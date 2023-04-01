/* * * * * * *
WORLD CLASS
Last Edite: 18/07/22

Description:
Generic world class for creating different worlds

WORLD DATA
array: the world itself where 1's are walls and 0's are open space
width: segment width of the room
height: segment height of the room
segmentSize: size of the segments to be drawn
initialPlayerPosition: starting player position is unique to each world
colorCeiling: color of the ceiling
colorFloor: color of the floor
horizon: horizon line
* * * * * * * * */

class World extends Entity {
  constructor(name, array, initial_position, initial_normal) {
    // Check that the right amount of arguments are provided
    if (arguments.length != 4) {
      throw new Error ("Argument length of " + arguments.length + " is wrong, expected 1.");
    }

    super(name),
    this.array = array,
    this.environment,
    this.width = this.array[0].length,
    this.height = this.array.length,
    this.segmentSize,
    this.initial_position = createVector(initial_position[0], initial_position[1]),
    this.initial_normal = createVector(initial_normal[0], initial_normal[1]),
    this.horizon,
    this.wallHeight,
    this.inventory,
    this.maxItems,
    this.characters,
    this.maxCharacters,
      this.entities,
      this.surroundings = new Array(0),
    this.player,
    this.renderObjects,
    this.lightArray,
    this.texture_atlas_size = 6

  }

  // setup the world
  setup() {
    // setup the enviornment
    this.setupEnvironment();

    // set values for the world
    this.setSegmentSize(50);
    this.setHorizon(0.5);
    this.setWallHeight(50);
    this.setInventoryLength(0);
    this.setCharactersLength(0);
    this.setEntitiesLength(0);
    this.setType("world");
    this.setMaxItems(20);
    this.setMaxCharacters(10);
    this.setLighting();
  }

  /** SET **/
  // update the array and recalculate values for the world
  setArray(array) {
    if (Array.isArray(array)) {
      this.array = array;
      this.width = this.array[0].length;
      this.height = this.array.length;
    } else {
      throw new Error (this.name + " can not set array");
    }
  }

  setSegmentSize(size) {
    if (Number.isInteger(size)) {
      this.segmentSize = size;
    } else {
      throw new Error (this.name + " can not set segment size");
    }
  }

  // color is normalized rgb values plus an alpha value
  // color fills an array of size four
  setColorCeiling(color) {
    if (Array.isArray(color)) {
      this.colorCeiling = color;
    } else {
      throw new Error (this.name + " can not set celing color");
    }
  }

  // color is normalized rgb values plus an alpha value
  // color fills an array of size four
  setColorFloor(color) {
    if (Array.isArray(color)) {
      this.colorFloor = color;
    } else {
      throw new Error (this.name + " can not set floor color");
    }
  }

  setHorizon(value) {
    if (typeof value === 'number') {
      this.horizon = value;
    } else {
      throw new Error (this.name + " can not set horizon");
    }
  }

  setWallHeight(height) {
    if (typeof height === 'number') {
      this.wallHeight = height;

      console.log("wall height is " + height);
    } else {
      throw new Error (this.name + " can not set wall height");
    }
  }

  setCharactersLength(length) {
    if (Number.isInteger(length)) {
      this.characters = new Array(length);
    } else {
      throw new Error (this.name + " can not set length of characters");
    }
  }

  setMaxItems(num) {
    if (Number.isInteger(num)) {
      this.maxItems = num;
    } else {
      throw new Error (this.name + " maxItems not an integer");
    }
  }

  setMaxCharacters(num) {
    if (Number.isInteger(num)) {
      this.maxCharacters = num;
    } else {
      throw new Error (this.name + " maxCharacters not an integer");
    }
  }

  addCharacter(character) {
    if (!Array.isArray(this.characters)) {
      throw new Error (this.name + " characters not set");
    } else {

      // check if inventory is full
      if (this.getCharacters().length < this.getMaxCharacterss()) {
        this.characters.push(character);
        console.log(character.name + " added to " + this.name + " characters");
      }
    }

    this.updateEntities();
  }

  addSurrounding(surrounding) {
    if (!Array.isArray(this.surroundings)) {
      throw new Error(this.name + " surrounding not set");
    } else {
      this.surroundings.push(surrounding);
      console.log(surrounding.name + " added to " + this.name + " surroundings");
    }

    this.updateEntities();
  }

  setInventoryLength(length) {
    if (Number.isInteger(length)) {
      this.inventory = new Array(length);
    } else {
      throw new Error (this.name + " inventory length not an integer");
    }
  }

  setEntitiesLength(length) {
    if (Number.isInteger(length)) {
      this.entities = new Array(length);
    } else {
      throw new Error (this.name + " can not set length of characters");
    }
  }

  setLighting() {
    this.lightArray = new Array(0);

    for (let i = 0; i < this.height; i++) {
      this.lightArray.push([]);
      for (let k = 0; k < this.width; k++) {
        this.lightArray[i].push(0);
      }
    }
  }



  /** GET **/
  getSegmentSize() {
    return this.segmentSize
  }

  getInventory() {
    return this.inventory
  }

  getCharacters() {
    return this.characters
  }

  getMaxItems() {
    return this.maxItems
  }

  getMaxCharacterss() {
    return this.maxCharacters
  }


  /** OTHER **/
  delCharacter(character) {
    if (this.characters.length - 1 < 0) {
      throw new Error (this.name + " can not delete character: characters is empty.")
    } else {
      var temp = new Array(0);

      for (let entity of this.characters) {
        if (entity.name == character.name) {
          // do nothing
        } else {
          temp.push(entity);
        }
      }

      this.characters = temp;
    }

    this.updateEntities();
  }

  addItem(item) {
    if (!Array.isArray(this.inventory)) {
      throw new Error (this.name + " inventory not set");
    } else {

      // check if inventory is full
      if (this.inventory.length < this.getMaxItems()) {
        this.inventory.push(item);
        console.log(item.name + " added to " + this.name + " inventory");
      }
    }


    this.updateEntities();
    if (item.getIsLight()) {
      this.updateLighting();
    }
  }

  delItem(item) {
    if (this.getInventory().length - 1 < 0) {
      throw new Error (this.name + " can not delete item: inventory is empty.")
    } else {
      var temp = new Array(0);

      for (let entity of this.getInventory()) {
        if (entity.name == item.name) {
        } else {
          temp.push(entity);
        }
      }

      this.inventory = temp;
    }

    this.updateEntities();

    if (item.getIsLight()) {
      this.updateLighting();
    }
  }

  addEntity(entity) {
    if (!Array.isArray(this.entities)) {
      throw new Error (this.name + " entities array not set");
    } else {
      this.entities.push(entity);
      //console.log(entity.name + " added to " + this.name + " entities array");
    }
  }

  updateEntities() {
    this.setEntitiesLength(0);

    for (let item of this.inventory) {
      this.addEntity(item);
    }

    for (let character of this.characters) {
      this.addEntity(character);
    }
  }

  checkLightPath(x, y) {
    return this.lightPathCheck[y][x];
  }

  attachPlayer(player) {
    this.player = player;

    this.player.setPosition(this.initial_position.x, this.initial_position.y);
    this.player.setNormal(this.initial_normal.x, this.initial_normal.y);
    this.player.setup();
  }

  updateLighting() {
    for (let entity of this.entities) {
      // reset the light array for the world
      this.setLighting();

      if (entity.getIsLight()) {
        entity.updateLightArray(this);
      }

      for (var row in entity.lightArray) {
        for (var col in entity.lightArray[row]) {
          var object_arr_pos = createVector(Number(col), Number(row));
          var object_world_arr_pos = this.getArrayPosition(entity.position.x, entity.position.y);
          var object_light_strength = entity.getLightStrength();
          var world_arr_pos = createVector(0, 0);

          world_arr_pos.x = object_arr_pos.x + (object_world_arr_pos.x - object_light_strength + 1);
          world_arr_pos.y = object_arr_pos.y + (object_world_arr_pos.y - object_light_strength + 1);

          if (this.isInsideWorld(world_arr_pos.x, world_arr_pos.y)) {
            var entity_light_value = entity.lightArray[object_arr_pos.y][object_arr_pos.x];

            this.lightArray[world_arr_pos.y][world_arr_pos.x] += entity_light_value;
          }
        }
      }
    }
  }

  isInsideWorld(x, y) {
    if (x >= 0 && x < this.width &&
        y >= 0 && y < this.height) {
      return true
    } else {
      return false
    }
  }



  update() {
    // calculate magnitudes of all entities
    var temp = new Array(0);

    // cycle through every entity in the world
    for (let entity of this.entities) {
      // update the magnitude of the entity
      entity.updateMagnitudeAndAngle(this.player);

      // check if the entity is within renderable distance
      if (this.checkEntityRenderable(entity)) {
        entity.determineDimensions();

        // find the position along the x-axis and y-axis
        entity.updateDisPositionX();
        entity.updateDisPositionY();

        // update the clip and texture coordinates
        entity.updateClipAndTexCoords();

        temp.push(entity);
      }
    }

    this.renderObjects = sortByMagnitude(temp, this.player.camera.rays);
 
    for (let entity of this.renderObjects) {
      if (entity.type == "ray") {
        entity.updateClipAndTexCoords();
      } else {
        //entity.updateTexCoords2();
      }

      entity.updateVisualEffect();
      entity.updateLighting();
    }

    this.updateWalls();

    // add floor and ceiling
    this.renderObjects.push(this.surroundings[0]);
    this.renderObjects.push(this.surroundings[1]);
  }




  // convert positions from world coordinates to segment coordinates
  // this will return segment coordinates at the center of the current segment
  convertWorldCoordsToSegCoords(coords) {
    coords.x = coords.x - (coords.x % this.segmentSize);
    coords.y = coords.y - (coords.y % this.segmentSize);

    coords.x += this.segmentSize / 2;
    coords.y += this.segmentSize / 2;
    return coords
  }

  // check collision of a point with the world
  collisionCheckVector(point, ray) {
    var x = (point.x - point.x % this.segmentSize) / this.segmentSize;
    var y = (point.y - point.y % this.segmentSize) / this.segmentSize;

    if (this.array[y][x] == 1) {
      // update the rays collision coords for the world segment
      ray.collisionWallSegmentPos.x = x;
      ray.collisionWallSegmentPos.y = y;
      ray.isCollisionWall = true;

      return true
    } else {
      return false
    }
  }

  collisionCheckVectorWorld(point) {
    var x = (point.x - point.x % this.segmentSize) / this.segmentSize;
    var y = (point.y - point.y % this.segmentSize) / this.segmentSize;

    if (this.array[y][x] == 1) {
      return true
    } else {
      return false
    }
  }

  // check if an entity is with the qualifications for being rendered
  checkEntityRenderable(entity) {
    let max_fov_rad = (world.player.camera.FOV) * (Math.PI / 180);

    // angle between two vectors:
    // the player normal and the ployer position to object position
    let angle = entity.getAngle();

    if ((max_fov_rad / 2) > angle) {
      return true
    }
  }

  getArrayPosition(x, y) {
    var arr_pos = createVector(0, 0);
    arr_pos.x = (x - x % this.segmentSize) / this.segmentSize;
    arr_pos.y = (y - y % this.segmentSize) / this.segmentSize;

    return arr_pos
  }

  setupEnvironment() {
    let environment = [];

    for (let row in this.array) {
      environment.push([]);
    }

    // default texture for all walls
    for (let col in this.array) {
      for (let row in this.array[0]) {
        if (this.array[col][row] != 0) {
          let default_wall = new Wall();

          default_wall.setAllTextures(5, 4);
          default_wall.setVisualEffectScroll(0, 0);

          environment[col].push(default_wall);
        } else {
          environment[col].push(0);
        }
      }
    }

    this.environment = environment;
  }

  updateWalls() {
    for (let row in this.environment) {
      for (let col in this.environment[0]) {
        if (this.environment[row][col] !== 0) {
          this.environment[row][col].updateVisualEffectScroll();
        }
      }
    }
  }
}
