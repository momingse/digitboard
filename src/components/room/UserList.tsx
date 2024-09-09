import { useRoomStore } from "@/store/room/room-use";

export const UserList = () => {
  const { users } = useRoomStore((state) => state);

  return (
    <div className="pointer-events-none absolute z-30 flex p-5">
      {[...users.entries()].map(([userId, user], index) => (
        <div
          key={userId}
          className="flex h-5 w-5 text-xs md:h-8 md:w-8 md:text-base lg:h-12 lg:w-12 select-none items-center justify-center rounded-full text-white"
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
