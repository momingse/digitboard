import { useRoomStore } from "@/store/room/room-use";
import RoomContextProvider from "../../providers/room-context-provider";
import Canvas from "./Canvas";
import { Chat } from "./Chat";
import MousePosition from "./MousePosition";
import MouseRenderer from "./MouseRenderer";
import { MoveImage } from "./MoveImage";
import { NameInput } from "./NameInput";
import { ToolBar } from "./ToolBar";
import { UserList } from "./UserList";

const Room = () => {
  const roomId = useRoomStore((state) => state.id);

  if (!roomId) return <NameInput />;

  return (
    <RoomContextProvider>
      <div className="relative h-full w-full overflow-hidden">
        <UserList />
        <ToolBar />
        <MoveImage />
        <Canvas />
        <MousePosition />
        <MouseRenderer />
        <Chat />
      </div>
    </RoomContextProvider>
  );
};

export default Room;
