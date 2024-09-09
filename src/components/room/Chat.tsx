import { socket } from "@/lib/socket";
import { useRoomStore } from "@/store/room/room-use";
import { useEffect, useRef, useState } from "react";
import { useList } from "react-use";
import { motion } from "framer-motion";
import { DEFAULT_EASING } from "@/constants/easings";
import { BsChatFill } from "react-icons/bs";
import { FaChevronDown } from "react-icons/fa";
import { Message } from "./Message";
import { ChatInput } from "./ChatInput";

export const Chat = () => {
  const { users } = useRoomStore((state) => state);

  const msgList = useRef<HTMLDivElement>(null);

  const [newMsg, setNewMsg] = useState(false);
  const [opened, setOpened] = useState(false);
  const [msgs, setMsgs] = useList<Message>([]);

  useEffect(() => {
    const handleNewMsg = (userId: string, msg: string) => {
      const user = users.get(userId);

      setMsgs.push({
        userId,
        msg,
        id: msgs.length,
        username: user?.name || "Anonymous",
        color: user?.color || "black",
      });

      msgList.current?.scroll({
        top: msgList.current.scrollHeight,
        behavior: "smooth",
      });

      if (!opened) {
        setNewMsg(true);
      }
    };

    socket.on("new_msg", handleNewMsg);

    return () => {
      socket.off("new_msg", handleNewMsg);
    };
  }, [users, opened, msgs.length, setMsgs]);

  return (
    <motion.div
      className="absolute z-50 bottom-0 w-full sm:left-36 flex h-[300px] sm:w-[30rem] flex-col overflow-hidden rounded-t-md"
      animate={{ y: opened ? 0 : 260 }}
      transition={{ ease: DEFAULT_EASING, duration: 0.2 }}
    >
      <button
        className="flex w-full cursor-pointer items-center justify-between bg-zinc-900 py-2 px-10 font-semibold text-white"
        onClick={() => {
          setOpened((prev) => !prev);
          setNewMsg(false);
        }}
      >
        <div className="flex items-center gap-2">
          <BsChatFill className="mt-[-2px]" />
          Chat
          {newMsg && (
            <p className="rounded-md bg-green-500 px-1 font-semibold text-green-900">
              New!
            </p>
          )}
        </div>
        <motion.div
          animate={{ rotate: opened ? 0 : 180 }}
          transition={{
            ease: DEFAULT_EASING,
            duration: 0.2,
          }}
        >
          <FaChevronDown />
        </motion.div>
      </button>
      <div className="flex flex-1 flex-col justify-between bg-white p-3">
        <div className="h-[190px] overflow-y-scroll pr-2" ref={msgList}>
          {msgs.map((msg) => (
            <Message key={msg.id} {...msg} />
          ))}
        </div>
        <ChatInput />
      </div>
    </motion.div>
  );
};
