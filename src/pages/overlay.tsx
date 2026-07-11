import { useState } from "react";
import Head from "next/head";
import VrmViewer from "@/components/vrmViewer";
import { MessageInputContainer } from "@/components/messageInputContainer";
import { OverlayChatLog } from "@/components/overlayChatLog";
import { useChatVrm } from "@/hooks/useChatVrm";

/**
 * iframe埋め込み用のオーバーレイ表示ページ
 *
 * 背景・メニュー等は表示せず、VRMアバター・チャットログ・入力欄のみを表示する。
 * html/bodyを透過にすることで、埋め込み先のページに背景なしでアバターを重ねられる。
 */
export default function Overlay() {
  const { chatProcessing, chatLog, handleSendChat } = useChatVrm();
  const [isAvatarLoading, setIsAvatarLoading] = useState(true);

  return (
    <div className={"font-M_PLUS_2 flex flex-col h-[100svh] w-screen overflow-hidden"}>
      <Head>
        <title>ひさこちゃんBOT</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>
      <style jsx global>{`
        html,
        body,
        #__next {
          background: transparent !important;
          background-image: none !important;
        }
      `}</style>

      <div className="relative flex-1 min-h-0">
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[45%]"
          style={{
            background:
              "radial-gradient(closest-side, rgba(126,232,255,0.16), rgba(126,232,255,0) 70%)",
          }}
        />
        <VrmViewer
          className="absolute inset-0"
          onLoadingChange={setIsAvatarLoading}
        />
        {isAvatarLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-[40px] h-[40px] border-4 border-[rgba(173,242,255,0.25)] border-t-[rgba(126,232,255,0.95)] rounded-oval animate-spin" />
          </div>
        )}
      </div>

      <OverlayChatLog messages={chatLog} />

      <MessageInputContainer
        isChatProcessing={chatProcessing}
        onChatProcessStart={handleSendChat}
        hideCredit
        overlay
      />
    </div>
  );
}
