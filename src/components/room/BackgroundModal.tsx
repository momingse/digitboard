import { CANVAS_SIZE } from "@/constants/canvasSize";
import { drawBackground } from "@/helper/canvasHelper";
import { useBackgroundStore } from "@/store/background/background-use";
import { useModalStore } from "@/store/modal/modal-use";
import { useEffect, useMemo } from "react";
import { AiOutlineClose } from "react-icons/ai";

export const BackgroundModal = () => {
  const { closeModal } = useModalStore((state) => state);
  const { setMode, setLines } = useBackgroundStore((state) => state);

  const renderBg = (
    ref: HTMLCanvasElement | null,
    mode: "dark" | "light",
    lines: boolean,
  ) => {
    const ctx = ref?.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = mode === "dark" ? "#222" : "#fff";
    ctx.fillRect(0, 0, CANVAS_SIZE.width, CANVAS_SIZE.height);
    document.documentElement.style.backgroundColor =
      mode === "dark" ? "#222" : "#fff";

    if (lines) drawBackground(ctx, mode);
  };

  const setting: { mode: "dark" | "light"; lines: boolean }[] = useMemo(
    () => [
      { mode: "dark", lines: true },
      { mode: "dark", lines: false },
      { mode: "light", lines: true },
      { mode: "light", lines: false },
    ],
    [],
  );

  return (
    <div className="relative flex flex-col items-center rounded-md bg-white p10">
      <button onClick={closeModal} className="absolute top-5 right-5">
        <AiOutlineClose />
      </button>
      <h2 className="mb-4 text-2xl font-bold">Choose background</h2>
      <div className="grid sm:grid-cols-2 gap-5">
        {setting.map((s, i) => (
          <canvas
            key={i}
            className="h-48 w-64 cursor-pointer rounded-md border-2"
            tabIndex={0}
            width={256}
            height={192}
            onClick={() => {
              setMode(s.mode);
              setLines(s.lines);
            }}
            ref={(ref) => renderBg(ref, s.mode, s.lines)}
          />
        ))}
      </div>
    </div>
  );
};
