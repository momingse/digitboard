import { CANVAS_SIZE } from "@/constants/canvasSize";
import { useBoardPosition } from "@/hooks/useBoardPosition";
import { useRefs } from "@/hooks/useRefs";
import { useViewportSize } from "@/hooks/useViewportSize";
import { motion, useMotionValue, useMotionValueEvent } from "framer-motion";
import { Dispatch, FC, SetStateAction, useMemo, useRef } from "react";

interface MiniMapProps {
  dragging: boolean;
  setMovedMinimap: Dispatch<SetStateAction<boolean>>;
}

const MiniMap: FC<MiniMapProps> = ({ dragging, setMovedMinimap }) => {
  const { x, y } = useBoardPosition();
  const { minimapRef } = useRefs();
  const containerRef = useRef<HTMLDivElement>(null);
  const { width, height } = useViewportSize();

  const miniX = useMotionValue(0);
  const miniY = useMotionValue(0);

  const divider = useMemo(() => {
    if (width > 1600) return 7;
    if (width > 1000) return 10;
    if (width > 600) return 14;

    return 20;
  }, [width]);

  useMotionValueEvent(miniX, "change", (latest) => {
    x.set(Math.floor(-latest * divider));
  });

  useMotionValueEvent(miniY, "change", (latest) => {
    y.set(Math.floor(-latest * divider));
  });

  return (
    <div
      className="absolute right-10 top-10 z-30 overflow-hidden rounded-lg shadow-lg"
      ref={containerRef}
      style={{
        width: CANVAS_SIZE.width / divider,
        height: CANVAS_SIZE.height / divider,
      }}
    >
      <canvas
        ref={minimapRef}
        width={CANVAS_SIZE.width}
        height={CANVAS_SIZE.height}
        className="h-full w-full"
      />
      <motion.div
        drag
        dragConstraints={containerRef}
        dragElastic={0}
        dragTransition={{ power: 0, timeConstant: 0 }}
        onDragStart={() => setMovedMinimap((prev) => true)}
        onDragEnd={() => setMovedMinimap((prev) => false)}
        className="absolute top-0 left-0 cursor-grab rounded-lg border-2 border-red-500"
        style={{
          width: width / divider,
          height: height / divider,
          x: miniX,
          y: miniY,
        }}
        animate={{
          x: -x.get() / divider,
          y: -y.get() / divider,
        }}
        transition={{ duration: 0 }}
      ></motion.div>
    </div>
  );
};

export default MiniMap;
