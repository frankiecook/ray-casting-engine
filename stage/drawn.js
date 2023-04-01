
class Drawn extends Physical {
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
    this.radius,
    this.angle, // angle from object to player camera's normal
    this.magnitude,

    this.height,
    this.width,
    this.renderHeight, // width and height are normalized
    this.renderWidth,
    this.floor = 0.0, // value between 0 and 1
                    // 0 is on the ground
                    // 1 is on the roof
    this.isLight = false, //false by default
    this.lightStrength,
    this.lightArray,
    this.lightPathCheck,
    this.color,

    this.testWidthPercent,
    this.defaultHeight,
    this.objectSize     // variable ranges from 0.0 to 1.0, 1.0 being normal size
  }

  /** SET **/
  setRadius(r) {
    if (Number.isInteger(r)) {
      this.radius = r;
    } else {
      throw new Error (this.name + " radius not an integer");
    }
  }

  setAngle(a) {
    if (typeof a === 'number') {
      this.angle = a;
    } else {
      throw new Error (this.name + " angle not a string");
    }
  }

  setMagnitude(mag) {
    Utils.setMagnitude(mag);
  }

  setHeight(h) {
    if (Number.isInteger(h)) {
      this.height = h;
    } else {
      throw new Error (this.name + " height not an integer");
    }
  }

  setWidth(w) {
    if (Number.isInteger(w)) {
      this.width = w;
    } else {
      throw new Error (this.name + " width not an integer");
    }
  }

  setColor(c) {
    this.color = c;
  }

  setDimensions(h, w) {
    this.setHeight(h);
    this.setWidth(w);
  }

  setIsLight(bool, world) {
    if (typeof bool === 'boolean') {
      this.isLight = bool;
      this.setupLighting();
      world.updateLighting();

    } else {
      throw new Error (this.name + " isLight not a boolean");
    }
  }

  setLightStrength(i) {
    if (Number.isInteger(i)) {
      this.lightStrength = i;
      this.lightArray = [];
    } else {
      throw new Error (this.name + " lightStrength not an integer");
    }
  }

  setLightArray(x, y, strength) {
    this.lightArray[y][x] = strength;
  }

  setObjectSize(i) {
    if (i <= 1 && i >= 0) {
      this.objectSize = i;
    } else {
      throw new Error (this.name + " objectSize not an integer");
    }
  }

  setFloor(i) {
    if (i <= 1 && i >= 0) {
      this.floor = i;
    } else {
      throw new Error (this.name + " setFloor not an integer");
    }
  }



  /** GET **/
  getRadius() {
    return this.radius
  }

  getAngle() {
    return this.angle
  }

  getMagnitude() {
    Utils.getMagnitude();
  }

  getHeight() {
    return this.height
  }

  getWidth() {
    return this.width
  }

  getIsLight() {
    return this.isLight
  }

  getLightStrength() {
    return this.lightStrength
  }

  getColor() {
    return this.color
  }

  getObjectSize() {
    return this.objectSize
  }

  /** OTHER **/
  determineDimensions () {
    // default height over the default magnitude (distance)
    let default_height = gl.canvas.height; // max segment height / distance one segment away
    let default_width = gl.canvas.height; // keep the square ratio of textures
    let magnitude_normal = this.magnitude / world.segmentSize;
    let object_size = this.getObjectSize();

    // save the default corrected height
    this.defaultHeight = Math.trunc(default_height / magnitude_normal);

    // height will be affected by the distance (magnitude)
    this.height = Math.trunc(object_size * this.defaultHeight);
    this.width = Math.trunc(object_size * default_width / magnitude_normal);
  }

  /* LIGHTING */
  setupLighting() {
    this.setupLightArray();
    console.log("SET UP LIGHTING");
    this.setupLightPathCheck();
  }

  setupLightArray() {
    var arr;
    var rev_arr;
    var size = this.getLightStrength() * 2 - 1;

    for (var row = 0; row < size; row++){
      this.lightArray.push([]);

      for (var col = 0; col < size; col++) {
        //var num = (this.getLightStrength() - col) - row;

        //if (num > 0) {
          //this.lightArray[row].push(0); // currentyl fills with 0, but was filling with num
        //} else {
          this.lightArray[row].push(0);
        //}

      }
      /*rev_arr = [...arr];
      console.log("rev_arr");
      console.log(rev_arr);
      rev_arr.reverse();
      rev_arr.splice(rev_arr.length - 1, 1, ...arr);*/

      //this.lightArray.push([...rev_arr]);
    }

    /*rev_arr = [...this.lightArray];
    rev_arr.reverse();
    rev_arr.splice(rev_arr.length - 1, 1, ...this.lightArray);

    this.lightArray = rev_arr;*/
    console.log("light array");
    console.log(this.lightArray);
  }

  updateLightArray(world) {
    var check_x;
    var check_y;
    var world_check = createVector(0, 0);
    var object_check = createVector(0, 0);
    var direction;
    var new_light;
    var light = this.getLightStrength();
    var world_arr_pos = world.getArrayPosition(this.position.x, this.position.y);
    var object_world_arr_pos = world.getArrayPosition(this.position.x, this.position.y); // never changes
    var object_arr_pos = createVector(this.lightStrength - 1, this.lightStrength - 1);

    // initial light value
    this.lightArray[object_arr_pos.y][object_arr_pos.x] = light;
    this.lightPathCheck[object_arr_pos.y][object_arr_pos.x] = 1;
    new_light = light - 1;

    // from origin go in all directions
    direction = "all";
    world_check.x = world_arr_pos.x;
    world_check.y = world_arr_pos.y;
    object_check.x = object_arr_pos.x;
    object_check.y = object_arr_pos.y;

    this.recursiveLightPath(world_check, object_check, new_light, direction, world);
  }

  tempHelper(world_check, object_check, new_light, direction, world) {
    this.recursiveLightPath(world_check, object_check, new_light, direction, world);
  }


  // light check moving up
  recursiveLightPath(world_check, object_check, light, direction, world) {
    // first pass
    // checks all directions
    if (direction == "all") {
      this.lightPathU(world_check, object_check, light, world);
      this.lightPathL(world_check, object_check, light, world);
      this.lightPathD(world_check, object_check, light, world);
      this.lightPathR(world_check, object_check, light, world);
    }

    // up
    if (direction == "up" ) {
      this.lightPathU(world_check, object_check, light, world);
      this.lightPathL(world_check, object_check, light, world);
      this.lightPathR(world_check, object_check, light, world);
    }


    // left
    if (direction == "left") {
      this.lightPathU(world_check, object_check, light, world);
      this.lightPathL(world_check, object_check, light, world);
      this.lightPathD(world_check, object_check, light, world);
    }

    // down
    if (direction == "down") {
      this.lightPathL(world_check, object_check, light, world);
      this.lightPathD(world_check, object_check, light, world);
      this.lightPathR(world_check, object_check, light, world);
    }

    // right
    if (direction == "right") {
      this.lightPathU(world_check, object_check, light, world);
      this.lightPathD(world_check, object_check, light, world);
      this.lightPathR(world_check, object_check, light, world);
    }
  }

  recursiveLightCheck(new_wc, new_oc, direction, light, world) {
    if (this.isLightChecked(new_oc.x, new_oc.y, light - 1)) {
      // checks for wall collision
      if (world.array[new_wc.y][new_wc.x] == 0) {
        this.lightArray[new_oc.y][new_oc.x] = light;
        this.lightPathCheck[new_oc.y][new_oc.x] = 1;
        light -= 1;

        if (light > 0) {
          this.recursiveLightPath(new_wc, new_oc, light, direction, world);
        }
      }
    }
  }

  // move to segment above current segment
  lightPathU(world_check, object_check, light, world) {
    // vars
    var direction = "up";
    var new_wc = createVector(world_check.x, world_check.y - 1);
    var new_oc = createVector(object_check.x, object_check.y - 1);

    this.recursiveLightCheck(new_wc, new_oc, direction, light, world);
  }

  // move to segment left of current segment
  lightPathL(world_check, object_check, light, world) {
    // vars
    var direction = "left";
    var new_wc = createVector(world_check.x - 1, world_check.y);
    var new_oc = createVector(object_check.x - 1, object_check.y);

    this.recursiveLightCheck(new_wc, new_oc, direction, light, world);
  }

  // move to segment below current segment
  lightPathD(world_check, object_check, light, world) {
    // vars
    var direction = "down";
    var new_wc = createVector(world_check.x, world_check.y + 1);
    var new_oc = createVector(object_check.x, object_check.y + 1);

    this.recursiveLightCheck(new_wc, new_oc, direction, light, world);

  }

  // move to segment right of the current segment
  lightPathR(world_check, object_check, light, world) {
    // vars
    var direction = "right";
    var new_wc = createVector(world_check.x + 1, world_check.y);
    var new_oc = createVector(object_check.x + 1, object_check.y);

    this.recursiveLightCheck(new_wc, new_oc, direction, light, world);
  }

  isLightChecked(x, y, light) {
    if (!world.isInsideWorld(x, y)) {
      return false
    }

    if (this.lightPathCheck[y][x]) {
      // already checked

      // check if current light value is greater than
      if (this.lightArray[y][x] < light) {
        return true
      } else {
        return false
      }
    } else {
      // needs to be checked
      return true
    }
  }

  setupLightPathCheck() {
    var temp;
    this.lightPathCheck = [];
    for (let i = 0; i < this.lightArray.length; i++) {
      temp = [];

      for (let k = 0; k < this.lightArray[0].length; k++) {
        temp.push(0);
      }

      this.lightPathCheck.push(temp);
    }
  }

  updateClipAndTexCoords() {
    var entity_height = this.displayPosY;

    let renderWidth = this.width;//Math.trunc(segmentHeightN * gl.canvas.height);
    let renderHeight = this.height;

    let left_x = this.getDisplayPosX() - renderWidth / 2;
    let right_x = this.getDisplayPosX() + renderWidth / 2;
    let top_y = entity_height - renderHeight / 2;
    let bottom_y = top_y + renderHeight;

    let TEMP_OFFSET = 0;

    // check the boundary for every side
    if (left_x < 0) {
      var clip_left_x = Math.trunc(0 + TEMP_OFFSET);
      var tex_left_x = -1 * left_x / renderWidth;
    } else {
      var clip_left_x = Math.trunc(left_x);
      var tex_left_x = 0;
    }

    if (right_x > gl.canvas.width) {
      var clip_right_x = Math.trunc(gl.canvas.width - TEMP_OFFSET);
      var tex_right_x = (clip_right_x - left_x) / renderWidth;
    } else {
      var clip_right_x = Math.trunc(right_x);
      var tex_right_x = 1;
    }

    if (top_y < 0) {
      var clip_top_y = Math.trunc(0 + TEMP_OFFSET);
      var tex_top_y = -1 * top_y / renderHeight;
    } else {
      var clip_top_y = Math.trunc(top_y);
      var tex_top_y = 0;
    }

    if (bottom_y > gl.canvas.height) {
      var clip_bottom_y = Math.trunc(gl.canvas.height - TEMP_OFFSET);
      var tex_bottom_y = (clip_bottom_y - top_y) / renderHeight;
    } else {
      var clip_bottom_y = Math.trunc(bottom_y);
      var tex_bottom_y = 1;
    }

    // adjust parameters for the relevant texture in the texture atlas
    let atlas_incrment = 1 / world.texture_atlas_size;

    // change scale for coords from 0.0-1.0 to the space taken by a texture in the atlas
    tex_left_x *= atlas_incrment;
    tex_right_x *= atlas_incrment;
    tex_top_y *= atlas_incrment;
    tex_bottom_y *= atlas_incrment;

    tex_left_x += atlas_incrment * this.texLocation.x;
    tex_right_x += atlas_incrment * this.texLocation.x;
    tex_top_y += atlas_incrment * this.texLocation.y;
    tex_bottom_y += atlas_incrment * this.texLocation.y;

    this.updateClipCoords(clip_left_x, clip_right_x, clip_top_y, clip_bottom_y);
    this.updateTexCoords(tex_left_x, tex_right_x, tex_top_y, tex_bottom_y);
  }
}
