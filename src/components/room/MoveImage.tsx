import { useBoardPosition } from "@/hooks/useBoardPosition";
import { useMoveImage } from "@/hooks/useMoveImage";
import { useRefs } from "@/hooks/useRefs";
import { getPos } from "@/lib/getPos";
import { socket } from "@/lib/socket";
import { motion, useMotionValue } from "framer-motion";
import { useCallback } from "react";

export const MoveImage = () => {
  const { canvasRef } = useRefs();
  const { x, y } = useBoardPosition();

  const imageX = useMotionValue(50);
  const imageY = useMotionValue(50);

  const { moveImage, setMoveImage } = useMoveImage();

  const handlePlaceImage = useCallback(() => {
    const [finalX, finalY] = [getPos(imageX.get(), x), getPos(imageY.get(), y)];

    const move: Move = {
      rect: {
        width: 0,
        height: 0,
      },
      circle: {
        cX: 0,
        cY: 0,
        radiusX: 0,
        radiusY: 0,
      },
      img: {
        base64: moveImage,
      },
      path: [[finalX, finalY]],
      options: {
        lineWidth: 1,
        lineColor: "#000",
        erase: false,
        shape: "image",
      },
      timestamp: 0,
      eraser: false,
      id: "",
    };

    socket.emit("draw", move);

    setMoveImage("");
    imageX.set(50);
    imageY.set(50);
  }, [imageX, imageY, moveImage, setMoveImage, x, y]);

  if (!moveImage) return null;

  return (
    <motion.div
      drag
      dragConstraints={canvasRef}
      dragElastic={0}
      dragTransition={{ power: 0.03, timeConstant: 50 }}
      className="absolute top-0 z-20 cursor-grab"
      style={{ x: imageX, y: imageY }}
    >
      <button
        className="w-full text-center text-black"
        onClick={handlePlaceImage}
      >
        Accept
      </button>
      <img
        className="pointer-events-none"
        alt="image to move"
        src={moveImage}
      />
    </motion.div>
  );
};
