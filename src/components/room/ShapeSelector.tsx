import { ColorPickerAnimation } from "@/animation/ColorPicker.animation";
import { useOptionsStore } from "@/store/options/options-use";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useRef, useState } from "react";
import { BiRectangle } from "react-icons/bi";
import { CgShapeZigzag } from "react-icons/cg";
import { FaCircle } from "react-icons/fa";
import { useClickAway } from "react-use";

export const ShapeSelector = () => {
  const ref = useRef<HTMLDivElement>(null);

  const { shape, setShape, setMode } = useOptionsStore((state) => state);

  const [opened, setOpened] = useState(false);

  useClickAway(ref, () => {
    setOpened(false);
  });

  const handleShapeChange = (shape: Shape) => {
    setShape(shape);
    setMode("draw");
    setOpened(false);
  };

  const shapeToIconMap: Partial<Record<keyof typeof Shape, JSX.Element>> =
    useMemo(
      () => ({
        line: <CgShapeZigzag />,
        circle: <FaCircle />,
        rect: <BiRectangle />,
      }),
      [],
    );

  return (
    <div className="relative flex items-center" ref={ref}>
      <button className="text-xl" onClick={() => setOpened((prev) => !prev)}>
        {Object.entries(shapeToIconMap).find(([key]) => key === shape)?.[1]}
      </button>
      <AnimatePresence>
        {opened && (
          <motion.div
            className="absolute left-14 flex gap-1 rouneded-lg bg-zinc-900 p-2"
            variants={ColorPickerAnimation}
            initial="from"
            animate="to"
            exit="from"
          >
            {Object.keys(shapeToIconMap).map((key) => (
              <button
                key={key}
                className="text-xl"
                onClick={() => handleShapeChange(key as Shape)}
              >
                {shapeToIconMap[key as Shape]}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
