'use strict';

class LinearRegression {
  constructor(color) {
    this.m = 0
    this.b = 0.5
    this.color = color
  }

  updateLeastSquares(points) {
    const xm = points.map(p => p.x).reduce((t, s) => t + s) / points.length
    const ym = points.map(p => p.y).reduce((t, s) => t + s) / points.length
    const num = points.map(p => (p.x - xm) * (p.y - ym)).reduce((t, s) => t + s)
    const den = points.map(p => (p.x - xm) ** 2).reduce((t, s) => t + s)
    this.m = num / den
    this.b = ym - this.m * xm
  }

  updateGradientDescent(points) {
    if (points.length < 2) return
    const rate = 0.05
    for (const p of points) {
      const x = p.x
      const y = p.y
      const guess = this.m * x + this.b
      const error = y - guess
      this.m += error * x * rate
      this.b += error * rate
    }
  }

  draw() {
    if (points.length < 2) return
    stroke(this.color)
    strokeWeight(2)
    let x1 = 0
    let y1 = this.m * x1 + this.b
    let x2 = 1
    let y2 = this.m * x2 + this.b
    x1 = map(x1, 0, 1, 0, width)
    y1 = map(y1, 0, 1, height, 0)
    x2 = map(x2, 0, 1, 0, width)
    y2 = map(y2, 0, 1, height, 0)
    line(x1, y1, x2, y2)
  }
}

const points = []
const LRLS = new LinearRegression('#9f0733')
const LRGD = new LinearRegression('#4fc775')

function setup() {
  createCenteredCanvas()
  background('#0e0e0e')
  frameRate(60)
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
  // Clear previous canvas
  background('#0e0e0e')
  // Linear Regression Least Squares
  LRLS.draw()
  // Linear Regression Gradient Descent
  LRGD.updateGradientDescent(points)
  LRGD.draw()
  // Points, frame and legend
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
  // Legend text
  noStroke()
  fill('#fff')
  textAlign(LEFT, CENTER)
  textSize(10)
  text('Least Squares', 410, 15)
  text('Gradient Descent', 410, 30) 
}

function mouseClicked() {
  if (mouseX > 0 && mouseX < width &&
      mouseY > 0 && mouseY < height) {
    points.push({
      x: map(mouseX, 0, width, 0, 1),
      y: map(mouseY, 0, height, 1, 0)
    })
    LRLS.updateLeastSquares(points)
  }
}