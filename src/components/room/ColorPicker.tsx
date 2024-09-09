import { ColorPickerAnimation } from "@/animation/ColorPicker.animation";
import { getStringFromRgba } from "@/lib/rgba";
import { useOptionsStore } from "@/store/options/options-use";
import { AnimatePresence, motion } from "framer-motion";
import { useRef, useState } from "react";
import { RgbaColorPicker } from "react-colorful";
import { BsPaletteFill } from "react-icons/bs";
import { useClickAway } from "react-use";

export const ColorPicker = () => {
  const { lineColor, fillColor, mode, setLineColor, setFillColor } =
    useOptionsStore((state) => state);

  const ref = useRef<HTMLDivElement>(null);

  const [opened, setOpened] = useState(false);

  useClickAway(ref, () => {
    setOpened(false);
  });

  return (
    <div className="relative flex items-center" ref={ref}>
      <button
        className=""
        onClick={() => setOpened((prev) => !prev)}
        disabled={mode === "select"}
      >
        <BsPaletteFill />
      </button>
      <AnimatePresence>
        {opened && (
          <motion.div
            className="absolute left-10 sm:left-14 mt-24"
            variants={ColorPickerAnimation}
            initial="from"
            animate="to"
            exit="from"
          >
            <h2 className="font-semibold text-black dark:text-white">
              Line Color
            </h2>
            <RgbaColorPicker
              color={lineColor}
              onChange={(color) => setLineColor({ ...color })}
              className="mb-5"
            />
            <h2 className="font-semibold text-black dark:text-white">Fill Color</h2>
            <RgbaColorPicker
              color={lineColor}
              onChange={(color) => setFillColor({ ...color })}
              className="mb-5"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
