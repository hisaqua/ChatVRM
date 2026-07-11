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
        className="mx-auto max-w-md max-h-[30svh] overflow-y-auto rounded-16 bg-[rgba(7,14,24,0.85)] backdrop-blur-md border border-[rgba(173,242,255,0.25)] shadow-lg px-12 py-8 scroll-hidden"
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
    <div className={`my-4 flex ${isAssistant ? "justify-start" : "justify-end"}`}>
      <div
        className={`max-w-[85%] px-12 py-6 rounded-[14px] border typography-14 text-[#ebf9ff] ${
          isAssistant
            ? "bg-[rgba(235,249,255,0.08)] border-[rgba(173,242,255,0.15)]"
            : "bg-[rgba(126,232,255,0.16)] border-[rgba(126,232,255,0.4)]"
        }`}
      >
        {text}
      </div>
    </div>
  );
};
