import { useModalStore } from "@/store/modal/modal-use";
import { FC } from "react";
import { AiOutlineClose } from "react-icons/ai";
``;

interface NotFoundModalProps {
  id: string;
}

export const NotFoundModal: FC<NotFoundModalProps> = ({ id }) => {
  const closeModal = useModalStore((state) => state.closeModal);

  return (
    <div className="relative flex flex-col items-center rounded-md bg-white p-10">
      <button onClick={closeModal} className="absolute top-5 right-5">
        <AiOutlineClose />
      </button>
      <h2 className="text-lg font-bold">Room with id: {id} not found!</h2>
      <h3>Please check the id and try again.</h3>
    </div>
  );
};
