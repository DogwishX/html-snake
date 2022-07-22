const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const blockSize = 10;

const snake = {
  head: {
    x: 50,
    y: 50,
    height: blockSize,
    width: blockSize,
  },
};

drawGame();

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
