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
        className="overlay-chatlog-scroll mx-auto max-w-md max-h-[32svh] overflow-y-auto rounded-24 overlay-panel-glow bg-gradient-to-b from-[rgba(9,17,28,0.88)] to-[rgba(6,12,20,0.82)] backdrop-blur-md border border-[rgba(173,242,255,0.18)] px-[14px] py-[18px] scroll-hidden"
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
  const text = message.replace(/\s*\[[^\]]+\]\s*/g, "").trim();
  if (!text) return null;

  return (
    <div
      className={`overlay-message-in my-[10px] flex items-end gap-[6px] ${
        isAssistant ? "justify-start" : "justify-end flex-row-reverse"
      }`}
    >
      <div
        className={`shrink-0 w-[22px] h-[22px] rounded-oval flex items-center justify-center typography-12 font-bold ${
          isAssistant
            ? "bg-gradient-to-br from-[rgba(126,232,255,0.9)] to-[rgba(98,255,200,0.75)] text-[#02050a]"
            : "bg-[rgba(235,249,255,0.16)] text-[rgba(235,249,255,0.85)]"
        }`}
      >
        {isAssistant ? "\u{1F4A7}" : "\u{1F464}"}
      </div>
      <div
        className={`max-w-[78%] px-[12px] py-8 border typography-14 text-[#ebf9ff] shadow-[0_2px_10px_rgba(2,8,16,0.35)] ${
          isAssistant
            ? "rounded-[16px] rounded-bl-[4px] bg-[rgba(235,249,255,0.07)] border-[rgba(173,242,255,0.15)]"
            : "rounded-[16px] rounded-br-[4px] bg-gradient-to-br from-[rgba(126,232,255,0.22)] to-[rgba(98,255,200,0.14)] border-[rgba(126,232,255,0.35)]"
        }`}
        style={{ lineHeight: 1.55 }}
      >
        {text}
      </div>
    </div>
  );
};
