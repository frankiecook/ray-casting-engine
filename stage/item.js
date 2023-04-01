/*
ITEM
Refactor Date: 14/07/2022

Description:
Items only deal with objects in the world that are collectable or decoration

Data

*/

// class syntax helps simplify method construction
class Item extends Drawn {
  constructor(name) {
    // Check that the right amount of arguments are provided
    if (arguments.length != 1) {
      throw new Error ("Argument length of " + arguments.length + " is wrong, expected 1.");
    }

    super(name),  // super method refers to the parent class that calls the parent's constructor
    this.isCollectible
  }

  setup() {
    this.setRadius(5);
    this.setColor("orange");
    world.addItem(this);
  }

  /** SET **/
  setCollectible(bool) {
    if (typeof bool === 'boolean') {
      this.isCollectible = bool;
    } else {
      throw new Error (this.name + " non boolean value given");
    }
  }

  /** GET **/
  getCollectible() {
    return this.isCollectible
  }
}
