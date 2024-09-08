import { RoomContext } from "@/providers/room-context-provider";
import { useContext } from "react";

export const useBoardPosition = () => {
  const { x, y } = useContext(RoomContext);
  return { x, y };
};
