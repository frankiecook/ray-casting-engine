/*
ENTITY CLASS
Refactor Date: 18/07/2022

Description:
An entity is the most overhead of all objects in the game
Any instantiated object will branch from entity

Data
name: name of object - str
*/

// class syntax helps simplify method construction
class Entity {
  constructor(name) {
    // Check that the right amount of arguments are provided
    if (arguments.length != 1) {
      throw new Error ("Argument length of " + arguments.length + " is wrong, expected 1.");
    }

    // check if abstract class
    if (this.constructor == Entity) {
      throw new Error ("Abstract classes can't be instantiated.");
    }

    this.name = name,
    this.type
  }

  /** SET **/
  setName(name) {
    if (typeof name !== "string") {
      toString(name);
      throw new Error ("Name for " + this.name + " was not a string, but has been converted.")
    }

    this.name = name;
  }

  setType(type) {
    if (typeof type !== "string") {
      toString(type);
      throw new Error ("Type for " + this.name + " was not a string, but has been converted.")
    }

    this.type = type;
  }

  /** GET **/
  getName() {
    return this.name;
  }

  getType() {
    return this.type;
  }
}

