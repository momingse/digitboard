import { useMoveImage } from "@/hooks/useMoveImage";
import { optimizeImage } from "@/lib/optimizeImage";
import { useEffect } from "react";
import { BsFillImageFill } from "react-icons/bs";

export const ImagePicker = () => {
  const { setMoveImage } = useMoveImage();

  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;

      if (items) {
        for (const item of items) {
          if (!item.type.includes("image")) continue;

          const file = item.getAsFile();
          if (!file) continue;

          optimizeImage(file, (uri) => {
            setMoveImage(uri);
          });
        }
      }
    };

    document.addEventListener("paste", handlePaste);

    return () => {
      document.removeEventListener("paste", handlePaste);
    };
  }, [setMoveImage]);

  const handleImageInput = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.click();

    fileInput.addEventListener("change", (e) => {
      if (fileInput && fileInput.files && fileInput.files[0]) {
        const file = fileInput.files[0];
        optimizeImage(file, (uri) => {
          setMoveImage(uri);
        });
      }
    });
  };

  return (
    <button className="text-xl" onClick={handleImageInput}>
      <BsFillImageFill />
    </button>
  );
};
