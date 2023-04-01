/*
RAY
A class for defining rays

position: the end point of a ray in world coordinates
normal: direction of the ray
origin: world position that the ray was cast from
*/

class Wall {
  constructor() {
    this.location,

    this.texture_north,
    this.texture_south,
    this.texture_west,
    this.texture_east,

    this.visualEffect = createVector(0, 0),
    this.visualEffectScroll = createVector(0,0)

  }

  setLocation(x, y) {
    this.location = createVector(x, y);
  }

  setTextureNorth(x, y) {
    this.texture_north = createVector(x, y);
  }
  setTextureSouth(x, y) {
    this.texture_south = createVector(x, y);
  }
  setTextureWest(x, y) {
    this.texture_west = createVector(x, y);
  }
  setTextureEast(x, y) {
    this.texture_east = createVector(x, y);
  }

  setAllTextures(x, y) {
    this.setTextureNorth(x, y);
    this.setTextureSouth(x, y);
    this.setTextureWest(x, y);
    this.setTextureEast(x, y);
  }

  setVisualEffect(x, y) {
    this.visualEffect.x = x;
    this.visualEffect.y = y;
  }

  setVisualEffectScroll(x, y) {
    this.visualEffectScroll.x = x;
    this.visualEffectScroll.y = y;
  }

  getTextureLocation() {
    return this.textureLocation
  }

  getTextureNorth() {
    return this.texture_north
  }

  getTextureSouth() {
    return this.texture_south
  }

  getTextureWest() {
    return this.texture_west
  }

  getTextureEast() {
    return this.texture_east
  }

  getVisualEffectScroll() {
    return this.visualEffectScroll
  }

  updateVisualEffectScroll(x, y) {
    let scroll_x = this.visualEffect.x + this.visualEffectScroll.x;
    let scroll_y = this.visualEffect.y + this.visualEffectScroll.y;

    if (scroll_x > 1) {scroll_x -= 1;}
    if (scroll_x < 0) {scroll_x += 1;}
    if (scroll_y > 1) {scroll_y -= 1;}
    if (scroll_y < 0.00000001) {scroll_y += 1;}

    this.setVisualEffect(scroll_x, scroll_y);
  }
}
