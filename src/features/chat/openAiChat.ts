import { Message } from "../messages/messages";

// getChatResponse は非ストリーミング用（現在未使用）
export async function getChatResponse(messages: Message[]) {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
  });
  const data = await res.json();
  return { message: data.message as string };
}

// Workers(サーバー)側の秘密鍵を使ったストリーミングをプロキシするエンドポイントへ接続
// apiKey 引数は後方互換のため残すが無視する。
export async function getChatResponseStream(messages: Message[], _apiKey: string) {
  const res = await fetch("/api/chatStream", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
  });
  const reader = res.body?.getReader();
  if (res.status !== 200 || !reader) {
    throw new Error("Streaming upstream error");
  }

  const stream = new ReadableStream({
    async start(controller: ReadableStreamDefaultController) {
      const decoder = new TextDecoder("utf-8");
      // SSEのdata:行やマルチバイト文字がネットワークチャンクの境界で
      // 分断されても欠落しないよう、行単位でバッファリングして処理する。
      let buffer = "";

      const processLine = (line: string) => {
        const trimmed = line.trim();
        if (!trimmed.startsWith("data:")) return;
        const payload = trimmed.slice("data:".length).trim();
        if (!payload || payload === "[DONE]") return;
        try {
          const json = JSON.parse(payload);
          const messagePiece = json.choices?.[0]?.delta?.content;
          if (messagePiece) controller.enqueue(messagePiece);
        } catch (_e) {
          // 解析失敗は握りつぶす（OpenAIのkeep-alive等）
        }
      };

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          // streamオプションを付けないと、マルチバイト文字がチャンク境界で
          // 分断された際に文字化け・文字欠落が発生するため必ず指定する。
          buffer += decoder.decode(value, { stream: true });

          const lines = buffer.split("\n");
          // 最後の要素は次のチャンクへ続く可能性がある未完の行なので保持しておく
          buffer = lines.pop() ?? "";
          for (const line of lines) {
            processLine(line);
          }
        }
        // 残りのバッファ(末尾に改行が無かった最後の行)を処理する
        buffer += decoder.decode();
        if (buffer) {
          processLine(buffer);
        }
      } catch (error) {
        controller.error(error);
      } finally {
        reader.releaseLock();
        controller.close();
      }
    },
  });
  return stream;
}
