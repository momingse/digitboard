const getWidthAndHeight = (
  x: number,
  y: number,
  from: [number, number],
  shift?: boolean,
) => {
  let width = x - from[0];
  let height = y - from[1];

  if (shift) {
    if (Math.abs(width) > Math.abs(height)) {
      if ((width > 0 && height < 0) || (width < 0 && height > 0)) {
        width = -height;
      } else {
        width = height;
      }
    } else if ((height > 0 && width < 0) || (height < 0 && width > 0)) {
      height = -width;
    } else {
      height = width;
    }
  } else {
    width = x - from[0];
    height = y - from[1];
  }

  return { width, height };
};

export const drawBackground = (ctx: CanvasRenderingContext2D) => {
  ctx.lineWidth = 1;
  ctx.strokeStyle = "#ccc";

  for (let i = 0; i < ctx.canvas.width; i += 25) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, ctx.canvas.height);
    ctx.stroke();
    ctx.closePath();
  }

  for (let i = 0; i < ctx.canvas.height; i += 25) {
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(ctx.canvas.width, i);
    ctx.stroke();
    ctx.closePath();
  }
};

export const drawCircle = (
  ctx: CanvasRenderingContext2D,
  from: [number, number],
  x: number,
  y: number,
  shift?: boolean,
): CircleInfo => {
  const { width, height } = getWidthAndHeight(x, y, from, shift);

  const cX = from[0] + width / 2;
  const cY = from[1] + height / 2;
  const radiusX = Math.abs(width / 2);
  const radiusY = Math.abs(height / 2);

  ctx.beginPath();
  ctx.ellipse(cX, cY, radiusX, radiusY, 0, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.closePath();

  return { cX, cY, radiusX, radiusY };
};

export const drawRect = (
  ctx: CanvasRenderingContext2D,
  from: [number, number],
  x: number,
  y: number,
  shift?: boolean,
) => {
  const { width, height } = getWidthAndHeight(x, y, from, shift);

  ctx.beginPath();
  ctx.rect(from[0], from[1], width, height);
  ctx.stroke();
  ctx.closePath();

  return {
    width,
    height,
  };
};

export const drawLine = (
  ctx: CanvasRenderingContext2D,
  from: [number, number],
  x: number,
  y: number,
  shift?: boolean,
) => {
  if (shift) {
    ctx.beginPath();
    ctx.moveTo(from[0], from[1]);
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.closePath();
    return;
  }

  ctx.lineTo(x, y);
  ctx.stroke();
};
