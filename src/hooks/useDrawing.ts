import { drawCircle, drawLine, drawRect } from "@/helper/canvasHelper";
import { getPos } from "@/lib/getPos";
import { socket } from "@/lib/socket";
import { useOptionsStoreOptionsSelector } from "@/store/options/options-use";
import { useRoomStore } from "@/store/room/room-use";
import { useUsersStore } from "@/store/users/users-use";
import { useCallback, useEffect, useRef, useState } from "react";
import { useBoardPosition } from "./useBoardPosition";
import { useRefs } from "./useRefs";
import { useSaveMovesStore } from "@/store/saveMoves/saveMoves-use";

const CIRCLE_INFO_DEFAULT: CircleInfo = Object.freeze({
  cX: 0,
  cY: 0,
  radiusX: 0,
  radiusY: 0,
});

export const useDrawing = (blocked: boolean = false) => {
  const { canvasRef } = useRefs();
  const options = useOptionsStoreOptionsSelector();
  const { users } = useUsersStore((state) => state);
  const { clearMoves } = useSaveMovesStore((state) => state);

  const [drawing, setDrawing] = useState(false);
  const tempMoves = useRef<[number, number][]>([]);
  const tempCircle = useRef<CircleInfo>({ ...CIRCLE_INFO_DEFAULT });
  const tempSize = useRef<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });
  const tempImageDate = useRef<ImageData | undefined>(undefined);

  const { x: movedX, y: movedY } = useBoardPosition();

  const [ctx, setCtx] = useState<CanvasRenderingContext2D>();

  const setUpCtxOption = useCallback(
    (ctx: CanvasRenderingContext2D | undefined) => {
      if (!ctx) return;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.lineWidth = options.lineWidth;
      ctx.strokeStyle = options.lineColor;
      ctx.globalCompositeOperation = options.erase
        ? "destination-out"
        : "source-over";
    },
    [options],
  );

  useEffect(() => {
    const newCtx = canvasRef.current?.getContext("2d");
    if (newCtx) {
      setCtx(newCtx);
    }
  }, [canvasRef]);

  const drawAndSet = () => {
    if (!tempImageDate.current) {
      tempImageDate.current = ctx?.getImageData(
        0,
        0,
        ctx.canvas.width,
        ctx.canvas.height,
      );
    }

    ctx?.putImageData(tempImageDate.current as ImageData, 0, 0);
  };

  const handleStartDrawing = (x: number, y: number) => {
    if (!ctx || blocked) return;

    setDrawing(true);
    setUpCtxOption(ctx);

    const nx = getPos(x, movedX);
    const ny = getPos(y, movedY);

    ctx.beginPath();
    ctx.moveTo(nx, ny);
    ctx.stroke();

    tempMoves.current = [];
    tempMoves.current.push([nx, ny]);
  };

  const handleEndDrawing = () => {
    if (!ctx || blocked) return;

    setDrawing(false);
    ctx.closePath();

    const move: Move = {
      rect: {
        ...tempSize.current,
      },
      circle: {
        ...tempCircle.current,
      },
      img: { base64: "" },
      path: tempMoves.current,
      options,
      timestamp: 0,
      eraser: options.erase,
      id: "",
    };

    tempMoves.current = [];
    tempCircle.current = { ...CIRCLE_INFO_DEFAULT };
    tempSize.current = { width: 0, height: 0 };
    tempImageDate.current = undefined;

    socket.emit("draw", move);
    clearMoves();
  };

  const handleDraw = (x: number, y: number, shift?: boolean) => {
    if (!ctx || !drawing || blocked) return;

    const nx = getPos(x, movedX);
    const ny = getPos(y, movedY);

    switch (options.shape) {
      case "line":
        if (shift) {
          tempMoves.current = tempMoves.current.slice(0, 1);
          drawAndSet();
        }
        drawLine(ctx, tempMoves.current[0], nx, ny, shift);
        tempMoves.current.push([nx, ny]);
        break;
      case "circle":
        drawAndSet();
        tempCircle.current = drawCircle(
          ctx,
          tempMoves.current[0],
          nx,
          ny,
          shift,
        );
        break;
      case "rect":
        drawAndSet();
        tempSize.current = drawRect(ctx, tempMoves.current[0], nx, ny);
        break;
      default:
        break;
    }
  };

  return {
    handleStartDrawing,
    handleEndDrawing,
    handleDraw,
    drawing,
  };
};
