/* * * * * * *
WORLD CLASS
Created: 16/04/2022
Last Edite: 16/04/2022
* * * * * * * * */

// collision detection between a circle and a rectangle
// rectangle is in a fixed position (NSWE)
function collisionCircleRectangle(cx, cy, r, rx, ry, rw, rh) {
  // temporary variables for the square's closet X/Y edges to the circle's position
  var testX = cx;
  var testY = cy;

  // check for which edge of the rectangle the circle is on
  if (cx < rx) { testX = rx }                   // left edge
  else if (cx > rx + rw) { testX = rx + rw; }   // right edge

  if (cy < ry) { testY = ry; }                  // top edge
  else if (cy > ry + rh) { testY = ry + rh; }   // bottom edge

  // run the Pythagorean Theorem using the circle's position and two rectangle edges
  var distX = cx - testX;
  var distY = cy - testY;
  var distance = Math.sqrt((distX * distX) + (distY * distY));

  // comparison against the circle's radius
  if (distance <= r) { return true; }
  return false;
}

// collision detection between a rectangle and a rectangle
function collisionRectangleRectangle(rax, ray, raw, rah, rbx, rby, rbw, rbh) {
  var CONDA = rax > rbx + rbw; // rect a's left edge is to the right of rect b's right edge
  var CONDB = ray > rby + rbh; // rect a's top edge is below rect b's bottom edge
  var CONDC = rax + raw < rbx; // rect a's right edge is to the left of rect b's left edge
  var CONDD = ray + rah < rby; // rect a's bottom edge is above rect b's top edge
  //console.log(rax + ", " + ray + ", " + raw + ", " + rah + ", " + rbx + ", " + rby + ", " + rbw + ", " + rbh);
  //console.log(CONDA + ", " + CONDB + ", " + CONDC + ", " + CONDD);
  if (!CONDA && !CONDB && !CONDC && !CONDD) {
    return true;
  } else {
    return false;
  }
}
