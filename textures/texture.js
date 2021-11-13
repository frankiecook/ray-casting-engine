// texture constructor
// BMP file format
// 16 bit per pixel
function newRoom() {

  var room = {
    walls: [
      [1,1,1,1,1,1,1],
      [1,1,1,0,1,1,1],
      [1,1,1,1,0,0,1],
      [1,1,1,1,0,0,1],
      [1,1,1,1,0,0,1],
      [1,1,1,1,1,1,1],
      [1,1,1,1,1,1,1]],
    width: 0,
    height: 0,
    textureN: '',
    textureS: '',
    textureW: '',
    textureE: '',
    //segmentSize: 50,
    //renderSegments: 60,
    //renderWidth: 9,
    //renderHeight: 5,
    populate: new Array[0]
  }

  // setup room variables
  room.width = walls[0].length;
  room.height = walls.length;

  return room
}
