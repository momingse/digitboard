import { CANVAS_SIZE } from "@/constants/canvasSize";
import { useBoardPosition } from "@/hooks/useBoardPosition";
import { useRefs } from "@/hooks/useRefs";
import { useViewportSize } from "@/hooks/useViewportSize";
import {
  motion,
  useMotionValue,
  useMotionValueEvent
} from "framer-motion";
import {
  Dispatch,
  FC,
  SetStateAction,
  useRef
} from "react";

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

  useMotionValueEvent(miniX, "change", (latest) => {
    x.set(-latest * 10);
  });

  useMotionValueEvent(miniY, "change", (latest) => {
    y.set(-latest * 10);
  });

  return (
    <div
      className="absolute right-10 top-10 z-30 bg-zinc-50 overflow-hidden rounded-lg shadow-lg"
      ref={containerRef}
      style={{
        width: CANVAS_SIZE.width / 10,
        height: CANVAS_SIZE.height / 10,
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
          width: width / 10,
          height: height / 10,
          x: miniX,
          y: miniY,
        }}
        animate={{
          x: -x.get() / 10,
          y: -y.get() / 10,
        }}
        transition={{ duration: 0 }}
      ></motion.div>
    </div>
  );
};

export default MiniMap;
