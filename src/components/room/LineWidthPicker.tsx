import { useOptionsStore } from "@/store/options/options-use";
import { AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { BsBorderWidth } from "react-icons/bs";
import { useClickAway } from "react-use";
import { motion } from "framer-motion";

export const LineWidthPicker = () => {
  const { lineWidth, mode, setLineWidth } = useOptionsStore((state) => state);

  const ref = useRef<HTMLDivElement>(null);

  const [opened, setOpened] = useState(false);

  useClickAway(ref, () => {
    setOpened(false);
  });

  return (
    <div className="relative flex items-center" ref={ref}>
      <button
        className="h-6 w-6 rounded-full border-2 border-white transition-all hover:scale-125 active:scale-100"
        onClick={() => setOpened((prev) => !prev)}
        disabled={mode === "select"}
      >
        <BsBorderWidth />
      </button>
      <AnimatePresence>
        {opened && (
          <motion.div
            className="absolute top-[6px] left-14 w-36"
            initial="from"
            animate="to"
            exit="from"
          >
            <input
              type="range"
              min={1}
              max={26}
              value={lineWidth}
              onChange={(e) => setLineWidth(+e.target.value)}
              className="h-4 w-full cursor-pointer appearance-none rounded-lg bg-zinc-200"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
