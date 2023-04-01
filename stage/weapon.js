/*
Weapon Class

*/

class Weapon extends Entity {
  constructor(name) {
    super(name),
      this.power,
      this.ammo,
      this.owner,
      this.position,
      this.cooldown,
      this.cooldown_default
  }

  /** SET **/
  setPower(int) {
    if (Number.isInteger(int)) {
      this.power == int;
    } else {
      throw new Error(this.name + " power not an integer");
    }
  }

  setAmmo(int) {
    if (Number.isInteger(int)) {
      this.ammo == int;
    } else {
      throw new Error(this.name + " ammo not an integer");
    }
  }

  setOwner(char) {
    this.owner = char;
    console.log("Owner is " + char.name);
  }

  setPosition(x, y) {
    if (Number.isInteger(x) && Number.isInteger(y)) {
      this.position = createVector(x, y);
    } else {
      throw new Error(this.name + " position not an integer");
    }
  }

  setCooldown(int) {
    if (Number.isInteger(int)) {
      this.cooldown == int;
    } else {
      throw new Error(this.name + " cooldown not an integer");
    }
  }

  setCooldownDefault(int) {
    if (Number.isInteger(int)) {
      this.cooldown_default == int;
    } else {
      throw new Error(this.name + " cooldown default not an integer");
    }
  }

  /** GET **/
  getPower() {
    return this.power;
  }

  getAmmo() {
    return this.ammo;
  }

  getOwner() {
    return this.owner;
  }

  getPosition() {
    return this.position;
  }

  getCooldown() {
    return this.cooldown;
  }

  getCooldownDefault() {
    return this.cooldown_default;
  }

  /** SETUP **/
  setup() {
    // turn off cooldown
    this.cooldown = 0;
  }

  /** **/
  update() {
    // lower cooldown
    if (this.cooldown > 0) {
      this.cooldown -= 1;
    }
  }

  fire() {
    if (this.cooldown < 1 && this.ammo > 0) {
      // start cooldown 
      this.cooldown = this.cooldown_default;

      // create a new bullet
      let bullet = new Bullet("obliviate", this);

      // decrease ammo
      this.ammo -= 1;
    } else {
      this.cooldown -= 1;
    }
  }
}