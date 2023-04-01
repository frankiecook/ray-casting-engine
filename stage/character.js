/*
CHARACTER
Refactor Date: 12/07/2022

Description:
Characters cover players, NPCs, and Enemies

Data

*/

// class syntax helps simplify method construction
class Character extends Drawn {
  constructor(name) {
    // Check that the right amount of arguments are provided
    if (arguments.length != 1) {
      throw new Error ("Argument length of " + arguments.length + " is wrong, expected 1.");
    }

    // check if abstract class
    /*if (this.constructor == Entity) {
      throw new Error ("Abstract classes can't be instantiated.");
    }*/

    super(name),
    this.health,
    this.velocity,
    this.inventory,
    this.maxItems
  }

  setup() {
    this.health = 10;
    this.color = "yellow";
    this.setRadius(5);
    world.addCharacter(this);
    this.setObjectSize(1.0);
  }

  /** SET **/
  // check health for an integer using a built in function for checking integers
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger
  setHealth(health) {
    if (Number.isInteger(health)) {
      this.health = health;
    } else {
      throw new Error (this.name + " health not an integer");
    }
  }

  setVelocity(v) {
    if (typeof v === 'number') {
      this.velocity = v;
    } else {
      throw new Error (this.name + " velocity not a number");
    }
  }

  setInventoryLength(length) {
    if (Number.isInteger(length)) {
      this.inventory = new Array(length);
    } else {
      throw new Error (this.name + " inventory length not an integer");
    }
  }

  setMaxItems(num) {
    if (Number.isInteger(num)) {
      this.maxItems = num;
    } else {
      throw new Error (this.name + " maxItems not an integer");
    }
  }

  /** GET **/
  getHealth() {
    return this.health
  }

  getVelocity() {
    return this.velocity
  }

  getInventory() {
    return this.inventory
  }

  getMaxItems() {
    return this.maxItems
  }

  /** OTHER **/
  addItem(item) {
    if (!Array.isArray(this.inventory)) {
      throw new Error (this.name + " inventory not set");
    } else {

      // check if inventory is full
      if (this.inventory.length < this.getMaxItems()) {
        this.inventory.push(item);
        //console.log(item.name + " added to " + this.name + " inventory");
      }
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
  }

  
}
