import { useOptionsStore } from "@/store/options/options-use";
import { FaEraser } from "react-icons/fa";

export const Eraser = () => {
  const { erase, setErase, setShape } = useOptionsStore((state) => state);

  return (
    <button
      className={`text-xl ${erase && "bg-green-400"}`}
      onClick={() => {
        setErase(!erase);
        setShape("line");
      }}
    >
      <FaEraser />
    </button>
  );
};
