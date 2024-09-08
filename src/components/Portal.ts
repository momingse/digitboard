import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface PortalProps {
  children: React.ReactNode;
}

export const Portal = ({ children }: PortalProps) => {
  const [portal, setPortal] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const node = document.getElementById("portal");
    if (node) setPortal(node);
  }, []);

  if (!portal) return null;

  return createPortal(children, portal);
};
