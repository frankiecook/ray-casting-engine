// set up using a hash table
const world_02 = {
  array: [
      [1,1,1,1,1,1,1,1,1,1,1,1],
      [1,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,1,1,0,0,0,0,1,1,0,1],
      [1,0,1,0,0,0,0,0,0,1,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,1,0,1],
      [1,0,1,0,0,0,0,0,0,0,0,1],
      [1,0,1,0,0,0,0,0,0,1,0,1],
      [1,0,1,1,0,0,0,0,1,1,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,1],
      [1,1,1,1,1,1,1,1,1,1,1,1]
    ],
  enviornment: new Array(),
  initial_position: [225, 225],
  initial_normal: [1, 0],
  initial_entities: function initial_entities() {

    let pickaxe = new Item("pickaxe");
    pickaxe.setPosition(250, 250);
    pickaxe.setCollectible(true);
    pickaxe.setDimensions(100, 100);
    pickaxe.setTexLocation(0, 0);
    pickaxe.updateTexCoords();
    pickaxe.setup();
    pickaxe.setObjectSize(0.5);
    pickaxe.setFloor(.25);

    let sausage = new Item("sausage");
    sausage.setPosition(200, 400);
    sausage.setCollectible(true);
    sausage.setDimensions(200, 200);
    sausage.setTexLocation(0, 0);
    sausage.updateTexCoords();
    sausage.setup();
    sausage.setObjectSize(.25);
    sausage.setFloor(1);

    let candle = new Item("candle");
    candle.setPosition(325, 75);
    candle.setCollectible(true);
    candle.setDimensions(150, 150);
    candle.setLightStrength(5);
    candle.setIsLight(true, world);
    candle.setTexLocation(0, 0);
    candle.updateTexCoords();
    candle.setup();
    candle.setObjectSize(1);
    candle.setFloor(1);

    let jared = new Character("jared");
    jared.setPosition(250, 300);
    jared.setDimensions(250, 150);
    jared.setMaxItems(10);
    jared.setTexLocation(0, 1);
    jared.updateTexCoords();
    jared.setup();
    jared.setObjectSize(1);
    jared.setFloor(0);

    let ceiling = new Surrounding("ceiling");
    ceiling.setTexLocation(4, 0);
    ceiling.updateTexCoords(0, 0.5, 0, 0.5);
    ceiling.updateClipCoordsCeiling();
    ceiling.setup();

    let floor = new Surrounding("floor");
    floor.setTexLocation(2, 0);
    floor.updateTexCoords();
    floor.updateClipCoordsFloor();
    floor.setup();

  },

  initial_environment: function initial_environment() {
    world.environment[0][1].setAllTextures(2, 1);
    world.environment[0][4].setAllTextures(3, 1);
    world.environment[0][5].setAllTextures(4, 1);
    world.environment[3][2].setAllTextures(3, 1);
    world.environment[2][3].setAllTextures(2, 1);

    world.environment[3][2].setVisualEffectScroll(0, 0);
    world.environment[2][3].setVisualEffectScroll(0.01, 0);

      world.environment[0][1].alpha = 0.5;
  }
};

const world_03 = {
  array: [
      [1,1,1,1,1,1,1,1,1,1,1,1],
      [1,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,1,0,0,1],
      [1,0,0,0,1,0,0,0,0,1,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,0,1,0,0,0,0,0,1,0,1],
      [1,0,0,0,1,0,0,1,1,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,1],
      [1,1,1,1,1,1,1,1,1,1,1,1]
    ],
  initial_position: [275, 275],
  initial_normal: [0, -1],
  initial_entities: function initial_entities() {
    let pickaxe = new Item("pickaxe");
    pickaxe.setPosition(250, 250);
    pickaxe.setCollectible(true);
    pickaxe.setDimensions(100, 100);
    pickaxe.setup();
  }
};

const world_04 = {
  array: [
      [1,1,1,1,1,1,1,1,1,1,1,1],
      [1,1,1,1,0,0,0,1,1,1,1,1],
      [1,1,1,1,0,0,0,1,1,1,1,1],
      [1,1,1,1,0,0,0,1,1,1,1,1],
      [1,1,1,1,0,0,0,1,1,1,1,1],
      [1,1,1,1,0,0,0,1,1,1,1,1],
      [1,1,1,1,0,0,0,1,1,1,1,1],
      [1,1,1,1,0,0,0,1,1,1,1,1],
      [1,1,1,1,0,0,0,1,1,1,1,1],
      [1,1,1,1,0,0,0,1,1,1,1,1],
      [1,1,1,1,0,0,0,1,1,1,1,1],
      [1,0,0,0,0,0,0,0,0,0,1,1],
      [1,0,1,0,1,0,1,0,1,0,1,1],
      [1,0,0,0,0,0,0,0,0,0,1,1],
      [1,1,0,1,0,1,0,1,0,1,1,1],
      [1,0,0,0,0,0,0,0,0,0,1,1],
      [1,0,1,0,1,0,1,0,1,0,1,1],
      [1,0,0,0,0,0,0,0,0,0,1,1],
      [1,1,1,1,1,1,1,1,1,1,1,1]
    ],
  initial_position: [275, 75],
  initial_normal: [0, 1],
  initial_entities: function initial_entities() {

  }
};

// demo world
const world_05 = {
  // world size: 32 x 32
  array: [
    [1, 1, 1, 1, 1, 1, 1, 1,    1, 1, 1, 1, 1, 1, 1, 1,   1, 1, 1, 1, 1, 1, 1, 1,    1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 0, 0, 0, 0, 0, 1,    1, 0, 0, 0, 0, 0, 0, 1,   1, 0, 0, 0, 0, 0, 0, 1,    1, 0, 0, 0, 0, 0, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0,    0, 0, 0, 0, 0, 0, 0, 1,   1, 0, 0, 0, 0, 0, 0, 0,    0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0,    0, 0, 0, 0, 0, 0, 0, 1,   1, 0, 0, 0, 0, 0, 0, 0,    0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0,    0, 0, 0, 0, 0, 0, 0, 0,   0, 0, 0, 0, 0, 0, 0, 1,    0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 1, 0, 0,    0, 0, 1, 0, 0, 0, 0, 0,   0, 0, 0, 0, 0, 1, 0, 0,    0, 0, 1, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0,    0, 0, 0, 0, 0, 0, 0, 0,   0, 0, 0, 0, 0, 0, 0, 0,    0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 0, 0, 0, 0, 0, 0,    0, 0, 0, 0, 0, 0, 0, 1,   1, 0, 0, 0, 0, 0, 0, 0,    0, 1, 0, 0, 0, 0, 1, 1],

    [1, 1, 0, 0, 0, 0, 0, 0,    0, 1, 0, 0, 0, 0, 0, 1,   1, 0, 0, 0, 0, 0, 0, 0,    0, 0, 0, 0, 0, 0, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 1,    0, 0, 0, 0, 0, 0, 0, 1,   1, 0, 0, 0, 0, 0, 0, 0,    0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 1, 0, 1,    0, 0, 0, 0, 0, 0, 0, 1,   1, 0, 0, 0, 0, 0, 0, 0,    0, 0, 1, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0,    0, 0, 0, 1, 1, 1, 1, 1,   1, 1, 1, 1, 1, 0, 0, 0,    0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0,    0, 0, 0, 1, 1, 1, 1, 0,   0, 1, 1, 1, 1, 0, 0, 0,    0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0,    0, 0, 0, 1, 1, 0, 0, 0,   0, 0, 0, 1, 1, 0, 0, 0,    0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0,    0, 0, 0, 1, 1, 0, 0, 0,   0, 0, 0, 1, 1, 0, 0, 0,    0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 0, 0, 0, 1, 0, 0,    0, 0, 0, 1, 0, 0, 0, 0,   0, 1, 0, 0, 1, 0, 0, 0,    0, 0, 1, 0, 0, 0, 1, 1],

    [1, 1, 0, 0, 0, 1, 0, 0,    0, 0, 0, 1, 0, 0, 1, 0,   0, 0, 0, 0, 1, 0, 0, 0,    0, 0, 1, 0, 0, 0, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0,    0, 0, 0, 1, 1, 0, 0, 0,   0, 0, 0, 1, 1, 0, 0, 0,    0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0,    0, 0, 0, 1, 1, 0, 0, 0,   0, 0, 0, 1, 1, 0, 0, 0,    0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0,    0, 0, 0, 1, 1, 1, 1, 0,   0, 1, 1, 1, 1, 0, 0, 0,    0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0,    0, 0, 0, 1, 1, 1, 1, 1,   1, 1, 1, 1, 1, 0, 0, 0,    0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 1, 0, 0,    0, 0, 0, 0, 0, 0, 0, 1,   1, 0, 0, 0, 0, 0, 0, 0,    0, 0, 1, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0,    0, 0, 0, 0, 0, 0, 0, 1,   1, 0, 0, 0, 0, 0, 0, 0,    0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 0, 0, 0, 0, 0, 0,    0, 1, 0, 0, 0, 0, 0, 1,   1, 0, 0, 0, 0, 0, 0, 0,    0, 0, 0, 0, 0, 0, 1, 1],

    [1, 1, 0, 0, 0, 0, 0, 0,    0, 1, 0, 0, 0, 0, 0, 1,   1, 0, 0, 0, 0, 0, 0, 0,    1, 0, 0, 0, 1, 0, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0,    0, 0, 0, 0, 0, 0, 0, 0,   0, 0, 0, 0, 0, 0, 0, 0,    0, 0, 1, 0, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 1, 0, 0,    0, 0, 1, 0, 0, 0, 0, 0,   0, 0, 0, 0, 0, 1, 0, 0,    0, 0, 1, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0,    0, 0, 0, 0, 0, 0, 0, 0,   0, 0, 0, 0, 0, 0, 0, 0,    0, 0, 0, 1, 0, 0, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0,    0, 0, 0, 0, 0, 0, 0, 1,   1, 0, 0, 0, 0, 0, 0, 0,    1, 0, 0, 1, 0, 0, 0, 1],
    [1, 0, 0, 1, 1, 0, 0, 0,    0, 0, 0, 0, 0, 0, 0, 1,   1, 0, 0, 0, 0, 0, 0, 0,    0, 0, 1, 0, 0, 1, 0, 1],
    [1, 1, 0, 0, 0, 0, 0, 1,    1, 0, 0, 0, 0, 0, 0, 1,   1, 0, 0, 0, 0, 0, 0, 1,    1, 0, 0, 1, 0, 0, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1,    1, 1, 1, 1, 1, 1, 1, 1,   1, 1, 1, 1, 1, 1, 1, 1,    1, 1, 1, 1, 1, 1, 1, 1]
  ],
  enviornment: new Array(),
  initial_position: [225, 225],
  initial_normal: [1, 0],
  initial_entities: function initial_entities() {

    let pickaxe = new Item("pickaxe");
    pickaxe.setPosition(275, 275); 375, 475
    pickaxe.setCollectible(true);
    pickaxe.setDimensions(100, 100);
    pickaxe.setTexLocation(3, 4);
    pickaxe.updateTexCoords();
    pickaxe.setup();
    pickaxe.setObjectSize(0.5);
    pickaxe.setFloor(1.0);

    let pickaxe2 = new Item("pickaxe2");
    pickaxe2.setPosition(375, 475); 
    pickaxe2.setCollectible(true);
    pickaxe2.setDimensions(100, 100);
    pickaxe2.setTexLocation(3, 4);
    pickaxe2.updateTexCoords();
    pickaxe2.setup();
    pickaxe2.setObjectSize(0.5);
    pickaxe2.setFloor(1.0);

    let pickaxe3 = new Item("pickaxe3");
    pickaxe3.setPosition(425, 425);
    pickaxe3.setCollectible(true);
    pickaxe3.setDimensions(100, 100);
    pickaxe3.setTexLocation(3, 4);
    pickaxe3.updateTexCoords();
    pickaxe3.setup();
    pickaxe3.setObjectSize(0.5);
    pickaxe3.setFloor(1.0);

    let sausage = new Item("sausage");
    sausage.setPosition(1375, 425);
    sausage.setCollectible(true);
    sausage.setDimensions(250, 250);
    sausage.setTexLocation(4, 2);
    sausage.updateTexCoords();
    sausage.setup();
    sausage.setObjectSize(1);
    sausage.setFloor(1.0);

    let sean = new Character("sean");
    sean.setPosition(225, 875);
    sean.setDimensions(250, 150);
    sean.setMaxItems(10);
    sean.setTexLocation(0, 4);
    sean.updateTexCoords();
    sean.setup();
    sean.setObjectSize(1);
    sean.setFloor(0);

    let jared = new Character("jared");
    jared.setPosition(1375, 775);
    jared.setDimensions(250, 150);
    jared.setMaxItems(10);
    jared.setTexLocation(4, 3);
    jared.updateTexCoords();
    jared.setup();
    jared.setObjectSize(1);
    jared.setFloor(0);

    let ceiling = new Surrounding("ceiling");
    ceiling.setTexLocation(1, 0);
    ceiling.updateTexCoords(0, 0.5, 0, 0.5);
    ceiling.updateClipCoordsCeiling();
    ceiling.setup();

    let floor = new Surrounding("floor");
    floor.setTexLocation(2, 0);
    floor.updateTexCoords();
    floor.updateClipCoordsFloor();
    floor.setup();

  },

  initial_environment: function initial_environment() {
    // plank walls
    world.environment[0][2+8*0].setAllTextures(0, 5);
    world.environment[0][6+8*0].setAllTextures(0, 5);
    world.environment[0][1+8*1].setAllTextures(0, 5);
    world.environment[0][6+8*1].setAllTextures(0, 5);
    world.environment[0][1+8*2].setAllTextures(0, 5);
    world.environment[0][6+8*2].setAllTextures(0, 5);
    world.environment[0][1+8*3].setAllTextures(0, 5);
    world.environment[0][5+8*3].setAllTextures(0, 5);

    world.environment[31][2+8*0].setAllTextures(0, 5);
    world.environment[31][6+8*0].setAllTextures(0, 5);
    world.environment[31][1+8*1].setAllTextures(0, 5);
    world.environment[31][6+8*1].setAllTextures(0, 5);
    world.environment[31][1+8*2].setAllTextures(0, 5);
    world.environment[31][6+8*2].setAllTextures(0, 5);
    world.environment[31][1+8*3].setAllTextures(0, 5);
    world.environment[31][5+8*3].setAllTextures(0, 5);

    world.environment[2+8*0][0].setAllTextures(0, 5);
    world.environment[6+8*0][0].setAllTextures(0, 5);
    world.environment[1+8*1][0].setAllTextures(0, 5);
    world.environment[6+8*1][0].setAllTextures(0, 5);
    world.environment[1+8*2][0].setAllTextures(0, 5);
    world.environment[6+8*2][0].setAllTextures(0, 5);
    world.environment[1+8*3][0].setAllTextures(0, 5);
    world.environment[5 + 8 * 3][0].setAllTextures(0, 5);

    world.environment[2+8*0][31].setAllTextures(0, 5);
    world.environment[6+8*0][31].setAllTextures(0, 5);
    world.environment[1+8*1][31].setAllTextures(0, 5);
    world.environment[6+8*1][31].setAllTextures(0, 5);
    world.environment[1+8*2][31].setAllTextures(0, 5);
    world.environment[6+8*2][31].setAllTextures(0, 5);
    world.environment[1+8*3][31].setAllTextures(0, 5);
    world.environment[5+8*3][31].setAllTextures(0, 5);

    // brick walls
    world.environment[11][11].setAllTextures(0, 2);
    world.environment[11][12].setAllTextures(0, 2);
    world.environment[11][13].setAllTextures(0, 2);
    world.environment[11][14].setAllTextures(0, 2);
    world.environment[11][15].setAllTextures(0, 2);
    world.environment[11][16].setAllTextures(0, 2);
    world.environment[11][17].setAllTextures(0, 2);
    world.environment[11][18].setAllTextures(0, 2);
    world.environment[11][19].setAllTextures(0, 2);
    world.environment[11][20].setAllTextures(0, 2);

    world.environment[20][11].setAllTextures(0, 2);
    world.environment[20][12].setAllTextures(0, 2);
    world.environment[20][13].setAllTextures(0, 2);
    world.environment[20][14].setAllTextures(0, 2);
    world.environment[20][15].setAllTextures(0, 2);
    world.environment[20][16].setAllTextures(0, 2);
    world.environment[20][17].setAllTextures(0, 2);
    world.environment[20][18].setAllTextures(0, 2);
    world.environment[20][19].setAllTextures(0, 2);
    world.environment[20][20].setAllTextures(0, 2);

    world.environment[12][11].setAllTextures(0, 2);
    world.environment[13][11].setAllTextures(0, 2);
    world.environment[14][11].setAllTextures(0, 2);
    world.environment[15][11].setAllTextures(0, 2);
    world.environment[16][11].setAllTextures(0, 2);
    world.environment[17][11].setAllTextures(0, 2);
    world.environment[18][11].setAllTextures(0, 2);
    world.environment[19][11].setAllTextures(0, 2);

    world.environment[12][20].setAllTextures(0, 2);
    world.environment[13][20].setAllTextures(0, 2);
    world.environment[14][20].setAllTextures(0, 2);
    world.environment[15][20].setAllTextures(0, 2);
    world.environment[16][20].setAllTextures(0, 2);
    world.environment[17][20].setAllTextures(0, 2);
    world.environment[18][20].setAllTextures(0, 2);
    world.environment[19][20].setAllTextures(0, 2);

    // Fs
    world.environment[12][12].setAllTextures(3, 3);
    world.environment[12][13].setAllTextures(3, 3);
    world.environment[12][14].setAllTextures(3, 3);
    //world.environment[12][15].setAllTextures(5, 3);
    //world.environment[12][16].setAllTextures(5, 3);
    world.environment[12][17].setAllTextures(3, 3);
    world.environment[12][18].setAllTextures(3, 3);
    world.environment[12][19].setAllTextures(3, 3);
    world.environment[12][12].setVisualEffectScroll(0.005, 0);
    world.environment[12][13].setVisualEffectScroll(0.005, 0);
    world.environment[12][14].setVisualEffectScroll(0.005, 0);
    world.environment[12][17].setVisualEffectScroll(-0.005, 0);
    world.environment[12][18].setVisualEffectScroll(-0.005, 0);
    world.environment[12][19].setVisualEffectScroll(-0.005, 0);

    world.environment[19][12].setAllTextures(3, 3);
    world.environment[19][13].setAllTextures(3, 3);
    world.environment[19][14].setAllTextures(3, 3);
    //world.environment[19][15].setAllTextures(5, 3);
    //world.environment[19][16].setAllTextures(5, 3);
    world.environment[19][17].setAllTextures(3, 3);
    world.environment[19][18].setAllTextures(3, 3);
    world.environment[19][19].setAllTextures(3, 3);
    world.environment[19][12].setVisualEffectScroll(0.005, 0);
    world.environment[19][13].setVisualEffectScroll(0.005, 0);
    world.environment[19][14].setVisualEffectScroll(0.005, 0);
    world.environment[19][17].setVisualEffectScroll(-0.005, 0);
    world.environment[19][18].setVisualEffectScroll(-0.005, 0);
    world.environment[19][19].setVisualEffectScroll(-0.005, 0);

    world.environment[13][12].setAllTextures(3, 3);
    world.environment[14][12].setAllTextures(3, 3);
    world.environment[17][12].setAllTextures(3, 3);
    world.environment[18][12].setAllTextures(3, 3);
    world.environment[13][12].setVisualEffectScroll(0.005, 0);
    world.environment[14][12].setVisualEffectScroll(0.005, 0);
    world.environment[17][12].setVisualEffectScroll(-0.005, 0);
    world.environment[18][12].setVisualEffectScroll(-0.005, 0);

    world.environment[13][19].setAllTextures(3, 3);
    world.environment[14][19].setAllTextures(3, 3);
    world.environment[17][19].setAllTextures(3, 3);
    world.environment[18][19].setAllTextures(3, 3);
    world.environment[13][19].setVisualEffectScroll(0.005, 0);
    world.environment[14][19].setVisualEffectScroll(0.005, 0);
    world.environment[17][19].setVisualEffectScroll(-0.005, 0);
    world.environment[18][19].setVisualEffectScroll(-0.005, 0);

    // chess-a-ray
    world.environment[26][5].setAllTextures(3, 3);
    world.environment[26][5].setTextureEast(5, 0);
    //world.environment[26][5].setVisualEffectScroll(0.005, 0);

    // craft adn pumpkin
    world.environment[4][23].setAllTextures(2, 2);
    world.environment[4][23].setTextureEast(1, 2);
    world.environment[4][23].setTextureWest(1, 2);

    world.environment[7][25].setAllTextures(5, 2);
    world.environment[7][25].setVisualEffectScroll(0.001, 0);

    // furnaces 
    world.environment[0][5 + 8 * 2].setAllTextures(3, 2);
    world.environment[0][2 + 8 * 3].setAllTextures(3, 2);
    world.environment[0][4 + 8 * 3].setAllTextures(3, 2);
    world.environment[5 + 8 *0][31].setAllTextures(3, 2);
    world.environment[2 + 8 *1][31].setAllTextures(3, 2);

    // bigtop truck
    world.environment[23][9].setTextureNorth(4, 0);
    world.environment[23][9].setTextureWest(3, 1);
    world.environment[23][9].setTextureEast(1, 1);
    world.environment[24][9].setTextureEast(2, 1);
    world.environment[24][9].setTextureSouth(0, 1);
    world.environment[24][9].setTextureWest(4, 1);

    world.environment[29][3].setTextureWest(4, 0);
    world.environment[29][3].setTextureSouth(3, 1);
    world.environment[29][3].setTextureNorth(1, 1);
    world.environment[29][4].setTextureNorth(2, 1);
    world.environment[29][4].setTextureEast(0, 1);
    world.environment[29][4].setTextureSouth(4, 1);

    // space background
    world.environment[8][9].setAllTextures(2, 4);
    world.environment[10][7].setTextureEast(1, 3);
    world.environment[9][7].setTextureNorth(1, 3);
    world.environment[9][7].setTextureWest(0, 3);

    // undertale castle
    world.environment[15][11].setTextureWest(1, 5);
    world.environment[16][11].setTextureWest(2, 5);
    world.environment[15][11].setTextureEast(2, 5);
    world.environment[16][11].setTextureEast(1, 5);


    world.environment[15][20].setTextureWest(1, 5);
    world.environment[16][20].setTextureWest(2, 5);
    world.environment[15][20].setTextureEast(2, 5);
    world.environment[16][20].setTextureEast(1, 5);

    // hmc
    world.environment[26][21].setTextureEast(4, 4);

    // jj leaves
    world.environment[24][24].setAllTextures(5, 1);
    world.environment[24][28].setAllTextures(5, 1);
    world.environment[24][30].setAllTextures(5, 1);
    world.environment[24][24].setVisualEffectScroll(0.001, 0);
    world.environment[24][28].setVisualEffectScroll(0.01, 0);
    world.environment[24][30].setVisualEffectScroll(-0.005, 0);

    world.environment[25][26].setAllTextures(5, 1);
    world.environment[25][29].setAllTextures(5, 1);
    world.environment[25][26].setVisualEffectScroll(0.02, 0);

    world.environment[26][26].setAllTextures(5, 1);

    world.environment[26][31].setAllTextures(5, 1);
    world.environment[26][26].setVisualEffectScroll(-0.008, 0);
    world.environment[26][31].setVisualEffectScroll(0.004, 0);

    world.environment[27][27].setAllTextures(5, 1);
    world.environment[27][30].setAllTextures(5, 1);
    world.environment[27][27].setVisualEffectScroll(0.002, 0);

    world.environment[28][24].setAllTextures(5, 1);
    world.environment[28][27].setAllTextures(5, 1);
    world.environment[28][27].setVisualEffectScroll(-0.01, 0);

    world.environment[29][26].setAllTextures(5, 1);
    world.environment[29][29].setAllTextures(5, 1);
    world.environment[29][26].setVisualEffectScroll(0.002, 0);
    world.environment[29][29].setVisualEffectScroll(0.008, 0);

    world.environment[30][24].setAllTextures(5, 1);
    world.environment[30][27].setAllTextures(5, 1);
    world.environment[30][30].setAllTextures(5, 1);
    world.environment[30][24].setVisualEffectScroll(-0.013, 0);
    world.environment[30][27].setVisualEffectScroll(0.0011, 0);

    world.environment[31][24].setAllTextures(5, 1);
    world.environment[31][27].setAllTextures(5, 1);
    world.environment[31][24].setVisualEffectScroll(0.024, 0);
    world.environment[31][27].setVisualEffectScroll(-0.0015, 0);

    // stripe
    world.environment[15][17].setAllTextures(5, 3);
    world.environment[16][14].setAllTextures(5, 3);
    world.environment[15][17].setVisualEffectScroll(0.024, 0);
    world.environment[16][14].setVisualEffectScroll(-0.024, 0);

    world.environment[0][1].alpha = 0.5;
  }
};