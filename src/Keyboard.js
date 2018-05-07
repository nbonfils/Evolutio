/**
 * A class representing a certain key based on its keycode.
 * It has 2 undefined method that needs to be implemented
 * - Key.press
 * - Key.release
 */
export default class Key {
  /**
   * Construct a Key based on its keycode
   * @constructor
   * @param {Int} keyCode is the code of the key
   */
  constructor(keyCode) {
    this.code = keyCode;
    this.isDown = false;
    this.isUp = true;

    this.downHandler = (event) => {
      if (event.keyCode == this.code) {
        if (this.isUp && this.press) this.press();
        this.isDown = true;
        this.isUp = false;
      }
      event.preventDefault();
    };

    this.upHandler = (event) => {
      if (event.keyCode == this.code) {
        if (this.isDown && this.release) this.release();
        this.isDown = false;
        this.isUp = true;
      }
      event.preventDefault();
    };

    window.addEventListener(
      'keydown', this.downHandler.bind(this), false
    );

    window.addEventListener(
      'keyup', this.upHandler.bind(this), false
    );
  }

  /**
   * Execute this method when key is pressed
   *
   * Needs to overwrite this method
   */
  press() {
  }

  /**
   * Execute this method when key is relesed
   *
   * Needs to overwrite this method
   */
  release() {
  }

  /**
   * Clear the bindings for this key
   */
  clear() {
    this.press = null;
    this.release = null;
  }
}
