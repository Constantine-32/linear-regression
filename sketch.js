'use strict';

function setup() {
  createCenteredCanvas(500, 500)
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
  // draw loop
}
