import { useBackgroundStore } from "@/store/background/background-use";
import { useModalStore } from "@/store/modal/modal-use";
import { CgScreen } from "react-icons/cg";
import { BackgroundModal } from "./BackgroundModal";

export const BackgroundPicker = () => {
  const { openModal } = useModalStore((state) => state);

  return (
    <button onClick={() => openModal(<BackgroundModal />)}>
      <CgScreen />
    </button>
  );
};
