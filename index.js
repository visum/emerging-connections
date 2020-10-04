const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
const rect = document.body.getBoundingClientRect();
const state = {
  points: [],
  lines: [],
};

canvas.width = rect.width;
canvas.height = rect.height;

const points = [];
let lines = [];
const numberOfPoints = 160;

const border = 5;
const maxConnectionDistance = 120;
const gravityStrength = 0.1;
const maxGravityEffect = 120;
const pointMass = 1;
const maxInitialSpeed = 1;
const gravityLimit = 10;

function getRandom(multi) {
  return Math.random() * multi;
}

function getDistance(point1, point2) {
  const dx = Math.abs(point1.x - point2.x);
  const dy = Math.abs(point1.y - point2.y);

  return Math.sqrt(dx * dx + dy * dy);
}

const initPoints = () => {
  canvasHeight = canvas.height;
  canvasWidth = canvas.width;
  const points = state.points;
  while (points.length < numberOfPoints) {
    const randomMax = maxInitialSpeed * 2;
    points.push({
      x: getRandom(canvasWidth),
      y: getRandom(canvasHeight),
      sx: getRandom(randomMax) - maxInitialSpeed,
      sy: getRandom(randomMax) - maxInitialSpeed,
    });
  }
};

const movePoint = (point) => {
  const canvasHeight = canvas.height;
  const canvasWidth = canvas.width;

  if (
    (point.x > canvasWidth - border && point.sx > 0) ||
    (point.x < border && point.sx < 0)
  ) {
    point.sx *= -1;
  }

  if (
    (point.y > canvasHeight - border && point.sy > 0) ||
    (point.y < border && point.sy < 0)
  ) {
    point.sy *= -1;
  }

  point.x += point.sx;
  point.y += point.sy;
};

const movePoints = () => {
  state.points.forEach((p) => movePoint(p));
};

const processConnections = () => {
  const points = state.points;

  lines = [];

  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      const p1 = points[i];
      const p2 = points[j];
      const distance = getDistance(p1, p2);

      if (distance < maxGravityEffect) {
        // gravity
        // accellerate each of the points toward each other slightly
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        // Force = gravity * ((mass1 * mass2) / distance^2)
        let accelleration = gravityStrength * (pointMass / distance ** 2);
        accelleration =
          accelleration > gravityLimit ? gravityLimit : accelleration;
        // accellerate the two points
        p1.sx += dx * accelleration;
        p1.sy += dy * accelleration;

        p2.sx -= dx * accelleration;
        p2.sy -= dy * accelleration;
      }

      if (distance < maxConnectionDistance) {
        const opacity = 1 - distance / maxConnectionDistance;
        const red = 255;
        const blue = 255;
        const green = 255;
        lines.push({
          p1,
          p2,
          strokeStyle: `rgba(${red}, ${green}, ${blue}, ${opacity})`,
        });
      }
    }
  }
  state.lines = lines;
};

window.addEventListener("resize", () => {
  const rect = document.body.getBoundingClientRect();
  canvas.width = rect.width;
  canvas.height = rect.height;
});

function clear() {
  context.fillStyle = "black";
  context.fillRect(0, 0, canvas.width, canvas.height);
}

const draw = () => {
  clear();
  // points.forEach(point => {
  //   context.beginPath();
  //   context.fillStyle = "rgba(255, 255, 255, 1)";
  //   context.arc(point.x, point.y, 1, 0, 2 * Math.PI);
  //   context.fill();
  // });

  for (let i = 0; i < state.lines.length; i++) {
    const line = state.lines[i];
    context.beginPath();
    context.moveTo(line.p1.x, line.p1.y);
    context.lineTo(line.p2.x, line.p2.y);
    context.strokeStyle = line.strokeStyle;
    context.stroke();
  }
};

const tick = () => {
  movePoints();
  processConnections();
  draw();
  requestAnimationFrame(tick);
};

initPoints();
requestAnimationFrame(tick);
