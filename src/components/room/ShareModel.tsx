import { copyToClipboard } from "@/lib/copyToClipboard";
import { useModalStore } from "@/store/modal/modal-use";
import { useRoomStore } from "@/store/room/room-use";
import { useEffect, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { toast } from "react-toastify";

export const ShareModel = () => {
  const { id } = useRoomStore((state) => state);

  const { closeModal } = useModalStore((state) => state);

  const [url, setUrl] = useState("");

  useEffect(() => {
    setUrl(window.location.href);
  }, []);

  const handleCopy = () => {
    const copySuccessfully = copyToClipboard(url);
    if (copySuccessfully) {
      toast.success("Copied to clipboard");
    } else {
      toast.error("Failed to copy to clipboard");
    }
    closeModal();
  };

  return (
    <div className="relative flex flex-col items-center rounded-md bg-white p-10 pt-5">
      <button onClick={closeModal} className="absolute top-5 right-5">
        <AiOutlineClose />
      </button>
      <h2 className="text-2xl font-bold">Invite</h2>
      <h3>
        Room id: <p className="inline font-bold">{id}</p>
      </h3>
      <div className="relative mt-2">
        <input
          type="text"
          value={url}
          readOnly
          className="rounded-xl border p-5 py-1 w-96"
        />
        <button className="absolute right-0 h-full" onClick={handleCopy}>
          Copy
        </button>
      </div>
    </div>
  );
};
