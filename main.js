const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

window.addEventListener("resize", resizeCanvas);
window.addEventListener("keydown", handleKeydown);

// Game settings
const defaultGameWidth = 400;
const defaultGameHeight = 400;
const blockSize = 10;
const snakeMovement = 1;
const fps = 10;
let gridRows = canvas.width / blockSize;
let gridColumns = canvas.height / blockSize;
ctx.fillStyle = "white";

class GameObject {
  constructor({ x, y }) {
    this.x = x;
    this.y = y;
  }

  draw() {
    ctx.fillRect(this.x, this.y, blockSize, blockSize);
  }
}

class Fruit extends GameObject {
  constructor(props) {
    super(props);
  }

  reposition() {
    this.x = Math.floor(Math.random() * gridColumns) * blockSize;
    this.y = Math.floor(Math.random() * gridRows) * blockSize;
    console.log(this.x, this.y);
  }
}

let fruit = new Fruit({
  x: 5 * blockSize,
  y: 5 * blockSize,
  height: blockSize,
  width: blockSize,
});

// Snake
class SnakeHead extends GameObject {
  constructor(props) {
    super(props);
    this.xMovement = 0;
    this.yMovement = 0;
  }

  move(key) {
    const { moveUp, moveDown, moveLeft, moveRight } = {
      moveUp: () => this.changeDirection("y", -1),
      moveDown: () => this.changeDirection("y", 1),
      moveLeft: () => this.changeDirection("x", -1),
      moveRight: () => this.changeDirection("x", 1),
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

    if (inputs[key]) inputs[key]();
    this.y += this.yMovement * blockSize;
    this.x += this.xMovement * blockSize;
  }

  changeDirection(xOrY, positiveOrNegative) {
    // This will prevent accelleration and user error [going into the body]
    if (this.isSameOrOppositeDirection(xOrY, positiveOrNegative)) return;

    this.yMovement = 0;
    this.xMovement = 0;
    this[`${xOrY}Movement`] = snakeMovement * positiveOrNegative;
  }

  isSameOrOppositeDirection(xOrY, positiveOrNegative) {
    const isOppositeDirection =
      Math.sign(this[`${xOrY}Movement`]) !== positiveOrNegative &&
      this[`${xOrY}Movement`] !== 0;

    const isSameDirection =
      Math.sign(this[`${xOrY}Movement`]) === positiveOrNegative &&
      this[`${xOrY}Movement`] !== 0;

    return isOppositeDirection || isSameDirection;
  }

  detectCollision() {
    const xAxisCollided =
      this.x + blockSize >= fruit.x && this.x <= fruit.x + blockSize;
    const yAxisCollided =
      this.y + blockSize >= fruit.y && this.y <= fruit.y + blockSize;

    if (xAxisCollided && yAxisCollided) this.fruitEaten();
  }

  fruitEaten() {
    fruit.reposition();
    snake.body.push(
      new GameObject({
        x: this.x,
        y: this.y,
      })
    );
  }
}

const snake = {
  head: new SnakeHead({
    x: canvas.width / 2,
    y: canvas.height / 2,
  }),
  body: [],
};

function resizeCanvas() {
  const newWidth =
    window.innerWidth < defaultGameWidth ? window.innerWidth : defaultGameWidth;
  const newHeight =
    window.innerWidth < defaultGameWidth ? window.innerWidth : defaultGameWidth;
  canvas.width = newWidth;
  canvas.height = newHeight;
  gridColumns = newWidth / blockSize;
  gridRows = newHeight / blockSize;

  centerSnake();
}

function centerSnake() {
  snake.head.x = canvas.width / 2;
  snake.head.y = canvas.height / 2;
  drawSnake();
}

function drawGame() {
  drawFrame();
  fruit.draw();
  snake.head.detectCollision();
  drawSnake();
}

function drawFrame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawSnake() {
  const { head, body } = snake;
  head.move();
  head.draw();

  body.pop();
  body.unshift(
    new GameObject({
      x: head.x,
      y: head.y,
      height: blockSize,
      width: blockSize,
    })
  );
  body.forEach((bodyPart) => bodyPart.draw());
}

function handleKeydown({ key }) {
  const lowerCaseKey = key.toLowerCase();
  snake.head.move(lowerCaseKey);
}

function drawFruit() {}

drawGame();
setInterval(drawGame, 1000 / fps);
