import { RoomContext } from "@/providers/room-context-provider";
import { useContext } from "react";

export const useRefs = () => {
  const { undoRef, redoRef, canvasRef, bgRef, minimapRef } =
    useContext(RoomContext);

  return { undoRef, redoRef, canvasRef, bgRef, minimapRef };
};
