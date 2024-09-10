import { isMac } from "@/helper/platformHelper";
import {
  useOptionsStore,
  useOptionsStoreOptionsSelector,
} from "@/store/options/options-use";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { useCtx } from "./useCtx";
import { useRefs } from "./useRefs";
import { socket } from "@/lib/socket";
import { DEFAULT_MOVE } from "@/constants/defaultMove";
import { useMoveImage } from "./useMoveImage";
import { OptionsState } from "@/store/options/options-store";
import { toast } from "react-toastify";
import { SelectionButtons } from "@/components/room/SelectionButtions";

export const useSelection = (drawAllMoves: () => Promise<void>) => {
  const ctx = useCtx();
  const { bgRef, selectionRefs } = useRefs();

  const { setSelection } = useOptionsStore((state) => state);
  const options = useOptionsStoreOptionsSelector();
  const { setMoveImage } = useMoveImage();

  const tempSelection = useRef<OptionsState["selection"] | null>(null);

  useEffect(() => {
    const callback = async () => {
      if (!ctx || !options.selection) return;
      await drawAllMoves();

      setTimeout(() => {
        const { x, y, width, height } = options.selection!;

        ctx.lineWidth = 2;
        ctx.strokeStyle = "#000";
        ctx.setLineDash([5, 10]);
        ctx.globalCompositeOperation = "source-over";

        ctx.beginPath();
        ctx.rect(x, y, width, height);
        ctx.stroke();
        ctx.closePath();

        ctx.setLineDash([]);
      }, 10);
    };

    if (
      tempSelection.current?.width !== options.selection?.width ||
      tempSelection.current?.height !== options.selection?.height ||
      tempSelection.current?.x !== options.selection?.x ||
      tempSelection.current?.y !== options.selection?.y
    ) {
      callback();
    }

    return () => {
      if (options.selection) tempSelection.current = { ...options.selection };
    };
  }, [options.selection, ctx, drawAllMoves]);

  const dimension = useMemo(() => {
    if (!options.selection)
      return {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
      };

    let { x, y, width, height } = options.selection;

    if (width < 0) {
      width += 4;
      x -= 2;
    } else {
      width -= 4;
      x += 2;
    }

    if (height < 0) {
      height += 4;
      y -= 2;
    } else {
      height -= 4;
      y += 2;
    }

    return { x, y, width, height };
  }, [options.selection]);

  const makeBlob = useCallback(
    async (widthBg?: boolean) => {
      if (!options.selection) return null;

      const { x, y, width, height } = dimension;

      const imageData = ctx?.getImageData(x, y, width, height);

      if (!imageData) return null;

      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = width;
      tempCanvas.height = height;
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const tempCtx = canvas.getContext("2d");

      if (!tempCtx || !bgRef.current) return null;
      const bgImage = bgRef.current
        .getContext("2d")
        ?.getImageData(x, y, width, height);

      if (bgImage && widthBg) tempCtx.putImageData(bgImage, 0, 0);

      const sTempCtx = tempCanvas.getContext("2d");
      sTempCtx?.putImageData(imageData, 0, 0);

      tempCtx.drawImage(tempCanvas, 0, 0);

      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          }
        });
      });

      return blob;
    },
    [options.selection, dimension, ctx, bgRef],
  );

  const createDeleteMove = useCallback(() => {
    if (!options.selection) return null;

    let { x, y, width, height } = dimension;

    if (width < 0) {
      width += 4;
      x -= 2;
    } else {
      width -= 4;
      x += 2;
    }

    if (height < 0) {
      height += 4;
      y -= 2;
    } else {
      height -= 4;
      y += 2;
    }

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
        fillColor: { r: 0, g: 0, b: 0, a: 1 },
      },
    };

    socket.emit("draw", move);
  }, [options, dimension]);

  const handleCopy = useCallback(async () => {
    const blob = await makeBlob();
    if (!blob) return;
    const item = new ClipboardItem({ "image/png": blob });
    navigator.clipboard.write([item]).then(() => {
      toast.success("Copied to clipboard");
    });
  }, [makeBlob]);

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    const handleSelection = async (e: KeyboardEvent) => {
      const trigger = isMac() ? e.metaKey : e.ctrlKey;
      const deleteKey = isMac()
        ? e.key === "Backspace" && trigger
        : e.key === "Delete";
      if (e.key === "c" && trigger) {
        e.preventDefault();
        handleCopy();
      }

      if (deleteKey) {
        createDeleteMove();
      }
    };

    document.addEventListener("keydown", handleSelection);

    return () => {
      document.removeEventListener("keydown", handleSelection);
    };
  }, [
    JSON.stringify(options.selection),
    ctx,
    handleCopy,
    bgRef,
    createDeleteMove,
  ]);

  useEffect(() => {
    const handleSelectionMove = async (e: MouseEvent) => {
      if (!options.selection) return;

      const blob = await makeBlob(true);
      if (!blob) return;

      const { x, y, width, height } = dimension;
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.addEventListener("loadend", () => {
        const base64 = reader.result?.toString();
        if (!base64) return;

        createDeleteMove();
        setMoveImage({
          base64,
          x: Math.min(x, x + width),
          y: Math.min(y, y + height),
        });
      });
    };

    if (!selectionRefs.current) return;
    const moveButton = selectionRefs.current[0];
    const copyButton = selectionRefs.current[1];
    const deleteButton = selectionRefs.current[2];

    moveButton.addEventListener("click", handleSelectionMove);
    copyButton.addEventListener("click", handleCopy);
    deleteButton.addEventListener("click", createDeleteMove);

    return () => {
      if (!selectionRefs.current) return;
      moveButton.removeEventListener("click", handleSelectionMove);
      copyButton.removeEventListener("click", handleCopy);
      deleteButton.removeEventListener("click", createDeleteMove);
    };
  }, [
    JSON.stringify(options.selection),
    dimension,
    makeBlob,
    createDeleteMove,
    handleCopy,
  ]);
};
