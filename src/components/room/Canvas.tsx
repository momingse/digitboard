import { CANVAS_SIZE } from "@/constants/canvasSize";
import { useBoardPosition } from "@/hooks/useBoardPosition";
import { useDrawing } from "@/hooks/useDrawing";
import { useMovesHandlers } from "@/hooks/useMovesHandlers";
import { useRefs } from "@/hooks/useRefs";
import { useSocketDraw } from "@/hooks/useSocketDraw";
import { useViewportSize } from "@/hooks/useViewportSize";
import { socket } from "@/lib/socket";
import { useOptionsStore } from "@/store/options/options-use";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useKeyPressEvent } from "react-use";
import { Background } from "./Background";
import MiniMap from "./Minimap";
import { useCtx } from "@/hooks/useCtx";

const Canvas = () => {
  const options = useOptionsStore((state) => state);
  const { canvasRef, bgRef, undoRef, redoRef } = useRefs();

  const [dragging, setDragging] = useState(false);
  const [, setMovedMinimap] = useState(false);

  const { width, height } = useViewportSize();
  const { x, y } = useBoardPosition();

  const { handleUndo, handleRedo } = useMovesHandlers();
  const ctx = useCtx();

  useKeyPressEvent("Control", (e) => {
    if (e.ctrlKey && !dragging) {
      setDragging(true);
    }
  });

  const { handleDraw, handleEndDrawing, handleStartDrawing, drawing } =
    useDrawing(dragging);

  useSocketDraw(drawing);

  useEffect(() => {
    const handleKeyUp = (e: KeyboardEvent) => {
      if (!e.ctrlKey && dragging) {
        setDragging(false);
      }
    };

    window.addEventListener("keyup", handleKeyUp);

    const undoButton = undoRef.current;
    const redoButton = redoRef.current;

    undoButton?.addEventListener("click", handleUndo);
    redoButton?.addEventListener("click", handleRedo);

    return () => {
      window.removeEventListener("keyup", handleKeyUp);
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
      <MiniMap dragging={dragging} setMovedMinimap={setMovedMinimap} />
    </div>
  );
};

export default Canvas;
