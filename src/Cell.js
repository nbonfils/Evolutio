import * as PIXI from 'pixi.js';

/**
 * A class to represent the main character
 * a cell
 */
export default class Cell extends PIXI.Container {
  /**
   * Construct a cell based on 2 textures
   * @constructor
   * @param {PIXI.Texture} cellText is the texture of the cell
   * @param {PIXI.Texture} coreText is the texture of the core
   */
  constructor(cellText, coreText) {
    super();

    // Init the members
    this.cellSprite = new PIXI.Sprite(cellText);
    this.coreSprite = new PIXI.Sprite(coreText);
    this.ticker = new PIXI.ticker.Ticker();
    this.maxSpeed = 5;
    this.speedX = 0;
    this.speedY = 0;
    this.accX = 0;
    this.accY = 0;
    this.acceleratingX = false;
    this.acceleratingY = false;
    this.deceleratingX = false;
    this.deceleratingY = false;

    // Bind the functions
    this.destroy = this.destroy.bind(this);
    this.move = this.move.bind(this);
    this.controlAcc = this.controlAcc.bind(this);
    this.controlDec = this.controlDec.bind(this);
    this.leftAcc = this.leftAcc.bind(this);
    this.leftDec = this.leftDec.bind(this);
    this.rightAcc = this.rightAcc.bind(this);
    this.rightDec = this.rightDec.bind(this);
    this.upAcc = this.upAcc.bind(this);
    this.upDec = this.upDec.bind(this);
    this.downAcc = this.downAcc.bind(this);
    this.downDec = this.downDec.bind(this);


    this.cellSprite.anchor.set(0.5, 0.5);
    this.coreSprite.anchor.set(0.5, 0.5);

    // Add the Sprites to the container
    this.addChild(this.cellSprite);
    this.addChild(this.coreSprite);

    // The animations
    this.ticker.start();
    this.ticker.add(this.move);
    this.ticker.add(this.controlAcc);
    this.ticker.add(this.controlDec);
  }

  /**
   * Destroys the cell along with all the internal refenrences
   */
  destroy() {
    this.cellSprite.destroy();
    this.coreSprite.destroy();
    this.ticker.destroy();
    super.destroy();
  }

  /**
   * Update the position of the cell each tick
   */
  move() {
    this.speedX += this.accX;
    this.speedY += this.accY;
    this.x += this.speedX;
    this.y += this.speedY;
  }

  /**
   * Controls the acceleration
   */
  controlAcc() {
    if (this.acceleratingX && Math.abs(this.speedX) >= this.maxSpeed) {
      this.acceleratingX = false;
      this.accX = 0;
      this.speedX = (this.speedX > 0 ? this.maxSpeed : -this.maxSpeed);
    }
    if (this.acceleratingY && Math.abs(this.speedY) >= this.maxSpeed) {
      this.acceleratingY = false;
      this.accY = 0;
      this.speedY = (this.speedY > 0 ? this.maxSpeed : -this.maxSpeed);
    }
  }


  /**
   * Controls the deceleration
   */
  controlDec() {
    if (this.deceleratingX && Math.abs(this.speedX) <= 0.3) {
      this.deceleratingX = false;
      this.accX = 0;
      this.speedX = 0;
    }
    if (this.deceleratingY && Math.abs(this.speedY) <= 0.3) {
      this.deceleratingY = false;
      this.accY = 0;
      this.speedY = 0;
    }
  }


  /**
   * Left movement with smooth acceleration
   */
  leftAcc() {
    this.acceleratingX = true;
    this.deceleratingX = false;
    this.accX = -0.25;
  }

  /**
   * Decelerate when left is released
   */
  leftDec() {
    this.acceleratingX = false;
    this.deceleratingX = true;
    this.accX = Math.sign(this.speedX) * -0.1;
  }

  /**
   * Right movement with smooth acceleration
   */
  rightAcc() {
    this.acceleratingX = true;
    this.deceleratingX = false;
    this.accX = 0.25;
  }

  /**
   * Decelerate when right is released
   */
  rightDec() {
    this.acceleratingX = false;
    this.deceleratingX = true;
    this.accX = Math.sign(this.speedX) * -0.1;
  }

  /**
   * Up movement with smooth acceleration
   */
  upAcc() {
    this.acceleratingY = true;
    this.deceleratingY = false;
    this.accY = -0.25;
  }

  /**
   * Decelerate when up is released
   */
  upDec() {
    this.acceleratingY = false;
    this.deceleratingY = true;
    this.accY = Math.sign(this.speedY) * -0.1;
  }

  /**
   * Down movement with smooth acceleration
   */
  downAcc() {
    this.acceleratingY = true;
    this.deceleratingY = false;
    this.accY = 0.25;
  }

  /**
   * decelerate when down is released
   */
  downDec() {
    this.acceleratingY = false;
    this.deceleratingY = true;
    this.accY = Math.sign(this.speedY) * -0.1;
  }
}
