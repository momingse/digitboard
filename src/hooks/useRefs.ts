import { RoomContext } from "@/providers/room-context-provider";
import { useContext } from "react";

export const useRefs = () => {
  const { undoRef, canvasRef, bgRef, minimapRef } = useContext(RoomContext);

  return { undoRef, canvasRef, bgRef, minimapRef };
};
