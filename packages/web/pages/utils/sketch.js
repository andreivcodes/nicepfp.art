const isServer = () => typeof window === "undefined";
let ml5;
// The SketchRNN model
let model;
// Start by drawing
let previous_pen = "down";
// Current location of drawing
let x, y;
// The current "stroke" of the drawing
let strokePath;

let p5;
let cnv;

export const captureFrame = () => {
  return cnv.elt.toDataURL();
};

export const setup = (_p5, canvasParentRef) => {
  if (!isServer()) ml5 = require("ml5");
  p5 = _p5;
  model = ml5.sketchRNN(window.location.origin + "/face.gen.json");
  cnv = p5.createCanvas(512, 512).parent(canvasParentRef);
  p5.background(255);

  if (p5.windowWidth < 512) {
    // p5.resizeCanvas(256, 256);
    p5.scale(0.5, 0.5);
  }
  // run sketchRNN
  startDrawing();
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

export const draw = () => {
  // If something new to draw
  if (strokePath) {
    // If the pen is down, draw a line
    if (previous_pen === "down") {
      p5.stroke(0);
      p5.strokeWeight(5.0);
      p5.line(x, y, x + strokePath.dx, y + strokePath.dy);
    }
    // Move the pen
    x += strokePath.dx;
    y += strokePath.dy;
    // The pen state actually refers to the next stroke
    previous_pen = strokePath.pen;

    // If the drawing is complete
    if (strokePath.pen !== "end") {
      strokePath = null;
      model.generate(gotStroke);
    }
  }
};

export default setup;
