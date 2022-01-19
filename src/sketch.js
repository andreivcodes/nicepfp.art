import * as ml5 from 'ml5';

// The SketchRNN model
let model;
// Start by drawing
let previous_pen = 'down';
// Current location of drawing
let x, y;
// The current "stroke" of the drawing
let strokePath;

// For when SketchRNN is fixed
function preload() {
  // See a list of all supported models: https://github.com/ml5js/ml5-library/blob/master/src/SketchRNN/models.js
  model = ml5.sketchRNN('face');
}

let p5;

export const setup = (_p5, canvasParentRef) => {
  p5 = _p5;
  preload();
  p5.createCanvas(500, 500).parent(canvasParentRef);
  p5.background(255);

  // run sketchRNN
  startDrawing(p5);
};

// Reset the drawing
export const startDrawing = () => {
  p5.background(255);
  x = p5.width / 2;
  y = p5.height / 3;
  model.reset();
  // Generate the first stroke path
  model.generate(gotStroke);
};

// A new stroke path
function gotStroke(err, s) {
  strokePath = s;
}

export const draw = (p5, parent) => {
  // If something new to draw
  if (strokePath) {
    // If the pen is down, draw a line
    if (previous_pen === 'down') {
      p5.stroke(0);
      p5.strokeWeight(3.0);
      p5.line(x, y, x + strokePath.dx, y + strokePath.dy);
    }
    // Move the pen
    x += strokePath.dx;
    y += strokePath.dy;
    // The pen state actually refers to the next stroke
    previous_pen = strokePath.pen;

    // If the drawing is complete
    if (strokePath.pen !== 'end') {
      strokePath = null;
      model.generate(gotStroke);
    }
  }
};
