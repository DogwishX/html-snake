const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

// Game Settings
const tileSize = 10;
const gameRows = (gameColumns = 40);
let gameSpeed = 50; // Lower value = faster
let gameInterval = setInterval(drawGame, gameSpeed);

// Game Objects
let snake = {
  head: {
    color: "lightblue",
    x: canvas.width / 2,
    y: canvas.height / 2,
    xMovement: 0,
    yMovement: 0,
  },
  body: [],
};

let fruit = {
  color: "lightpink",
  x: 5 * tileSize,
  y: 5 * tileSize,
};

// Initialization
let score = 0;
canvas.height = gameColumns * tileSize;
canvas.width = gameRows * tileSize;

function drawGame() {
  resetFrame();
  drawTile(fruit);
  updateSnakeCoordinates();
  detectCollision();
  drawSnake();
  drawScore();
}

function resetFrame() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawTile(obj) {
  const { x, y, color = "white" } = obj;
  ctx.fillStyle = color;
  ctx.fillRect(x, y, tileSize, tileSize);
}

function updateSnakeCoordinates() {
  snake.head.y += snake.head.yMovement * tileSize;
  snake.head.x += snake.head.xMovement * tileSize;

  // Update Body coordinates
  snake.body.pop();
  snake.body.unshift({ x: snake.head.x, y: snake.head.y });
}

function detectCollision() {
  const hasHitBody = snake.body.find(
    ({ x, y }, index) => x === snake.head.x && y === snake.head.y && index !== 0
  );
  const hasHitFruit = snake.head.y === fruit.y && snake.head.x === fruit.x;
  const hasHitWall =
    snake.head.y >= gameRows * tileSize ||
    snake.head.y < 0 ||
    snake.head.x >= gameColumns * tileSize ||
    snake.head.x < 0;

  if (hasHitFruit) return handleEat();
  if (hasHitBody || hasHitWall) gameOver();
}

function handleEat() {
  score += 50;
  increaseDifficulty();
  increaseBodySize();
  repositionFruit();
}

function gameOver() {
  alert("Game Over");
  (localStorage.hiScore || 0) < score && localStorage.setItem("hiScore", score);
  resetGame();
}

function resetGame() {
  clearInterval(gameInterval);
  gameSpeed = 50;
  score = 0;
  gameInterval = setInterval(drawGame, gameSpeed);
  snake.head.x = canvas.width / 2;
  snake.head.y = canvas.height / 2;
  snake.body = [];
}

function increaseDifficulty() {
  gameSpeed -= 0.5;
  clearInterval(gameInterval);
  gameInterval = setInterval(drawGame, gameSpeed);
}

function increaseBodySize() {
  snake.body.push({ x: fruit.x, y: fruit.y });
}

function repositionFruit() {
  fruit.x = Math.floor(Math.random() * gameColumns) * tileSize;
  fruit.y = Math.floor(Math.random() * gameRows) * tileSize;
  drawTile(fruit);
}

function drawSnake() {
  snake.body.forEach(drawTile);
  drawTile(snake.head);
}

// Movement

window.addEventListener("keyup", moveSnake);

function moveSnake({ key }) {
  const lowerCaseKey = key.toLowerCase();

  const { moveUp, moveDown, moveLeft, moveRight } = {
    moveUp: () => changeDirection("y", -1),
    moveDown: () => changeDirection("y", 1),
    moveLeft: () => changeDirection("x", -1),
    moveRight: () => changeDirection("x", 1),
  };

  const inputs = {
    w: moveUp,
    a: moveLeft,
    s: moveDown,
    d: moveRight,
    arrowup: moveUp,
    arrowleft: moveLeft,
    arrowdown: moveDown,
    arrowright: moveRight,
  };

  if (inputs[lowerCaseKey]) inputs[lowerCaseKey]();
}

function changeDirection(xOrY, positiveOrNegative) {
  // This will prevent user error [going into the body]
  if (isOppositeDirection(xOrY, positiveOrNegative)) return;

  snake.head.yMovement = 0;
  snake.head.xMovement = 0;
  snake.head[`${xOrY}Movement`] = positiveOrNegative;
}

function isOppositeDirection(xOrY, positiveOrNegative) {
  const xOrYMovement = snake.head[`${xOrY}Movement`];
  return Math.sign(xOrYMovement) !== positiveOrNegative && xOrYMovement !== 0;
}

function drawScore() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "white";
  ctx.fillText(`Score:  ${score}`, canvas.width - 120, 30);
  ctx.fillText(
    `Hi-score:  ${localStorage.hiScore || score}`,
    canvas.width - 120,
    50
  );
}
