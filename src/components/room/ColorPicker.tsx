import { ColorPickerAnimation } from "@/animation/ColorPicker.animation";
import { getStringFromRgba } from "@/lib/rgba";
import { useOptionsStore } from "@/store/options/options-use";
import { AnimatePresence, motion } from "framer-motion";
import { useRef, useState } from "react";
import { RgbaColorPicker } from "react-colorful";
import { useClickAway } from "react-use";

export const ColorPicker = () => {
  const { lineColor, setLineColor } = useOptionsStore((state) => state);

  const ref = useRef<HTMLDivElement>(null);

  const [opened, setOpened] = useState(false);

  useClickAway(ref, () => {
    setOpened(false);
  });

  return (
    <div className="relative flex items-center" ref={ref}>
      <button
        className="h-6 w-6 rounded-full border-2 border-white transition-all hover:scale-125 active:scale-100"
        style={{ backgroundColor: getStringFromRgba(lineColor) }}
        onClick={() => setOpened((prev) => !prev)}
      ></button>
      <AnimatePresence>
        {opened && (
          <motion.div
            className="absolute top-0 left-14"
            variants={ColorPickerAnimation}
            initial="from"
            animate="to"
            exit="from"
          >
            <RgbaColorPicker
              color={lineColor}
              onChange={(color) => setLineColor({ ...color })}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
