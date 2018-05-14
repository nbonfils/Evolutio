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
    this.move = this.move.bind(this);

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
    this.x += this.speedX;
    this.y += this.speedY;
  }
}
