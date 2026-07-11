import { useContext, useCallback } from "react";
import { ViewerContext } from "../features/vrmViewer/viewerContext";
import { buildUrl } from "@/utils/buildUrl";

type Props = {
  // アバターを表示するコンテナのclassName(未指定時は全画面表示)
  className?: string;
  // アバターの読み込み開始/完了を通知するコールバック
  onLoadingChange?: (isLoading: boolean) => void;
  // カメラの平行移動(パン)操作を許可するか(既定はtrue)
  enablePan?: boolean;
  // カメラの回転操作を許可するか(既定はtrue)
  enableRotate?: boolean;
  // カメラの拡大縮小(ズーム)操作を許可するか(既定はtrue)
  enableZoom?: boolean;
};

export default function VrmViewer({
  className,
  onLoadingChange,
  enablePan,
  enableRotate,
  enableZoom,
}: Props) {
  const { viewer } = useContext(ViewerContext);

  const canvasRef = useCallback(
    (canvas: HTMLCanvasElement) => {
      if (canvas) {
        viewer.setup(canvas, { enablePan, enableRotate, enableZoom });
        onLoadingChange?.(true);
        viewer.loadVrm(buildUrl("/hisako.vrm")).then(() => {
          onLoadingChange?.(false);
        });

        // Drag and DropでVRMを差し替え
        canvas.addEventListener("dragover", function (event) {
          event.preventDefault();
        });

        canvas.addEventListener("drop", function (event) {
          event.preventDefault();

          const files = event.dataTransfer?.files;
          if (!files) {
            return;
          }

          const file = files[0];
          if (!file) {
            return;
          }

          const file_type = file.name.split(".").pop();
          if (file_type === "vrm") {
            const blob = new Blob([file], { type: "application/octet-stream" });
            const url = window.URL.createObjectURL(blob);
            viewer.loadVrm(url);
          }
        });
      }
    },
    [viewer, onLoadingChange, enablePan, enableRotate, enableZoom]
  );

  return (
    <div
      className={
        className ?? "absolute top-0 left-0 w-screen h-[100svh] -z-10"
      }
    >
      <canvas ref={canvasRef} className={"h-full w-full"}></canvas>
    </div>
  );
}
