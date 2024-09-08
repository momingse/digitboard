import { socket } from "@/lib/socket";
import { useRoomStore } from "@/store/room/room-use";
import { useEffect } from "react";

export const useSocketDraw = (drawing: boolean) => {
  const { addMoveToUser, removeMoveFromUser } = useRoomStore((state) => state);

  useEffect(() => {
    let moveToDrawLater: Move | undefined;
    let userIdLater = "";
    socket.on("user_draw", (move, userId) => {
      if (!drawing) {
        addMoveToUser(userId, move);
      } else {
        moveToDrawLater = move;
        userIdLater = userId;
      }
    });

    return () => {
      socket.off("user_draw");

      if (moveToDrawLater && userIdLater) {
        addMoveToUser(userIdLater, moveToDrawLater);
      }
    };
  }, [addMoveToUser, drawing]);

  useEffect(() => {
    socket.on("user_undo", (userId) => {
      removeMoveFromUser(userId);
    });

    return () => {
      socket.off("user_undo");
    };
  }, [removeMoveFromUser]);
};
