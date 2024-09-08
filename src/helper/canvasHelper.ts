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
) => {
  const radius = Math.sqrt((x - from[0]) ** 2 + (y - from[1]) ** 2);
  ctx.beginPath();
  ctx.arc(from[0], from[1], radius, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.closePath();

  return radius;
};

export const drawRect = (
  ctx: CanvasRenderingContext2D,
  from: [number, number],
  x: number,
  y: number,
  shift?: boolean,
) => {
  let width = 0;
  let height = 0;

  if (shift) {
    const d = Math.sqrt((x - from[0]) ** 2 + (y - from[1]) ** 2);
    width = d / Math.sqrt(2);
    height = d / Math.sqrt(2);

    if (x - from[0] > 0 && y - from[1] < 0) {
      height = -height;
    } else if (x - from[0] < 0 && y - from[1] > 0) {
      width = -width;
    } else if (x - from[0] < 0 && y - from[1] < 0) {
      width = -width;
      height = -height;
    }
  } else {
    width = x - from[0];
    height = y - from[1];
  }

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
