import { useBoardPosition } from "@/hooks/useBoardPosition";
import { socket } from "@/lib/socket";
import { useRoomStore } from "@/store/room/room-use";
import { motion } from "framer-motion";
import { FC, useEffect, useState } from "react";
import { BsCursorFill } from "react-icons/bs";

interface UserMouseProps {
  userId: string;
}

const UserMouse: FC<UserMouseProps> = ({ userId }) => {
  const { users } = useRoomStore((state) => state);
  const boardPos = useBoardPosition();
  const [x, setX] = useState(boardPos.x.get());
  const [y, setY] = useState(boardPos.y.get());

  const [msg, setMsg] = useState("");
  const [pos, setPos] = useState({ x: -1, y: -1 });

  useEffect(() => {
    socket.on("mouse_moved", (newX, newY, socketIdMoved) => {
      if (socketIdMoved === userId) {
        setPos({ x: newX, y: newY });
      }
    });

    const handleNewMsg = (msgUserId: string, newMsg: string) => {
      if (msgUserId === userId) {
        setMsg(newMsg);
      }

      setTimeout(() => {
        setMsg("");
      }, 3000);
    };

    socket.on("new_msg", handleNewMsg);

    return () => {
      socket.off("mouse_moved");
      socket.off("new_msg", handleNewMsg);
    };
  }, [userId]);

  useEffect(() => {
    const unsubscribe = boardPos.x.onChange(setX);
    return unsubscribe;
  }, [boardPos.x]);

  useEffect(() => {
    const unsubscribe = boardPos.y.onChange(setY);
    return unsubscribe;
  }, [boardPos.y]);

  return (
    <motion.div
      className={`absolute top-0 left-0 text-blue-800 pointer-events-none ${pos.x === -1 && "hidden"}`}
      animate={{
        x: pos.x + x,
        y: pos.y + y,
      }}
      transition={{ duration: 0.2, ease: "linear" }}
      style={{
        color: users.get(userId)?.color,
      }}
    >
      <BsCursorFill className="-rotate-90" />
      {msg && (
        <p className="absolute top-full left-5 max-w-[15rem] overflow-hidden text-ellipsis rounded-md bg-zinc-900 p-1 px-3 text-white">
          {msg}
        </p>
      )}
      <p className="ml-2">{users.get(userId)?.name || "Anonymous"}</p>
    </motion.div>
  );
};

export default UserMouse;
