import { CANVAS_SIZE } from "@/constants/canvasSize";
import { useBoardPosition } from "@/hooks/useBoardPosition";
import { useCtx } from "@/hooks/useCtx";
import { useDrawing } from "@/hooks/useDrawing";
import { useMovesHandlers } from "@/hooks/useMovesHandlers";
import { useRefs } from "@/hooks/useRefs";
import { useSocketDraw } from "@/hooks/useSocketDraw";
import { useViewportSize } from "@/hooks/useViewportSize";
import { socket } from "@/lib/socket";
import { useOptionsStore } from "@/store/options/options-use";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { BsArrowsMove } from "react-icons/bs";
import { useKeyPressEvent } from "react-use";
import { Background } from "./Background";
import MiniMap from "./Minimap";

const Canvas = () => {
  const options = useOptionsStore((state) => state);
  const { canvasRef, bgRef, undoRef, redoRef } = useRefs();

  const [dragging, setDragging] = useState(true);
  const [, setMovedMinimap] = useState(false);

  const { width, height } = useViewportSize();
  const { x, y } = useBoardPosition();

  const ctx = useCtx();

  useKeyPressEvent("Control", (e) => {
    if (e.ctrlKey && !dragging) {
      setDragging(true);
    }
  });

  const {
    handleDraw,
    handleEndDrawing,
    handleStartDrawing,
    drawing,
    clearOnYourMove,
  } = useDrawing(dragging);
  const { handleUndo, handleRedo } = useMovesHandlers(clearOnYourMove);

  useSocketDraw(drawing);

  useEffect(() => {
    setDragging(false);
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      setDragging(e.ctrlKey);
    };

    window.addEventListener("keydown", handleKey);
    window.addEventListener("keyup", handleKey);

    const undoButton = undoRef.current;
    const redoButton = redoRef.current;

    undoButton?.addEventListener("click", handleUndo);
    redoButton?.addEventListener("click", handleRedo);

    return () => {
      window.removeEventListener("keydown", handleKey);
      window.removeEventListener("keyup", handleKey);
      undoButton?.removeEventListener("click", handleUndo);
      redoButton?.removeEventListener("click", handleRedo);
    };
  }, [dragging, undoRef, redoRef, handleUndo, handleRedo, canvasRef]);

  useEffect(() => {
    if (ctx) socket.emit("joined_room");
  }, [ctx]);

  return (
    <div className="relative h-full w-full overflow-hidden">
      <motion.canvas
        ref={canvasRef}
        width={CANVAS_SIZE.width}
        height={CANVAS_SIZE.height}
        className={`absolute top-0 z-10 ${dragging && "cursor-move"}`}
        style={{ x, y }}
        drag={dragging}
        dragConstraints={{
          left: -(CANVAS_SIZE.width - width),
          right: 0,
          top: -(CANVAS_SIZE.height - height),
          bottom: 0,
        }}
        dragElastic={0}
        dragTransition={{ power: 0, timeConstant: 0 }}
        onMouseDown={(e) => handleStartDrawing(e.clientX, e.clientY)}
        onMouseUp={handleEndDrawing}
        onMouseMove={(e) => {
          handleDraw(e.clientX, e.clientY, e.shiftKey);
        }}
        onTouchStart={(e) => {
          handleStartDrawing(
            e.changedTouches[0].clientX,
            e.changedTouches[0].clientY,
          );
        }}
        onTouchEnd={handleEndDrawing}
        onTouchMove={(e) => {
          handleDraw(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
        }}
      />
      <Background bgRef={bgRef} />
      <MiniMap dragging={dragging} />
      <button
        className={`absolute bottom-14 right-5 z-10 rounded-xl md:botton-5 ${
          dragging ? "bg-green-500" : "bg-zinc-300 text-black"
        } p-3 text-lg text-white`}
        onClick={() => setDragging((prev) => !prev)}
      >
        <BsArrowsMove />
      </button>
    </div>
  );
};

export default Canvas;
