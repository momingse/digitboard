import { useBoardPosition } from "@/hooks/useBoardPosition";
import { getPos } from "@/lib/getPos";
import { socket } from "@/lib/socket";
import { motion } from "framer-motion";
import { useRef } from "react";
import { useInterval, useMouse } from "react-use";

const MousePosition = () => {
  const prevPosition = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const { x, y } = useBoardPosition();

  const ref = useRef<HTMLDivElement>(null);

  const { docX, docY } = useMouse(ref);

  const touchDevice = window.matchMedia("(pointer: coarse)").matches;

  useInterval(() => {
    if (
      prevPosition.current.x !== docX ||
      (prevPosition.current.y !== docY && !touchDevice)
    ) {
      socket.emit("mouse_move", getPos(docX, x), getPos(docY, y));
      prevPosition.current = { x: docX, y: docY };
    }
  }, 150);

  if (touchDevice) return null;

  return (
    <motion.div
      ref={ref}
      className="absolute top-0 left-0 z-50 pointer-events-none select-none transition-colors dark:text-white"
      animate={{
        x: docX + 15,
        y: docY + 15,
      }}
      transition={{
        duration: 0.05,
        ease: "linear",
      }}
    >
      {getPos(docX, x).toFixed(0)} | {getPos(docY, y).toFixed(0)}
    </motion.div>
  );
};

export default MousePosition;
