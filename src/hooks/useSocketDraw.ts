import { socket } from "@/lib/socket";
import { useRoomStore } from "@/store/room/room-use";
import { useEffect } from "react";

export const useSocketDraw = (
  ctx: CanvasRenderingContext2D | undefined,
  drawing: boolean,
) => {
  const { addMoveToUser, removeMoveFromUser } = useRoomStore((state) => state);

  useEffect(() => {
    if (!ctx) return;
    socket.emit("joined_room");
  }, [ctx]);

  useEffect(() => {
    let moveToDrawLater: Move | undefined;
    let userIdLater = "";
    socket.on("user_draw", (move, userId) => {
      if (ctx && !drawing) {
        addMoveToUser(userId, move);
      } else {
        moveToDrawLater = move;
        userIdLater = userId;
      }
    });

    return () => {
      socket.off("user_draw");

      if (moveToDrawLater && userIdLater && ctx) {
        addMoveToUser(userIdLater, moveToDrawLater);
      }
    };
  }, [ctx, addMoveToUser, drawing]);

  useEffect(() => {
    socket.on("user_undo", (userId) => {
      removeMoveFromUser(userId);
    });

    return () => {
      socket.off("user_undo");
    };
  }, [removeMoveFromUser]);
};
