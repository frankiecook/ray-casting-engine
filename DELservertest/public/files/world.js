function newWorld() {

  var world = {
    arr: [
      [1,1,1,1,1,1,1],
      [1,1,1,0,1,1,1],
      [1,1,1,1,0,1,1],
      [1,1,1,1,0,0,1],
      [1,1,1,1,0,0,1],
      [1,1,1,1,1,1,1],
      [1,1,1,1,1,1,1]],
    width: 7,
    height: 7,
    segmentSize: 50,
    renderSegments: 60,
    renderWidth: 9,
    renderHeight: 5
  }

  return world
}
