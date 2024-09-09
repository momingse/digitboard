import { useModalStore } from "@/store/modal/modal-use";
import { IoIosShareAlt } from "react-icons/io";
import { ShareModel } from "./ShareModel";

export const ShareButton = () => {
  const { openModal } = useModalStore((state) => state);

  const handleOnClick = () => openModal(<ShareModel />);

  return (
    <button className="text-2xl" onClick={handleOnClick}>
      <IoIosShareAlt />
    </button>
  );
};
