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

class GameObject {
  constructor({ x, y, height, width }) {
    this.x = x;
    this.y = y;
    this.height = height;
    this.width = width;
  }

  draw() {
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

class Fruit extends GameObject {
  constructor(props) {
    super(props);
  }

  reposition() {
    this.x = Math.floor(Math.random() * canvas.width);
    this.y = Math.floor(Math.random() * canvas.height);
  }
}

let fruit = new Fruit({
  x: 50,
  y: 50,
  height: blockSize,
  width: blockSize,
});

// Snake
class SnakeHead extends GameObject {
  constructor(props) {
    super(props);
    this.xMovement = 0;
    this.yMovement = 1;
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
    this.y += this.yMovement;
    this.x += this.xMovement;
  }

  changeDirection(xOrY, positiveOrNegative) {
    // Prevent from going in opposite direction
    if (this.isOppositeDirection(xOrY, positiveOrNegative)) return;

    this.yMovement = 0;
    this.xMovement = 0;
    this[`${xOrY}Movement`] = snakeMovement * positiveOrNegative;
  }

  isOppositeDirection(xOrY, positiveOrNegative) {
    return (
      Math.sign(this[`${xOrY}Movement`]) !== positiveOrNegative &&
      this[`${xOrY}Movement`] !== 0
    );
  }

  detectCollision() {
    const xAxisCollided =
      this.x + this.width >= fruit.x && this.x <= fruit.x + fruit.width;
    const yAxisCollided =
      this.y + this.height >= fruit.y && this.y <= fruit.y + fruit.height;

    if (xAxisCollided && yAxisCollided) this.fruitEaten();
  }

  fruitEaten() {
    fruit.reposition();
    snake.body.push(
      new GameObject({
        x: this.x,
        y: this.y,
        height: blockSize,
        width: blockSize,
      })
    );
  }
}

const snake = {
  head: new SnakeHead({
    x: canvas.width / 2,
    y: canvas.height / 2,
    height: blockSize,
    width: blockSize,
  }),
  body: [],
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

setInterval(drawGame, 11);
