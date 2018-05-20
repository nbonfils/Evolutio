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

    // Bind the functions
    this.setX = this.setX.bind(this);
    this.setY = this.setY.bind(this);
    this.setPos = this.setPos.bind(this);
    this.follow = this.follow.bind(this);
    this.unfollow = this.unfollow.bind(this);

    // Handle the ticker
    this.ticker.start();
  }

  /**
   * Set the camera X pos
   *
   * @param {Int} x is the X pos in the world
   */
  setX(x) {
    this.cameraX = x;
    this.world.x = -this.cameraX + (this._width / 2);
  }

  /**
   * Set the camera Y pos
   *
   * @param {Int} y is the Y pos in the world
   */
  setY(y) {
    this.cameraY = y;
    this.world.y = -this.cameraY + (this._height / 2);
  }

  /**
   * Set the pos of the camera in the world
   *
   * @param {Int} x is the X pos in the world
   * @param {Int} y is the Y pos in the world
   */
  setPos(x, y) {
    this.setX(x);
    this.setY(y);
  }

  /**
   * Make the cam follow the entity
   *
   * @param {PIXI.DisplayObject} entity the cam will follow
   * @param {Int} latency is the latency before the cam follows
   */
  follow(entity, latency) {
    this.followFunc = () => {
      // Clojure to keep the entity pos at that time
      window.setTimeout(((x, y) => () => {
        this.setPos(x, y);
      })(entity.x, entity.y), latency);
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
