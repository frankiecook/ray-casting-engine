/*
ITEM
Refactor Date: 18/07/2022

Description:
Physical class are objects that exists within the world and are physically present
Require variables such as position and radius

Data

*/

// class syntax helps simplify method construction
// these are objects that are physically present in the world and require
// stats such as position, normal, radius
class Physical extends Entity {
  constructor(name) {
    // Check that the right amount of arguments are provided
    if (arguments.length != 1) {
      throw new Error ("Argument length of " + arguments.length + " is wrong, expected 1.");
    }

    // check if abstract class
    /*if (this.constructor == Entity) {
      throw new Error ("Abstract classes can't be instantiated.");
    }*/

    super(name),  // super method refers to the parent class that calls the parent's constructor
    this.position = createVector(-1, -1),
    this.normal = createVector(0,0),
    this.color,
    this.displayPosX, // x position on display
    this.displayPosY, // y position on display

    // texture location coordinates on texture atlas
    this.texLocation,

    // values for the texture coordinates and clip space
    this.texCoords,
    this.clipCoords,

    this.brightness,
    this.alpha,

    this.visualEffectScroll
  }

  /** SET **/
  setPosition(x, y) {
    if (typeof x === 'number' && typeof y === 'number') {
      this.position.x = x;
      this.position.y = y;
    } else {
      throw new Error (this.name + " position not a number");
    }
  }

  setNormal(x, y) {
    if (typeof x === 'number' && typeof y === 'number') {
      this.normal.x = x;
      this.normal.y = y;
    } else {
      throw new Error (this.name + " normal not a number");
    }
  }

  setColor(c) {
    if (typeof c === 'string') {
      this.color = c;
    }
  }

  setDisplayPosX(i) {
    if (Number.isInteger(i)) {
      this.displayPosX = i;
    } else {
      throw new Error (this.name + " diplsayPosX not an integer");
    }
  }

  setDisplayPosY(i) {
    if (Number.isInteger(i)) {
      this.displayPosY = i;
    } else {
      throw new Error (this.name + " diplsayPosX not an integer");
    }
  }

  // spacial location of texture in texture atlas
  // set once for all objects
  setTexLocation(x, y) {
    if (Number.isInteger(x) & Number.isInteger(y)) {
      this.texLocation = createVector(x, y);
    } else {
      throw new Error (this.name + " texLocation not an integer");
    }
  }

  setTexCoords(arr) {
    this.texCoords = arr;
  }

  setClipCoords(arr) {
    this.clipCoords = arr;
  }

  setBrightness(b) {
    this.brightness = b;
  }

  setAlpha(a) {
    this.alpha = a;
  }

  setVisualEffectScroll(x, y) {
    this.visualEffectScroll = createVector(x, y);
  }

  /** GET **/
  getPosition() {
    return this.position
  }

  getNormal() {
    return this.normal
  }

  getColor() {
    return this.color
  }

  getDisplayPosX() {
    return this.displayPosX;
  }

  getDisplayPosY() {
    return this.displayPosY;
  }

  getTexLocation() {
    return this.texLocation
  }

  getTexCoords() {
    return this.texCoords
  }

  getClipCoords() {
    return this.clipCoords
  }

  getBrightness() {
    return this.brightness;
  }

  getAlpha() {
    return this.alpha;
  }

  /** OTHER **/
  // rotate normal
  rotateNormal(r) {
    var normal_copy = createVector(0, 0);

    copy2DVector(normal_copy, this.getNormal());
    rotation2DVector(normal_copy, world.player.angularVelocity * r);

    this.setNormal(normal_copy.x, normal_copy.y);
  }

  // calculate magnitude and angle
  updateMagnitudeAndAngle(player) {
    let object_vector = sub2DVectorsReturn(this.position, player.position);
    let player_vector = createVector(player.normal.x, player.normal.y);
    let distorted_magnitude = magnitude2DVector(object_vector);

    let mag_obj_vec = magnitude2DVector(object_vector);
    let mag_player_vec = magnitude2DVector(player_vector);
    let dot_product = dot2DVector(object_vector, player_vector);

    // angle between two vectors:
    // the player normal and the object position relative to the player
    let alpha = acos((dot_product) / (mag_obj_vec * mag_player_vec));

    if (this.name == "caandle") {
      console.log("update magnitude alpha: "+alpha);
      console.log("half FOV (max): "+(world.player.camera.FOV / 2) * (Math.PI / 180));
      console.log("object_vector: "+object_vector);
      console.log("player_vector: "+player_vector);
      console.log("dot product: "+dot_product);
      if (dot_product < 0) {
        console.log("less than 0");
      } else {
        console.log("greater");
      }
    }

    // calculate the magnitude
    let new_magnitude = Math.trunc(cos(alpha) * distorted_magnitude);

    this.setAngle(alpha);
    this.magnitude = new_magnitude;
  }

  // update lighting after updating the magnitude
  updateLighting() {
    let brightness = 1 - this.magnitude / world.player.camera.renderDistance;
    let alpha = 1;

    if (brightness < 0) {
      brightness = 0;
    }

    this.setBrightness(brightness);
    this.setAlpha(alpha);
  }

  // calculate the position along the x-axis
  updateDisPositionX() {
    let max_position_x = gl.canvas.width - 1;
    let max_fov_rad = (world.player.camera.FOV) * (Math.PI / 180);

    let vector_a = createVector(0,0);
        copy2DVector(vector_a, world.player.camera.normal);
    let vector_b = sub2DVectorsReturn(this.position, world.player.position);
    let mag_vec_a = magnitude2DVector(vector_a);
    let mag_vec_b = magnitude2DVector(vector_b);

    let dot_a_b = dot2DVector(vector_a, vector_b);

    // calculate the on screen x position of the object
    // First, find the vector 90 degrees to the left of the player's normal
    rotation2DVector(vector_a, -(max_fov_rad / 2));

    // second, calculate the angle between the object and the new vector
    mag_vec_a = 1.0;
    dot_a_b = dot2DVector(vector_a, vector_b);
    var display_angle = acos(dot_a_b / (mag_vec_a * mag_vec_b));
    if (dot_a_b / (mag_vec_a * mag_vec_b) > 1) {
      display_angle = 0;
    }

    // normalize the angle be dividing by the fov
    display_angle /= (max_fov_rad);

    this.setDisplayPosX(Math.trunc(display_angle * max_position_x));

    var angle = this.getAngle();
  }

  updateDisPositionY() {
    let floor = this.floor;
    let object_size = this.objectSize;

    // find the upper most value given the middle height of the object
    let upper_bound = 1.0 - object_size / 2;
    let lower_bound = object_size / 2;
    let height = ((upper_bound - lower_bound) * floor) + lower_bound;

    let ceiling_height = (gl.canvas.height / 2) - this.defaultHeight / 2;

    //console.log("Y: "+Math.trunc(ceiling_height + height * this.defaultHeight));
    this.setDisplayPosY(Math.trunc(ceiling_height + height * this.defaultHeight));
  }

  // this is a one time call for all drawn objects
  // however, this will be updated once a frame for all rays
  // updates the coordinates for where the texture is located in the texture atlas
  updateTexCoords(left_x, right_x, top_y, bottom_y) {
    // positions for two triangles that definie the texture location
    let positions = new Float32Array(
      [
        left_x, top_y, // top left
        right_x, top_y, // top right
        left_x, bottom_y, // bottom left
        left_x, bottom_y, // bottom left
        right_x, top_y, // top right
        right_x, bottom_y, // bottom right
      ]);

    this.setTexCoords(positions);
  }

  // update the clip space coordinates for the texture every frame
  // slightly misleading, because these are actually set in pixel values, but are converted to clip space in the shader
  updateClipCoords(left_x, right_x, top_y, bottom_y) {
    // for some reason, some numbers a negative right now
    // they seem to be -4 only
    if (left_x < 0) {
      left_x = 0;
    }

    if (right_x < 0) {
      right_x = 0;
    }

    if (top_y < 0) {
      top_y = 0;
    }

    if (bottom_y < 0) {
      bottom_y = 0;
    }

    // positions for two triangles that definie the texture location
    let positions = new Float32Array(
      [
        left_x, top_y, // top left
        right_x, top_y, // top right
        left_x, bottom_y, // bottom left
        left_x, bottom_y, // bottom left
        right_x, top_y, // top right
        right_x, bottom_y, // bottom right
      ]);

    this.setClipCoords(positions);
  }

  // VISUAL EFFECTS
  updateVisualEffect() {
    this.setVisualEffectScroll(0, 0);

  }
}
