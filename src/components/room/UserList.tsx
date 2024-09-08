import { useRoomStore } from "@/store/room/room-use";

export const UserList = () => {
  const { users } = useRoomStore((state) => state);

  return (
    <div className="pointer-events-none absolute z-30 flex p-5">
      {[...users.entries()].map(([userId, user], index) => (
        <div
          key={userId}
          className="flex h-12 w-12 select-none items-center justify-center rounded-full text-white"
          style={{
            backgroundColor: user.color,
            marginLeft: index !== 0 ? "-0.5rem" : 0,
          }}
        >
          {user?.name[0]?.toUpperCase() || "A"}
        </div>
      ))}
    </div>
  );
};
