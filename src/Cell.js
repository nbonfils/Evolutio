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
   * @param {PIXI.Ticker} ticker is the ticker which we'll use
   *                      to animate our cell
   */
  constructor(cellText, coreText, ticker) {
    super();

    // Init the members
    this.cellSprite = new PIXI.Sprite(cellText);
    this.coreSprite = new PIXI.Sprite(coreText);
    this.ticker = new PIXI.ticker.Ticker();
    this.speedX = 0;
    this.speedY = 0;
    this.accX = 0;
    this.accY = 0;

    // Bind the functions
    this.destroy = this.destroy.bind(this);
    this.move = this.move.bind(this);
    this.leftAcc = this.leftAcc.bind(this);
    this.leftDec = this.leftDec.bind(this);

    this.cellSprite.anchor.set(0.5, 0.5);
    this.coreSprite.anchor.set(0.5, 0.5);

    // Add the Sprites to the container
    this.addChild(this.cellSprite);
    this.addChild(this.coreSprite);

    // The animations
    this.ticker.start();
    this.ticker.add(this.move);
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
   * Left movement with smooth acceleration
   */
  leftAcc() {
    console.log(this.speedX);
    if (this.speedX <= -5) {
      this.accX = 0;
      this.speedX = 5;
    } else {
      this.accX = -0.25;
    }
  }

  /**
   * decelerate when left is released
   */
  leftDec() {
    if (this.speed >= 0) {
      this.accX = 0;
    } else {
      this.accX = 0.1;
    }
  }
}
