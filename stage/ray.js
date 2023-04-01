/*
RAY
A class for defining rays

position: the end point of a ray in world coordinates
normal: direction of the ray
origin: world position that the ray was cast from
ray collision is position and is relative to the world origin
collisionWallSegmentPos is the top left corner of the wall collidision
*/

class Ray extends Physical {
  constructor(position, normal, origin) {
    super("ray"),
    this.position = createVector(position.x, position.y),
    this.normal = createVector(normal.x, normal.y),
    //this.origin = createVector(origin.x, origin.y),
    //this.collision_face_origin = createVector(-1, -1),
    this.face,
    this.light,
    this.magnitude,
    this.wall_color,
    this.isCollisionWall = false,
    this.collisionWallSegmentPos = createVector(0, 0),
    this.index,
    this.texPos,
    this.texture,
    this.visualEffectScroll,

    // debug variables
    this.given_x = createVector(0, 0),
    this.given_y = createVector(0, 0),
    this.setType("ray")
  }

  setFace(x, y) {
    this.face = createVector(x, y);
  }

  setLight(num) {
    this.light = num;
  }

  setTexPos(num) {
    this.texPos = num;
  }

  setTexture(x, y) {
    this.texture = createVector(x, y);
  }

  setVisualEffectScroll(x, y) {
    this.visualEffectScroll = createVector(x, y);
  }

  getFace() {
    return this.face
  }

  getLight() {
    return this.light;
  }

  getTexPos() {
    return this.texPos;
  }

  show() {
    return 'position: ' + this.position;
  }

  updateFace(world) {
    var lower_x = (this.collisionWallSegmentPos.x) * world.segmentSize;
    var higher_x = lower_x + world.segmentSize;
    var lower_y = this.collisionWallSegmentPos.y * world.segmentSize;
    var higher_y = this.collisionWallSegmentPos.y * world.segmentSize + world.segmentSize;

    var middle_y = lower_y + world.segmentSize / 2;
    var middle_x = lower_x + world.segmentSize / 2;
    // convert ray position to world coordinates
    var position_world = createVector(world.player.position.x + this.position.x, world.player.position.y + this.position.y);

    if (lower_x < position_world.x && position_world.x < higher_x) {
      // either top or bottom face
      if (position_world.y < middle_y) {
        // top face
        // coords are (0, -1)
        this.setFace(0, -1);
      } else {
        // bottom face
        // coords are (0, 1)
        this.setFace(0, 1);
      }
    } else {
      // either left or right face
      if (position_world.x < middle_x) {
        // left face
        // coords are (-1, 0)
        this.setFace(-1, 0);
      } else {
        // right face
        // coords are (1, 0)
        this.setFace(1, 0);
      }
    }
  }

  updateLight(world) {
    var lightCheckWorld = createVector(this.collisionWallSegmentPos.x, this.collisionWallSegmentPos.y);
    var curFace = this.getFace();


    add2DVectors(lightCheckWorld, curFace);

    // check if constraints are within range of world array
    if (0 < lightCheckWorld.y < world.height
        && 0 < lightCheckWorld.x < world.width) {
          var light_strength = world.lightArray[lightCheckWorld.y][lightCheckWorld.x]
          this.setLight(light_strength);
    }
  }

  updateTexPos(player) {
    var size = world.segmentSize;

    // top left corner of a square
    var wall_origin_x = this.collisionWallSegmentPos.x * size;
    var wall_origin_y = this.collisionWallSegmentPos.y * size;

    var texOrigin;
    var texPos;
    var world_col_ray;

    // find texture origin on wall
    if (this.getFace().x == 1) {
      // right face
      texOrigin = createVector(wall_origin_x + size, wall_origin_y + size);

      //
      world_col_ray = createVector(this.position.x + player.position.x, this.position.y + player.position.y)
      texPos = sub2DVectorsReturn(world_col_ray, texOrigin);
   
      this.setTexPos(magnitude2DVector(texPos) / size);

    } else if (this.getFace().x == -1) {
      // left face
      texOrigin = createVector(wall_origin_x, wall_origin_y);

      world_col_ray = createVector(this.position.x + player.position.x, this.position.y + player.position.y)
      texPos = sub2DVectorsReturn(world_col_ray, texOrigin);

      this.setTexPos(magnitude2DVector(texPos) / size);

    } else if (this.getFace().y == 1) {
      // bottom face
      texOrigin = createVector(wall_origin_x, wall_origin_y + size);

      world_col_ray = createVector(this.position.x + player.position.x, this.position.y + player.position.y)
      texPos = sub2DVectorsReturn(world_col_ray, texOrigin);

      this.setTexPos(magnitude2DVector(texPos) / size);

    } else if (this.getFace().y == -1) {
      // Top face
      texOrigin = createVector(wall_origin_x + size, wall_origin_y);

      world_col_ray = createVector(this.position.x + player.position.x, this.position.y + player.position.y)
      texPos = sub2DVectorsReturn(world_col_ray, texOrigin);

      // find magnitude and normalize
      this.setTexPos(magnitude2DVector(texPos) / size);

    }
  }

  // this is a one time call for all drawn objects
  // however, this will be updated once a frame for all rays
  // updates the coordinates for where the texture is located in the texture atlas
  updateClipAndTexCoords() {
    let size = 256-1; //size of texture sprites
    let number_of_textures = world.texture_atlas_size;

    // pixel cordinates of the texture
    let left_x = this.texLocation.x * size;
    let right_x = left_x + size;
    let top_y = this.texLocation.y * size;
    let bottom_y = top_y + size;

    // projected wall height is taller than the viewport
    if (this.segmentHeight >= world.segmentSize) {
      // projected height normalized
      let proj_height = this.segmentHeight / world.segmentSize;
      proj_height *= gl.canvas.height;
      // = (projected_height - screen_height) / projected_height 
      let percent_offset = (proj_height - gl.canvas.height) / (proj_height * 2);

      top_y += percent_offset * size;
      bottom_y -= percent_offset * size;
    }


    if (this.type != "ray") {
      var segmentWidth = size;
      var offset = (this.getDisplayPosX() - segmentWidth) + 6;

      if (offset < 0) {
        left_x -= this.testWidthPercent * size;
      }
    }

    // adjust texture coordinates based on the ray's collision position on the wall face
    // positionOnTexture originally runs up to 1, but 1.0 does not equal texture coordinates
    if (this.type == "ray") {
      let positionOnTexture = this.getTexPos();

      let pixels = gl.canvas.width / world.player.camera.numOfRays;
      left_x += Math.trunc(positionOnTexture * size);
      let new_right_x = left_x + pixels; // increment for size of 1 pixel

      if (new_right_x < right_x ) {
        right_x = new_right_x;
      }
    }

    left_x = Math.trunc(left_x);
    right_x = Math.trunc(right_x);
    top_y = Math.trunc(top_y);
    bottom_y = Math.trunc(bottom_y);

    // normalize the texture pixel coordinates
    left_x /= size * number_of_textures;
    right_x /= size * number_of_textures;
    top_y /= size * number_of_textures;
    bottom_y /= size * number_of_textures;

    // add visual effect offset
    let normal_texture_size = 1.0 / number_of_textures;
    let normal_texture_location = createVector(this.texture.x * normal_texture_size, this.texture.y * normal_texture_size);

    left_x += (this.visualEffectScroll.x * normal_texture_size);
    right_x += (this.visualEffectScroll.x * normal_texture_size);
    top_y += (this.visualEffectScroll.y * normal_texture_size);
    bottom_y += (this.visualEffectScroll.y * normal_texture_size);

    if (right_x >= normal_texture_location.x + normal_texture_size) {right_x -= normal_texture_size;}
    if (left_x >= normal_texture_location.x + normal_texture_size) {left_x -= normal_texture_size;}
    if (right_x < normal_texture_location.x) {right_x += normal_texture_size;}
    if (left_x < normal_texture_location.x) {left_x += normal_texture_size;}

    if (bottom_y < normal_texture_location.y) {bottom_y += normal_texture_size;}
    if (top_y < normal_texture_location.y) {top_y += normal_texture_size;}
    if (bottom_y >= normal_texture_location.y + normal_texture_size) {bottom_y -= normal_texture_size;}
    if (top_y >= normal_texture_location.y + normal_texture_size) {top_y -= normal_texture_size;}

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

  updateEnvironment() {
    let x = this.collisionWallSegmentPos.x;//Math.trunc(this.position.x / world.segmentSize);
    let y = this.collisionWallSegmentPos.y;//Math.trunc(this.position.y / world.segmentSize)+1;

    if (world.environment[y][x] == 0) {
      console.log("the ray collision variables are wrong");
      console.log("x: "+x);
      console.log("y: "+y);
    }

    // pick facing of wall
    let row;
    let col;
    if (this.getFace().x == 1) {
      row = world.environment[y][x].texture_east.x;
      col = world.environment[y][x].texture_east.y;
    } else if (this.face.x == -1) {
      row = world.environment[y][x].texture_west.x;
      col = world.environment[y][x].texture_west.y;
    } else if (this.face.y == 1) {
      row = world.environment[y][x].texture_south.x;
      col = world.environment[y][x].texture_south.y;
    } else if (this.face.y == -1) {
      row = world.environment[y][x].texture_north.x;
      col = world.environment[y][x].texture_north.y;
    } else {
      // default texture location
      row = 1;
      col = 4;
    }

    let scroll_x = world.environment[y][x].visualEffect.x;
    let scroll_y = world.environment[y][x].visualEffect.y;

    this.setTexture(row, col);
    this.setVisualEffectScroll(scroll_x, scroll_y);
  }
}
