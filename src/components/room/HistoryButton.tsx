import { useRefs } from "@/hooks/useRefs";
import { useRoomStore } from "@/store/room/room-use";
import { useSaveMovesStore } from "@/store/saveMoves/saveMoves-use";
import { FaUndo, FaRedo } from "react-icons/fa";

export const HistoryButton = () => {
  const { redoRef, undoRef } = useRefs();

  const { myMoves } = useRoomStore((state) => state);

  const { savedMoves } = useSaveMovesStore((state) => state);

  return (
    <>
      <button
        className="text-xl disabled:opacity-25"
        ref={undoRef}
        disabled={!myMoves.length}
      >
        <FaUndo />
      </button>
      <button
        className="text-xl disabled:opacity-25"
        ref={redoRef}
        disabled={!savedMoves.length}
      >
        <FaRedo />
      </button>
    </>
  );
};
