'use strict';

class LRLeastSquares {
  constructor(color) {
    this.m = 1
    this.b = 0
    this.color = color
  }

  update(points) {
    const xm = points.map(p => p.x).reduce((t, s) => t + s) / points.length
    const ym = points.map(p => p.y).reduce((t, s) => t + s) / points.length
    const num = points.map(p => (p.x - xm) * (p.y - ym)).reduce((t, s) => t + s)
    const den = points.map(p => (p.x - xm) ** 2).reduce((t, s) => t + s)
    this.m = num / den
    this.b = ym - this.m * xm
  }

  draw() {
    if (points.length < 2) return
    stroke(this.color)
    strokeWeight(2)
    let x1 = 0
    let y1 = this.m * x1 + this.b
    let x2 = 1
    let y2 = this.m * x2 + this.b
    x1 = map(x1, 0, 1, 0, CWidth)
    y1 = map(y1, 0, 1, CHeigh, 0)
    x2 = map(x2, 0, 1, 0, CWidth)
    y2 = map(y2, 0, 1, CHeigh, 0)
    line(x1, y1, x2, y2)
  }
}

class LRGradientDescent {
  constructor(color) {
    this.m = 0
    this.b = 0.5
    this.color = color
  }

  update(points) {
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
    x1 = map(x1, 0, 1, 0, CWidth)
    y1 = map(y1, 0, 1, CHeigh, 0)
    x2 = map(x2, 0, 1, 0, CWidth)
    y2 = map(y2, 0, 1, CHeigh, 0)
    line(x1, y1, x2, y2)
  }
}

const CWidth = 500
const CHeigh = 500
const CHalfW = CWidth / 2
const points = []
const LRLS = new LRLeastSquares('#9f0733')
const LRGD = new LRGradientDescent('#4fc775')

points.draw = function() {
  stroke('#f5f5f5')
  strokeWeight(3)
  this.map(p => point(
    map(p.x, 0, 1, 0, CWidth),
    map(p.y, 0, 1, CHeigh, 0)
  ))
}

function setup() {
  createCenteredCanvas(CWidth, CHeigh)
  background('#0e0e0e')
  frameRate(60)
}

function windowResized() {
  createCenteredCanvas()
}

function createCenteredCanvas(w, h) {
  createCanvas(w, h).position((windowWidth - width) / 2, (windowHeight - height) / 2)
}

function draw() {
  background('#0e0e0e')
  LRLS.draw()
  LRGD.update(points)
  LRGD.draw()
  points.draw()
  drawFrame()
}

function drawFrame() {
  stroke('#000')
  strokeWeight(1)
  line(0, 0, CWidth, 0)
  line(0, 0, 0, CHeigh)
  line(CWidth-1, CHeigh-1, CWidth-1, 0)
  line(CWidth-1, CHeigh-1, 0, CHeigh-1)
  strokeWeight(2)
  stroke(LRLS.color)
  line(390, 15, 400, 15)
  stroke(LRGD.color)
  line(390, 30, 400, 30)

  noStroke()
  fill('#fff')
  textAlign(LEFT, CENTER)
  textSize(10)
  text('Least Squares', 410, 15)
  text('Gradient Descent', 410, 30) 
}

function mouseClicked() {
  if (mouseX > 0 && mouseX < CWidth &&
      mouseY > 0 && mouseY < CHeigh) {
    points.push({
      x: map(mouseX, 0, CWidth, 0, 1),
      y: map(mouseY, 0, CHeigh, 1, 0)
    })
    LRLS.update(points)
    console.log(mouseX, mouseY)
  }
}