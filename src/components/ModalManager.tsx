import {
  bgAnimation,
  modalAnimation,
} from "@/animation/ModelManager.animation";
import { useModalStore } from "@/store/modal/modal-use";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Portal } from "./Portal";

export const ModalManager = () => {
  const { opened, modal, openModal, closeModal } = useModalStore(
    (state) => state,
  );

  const [portalNode, setPortalNode] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (!portalNode) {
      const node = document.getElementById("portal");
      if (node) setPortalNode(node);
      return;
    }

    if (opened) {
      portalNode.style.pointerEvents = "all";
    } else {
      portalNode.style.pointerEvents = "none";
    }
  }, [opened, portalNode]);

  return (
    <Portal>
      <motion.div
        className="z-40 flex min-h-full w-full items-center justify-center bg-black/80"
        onClick={closeModal}
        variants={bgAnimation}
        initial="closed"
        animate={opened ? "opened" : "closed"}
      >
        <AnimatePresence>
          {opened && (
            <motion.div
              variants={modalAnimation}
              initial="closed"
              animate="opened"
              exit="exited"
              onClick={(e) => e.stopPropagation()}
              className="p-6"
            >
              {modal}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </Portal>
  );
};
