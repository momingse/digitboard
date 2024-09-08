import { CANVAS_SIZE } from "@/constants/canvasSize";
import { FC, RefObject } from "react";
import { HiOutlineDownload } from "react-icons/hi";

interface DownloadButtonProps {
  canvasRef: RefObject<HTMLCanvasElement>;
  bgRef: RefObject<HTMLCanvasElement>;
}

export const DownloadButton: FC<DownloadButtonProps> = ({
  canvasRef,
  bgRef,
}) => {
  const handleDownload = () => {
    const canvas = document.createElement("canvas");
    canvas.width = CANVAS_SIZE.width;
    canvas.height = CANVAS_SIZE.height;

    const tempCtx = canvas.getContext("2d");

    if (tempCtx && canvasRef.current && bgRef.current) {
      tempCtx.drawImage(bgRef.current, 0, 0);
      tempCtx.drawImage(canvasRef.current, 0, 0);
    }

    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = "canvas.png";
    link.click();
  };

  return (
    <button onClick={handleDownload}>
      <HiOutlineDownload />
    </button>
  );
};
