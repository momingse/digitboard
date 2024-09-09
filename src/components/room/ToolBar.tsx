import { useRefs } from "@/hooks/useRefs";
import { ColorPicker } from "./ColorPicker";
import { DownloadButton } from "./DownloadButton";
import { ExitButton } from "./ExitButton";
import { HistoryButton } from "./HistoryButton";
import { ImagePicker } from "./ImagePicker";
import { LineWidthPicker } from "./LineWidthPicker";
import { ModePicker } from "./ModePicker";
import { ShapeSelector } from "./ShapeSelector";

export const ToolBar = () => {
  const { canvasRef, bgRef } = useRefs();

  return (
    <div
      className="absolute p-5 left-10 top-[50%] z-50 flex flex-col items-center rounded-lg gap-5 bg-zinc-900 text-white"
      style={{
        transform: "translateY(-50%)",
      }}
    >
      <HistoryButton />
      <div className="h-px w-full bg-white" />
      <ColorPicker />
      <ShapeSelector />
      <LineWidthPicker />
      <ModePicker />
      <ImagePicker />
      <div className="h-px w-full bg-white" />
      <DownloadButton canvasRef={canvasRef} bgRef={bgRef} />
      <ExitButton />
    </div>
  );
};
