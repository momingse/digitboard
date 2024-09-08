import { RoomContext } from "@/providers/room-context-provider";
import { useContext } from "react";

export const useMoveImage = () => {
  const { moveImage, setMoveImage } = useContext(RoomContext);

  return { moveImage, setMoveImage };
};
