import VrmViewer from "@/components/vrmViewer";
import { MessageInputContainer } from "@/components/messageInputContainer";
import { Menu } from "@/components/menu";
import { Meta } from "@/components/meta";
import { buildUrl } from "@/utils/buildUrl";
import { useChatVrm } from "@/hooks/useChatVrm";
import { SYSTEM_PROMPT } from "@/features/constants/systemPromptConstants";

export default function Home() {
  const {
    openAiKey,
    systemPrompt,
    setSystemPrompt,
    koeiroParam,
    setKoeiroParam,
    chatProcessing,
    chatLog,
    assistantMessage,
    koeiromapKey,
    setOpenAiKey,
    setKoeiromapKey,
    handleChangeChatLog,
    handleSendChat,
    setChatLog,
  } = useChatVrm();

  return (
    <div className={"font-M_PLUS_2"}>
      <Meta />
      <div
        className={"fixed top-0 left-0 w-screen h-[100svh] -z-20 bg-cover bg-center bg-no-repeat bg-fixed"}
        style={{ backgroundImage: `url(${buildUrl("./hisako.png")})` }}
      />
      <VrmViewer />
      <MessageInputContainer
        isChatProcessing={chatProcessing}
        onChatProcessStart={handleSendChat}
      />
      <Menu
        openAiKey={openAiKey}
        systemPrompt={systemPrompt}
        chatLog={chatLog}
        koeiroParam={koeiroParam}
        assistantMessage={assistantMessage}
        koeiromapKey={koeiromapKey}
        onChangeAiKey={setOpenAiKey}
        onChangeSystemPrompt={setSystemPrompt}
        onChangeChatLog={handleChangeChatLog}
        onChangeKoeiromapParam={setKoeiroParam}
        handleClickResetChatLog={() => setChatLog([])}
        handleClickResetSystemPrompt={() => setSystemPrompt(SYSTEM_PROMPT)}
        onChangeKoeiromapKey={setKoeiromapKey}
      />
    </div>
  );
}
