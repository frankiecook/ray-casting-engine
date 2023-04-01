class Utils {
  /*** MAGNITUDE ***/
  static setMagnitude(mag) {
    if (typeof mag === 'number') {
      this.magnitude = mag;
    } else {
      throw new Error (this.name + " magnitude not a number");
    }
  }

  static getMagnitude() {
    return this.magnitude
  }

  /*** INVENTORY ***/
  /*static setInventoryLength(length) {
    if (Number.isInteger(length)) {
      this.inventory = new Array(length);
    } else {
      throw new Error (this.name + " inventory length not an integer");
    }
  }

  static addItem(item) {
    if (!Array.isArray(this.inventory)) {
      throw new Error (this.name + " inventory not set");
    } else {
      this.inventory.push(item);
      console.log(item.name + " added to " + this.name + " inventory");
    }
  }

  static delItem(item) {
    for (var i=0; i<this.inventory.length; i++) {
      if (this.inventory[i] != null || undefined) {
        if (this.inventory[i].name == item.name) {
          console.log(this.inventory[i].name + " deleted from " + this.name);
          this.inventory[i].position = (-1, -1);
          this.inventory[i] = undefined;
          break;
        }
      } else if (i == this.inventory.length) {
        throw new Error (this.name + " item to delete not found");
      }
    }
  }*/
}
