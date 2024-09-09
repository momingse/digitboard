import { socket } from "@/lib/socket";
import { useModalStore } from "@/store/modal/modal-use";
import { useRoomStore } from "@/store/room/room-use";
import { useRouter } from "next/router";
import { FormEvent, useEffect, useState } from "react";
import { NotFoundModal } from "./NotFoundModal.tsx";

export const Home = () => {
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");
  const setStoreRoomId = useRoomStore((state) => state.setRoomId);

  const router = useRouter();

  const openModal = useModalStore((state) => state.openModal);

  useEffect(() => {
    socket.on("created", (roomIdFromServer) => {
      setStoreRoomId(roomIdFromServer);
      router.push(`/room/${roomIdFromServer}`);
    });

    const handleJoinRoom = (roomIdFromServer: string, failed?: boolean) => {
      if (!failed) {
        setStoreRoomId(roomIdFromServer);
        router.push(`/room/${roomIdFromServer}`);
      } else {
        openModal(<NotFoundModal id={roomId} />);
      }
    };

    socket.on("joined", handleJoinRoom);

    return () => {
      socket.off("created");
      socket.off("joined", handleJoinRoom);
    };
  }, [openModal, roomId, router, setStoreRoomId]);

  useEffect(() => {
    socket.emit("leave_room");
    setStoreRoomId("");
  }, [setStoreRoomId]);

  const handleCreateRoom = () => {
    socket.emit("create_room", username);
  };

  const handleJoinRoom = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    socket.emit("join_room", roomId, username);
  };

  return (
    <div className="flex flex-col items-center">
      <h1 className="mt-24 text-5xl font-extrabold leading-tight sm:text-7xl">
        DigitBoard
      </h1>
      <h3 className="text-xl sm:text-2xl">Real time whiteboard</h3>

      <div className="mt-10 flex flex-col gap-2">
        <label className="self-start font-bold leading-tight">
          Enter your name:
        </label>
        <input
          className="rounded-xl border p-5 py-1"
          id="username"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        ></input>
      </div>
      <form
        className="flex flex-col items-center gap-3"
        onSubmit={(e) => handleJoinRoom(e)}
      >
        <label htmlFor="room-id" className="self-start font-bold leading-tight">
          Enter room ID:
        </label>
        <input
          className="rounded-xl border p-5 py-1"
          id="room-id"
          placeholder="Room ID..."
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
        />
        <button
          className="rounded-xl bg-black p-5 py-1 text-white transition-all hover:scale-105 active:scale-100"
          type="submit"
        >
          Join
        </button>
      </form>
      <div className="my-2 flex w-96 items-center gap-2">
        <div className="h-px w-full bg-zinc-200" />
        <p className="text-zinc-400">OR</p>
        <div className="h-px w-full bg-zinc-200" />
      </div>

      <div className="flex flex-col item-center gap-2">
        <h5 className="self-start font-bold leading-tight">Create new Room</h5>
        <button
          className="rounded-xl bg-black p-5 py-1 text-white transition-all hover:scale-105 active:scale-100"
          onClick={handleCreateRoom}
        >
          Create
        </button>
      </div>
    </div>
  );
};
