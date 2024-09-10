import { DEFAULT_MOVE } from "@/constants/defaultMove";
import { useBoardPosition } from "@/hooks/useBoardPosition";
import { useMoveImage } from "@/hooks/useMoveImage";
import { useRefs } from "@/hooks/useRefs";
import { getPos } from "@/lib/getPos";
import { socket } from "@/lib/socket";
import { motion, useMotionValue } from "framer-motion";
import { useCallback, useEffect } from "react";
import { AiOutlineCheck, AiOutlineClose } from "react-icons/ai";

export const MoveImage = () => {
  const { canvasRef } = useRefs();
  const { x, y } = useBoardPosition();

  const { moveImage, setMoveImage } = useMoveImage();

  const imageX = useMotionValue(moveImage.x || 50);
  const imageY = useMotionValue(moveImage.y || 50);

  useEffect(() => {
    if (moveImage.x) imageX.set(moveImage.x);
    else imageX.set(50);
    if (moveImage.y) imageY.set(moveImage.y);
    else imageY.set(50);
  }, [moveImage.x, moveImage.y, imageX, imageY]);

  const handlePlaceImage = useCallback(() => {
    const [finalX, finalY] = [getPos(imageX.get(), x), getPos(imageY.get(), y)];

    const move: Move = {
      ...DEFAULT_MOVE,
      img: {
        base64: moveImage.base64,
      },
      path: [[finalX, finalY]],
      options: {
        ...DEFAULT_MOVE.options,
        shape: "image",
        selection: null,
      },
    };

    socket.emit("draw", move);

    setMoveImage({ base64: "" });
    imageX.set(50);
    imageY.set(50);
  }, [imageX, imageY, moveImage, setMoveImage, x, y]);

  if (!moveImage.base64) return null;

  return (
    <motion.div
      drag
      dragConstraints={canvasRef}
      dragElastic={0}
      dragTransition={{ power: 0.03, timeConstant: 50 }}
      className="absolute top-0 z-20 cursor-grab"
      style={{ x: imageX, y: imageY }}
    >
      <div className="absolute bottom-full mb-2 flex gap-3">
        <button
          className="rounded-full bg-gray-200 p-2"
          onClick={handlePlaceImage}
        >
          <AiOutlineCheck />
        </button>
        <button
          className="rounded-full bg-gray-200 p-2"
          onClick={() => setMoveImage({ base64: "" })}
        >
          <AiOutlineClose />
        </button>
      </div>
      <img
        className="pointer-events-none"
        alt="image to move"
        src={moveImage.base64}
      />
    </motion.div>
  );
};
