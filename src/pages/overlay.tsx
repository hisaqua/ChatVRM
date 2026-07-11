import Head from "next/head";
import VrmViewer from "@/components/vrmViewer";
import { MessageInputContainer } from "@/components/messageInputContainer";
import { useChatVrm } from "@/hooks/useChatVrm";

/**
 * iframe埋め込み用のオーバーレイ表示ページ
 *
 * 背景・メニュー・チャットログ等は一切表示せず、VRMアバターと入力欄のみを表示する。
 * html/bodyを透過にすることで、埋め込み先のページに背景なしでアバターを重ねられる。
 */
export default function Overlay() {
  const { chatProcessing, handleSendChat } = useChatVrm();

  return (
    <div className={"font-M_PLUS_2"}>
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
      <VrmViewer />
      <MessageInputContainer
        isChatProcessing={chatProcessing}
        onChatProcessStart={handleSendChat}
        hideCredit
      />
    </div>
  );
}
