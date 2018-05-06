import './style.css';
import Fonts from './fonts.css';
import {newText} from './utils';
import * as PIXI from 'pixi.js';

import StartScreen from './assets/startScreen.png';

const app = new PIXI.Application({
  width: 960,
  height: 540,
});
document.body.appendChild(app.view);

// load the custom fonts before initializing the game
WebFont.load({
  custom: {
    families: ['acherus_grotesqueregular'],
    urls: [Fonts],
  },
  active: () => init(),
});

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
  const startScreenTitle = newText(
    'eVOLUTIO',
    50,
    true,
    app.ticker
  );

  // center the title
  startScreenTitle.position.set(
    app.renderer.width / 2,
    app.renderer.height / 6
  );

  app.stage.addChild(startScreenTitle);


  // "Press a key to start" text
  const keyToStartContainer = newText(
    'press a key to start',
    40,
    true,
    app.ticker
  );

  keyToStartContainer.position.set(
    app.renderer.width / 2,
    app.renderer.height - (app.renderer.height / 6)
  );

  app.stage.addChild(keyToStartContainer);


  // start the game once a click or a key is pressed
  let start = (e) => {
    window.removeEventListener('keydown', start);
    app.view.removeEventListener('mousedown', start);

    app.stage.removeChild(keyToStartContainer);

    menu();
  };

  window.addEventListener(
    'keydown', start
  );
  app.view.addEventListener(
    'mousedown', start
  );
}

/**
 * Main menu of the game
 *
 * here the player can chose to start a new game, load, settings, etc..
 */
function menu() {

}

/**
 * Main game loop function
 *
 * @param {Int} delta is the fractional lag between 2 frames
 */
// function gameLoop(delta) {
// };
