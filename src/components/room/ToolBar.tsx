import { DEFAULT_EASING } from "@/constants/easings";
import { useRefs } from "@/hooks/useRefs";
import { useViewportSize } from "@/hooks/useViewportSize";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FiChevronRight } from "react-icons/fi";
import { BackgroundPicker } from "./BackgroundPicker";
import { ColorPicker } from "./ColorPicker";
import { DownloadButton } from "./DownloadButton";
import { ExitButton } from "./ExitButton";
import { HistoryButton } from "./HistoryButton";
import { ImagePicker } from "./ImagePicker";
import { LineWidthPicker } from "./LineWidthPicker";
import { ModePicker } from "./ModePicker";
import { ShapeSelector } from "./ShapeSelector";
import { ShareButton } from "./ShareButton";

export const ToolBar = () => {
  const { canvasRef, bgRef } = useRefs();
  const { width } = useViewportSize();
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    setOpened(width >= 1024);
  }, [width]);

  return (
    <>
      <motion.button
        className="absolute bottom-1/2 -left-2 z-50 h-10 w-10 rounded-full bg-black text-2xl transition-none lg:hidden"
        animate={{ rotate: opened ? 0 : 100 }}
        transition={{ duration: 0.2, ease: DEFAULT_EASING }}
        onClick={() => setOpened((prev) => !prev)}
      >
        <FiChevronRight />
      </motion.button>
      <motion.div
        className="absolute p-5 left-10 top-[50%] z-50 grid grid-cols-2 items-center rounded-lg gap-5 bg-zinc-900 text-white 2xl:grid-cols-1"
        animate={{
          x: opened ? 0 : -160,
          y: "-50%",
        }}
        transition={{
          duration: 0.2,
          ease: DEFAULT_EASING,
        }}
        style={{
          transform: "translateY(-50%)",
        }}
      >
        <HistoryButton />
        <div className="h-px w-full bg-white 2xl:hidden" />
        <div className="h-px w-full bg-white" />
        <ColorPicker />
        <ShapeSelector />
        <LineWidthPicker />
        <ModePicker />
        <ImagePicker />
        <div className="2xl:hidden"/>
        <div className="h-px w-full bg-white 2xl:hidden" />
        <div className="h-px w-full bg-white" />
        <BackgroundPicker />
        <DownloadButton canvasRef={canvasRef} bgRef={bgRef} />
        <ExitButton />
        <ShareButton />
      </motion.div>
    </>
  );
};
