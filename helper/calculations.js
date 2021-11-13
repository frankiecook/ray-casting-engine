/*
CALCULATIONSs
math helper functions that I've found useful
*/

// rounding
function roundDecimal(num, place) {

  var temp = num * (10 ** place);
  temp = Math.round(temp);
  temp /= 10 ** place;

  return temp
}

// add two 2D vectors together
// stores the value in the first input
function add2DVectors(vec1, vec2) {
  vec1.x += vec2.x;
  vec1.y += vec2.y;
}

// copies a 2D vector into another
// copies the value into the first vector
function copy2DVector(vec1, vec2) {
  vec1.x = vec2.x;
  vec1.y = vec2.y;
}

// increase the magnitude of a vector by a specified length
// resize vector to a specific Length
// u ||v|| = L v
function increase2DVector(vec1, length) {
  var magnitude = sqrt(vec1.x * vec1.x + vec1.y * vec1.y);
  var ratio = length / magnitude;

  var x = vec1.x;
  var y = vec1.y;
  vec1.x += x * ratio;
  vec1.y += y * ratio;
}

// rotate a specified vector by a certian radian
function rotation2DVector(vec1, rotation) {
  var rotMatrix = [[cos(rotation), -sin(rotation)], [sin(rotation), cos(rotation)]];;

  var x = vec1.x;
  var y = vec1.y;

  vec1.x = roundDecimal(rotMatrix[0][0] * x + rotMatrix[0][1] * y, 4);
  vec1.y = roundDecimal(rotMatrix[1][0] * x + rotMatrix[1][1] * y, 4);
}

// multiplies a 2D vector by a scalar
function multiply2DVectors(vec1, x) {
  var vec2 = createVector(0,0);
  vec2.x = vec1.x * x;
  vec2.y = vec1.y * x;
  return vec2
}
function scalar2DVector(vec1, x) {
  vec1.x = vec1.x * x;
  vec1.y = vec1.y * x;
}

// returns the magnitude of a 2D vector
function magnitude2DVector(vector) {
  var value = sqrt(vector.x * vector.x + vector.y * vector.y);
  return value
}

// normalizes a 2D vector
function normalize2DVector(vector) {
  var temp = createVector(0,0);
  temp.x = vector.x;
  temp.y = vector.y;

  var mag = magnitude2DVector(vector);
  vector.x = temp.x / mag;
  vector.y = temp.y / mag;
}
