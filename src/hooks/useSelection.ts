import { isMac } from "@/helper/platformHelper";
import { useOptionsStore } from "@/store/options/options-use";
import { useEffect } from "react";
import { useCtx } from "./useCtx";

export const useSelection = (drawAllMoves: () => void) => {
  const ctx = useCtx();

  const { selection, setSelection } = useOptionsStore((state) => state);

  useEffect(() => {
    drawAllMoves();

    if (!ctx || !selection) return;

    const { x, y, width, height } = selection;

    ctx.lineWidth = 2;
    ctx.setLineDash([5, 10]);
    ctx.globalCompositeOperation = "source-over";

    ctx.beginPath();
    ctx.rect(x - 2, y - 2, width + 4, height + 4);
    ctx.stroke();
    ctx.closePath();

    ctx.setLineDash([]);
  }, [selection, ctx, drawAllMoves]);

  useEffect(() => {
    const handleCopySelection = (e: KeyboardEvent) => {
      if (!selection || !ctx) return;

      const trigger = isMac() ? e.metaKey : e.ctrlKey;
      if (trigger && e.key === "c") {
        e.preventDefault();
        const { x, y, width, height } = selection;

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
    };

    document.addEventListener("keydown", handleCopySelection);

    return () => {
      document.removeEventListener("keydown", handleCopySelection);
    };
  }, [selection, ctx]);
};
