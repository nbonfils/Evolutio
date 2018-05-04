import './style.css';
import * as PIXI from 'pixi.js';

import StartScreen from './assets/startScreen.png';

const app = new PIXI.Application({
  width: 1078,
  height: 728,
});
document.body.appendChild(app.view);

/**
 * Initialize the game
 */
function init() {
  // add functions to the ticker
  app.ticker.add((delta) => gameLoop(delta));


  // load the starting screen background
  const background = PIXI.Sprite.fromImage(StartScreen);

  background.width = app.screen.width;
  background.height = app.screen.height;

  app.stage.addChild(background);


  // the title of the game
  const startScreenTitle = new PIXI.Container();
  const text = new PIXI.Text('eVOLUTIO', {
    fontFamily: 'acherus_grotesqueregular',
    fontSize: 50,
    fill: 'white',
  });
  const blured = new PIXI.Text('eVOLUTIO', {
    fontFamily: 'acherus_grotesqueregular',
    fontSize: 50,
    fill: 0xd7f4e3,
  });
  const blurFilter = new PIXI.filters.BlurFilter();

  // make the blur "glow"
  let count = 0;
  app.ticker.add(() => {
    count += 0.03;

    let alpha = Math.sin(count);

    blured.alpha = (alpha + 1) / 2;
  });

  blured.filters = [blurFilter];

  startScreenTitle.addChild(text);
  startScreenTitle.addChild(blured);

  startScreenTitle.pivot.set(
    startScreenTitle.width / 2,
    startScreenTitle.height / 2
  );
  startScreenTitle.position.set(
    app.renderer.width / 2,
    app.renderer.height / 4
  );

  app.stage.addChild(startScreenTitle);
}

/**
 * Main game loop function
 *
 * @param {Int} delta is the fractional lag between 2 frames
 */
function gameLoop(delta) {
};

init();
