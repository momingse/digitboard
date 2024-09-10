import { drawCircle, drawLine, drawRect } from "@/helper/canvasHelper";
import { getPos } from "@/lib/getPos";
import { socket } from "@/lib/socket";
import {
  useOptionsStore,
  useOptionsStoreOptionsSelector,
} from "@/store/options/options-use";
import { useSaveMovesStore } from "@/store/saveMoves/saveMoves-use";
import { useUsersStore } from "@/store/users/users-use";
import { useCallback, useRef, useState } from "react";
import { useBoardPosition } from "./useBoardPosition";
import { useCtx } from "./useCtx";
import { useRefs } from "./useRefs";
import { getStringFromRgba } from "@/lib/rgba";
import { DEFAULT_MOVE } from "@/constants/defaultMove";
import { useRoomStore } from "@/store/room/room-use";

export const useDrawing = (blocked: boolean = false) => {
  const options = useOptionsStoreOptionsSelector();
  const { users } = useUsersStore((state) => state);
  const { clearMoves } = useSaveMovesStore((state) => state);
  const { selection, setSelection } = useOptionsStore((state) => state);
  const { addMoveToMyMoves } = useRoomStore((state) => state);

  const [drawing, setDrawing] = useState(false);
  const tempMoves = useRef<[number, number][]>([]);
  const tempCircle = useRef<CircleInfo>({ ...DEFAULT_MOVE.circle });
  const tempSize = useRef<{ width: number; height: number }>({
    ...DEFAULT_MOVE.rect,
  });
  const tempImageDate = useRef<ImageData | undefined>(undefined);

  const { x: movedX, y: movedY } = useBoardPosition();

  const ctx = useCtx();

  const setUpCtxOption = useCallback(
    (ctx: CanvasRenderingContext2D | undefined) => {
      if (!ctx) return;
      ctx.lineWidth = options.lineWidth;
      ctx.strokeStyle = getStringFromRgba(options.lineColor);
      ctx.fillStyle = getStringFromRgba(options.fillColor);
      ctx.globalCompositeOperation =
        options.mode === "erase" ? "destination-out" : "source-over";
    },
    [options],
  );

  const drawAndSet = useCallback(() => {
    if (!tempImageDate.current) {
      tempImageDate.current = ctx?.getImageData(
        0,
        0,
        ctx.canvas.width,
        ctx.canvas.height,
      );
    }

    ctx?.putImageData(tempImageDate.current as ImageData, 0, 0);
  }, [ctx]);

  const handleStartDrawing = (x: number, y: number) => {
    if (!ctx || blocked) return;

    setDrawing(true);
    setUpCtxOption(ctx);
    drawAndSet();

    const nx = getPos(x, movedX);
    const ny = getPos(y, movedY);

    if (options.shape === "line" && options.mode !== "select") {
      ctx.beginPath();
      ctx.moveTo(nx, ny);
      ctx.stroke();
    }

    tempMoves.current = [];
    tempMoves.current.push([nx, ny]);
  };

  const handleEndDrawing = () => {
    if (!ctx || blocked || !drawing) return;

    setDrawing(false);
    ctx.closePath();

    let addMove = true;
    if (options.mode === "select" && tempMoves.current.length) {
      clearOnYourMove();

      let x = tempMoves.current[0][0];
      let y = tempMoves.current[0][1];
      let width = tempMoves.current[tempMoves.current.length - 1][0] - x;
      let height = tempMoves.current[tempMoves.current.length - 1][1] - y;

      if (width < 0) {
        width -= 4;
        x += 4;
      } else {
        width += 4;
        x -= 2;
      }

      if (height < 0) {
        height -= 4;
        y += 4;
      } else {
        height += 4;
        y -= 2;
      }

      if ((width < 4 || width > 4) && (height > 4 || height < 4)) {
        setSelection({ x, y, width, height });
      } else {
        setSelection(null);
        addMove = false;
      }
    }

    const move: Move = {
      ...DEFAULT_MOVE,
      rect: {
        ...tempSize.current,
      },
      circle: {
        ...tempCircle.current,
      },
      path: tempMoves.current,
      options,
    };

    tempMoves.current = [];
    tempCircle.current = { ...DEFAULT_MOVE.circle };
    tempSize.current = { width: 0, height: 0 };

    if (options.mode === "select") {
      addMoveToMyMoves(move);
    } else if (addMove) {
      socket.emit("draw", move);
      clearMoves();
    }
  };

  const handleDraw = (x: number, y: number, shift?: boolean) => {
    if (!ctx || !drawing || blocked) return;

    const nx = getPos(x, movedX);
    const ny = getPos(y, movedY);

    drawAndSet();

    if (options.mode === "select") {
      ctx.fillStyle = "rgba(0, 0, 0, 0.3)";

      drawRect(ctx, tempMoves.current[0], nx, ny, false, true);
      tempMoves.current.push([nx, ny]);

      setUpCtxOption(ctx);

      return;
    }

    switch (options.shape) {
      case "line":
        if (shift) {
          tempMoves.current = tempMoves.current.slice(0, 1);
        }
        drawLine(ctx, tempMoves.current[0], nx, ny, shift);
        tempMoves.current.push([nx, ny]);
        break;
      case "circle":
        tempCircle.current = drawCircle(
          ctx,
          tempMoves.current[0],
          nx,
          ny,
          shift,
        );
        break;
      case "rect":
        tempSize.current = drawRect(ctx, tempMoves.current[0], nx, ny, shift);
        break;
      default:
        break;
    }
  };

  const clearOnYourMove = useCallback(() => {
    drawAndSet();
    tempImageDate.current = undefined;
  }, [drawAndSet]);

  return {
    handleStartDrawing,
    handleEndDrawing,
    handleDraw,
    drawing,
    clearOnYourMove,
  };
};
