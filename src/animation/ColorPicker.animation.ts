import { DEFAULT_EASING } from "@/constants/easings";

export const ColorPickerAnimation = {
  from: {
    y: -30,
    opacity: 0,
    transition: {
      ease: DEFAULT_EASING,
      duration: 0.2,
    },
  },
  to: {
    y: 0,
    opacity: 1,
    transition: {
      ease: DEFAULT_EASING,
      duration: 0.2,
    },
  },
};
