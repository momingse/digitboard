import { useRoomStore } from "@/store/room/room-use";
import UserMouse from "./UserMouse";
import { socket } from "@/lib/socket";

const MouseRenderer = () => {
  const { users } = useRoomStore((state) => state);

  return (
    <>
      {Array.from(users.keys()).map((userId) => {
        if (userId === socket.id) return null;
        return <UserMouse userId={userId} key={userId} />;
      })}
    </>
  );
};

export default MouseRenderer;
