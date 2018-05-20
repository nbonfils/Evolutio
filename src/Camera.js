import * as PIXI from 'pixi.js';

/**
 * A class to represent the camera, moving the camera will move
 * the world behind it.
 * We create one camera by world.
 */
export default class Camera extends PIXI.Container {
  /**
   * Constructs the camera for the specific world
   *
   * @constructor
   * @param {PIXI.Container} world on which the camera looks
   * @param {Int} width is the width of the screen
   * @param {Int} height is the height of the screen
   */
  constructor(world, width, height) {
    super();

    // Init the members
    this.world = world;
    this.ticker = new PIXI.ticker.Ticker();
    this.followFunc = undefined;
    this.cameraX = 0;
    this.cameraY = 0;

    this.on('added', () => {
      this._width = width;
      this._height = height;
    });

    // Sync the camera pos with the world
    this.ticker.add(() => {
      this.world.x = -this.cameraX + (this._width / 2);
      this.world.y = -this.cameraY + (this._height / 2);
    });

    // Bind the functions
    this.follow = this.follow.bind(this);
    this.unfollow = this.unfollow.bind(this);

    // Handle the ticker
    this.ticker.start();
  }

  /**
   * Make the cam follow the entity
   *
   * @param {PIXI.DisplayObject} entity the cam will follow
   */
  follow(entity) {
    this.followFunc = () => {
      this.cameraX = entity.x;
      this.cameraY = entity.y;
    };

    this.ticker.add(this.followFunc);
  }

  /**
   * Make the camera stop following what it was following
   */
  unfollow() {
    this.ticker.remove(this.followFunc);
  }
}
