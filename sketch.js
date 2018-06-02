'use strict';

class Points {
  constructor(color) {
    this.points = []
    this.color = color
  }

  get length() {
    return this.points.length
  }

  push(point) {
    this.points.push(point)
  }

  draw() {
    stroke(this.color)
    strokeWeight(3)
    this.points.map(p => point(p.x, -p.y))
  }
}

class LRLeastSquares {
  constructor(color) {
    this.m = 1
    this.b = 0
    this.color = color
  }

  update(points) {
    const xm = points.points.map(p => p.x).reduce((t, s) => t + s) / points.length
    const ym = points.points.map(p => p.y).reduce((t, s) => t + s) / points.length
    const num = points.points.map(p => (p.x - xm) * (p.y - ym)).reduce((t, s) => t + s)
    const den = points.points.map(p => (p.x - xm) ** 2).reduce((t, s) => t + s)
    this.m = num / den
    this.b = ym - this.m * xm
  }

  draw() {
    if (points.length < 2) return
    stroke(this.color)
    strokeWeight(2)
    const x1 = -CHalfW
    const y1 = this.m * x1 + this.b
    const x2 = CHalfW
    const y2 = this.m * x2 + this.b
    line(x1, -y1, x2, -y2)
  }
}

const CWidth = 500
const CHeigh = 500
const CHalfW = CWidth / 2
const points = new Points('#f5f5f5')
const LRLS = new LRLeastSquares('#9f0733')

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
  translate(CHalfW, CHalfW)
  background('#0e0e0e')
  LRLS.draw()
  points.draw()
  drawBorder()
}

function drawBorder() {
  stroke('#000')
  strokeWeight(1)
  line(-CHalfW, -CHalfW, CHalfW, -CHalfW)
  line(-CHalfW, -CHalfW, -CHalfW, CHalfW)
  line(CHalfW-1, CHalfW-1, CHalfW-1, -CHalfW-1)
  line(CHalfW-1, CHalfW-1, -CHalfW-1, CHalfW-1)
}

function mouseClicked() {
  if (mouseX > 0 && mouseX < CWidth &&
      mouseY > 0 && mouseY < CHeigh) {
    points.push({x: mouseX - CHalfW, y: -(mouseY - CHalfW)})
    LRLS.update(points)
  }
  console.log(mouseX, mouseY)
}