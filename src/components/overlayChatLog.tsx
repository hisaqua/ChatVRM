import { useEffect, useRef } from "react";
import { Message } from "@/features/messages/messages";

type Props = {
  messages: Message[];
};

/**
 * iframe埋め込み(overlay)向けの軽量なチャットログ
 *
 * 常時表示される小さなガラス風パネルとして、会話履歴をスクロール表示する。
 */
export const OverlayChatLog = ({ messages }: Props) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  if (messages.length === 0) return null;

  return (
    <div className="relative z-20 w-full px-8 pt-4">
      <div
        ref={scrollRef}
        className="mx-auto max-w-md max-h-[30svh] overflow-y-auto rounded-16 bg-[rgba(20,18,24,0.55)] backdrop-blur-md border border-[rgba(255,255,255,0.14)] px-12 py-8 scroll-hidden"
      >
        {messages.map((msg, i) => (
          <ChatLine key={i} role={msg.role} message={msg.content} />
        ))}
      </div>
    </div>
  );
};

const ChatLine = ({ role, message }: { role: string; message: string }) => {
  const isAssistant = role === "assistant";
  const text = message.replace(/\s*\[[^\]]+\]\s*/g, " ").trim();
  if (!text) return null;

  return (
    <div className={`my-4 flex ${isAssistant ? "justify-start" : "justify-end"}`}>
      <div
        className={`max-w-[85%] px-12 py-6 rounded-12 typography-14 leading-relaxed ${
          isAssistant
            ? "bg-[rgba(255,255,255,0.12)] text-white"
            : "bg-[rgba(129,163,133,0.55)] text-white"
        }`}
      >
        {text}
      </div>
    </div>
  );
};
