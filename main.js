const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

window.addEventListener("resize", resizeCanvas);
window.addEventListener("keydown", handleKeydown);

// Game settings
const gameWidth = 400;
const gameHeight = 380;
const blockSize = 10;
const snakeMovement = 1;
ctx.fillStyle = "white";

// Snake
class SnakePart {
  constructor({ x, y, height, width }) {
    this.x = x;
    this.y = y;
    this.height = height;
    this.width = width;
    this.xMovement = 0;
    this.yMovement = 1;
  }

  draw() {
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  move(key) {
    this.y += this.yMovement;
    this.x += this.xMovement;
    if (key === "w") this.changeDirection("y", -1);
    if (key === "a") this.changeDirection("x", -1);
    if (key === "s") this.changeDirection("y", 1);
    if (key === "d") this.changeDirection("x", 1);
  }

  changeDirection(isX, positiveOrNegative) {
    if (isX === "x") {
      this.yMovement = 0;
      this.xMovement = snakeMovement * positiveOrNegative;
      return;
    }

    this.yMovement = snakeMovement * positiveOrNegative;
    this.xMovement = 0;
  }
}

const snake = {
  head: new SnakePart({
    x: canvas.width / 2,
    y: canvas.height / 2,
    height: blockSize,
    width: blockSize,
  }),
};

function resizeCanvas() {
  canvas.width = window.innerWidth < gameWidth ? window.innerWidth : gameWidth;
  centerSnake();
}

function centerSnake() {
  snake.head.x = canvas.width / 2;
  snake.head.y = canvas.height / 2;
  drawSnake();
}

function drawGame() {
  drawFrame();
  drawSnake();
}

function drawFrame() {
  window.requestAnimationFrame(drawGame);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawSnake() {
  const { head } = snake;
  head.move();
  head.draw();
}

function handleKeydown({ key }) {
  const lowerCaseKey = key.toLowerCase();
  const validKeys = ["w", "a", "s", "d"];

  if (validKeys.includes(lowerCaseKey)) return snake.head.move(lowerCaseKey);
}

drawGame();
