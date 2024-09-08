import { CANVAS_SIZE } from "@/constants/canvasSize";
import { drawBackground } from "@/helper/canvasHelper";
import { useBoardPosition } from "@/hooks/useBoardPosition";
import { motion } from "framer-motion";
import { FC, RefObject, useEffect } from "react";

interface BackgroundProps {
  bgRef: RefObject<HTMLCanvasElement>;
}

export const Background: FC<BackgroundProps> = ({ bgRef }) => {
  const { x, y } = useBoardPosition();

  useEffect(() => {
    const ctx = bgRef.current?.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, CANVAS_SIZE.width, CANVAS_SIZE.height);

    drawBackground(ctx);
  }, [bgRef]);

  return (
    <motion.canvas
      ref={bgRef}
      width={CANVAS_SIZE.width}
      height={CANVAS_SIZE.height}
      className="absolute top-0 bg-zinc-100"
      style={{ x, y }}
    />
  );
};
