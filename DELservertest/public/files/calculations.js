// Calculations

// roudning
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
  vec1.x = x * ratio;
  vec1.y = y * ratio;
}

// rotate a specified vector by a certian degree
function rotation2DVector(vec1, rotation) {

  var rotMatrix = [[cos(rotation), -sin(rotation)], [sin(rotation), cos(rotation)]];;

  var x = vec1.x;
  var y = vec1.y;

  vec1.x = roundDecimal(rotMatrix[0][0] * x + rotMatrix[0][1] * y, 4);
  vec1.y = roundDecimal(rotMatrix[1][0] * x + rotMatrix[1][1] * y, 4);
}

//





function multiply2D(vector, x) {
  var newVector = createVector();

  newVector.x = vector.x * x;
  newVector.y = vector.y * x;

  return newVector;
}

function magnitude2D(vector) {
  var value = sqrt(vector.x * vector.x + vector.y * vector.y);
  return value;
}
