import { IconButton } from "./iconButton";

type Props = {
  userMessage: string;
  isMicRecording: boolean;
  isChatProcessing: boolean;
  onChangeUserMessage: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onClickSendButton: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onClickMicButton: (event: React.MouseEvent<HTMLButtonElement>) => void;
  // trueの場合、フッターのクレジット表記を省略する(iframe埋め込み等の省スペース表示用)
  hideCredit?: boolean;
  // trueの場合、iframe埋め込み向けのガラス風デザインで表示する
  overlay?: boolean;
};
export const MessageInput = ({
  userMessage,
  isMicRecording,
  isChatProcessing,
  onChangeUserMessage,
  onClickMicButton,
  onClickSendButton,
  hideCredit,
  overlay,
}: Props) => {
  if (overlay) {
    return (
      <div className="relative z-20 w-full px-8 pb-8">
        <div className="mx-auto max-w-md rounded-full bg-[rgba(20,18,24,0.6)] backdrop-blur-md border border-[rgba(255,255,255,0.16)] shadow-lg px-8 py-8">
          <div className="grid grid-flow-col gap-[8px] grid-cols-[min-content_1fr_min-content] items-center">
            <IconButton
              iconName="24/Microphone"
              className="!bg-[rgba(255,255,255,0.12)] hover:!bg-[rgba(255,255,255,0.22)] disabled:!bg-[rgba(255,255,255,0.06)] !text-white !mr-0"
              isProcessing={isMicRecording}
              disabled={isChatProcessing}
              onClick={onClickMicButton}
            />
            <input
              type="text"
              placeholder="聞きたいことをいれてね"
              onChange={onChangeUserMessage}
              disabled={isChatProcessing}
              className="bg-transparent w-full px-8 text-white placeholder-[rgba(255,255,255,0.5)] typography-16 font-bold outline-none disabled:text-[rgba(255,255,255,0.4)]"
              value={userMessage}
            ></input>

            <IconButton
              iconName="24/Send"
              className="!bg-[rgba(255,255,255,0.12)] hover:!bg-[rgba(255,255,255,0.22)] disabled:!bg-[rgba(255,255,255,0.06)] !text-white !mr-0"
              isProcessing={isChatProcessing}
              disabled={isChatProcessing || !userMessage}
              onClick={onClickSendButton}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute bottom-0 z-20 w-screen">
      <div className="bg-base text-black">
        <div className="mx-auto max-w-4xl p-16">
          <div className="grid grid-flow-col gap-[8px] grid-cols-[min-content_1fr_min-content]">
            <IconButton
              iconName="24/Microphone"
              className="bg-secondary hover:bg-secondary-hover active:bg-secondary-press disabled:bg-secondary-disabled"
              isProcessing={isMicRecording}
              disabled={isChatProcessing}
              onClick={onClickMicButton}
            />
            <input
              type="text"
              placeholder="聞きたいことをいれてね"
              onChange={onChangeUserMessage}
              disabled={isChatProcessing}
              className="bg-surface1 hover:bg-surface1-hover focus:bg-surface1 disabled:bg-surface1-disabled disabled:text-primary-disabled rounded-16 w-full px-16 text-text-primary typography-16 font-bold disabled"
              value={userMessage}
            ></input>

            <IconButton
              iconName="24/Send"
              className="bg-secondary hover:bg-secondary-hover active:bg-secondary-press disabled:bg-secondary-disabled"
              isProcessing={isChatProcessing}
              disabled={isChatProcessing || !userMessage}
              onClick={onClickSendButton}
            />
          </div>
        </div>
        {!hideCredit && (
          <div className="py-4 bg-[#413D43] text-center text-white font-Montserrat">
            Powered by GPT-3.5, VOICEVOX: 四国めたん
          </div>
        )}
      </div>
    </div>
  );
};
