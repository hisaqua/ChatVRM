import { wait } from "@/utils/wait";
import { synthesizeVoicevox } from "./synthesizeVoice";
import { Viewer } from "../vrmViewer/viewer";
import { Screenplay } from "./messages";
import { Talk } from "./messages";
import { toSpeakableText } from "@/utils/englishToKatakana";

const createSpeakCharacter = () => {
  let lastTime = 0;
  let prevFetchPromise: Promise<unknown> = Promise.resolve();
  let prevSpeakPromise: Promise<unknown> = Promise.resolve();

  return (
    screenplay: Screenplay,
    viewer: Viewer,
    // voicevoxApiKey kept for backward compatibility but ignored (server secret now)
    _voicevoxApiKey: string,
    onStart?: () => void,
    onComplete?: () => void
  ) => {
    const fetchPromise = prevFetchPromise.then(async () => {
      const now = Date.now();
      if (now - lastTime < 1000) {
        await wait(1000 - (now - lastTime));
      }

      const buffer = await fetchAudio(screenplay.talk).catch(
        () => null
      );
      lastTime = Date.now();
      return buffer;
    });

    prevFetchPromise = fetchPromise;
    prevSpeakPromise = Promise.all([fetchPromise, prevSpeakPromise]).then(
      ([audioBuffer]) => {
        onStart?.();
        if (!audioBuffer) {
          return;
        }
        return viewer.model?.speak(audioBuffer, screenplay);
      }
    );
    prevSpeakPromise.then(() => {
      onComplete?.();
    });
  };
};

export const speakCharacter = createSpeakCharacter();

export const fetchAudio = async (
  talk: Talk
): Promise<ArrayBuffer> => {
  // 画面表示(talk.message)には手を加えず、音声合成用のテキストのみカタカナ変換・URL等の除去を行う
  const ttsVoice = await synthesizeVoicevox(toSpeakableText(talk.message));
  const buffer = (await ttsVoice.audio).arrayBuffer();
    if (buffer == null) {
      throw new Error("Something went wrong");
  }
  return buffer;
};
