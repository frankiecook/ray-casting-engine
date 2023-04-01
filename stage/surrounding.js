console.log("loaded");

class Surrounding extends Physical {
  constructor(name) {
    // Check that the right amount of arguments are provided
    if (arguments.length != 1) {
      throw new Error("Argument length of " + arguments.length + " is wrong, expected 1.");
    }

    super(name)
  }

  setup() {
    this.brightness = 1;
    this.alpha = 1;
    world.addSurrounding(this);
  }

  // update texture coordinates
  updateTexCoords() {
    let size = 1 / world.texture_atlas_size;

    let left_x = this.getTexLocation().x * size;
    let right_x = left_x + size;
    let top_y = this.getTexLocation().y * size;
    let bottom_y = top_y + size;

    super.updateTexCoords(left_x, right_x, top_y, bottom_y);
  }

  // modified update clip coords
  updateClipCoordsCeiling() {
    let c = document.getElementById("glcanvas");

      let width = c.clientWidth;
      let height = c.clientHeight;
      
      let left_x = 0;
      let right_x = width;
      let top_y = 0;
      let bottom_y = height * world.horizon;

    super.updateClipCoords(left_x, right_x, top_y, bottom_y);
  }

  updateClipCoordsFloor() {
    let c = document.getElementById("glcanvas");

    let width = c.clientWidth;
    let height = c.clientHeight;

    let left_x = 0;
    let top_y = height * world.horizon;
    let right_x = width;
    let bottom_y = height;

    super.updateClipCoords(left_x, right_x, top_y, bottom_y);
  }
}