import { DEFAULT_EASING } from "@/constants/easings";

const transition = { ease: DEFAULT_EASING };

export const bgAnimation = {
  closed: { opacity: 0, transition },
  opened: { opacity: 1, transition },
};

export const modalAnimation = {
  closed: { y: -100, transition },
  opened: { y: 0, transition },
  exited: { y: 100, transition },
};
