import { isMac } from "@/helper/platformHelper";
import {
  useOptionsStore,
  useOptionsStoreOptionsSelector,
} from "@/store/options/options-use";
import { useEffect } from "react";
import { useCtx } from "./useCtx";
import { useRefs } from "./useRefs";
import { socket } from "@/lib/socket";
import { DEFAULT_MOVE } from "@/constants/defaultMove";

export const useSelection = (drawAllMoves: () => Promise<void>) => {
  const ctx = useCtx();
  const { bgRef } = useRefs();

  const { setSelection } = useOptionsStore((state) => state);
  const options = useOptionsStoreOptionsSelector();

  useEffect(() => {
    const callback = async () => {
      await drawAllMoves();

      if (!ctx || !options.selection) return;

      const { x, y, width, height } = options.selection;

      ctx.lineWidth = 2;
      ctx.strokeStyle = "#000";
      ctx.setLineDash([5, 10]);
      ctx.globalCompositeOperation = "source-over";

      ctx.beginPath();
      ctx.rect(x, y, width, height);
      ctx.stroke();
      ctx.closePath();

      ctx.setLineDash([]);
    };

    callback();
  }, [options.selection, ctx, drawAllMoves]);

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    const handleCopySelection = (e: KeyboardEvent) => {
      if (!options.selection || !ctx) return;

      const trigger = isMac() ? e.metaKey : e.ctrlKey;
      const { x, y, width, height } = options.selection;
      if (trigger && e.key === "c") {
        e.preventDefault();
        const imageData = ctx?.getImageData(x, y, width, height);

        if (imageData) {
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const tempCtx = canvas.getContext("2d");
          tempCtx?.putImageData(imageData, 0, 0);

          canvas.toBlob((blob) => {
            if (blob) {
              const item = new ClipboardItem({ "image/png": blob });
              navigator.clipboard.write([item]);
            }
          });
        }

        setSelection(null);
      }

      const deleteKey = isMac()
        ? e.key === "Backspace" && trigger
        : e.key === "Delete";

      if (deleteKey) {
        const move: Move = {
          ...DEFAULT_MOVE,
          rect: {
            width,
            height,
          },
          path: [[x, y]],
          options: {
            ...options,
            shape: "rect",
            mode: "erase",
            fillColor: { r: 0, g: 0, b: 0, a: 0 },
          },
        };

        socket.emit("draw", move);
        setSelection(null);
      }
    };

    document.addEventListener("keydown", handleCopySelection);

    return () => {
      document.removeEventListener("keydown", handleCopySelection);
    };
  }, [JSON.stringify(options), ctx, setSelection, bgRef]);
};
