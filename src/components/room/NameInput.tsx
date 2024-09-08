import { socket } from "@/lib/socket";
import { useRoomStore } from "@/store/room/room-use";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";

export const NameInput = () => {
  const setRoomId = useRoomStore((state) => state.setRoomId);

  const [username, setUsername] = useState("");

  const router = useRouter();
  const roomId = useMemo(
    () => (router.query.roomId || "").toString(),
    [router.query.roomId],
  );

  useEffect(() => {
    if (!roomId) {
      return;
    }

    socket.emit("check_room", roomId);

    socket.on("room_exists", (exists) => {
      if (!exists) {
        console.log("Room does not exist");
        router.push("/");
      }
    });

    return () => {
      socket.off("room_exists");
    };
  }, [roomId, router]);

  useEffect(() => {
    const handleJoined = (roomIdFromServer: string, failed?: boolean) => {
      if (!failed) {
        setRoomId(roomIdFromServer);
      } else {
        router.push("/");
      }
    };

    socket.on("joined", handleJoined);

    return () => {
      socket.off("joined", handleJoined);
    };
  }, [router, setRoomId]);

  const handleJoinRoom = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    socket.emit("join_room", roomId, username);
  };

  return (
    <form
      className="flex flex-col items-center gap-3"
      onSubmit={handleJoinRoom}
    >
      <h1 className="mt-24 text-7xl font-extrabold leading-tight">
        DigitBoard
      </h1>

      <h3 className="text-2xl">Real time whiteboard</h3>
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
      <button
        className="rounded-xl bg-black p-5 py-1 text-white transition-all hover:scale-105 active:scale-100"
        type="submit"
      >
        Enter Room
      </button>
    </form>
  );
};
