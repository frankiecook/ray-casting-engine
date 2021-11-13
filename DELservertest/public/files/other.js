// other functions

// world variable is temporary for debugging
function collisionCheck(p, w) {
  var pChunkPos = posToSegment(p.pos);
  var walls = new Array(9);

  for (col=0; col<3; col++) {
    for (row=0; row<3; row++) {
      //walls[row + col*3] = createVector(pChunkPos.x+(col-1), pChunkPos.y+(row-1));

      var place = row+col*3;

      walls[row + col*3] = createVector(pChunkPos.x+(col-1), pChunkPos.y+(row-1));
    }
  }

  // debugging
  for (col=0; col<3; col++) {
    for (row=0; row<3; row++) {
      if (w.arr[walls[row + col*3].y][walls[row + col*3].x] != 0 && row + col*3 != 4) {
        fill('white');
        rect(walls[row + col*3].x * w.segmentSize, walls[row + +col*3].y * w.segmentSize, w.segmentSize, w.segmentSize);
      }
    }
  }
}

function posToSegment(vec1) {
  var x = ((vec1.x) - ((vec1.x) % world.segmentSize)) / world.segmentSize;
  var y = ((vec1.y) - ((vec1.y) % world.segmentSize)) / world.segmentSize;
  var newVector = createVector(x, y);

  return newVector
}
