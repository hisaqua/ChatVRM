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
        {/* box-shadowとbackdrop-blurを同じ要素に重ねると影が角丸に沿わず矩形になる不具合があるため、
            影(overlay-input-glow)とぼかし背景(overlay-input-surface)を別要素に分離する */}
        <div className="overlay-input-glow mx-auto max-w-md rounded-oval">
          <div className="overlay-input-surface rounded-oval overflow-hidden bg-gradient-to-b from-[rgba(11,20,32,0.9)] to-[rgba(7,14,24,0.88)] backdrop-blur-md border border-[rgba(173,242,255,0.18)] px-8 py-[10px]">
            <div className="grid grid-flow-col gap-[8px] grid-cols-[min-content_1fr_min-content] items-center">
              <IconButton
                iconName="24/Microphone"
                className="!rounded-oval !bg-[rgba(126,232,255,0.14)] hover:!bg-[rgba(126,232,255,0.26)] disabled:!bg-[rgba(126,232,255,0.06)] !text-[#ebf9ff] !mr-0 transition-transform duration-150 hover:scale-105 active:scale-95"
                isProcessing={isMicRecording}
                disabled={isChatProcessing}
                onClick={onClickMicButton}
              />
              <input
                type="text"
                placeholder="聞きたいことをいれてね"
                onChange={onChangeUserMessage}
                disabled={isChatProcessing}
                className="bg-transparent w-full px-8 text-[#ebf9ff] placeholder-[rgba(235,249,255,0.5)] typography-16 font-bold outline-none disabled:text-[rgba(235,249,255,0.4)]"
                value={userMessage}
              ></input>

              <IconButton
                iconName="24/Send"
                className="!rounded-oval !bg-gradient-to-br !from-[rgba(126,232,255,0.9)] !to-[rgba(98,255,200,0.75)] hover:!brightness-110 disabled:!bg-[rgba(126,232,255,0.06)] disabled:!bg-none !text-[#02050a] disabled:!text-[rgba(235,249,255,0.3)] !mr-0 transition-transform duration-150 hover:scale-105 active:scale-95"
                isProcessing={isChatProcessing}
                disabled={isChatProcessing || !userMessage}
                onClick={onClickSendButton}
              />
            </div>
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
