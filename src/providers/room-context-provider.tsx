import { COLORS_ARRAY } from "@/constants/colors";
import { socket } from "@/lib/socket";
import { useRoomStore } from "@/store/room/room-use";
import { useUsersStoreUserIdsSelector } from "@/store/users/users-use";
import { MotionValue, useMotionValue } from "framer-motion";
import {
  createContext,
  ReactNode,
  RefObject,
  useEffect,
  useRef,
  useState,
} from "react";
import { toast } from "react-toastify";

export const RoomContext = createContext<{
  x: MotionValue<number>;
  y: MotionValue<number>;
  undoRef: RefObject<HTMLButtonElement>;
  canvasRef: RefObject<HTMLCanvasElement>;
  bgRef: RefObject<HTMLCanvasElement>;
  minimapRef: RefObject<HTMLCanvasElement>;
  moveImage: string;
  setMoveImage: (image: string) => void;
}>(null!);

const RoomContextProvider = ({ children }: { children: ReactNode }) => {
  const { users, addUser, removeUser, setRoomId, setRoom } = useRoomStore(
    (state) => state,
  );
  const usersIds = useUsersStoreUserIdsSelector();
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const undoRef = useRef<HTMLButtonElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bgRef = useRef<HTMLCanvasElement>(null);
  const minimapRef = useRef<HTMLCanvasElement>(null);

  const [moveImage, setMoveImage] = useState("");

  useEffect(() => {
    socket.on("room", (drawed, usersMovesToParse, usersToParse) => {
      const usersMoves = new Map<string, Move[]>(
        Object.entries(JSON.parse(usersMovesToParse)),
      );
      const usersParsed = new Map<string, string>(
        Object.entries(JSON.parse(usersToParse)),
      );
      const newUser = new Map<string, User>();

      usersParsed.forEach((name, id) => {
        if (id === socket.id) return;

        const index = [...usersParsed.keys()].indexOf(id);

        const color = COLORS_ARRAY[index % COLORS_ARRAY.length];

        newUser.set(id, {
          name,
          color,
        });
      });

      setRoom(newUser, usersMoves, drawed);
    });

    socket.on("new_user", (userId, username) => {
      toast(`${username || "Anonymous"} has joined the room`, {
        position: "top-center",
        theme: "colored",
      });
      addUser(userId, username);
    });

    socket.on("user_disconnect", (userId) => {
      toast(`${users.get(userId)?.name || "Anonymous"} has left the room`, {
        position: "top-center",
        theme: "colored",
      });
      removeUser(userId);
    });

    return () => {
      socket.off("room");
      socket.off("new_user");
      socket.off("user_disconnect");
    };
  }, [usersIds, addUser, removeUser, setRoom, users]);

  return (
    <RoomContext.Provider
      value={{
        x,
        y,
        undoRef,
        bgRef,
        canvasRef,
        minimapRef,
        moveImage,
        setMoveImage,
      }}
    >
      {children}
    </RoomContext.Provider>
  );
};

export default RoomContextProvider;
