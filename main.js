const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

window.addEventListener("resize", resizeCanvas);

// Game settings
const gameWidth = 400;
const gameHeight = 380;
const blockSize = 10;

// Snake
const snake = {
  head: {
    x: canvas.width / 2,
    y: canvas.height / 2,
    height: blockSize,
    width: blockSize,
  },
};

drawGame();

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
  window.requestAnimationFrame(drawGame);
  ctx.fillStyle = "white";
  drawSnake();
}

function drawSnake() {
  drawHead();
}

function drawHead() {
  const { x, y, height, width } = snake.head;
  ctx.fillRect(x, y, width, height);
}
