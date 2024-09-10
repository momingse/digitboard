import { useRefs } from "@/hooks/useRefs";
import { useOptionsStoreOptionsSelector } from "@/store/options/options-use";
import { useRef } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { BsArrowsMove } from "react-icons/bs";
import { FiCopy } from "react-icons/fi";

export const SelectionButtons = () => {
  const { selection } = useOptionsStoreOptionsSelector();
  const { selectionRefs } = useRefs();

  const top = useRef(0);
  const left = useRef(0);

  if (selection) {
    const { x, y, width, height } = selection;
    top.current = Math.min(y, y + height) - 40;
    left.current = Math.min(x, x + width);
  } else {
    top.current = -40;
    left.current = -40;
  }

  return (
    <div
      className="absolute top-0 left-0 z-50 flex items-center justify-center gap-2"
      style={{ top: top.current, left: left.current }}
    >
      <button
        className="rounded-full bg-gray-20 p-2"
        ref={(ref) => {
          if (ref && selectionRefs.current) selectionRefs.current[0] = ref;
        }}
      >
        <BsArrowsMove />
      </button>
      <button
        className="rounded-full bg-gray-20 p-2"
        ref={(ref) => {
          if (ref && selectionRefs.current) selectionRefs.current[1] = ref;
        }}
      >
        <FiCopy />
      </button>
      <button
        className="rounded-full bg-gray-20 p-2"
        ref={(ref) => {
          if (ref && selectionRefs.current) selectionRefs.current[2] = ref;
        }}
      >
        <AiOutlineDelete />
      </button>
    </div>
  );
};
