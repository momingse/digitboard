import { useRouter } from "next/router";
import { ImExit } from "react-icons/im";

export const ExitButton = () => {
  const router = useRouter();

  const handleExit = () => router.push("/");

  return (
    <button className="text-2xl" onClick={handleExit}>
      <ImExit />
    </button>
  );
};
