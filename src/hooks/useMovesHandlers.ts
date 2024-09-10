import { isMac } from "@/helper/platformHelper";
import { socket } from "@/lib/socket";
import { useRoomStore } from "@/store/room/room-use";
import { useSaveMovesStore } from "@/store/saveMoves/saveMoves-use";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { useCtx } from "./useCtx";
import { useRefs } from "./useRefs";
import { useSelection } from "./useSelection";
import { getStringFromRgba } from "@/lib/rgba";
import { useOptionsStore } from "@/store/options/options-use";

export const useMovesHandlers = (clearOnYourMove: () => void) => {
  const {
    myMoves,
    movesWithoutUser,
    usersMoves,
    addMoveToMyMoves,
    removeMoveFromMyMoves,
  } = useRoomStore((state) => state);
  const { addMove, popMove } = useSaveMovesStore((state) => state);
  const { canvasRef, minimapRef } = useRefs();
  const ctx = useCtx();
  const { setSelection } = useOptionsStore((state) => state);

  const prevMovesLength = useRef(0);

  /* eslint-disable react-hooks/exhaustive-deps */
  const sortedMoves = useMemo(() => {
    const moves = [
      ...myMoves,
      ...movesWithoutUser,
      ...Array.from(usersMoves.values()).flat(),
    ];

    moves.sort((a, b) => a.timestamp - b.timestamp);

    return moves;
  }, [
    JSON.stringify(myMoves),
    JSON.stringify(movesWithoutUser),
    JSON.stringify(Array.from(usersMoves.values())),
  ]);

  const copyCanvasToSmall = useCallback(() => {
    if (!canvasRef.current || !minimapRef.current) return;

    const smallCtx = minimapRef.current.getContext("2d");
    if (!smallCtx) return;

    smallCtx.clearRect(0, 0, smallCtx.canvas.width, smallCtx.canvas.height);
    smallCtx.drawImage(
      canvasRef.current,
      0,
      0,
      smallCtx.canvas.width,
      smallCtx.canvas.height,
    );
  }, [canvasRef, minimapRef]);

  const drawMove = useCallback(
    (move: Move, image?: HTMLImageElement) => {
      const { path } = move;
      if (!ctx && !path.length) {
        return;
      }

      const moveOption = move.options;
      if (moveOption.mode == "select") return;

      if (!ctx) {
        return;
      }

      ctx.lineWidth = moveOption.lineWidth;
      ctx.strokeStyle = getStringFromRgba(moveOption.lineColor);
      ctx.fillStyle = getStringFromRgba(moveOption.fillColor);
      const originalComposite = ctx.globalCompositeOperation;
      if (move.options.mode === "erase")
        ctx.globalCompositeOperation = "destination-out";
      else ctx.globalCompositeOperation = "source-over";

      if (moveOption.shape === "image" && image) {
        ctx?.drawImage(image, path[0][0], path[0][1]);
        return;
      }

      ctx.beginPath();
      switch (move.options.shape) {
        case "line":
          path.forEach(([x, y], index) => {
            if (index === 0) {
              ctx.moveTo(x, y);
            } else {
              ctx.lineTo(x, y);
            }
          });
          ctx.stroke();
          break;
        case "circle":
          const { cX, cY, radiusX, radiusY } = move.circle;
          ctx.ellipse(cX, cY, radiusX, radiusY, 0, 0, 2 * Math.PI);
          ctx.fill();
          ctx.stroke();
          break;
        case "rect":
          const { width, height } = move.rect;
          ctx.rect(path[0][0], path[0][1], width, height);
          ctx.stroke();
          ctx.fill();
          break;
        default:
          break;
      }
      ctx.closePath();
      ctx.globalCompositeOperation = originalComposite;
    },
    [ctx],
  );

  const drawAllMoves = useCallback(async () => {
    if (!ctx) return;

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    const image = await Promise.all(
      sortedMoves
        .filter((move) => move.options.shape === "image")
        .map((move) => {
          return new Promise<HTMLImageElement>((resolve) => {
            const img = new Image();
            img.src = move.img.base64;
            img.id = move.id;
            img.onload = () => resolve(img);
          });
        }),
    );

    sortedMoves.forEach((move, index) => {
      if (move.options.shape === "image") {
        const img = image.find((i) => i.id === move.id);
        if (img) drawMove(move, img);
      } else {
        drawMove(move);
      }
    });

    copyCanvasToSmall();
  }, [ctx, sortedMoves, drawMove]);

  useSelection(drawAllMoves);

  useEffect(() => {
    socket.on("your_move", (move: Move) => {
      clearOnYourMove();
      addMoveToMyMoves(move);
      setTimeout(() => {
        setSelection(null);
      }, 100);
    });

    return () => {
      socket.off("your_move");
    };
  }, [addMoveToMyMoves, clearOnYourMove, setSelection]);

  useEffect(() => {
    if (
      prevMovesLength.current >= sortedMoves.length ||
      !prevMovesLength.current
    ) {
      drawAllMoves();
    } else {
      const lastMove = sortedMoves[sortedMoves.length - 1];
      if (lastMove.options.shape === "image") {
        const img = new Image();
        img.src = lastMove.img.base64;
        img.onload = () => {
          drawMove(lastMove, img);
          copyCanvasToSmall();
        };
      } else {
        drawMove(lastMove);
      }
    }

    return () => {
      prevMovesLength.current = sortedMoves.length;
    };
  }, [sortedMoves, drawAllMoves, drawMove]);

  const handleUndo = useCallback(() => {
    if (!ctx) return;
    const move = removeMoveFromMyMoves();
    if (move?.options.mode === "select") setSelection(null);
    else if (move) {
      addMove(move);
      socket.emit("undo");
    }
  }, [ctx, removeMoveFromMyMoves]);

  const handleRedo = useCallback(() => {
    if (!ctx) return;
    const move = popMove();
    if (move) {
      socket.emit("draw", move);
    }
  }, [ctx, popMove, addMoveToMyMoves]);

  useEffect(() => {
    const handleUndoRedoKeyboard = (e: KeyboardEvent) => {
      const trigger = isMac() ? e.metaKey : e.ctrlKey;
      if (trigger && e.key === "z") {
        e.preventDefault();
        handleUndo();
      } else if (trigger && e.key === "y") {
        e.preventDefault();
        handleRedo();
      }
    };
    document.addEventListener("keydown", handleUndoRedoKeyboard);

    return () => {
      document.removeEventListener("keydown", handleUndoRedoKeyboard);
    };
  }, [handleUndo, handleRedo]);

  return {
    handleUndo,
    handleRedo,
    drawAllMoves,
    drawMove,
  };
};
