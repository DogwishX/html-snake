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
canvas.height = gameColumns * tileSize;
canvas.width = gameRows * tileSize;

function drawGame() {
  resetFrame();
  drawTile(fruit);
  updateSnakeCoordinates();
  detectCollision();
  drawSnake();
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
  if (snake.head.y === fruit.y && snake.head.x === fruit.x) return handleEat();
}

function handleEat() {
  increaseDifficulty();
  increaseBodySize();
  repositionFruit();
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
