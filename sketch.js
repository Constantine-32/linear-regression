'use strict';

const CWidth = 500
const CHeigh = 500
let points = []
let m = 0
let b = 0

function setup() {
  createCenteredCanvas(CWidth, CHeigh)
  background('#005073')
  frameRate(60)
}

function windowResized() {
  createCenteredCanvas()
}

function createCenteredCanvas(w, h) {
  createCanvas(w, h).position((windowWidth - width) / 2, (windowHeight - height) / 2)
}

function draw() {
  translate(CWidth / 2, CHeigh / 2)
  background('#005073')
  drawPoints()
  if (points.length > 1)
    drawLine()
}

function drawPoints() {
  stroke('#fff')
  strokeWeight(3)
  for (const p of points)
    point(p.x, -p.y)
}

function drawLine() {
  const x1 = -CWidth / 2
  const y1 = m * x1 + b
  const x2 = CWidth / 2
  const y2 = m * x2 + b
  strokeWeight(1)
  line(x1, -y1, x2, -y2)
}

function calcLine() {
  const mx = points.reduce((t, s) => ({x: t.x + s.x})).x / points.length
  const my = points.reduce((t, s) => ({y: t.y + s.y})).y / points.length
  const num = points.map(p => (p.x - mx) * (p.y - my)).reduce((t, s) => t + s)
  const den = points.map(p => (p.x - mx) ** 2).reduce((t, s) => t + s)
  m = num / den
  b = my - m * mx
}

function mouseClicked() {
  points.push({x: mouseX - CWidth / 2, y: -(mouseY - CHeigh / 2)})
  calcLine()
}