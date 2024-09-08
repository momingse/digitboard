import { useRefs } from "@/hooks/useRefs";
import { FaUndo } from "react-icons/fa";
import { ColorPicker } from "./ColorPicker";
import { DownloadButton } from "./DownloadButton";
import { Eraser } from "./Eraser";
import { LineWidthPicker } from "./LineWidthPicker";
import { ShapeSelector } from "./ShapeSelector";
import { ImageChoser } from "./ImageChoser";

export const ToolBar = () => {
  const { canvasRef, bgRef, undoRef } = useRefs();

  return (
    <div
      className="absolute p-5 left-10 top-[50%] z-50 flex flex-col items-center rounded-lg gap-5 bg-zinc-900 text-white"
      style={{
        transform: "translateY(-50%)",
      }}
    >
      <button className="text-xl" ref={undoRef}>
        <FaUndo />
      </button>
      <div className="h-px w-full bg-white" />
      <ColorPicker />
      <ShapeSelector />
      <LineWidthPicker />
      <Eraser />
      <ImageChoser />
      <DownloadButton canvasRef={canvasRef} bgRef={bgRef} />
    </div>
  );
};
