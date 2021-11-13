// room constructor

function newRoom() {

  var room = {
    walls: [
      [1,1,1,1,1,1,1],
      [1,0,0,0,0,0,1],
      [1,0,0,0,0,0,1],
      [1,0,0,0,0,0,1],
      [1,0,0,0,0,0,1],
      [1,0,0,0,0,0,1],
      [1,1,1,1,1,1,1]],
    width: 0,
    height: 0,
    colorFloor: 'grey',
    colorCeiling: 'teal',
    horizon: .5,
    segmentSize: 50,
    renderSegments: 60,
    renderWidth: 9,
    renderHeight: 5,
    populate: []
  }

  // setup room variables
  room.width = room.walls[0].length;
  room.height = room.walls.length;

  return room
}
