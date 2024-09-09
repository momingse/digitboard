export const DEFAULT_MOVE = Object.freeze<Move>({
  rect: {
    width: 0,
    height: 0,
  },
  circle: {
    cX: 0,
    cY: 0,
    radiusX: 0,
    radiusY: 0,
  },
  img: {
    base64: "",
  },
  path: [],
  options: {
    shape: "line",
    mode: "draw",
    lineWidth: 1,
    lineColor: { r: 0, g: 0, b: 0, a: 0 },
    fillColor: { r: 0, g: 0, b: 0, a: 0 },
    selection: null,
  },
  id: "",
  timestamp: 0,
});
