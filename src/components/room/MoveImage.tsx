import { DEFAULT_MOVE } from "@/constants/defaultMove";
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
      ...DEFAULT_MOVE,
      img: {
        base64: moveImage,
      },
      path: [[finalX, finalY]],
      options: {
        ...DEFAULT_MOVE.options,
        shape: "image",
        selection: null,
      },
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
