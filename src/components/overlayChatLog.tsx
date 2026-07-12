import { useEffect, useRef } from "react";
import { Message } from "@/features/messages/messages";

type Props = {
  messages: Message[];
  // 会話履歴を削除するためのコールバック(未指定時は削除ボタンを表示しない)
  onClear?: () => void;
};

/**
 * iframe埋め込み(overlay)向けの軽量なチャットログ
 *
 * 常時表示される小さなガラス風パネルとして、会話履歴をスクロール表示する。
 */
export const OverlayChatLog = ({ messages, onClear }: Props) => {
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
      {/* box-shadowとbackdrop-blurを同じ要素に重ねると影が角丸に沿わず矩形になる不具合があるため、
          影(overlay-panel-glow)とぼかし背景(内側のスクロール要素)を別要素に分離する */}
      <div className="overlay-panel-glow relative mx-auto max-w-md rounded-24">
        {onClear && (
          <button
            type="button"
            onClick={onClear}
            aria-label="会話履歴を削除"
            title="会話履歴を削除"
            className="absolute right-8 top-8 z-10 flex h-[24px] w-[24px] items-center justify-center rounded-oval border border-[rgba(173,242,255,0.25)] bg-[rgba(6,12,20,0.7)] text-[#ebf9ff] opacity-70 backdrop-blur-sm transition-opacity hover:opacity-100"
          >
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
              <path d="M10 11v6" />
              <path d="M14 11v6" />
              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
            </svg>
          </button>
        )}
        <div
          ref={scrollRef}
          className="overlay-chatlog-scroll max-h-[32svh] overflow-y-auto rounded-24 bg-gradient-to-b from-[rgba(9,17,28,0.88)] to-[rgba(6,12,20,0.82)] backdrop-blur-md border border-[rgba(173,242,255,0.18)] px-[14px] py-[18px] scroll-hidden"
        >
          {messages.map((msg, i) => (
            <ChatLine key={i} role={msg.role} message={msg.content} />
          ))}
        </div>
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
      className={`overlay-message-in my-[10px] flex ${
        isAssistant ? "justify-start" : "justify-end"
      }`}
    >
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
