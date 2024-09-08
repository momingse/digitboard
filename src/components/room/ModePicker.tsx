import { useOptionsStore } from "@/store/options/options-use";
import { useEffect } from "react";
import { AiOutlineSelect } from "react-icons/ai";
import { BsPencilFill } from "react-icons/bs";
import { FaEraser } from "react-icons/fa";

export const ModePicker = () => {
  const { mode, setMode, setSelection } = useOptionsStore((state) => state);

  useEffect(() => {
    setSelection(null);
  }, [mode, setSelection]);

  return (
    <>
      <button
        className={`text-xl ${mode === "draw" && "bg-green-400"}`}
        onClick={() => setMode("draw")}
      >
        <BsPencilFill />
      </button>
      <button
        className={`text-xl ${mode === "erase" && "bg-green-400"}`}
        onClick={() => setMode("erase")}
      >
        <FaEraser />
      </button>
      <button
        className={`text-xl ${mode === "select" && "bg-green-400"}`}
        onClick={() => setMode("select")}
      >
        <AiOutlineSelect />
      </button>
    </>
  );
};
