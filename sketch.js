'use strict';

class LinearRegression {
  constructor(color) {
    this.m = 0
    this.b = 0.5
    this.color = color
  }

  draw() {
    if (points.length < 2) return this
    stroke(this.color)
    strokeWeight(2)
    const y1 = map((this.m * 0 + this.b), 0, 1, height, 0)
    const y2 = map((this.m * 1 + this.b), 0, 1, height, 0)
    line(0, y1, width, y2)
    return this
  }
}

class LeastSquares extends LinearRegression {
  constructor(color) {
    super(color)
  }

  update(points) {
    if (points.length < 2) return this
    const xmean = points.map(p => p.x)
      .reduce((a, b) => a + b) / points.length
    const ymean = points.map(p => p.y)
      .reduce((a, b) => a + b) / points.length
    const num = points.map(p => (p.x - xmean) * (p.y - ymean))
      .reduce((a, b) => a + b)
    const den = points.map(p => (p.x - xmean) ** 2)
      .reduce((a, b) => a + b)
    this.m = num / den
    this.b = ymean - this.m * xmean
    return this
  }
}

class GradientDescent extends LinearRegression {
  constructor(color) {
    super(color)
  }

  update(points) {
    if (points.length < 2) return this
    const rate = 0.2
    for (const p of points) {
      const guess = this.m * p.x + this.b
      const error = p.y - guess
      this.m += error * p.x * rate
      this.b += error * rate
    }
    return this
  }
}

class GDTensorFLow {
  constructor(color) {
    this.m = tf.variable(tf.scalar(0))
    this.b = tf.variable(tf.scalar(0.5))
    this.f = xs => tf.tensor1d(xs).mul(this.m).add(this.b)
    this.loss = (pred, labels) => pred.sub(labels).square().mean()
    this.optimizer = tf.train.sgd(0.2)
    this.color = color
  }

  update(points) {
    if (points.length < 2) return this
    tf.tidy(() => 
      this.optimizer.minimize(() =>
        this.loss(
          this.f(points.map(p => p.x)),
          tf.tensor1d(points.map(p => p.y))
        )
      )
    )
    return this
  }

  draw() {
    if (points.length < 2) return this
    stroke(this.color)
    strokeWeight(2)
    const ys = tf.tidy(() => this.f([0, 1]).dataSync())
    const y1 = map(ys[0], 0, 1, height, 0)
    const y2 = map(ys[1], 0, 1, height, 0)
    line(0, y1, width, y2)
    return this
  }
}

const points = []
// Linear Regression Least Squares
const LRLS = new LeastSquares('#c0392b')
// Linear Regression Gradient Descent
const LRGD = new GradientDescent('#27ae60')
// Linear Regression Gradient Descent TensorFlow
const LRTS = new GDTensorFLow('#2980b9')

function setup() {
  createCenteredCanvas()
  frameRate(60)
  draw()
}

function windowResized() {
  createCenteredCanvas()
}

function createCenteredCanvas() {
  createCanvas(500, 500).position(
    (windowWidth - width) / 2,
    (windowHeight - height) / 2
  )
}

function draw() {
  background('#0e0e0e')
  LRLS.draw()
  LRGD.update(points).draw()
  LRTS.update(points).draw()
  drawPoints()
  drawFrame()
}

function drawPoints() {
  stroke('#fff')
  strokeWeight(3)
  points.map(p => point(
    map(p.x, 0, 1, 0, width),
    map(p.y, 0, 1, height, 0)
  ))
}

function drawFrame() {
  // Frame
  stroke('#000')
  strokeWeight(1)
  line(0, 0, width, 0)
  line(0, 0, 0, height)
  line(width-1, height-1, width-1, 0)
  line(width-1, height-1, 0, height-1)
  // Legend lines
  strokeWeight(2)
  stroke(LRLS.color)
  line(390, 15, 400, 15)
  stroke(LRGD.color)
  line(390, 30, 400, 30)
  stroke(LRTS.color)
  line(390, 45, 400, 45)
  // Legend text
  noStroke()
  fill('#fff')
  textAlign(LEFT, CENTER)
  textSize(10)
  text('Least Squares', 410, 15)
  text('Gradient Descent', 410, 30) 
  text('GD TensorFlow', 410, 45) 
}

function mouseClicked() {
  if (mouseX > 0 && mouseX < width &&
      mouseY > 0 && mouseY < height) {
    points.push({
      x: map(mouseX, 0, width, 0, 1),
      y: map(mouseY, 0, height, 1, 0)
    })
    LRLS.update(points)
  }
}