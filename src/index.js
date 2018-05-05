import './style.css';
import * as PIXI from 'pixi.js';

import StartScreen from './assets/startScreen.png';

const app = new PIXI.Application({
  width: 960,
  height: 540,
});
document.body.appendChild(app.view);

// glowing effect for a text
const glowingEffect = (text, count) => () => {
  count += 0.03;

  let alpha = Math.sin(count);

  text.alpha = (alpha + 1) / 2;
};

/**
 * Initialize the game
 */
function init() {
  // load the starting screen background
  const background = PIXI.Sprite.fromImage(StartScreen);

  background.width = app.screen.width;
  background.height = app.screen.height;

  app.stage.addChild(background);


  // the title text
  const startScreenTitle = new PIXI.Container();
  const startScreenText = new PIXI.Text('eVOLUTIO', {
    fontFamily: 'acherus_grotesqueregular',
    fontSize: 50,
    fill: 'white',
  });
  const startScreenBlured = new PIXI.Text('eVOLUTIO', {
    fontFamily: 'acherus_grotesqueregular',
    fontSize: 50,
    fill: 0xd7f4e3,
  });

  app.ticker.add(glowingEffect(startScreenBlured, 0));

  // apply blur to one of the text occurence
  const blurFilter = new PIXI.filters.BlurFilter();
  startScreenBlured.filters = [blurFilter];

  startScreenTitle.addChild(startScreenText);
  startScreenTitle.addChild(startScreenBlured);

  // center the title
  startScreenTitle.pivot.set(
    startScreenTitle.width / 2,
    startScreenTitle.height / 2
  );
  startScreenTitle.position.set(
    app.renderer.width / 2,
    app.renderer.height / 6
  );

  app.stage.addChild(startScreenTitle);


  // "Press a key to start" text
  const keyToStartContainer = new PIXI.Container();
  const keyToStartText = new PIXI.Text('Press a key to start', {
    fontFamily: 'acherus_grotesqueregular',
    fontSize: 40,
    fill: 'white',
  });
  const keyToStartBlurred = new PIXI.Text('Press a key to start', {
    fontFamily: 'acherus_grotesqueregular',
    fontSize: 40,
    fill: 0xd7f4e3,
  });

  app.ticker.add(glowingEffect(keyToStartBlurred, 0));

  // apply blur to one of the text occurence
  keyToStartBlurred.filters = [blurFilter];

  keyToStartContainer.addChild(keyToStartText);
  keyToStartContainer.addChild(keyToStartBlurred);

  // center the text
  keyToStartContainer.pivot.set(
    keyToStartContainer.width / 2,
    keyToStartContainer.height / 2
  );
  keyToStartContainer.position.set(
    app.renderer.width / 2,
    app.renderer.height - (app.renderer.height / 6)
  );

  app.stage.addChild(keyToStartContainer);


  // main game loop
  app.ticker.add((delta) => gameLoop(delta));
}

/**
 * Main game loop function
 *
 * @param {Int} delta is the fractional lag between 2 frames
 */
function gameLoop(delta) {
};

init();
