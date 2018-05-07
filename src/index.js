import * as PIXI from 'pixi.js';

import './style.css';
import Fonts from './fonts.css';
import Key from './Keyboard.js';
import {newText, newMenuItem} from './utils';

import StartScreen from './assets/startScreen.png';

const app = new PIXI.Application({
  width: 960,
  height: 540,
});
document.body.appendChild(app.view);

// Load the custom fonts before initializing the game
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
  // Load the starting screen background
  const background = PIXI.Sprite.fromImage(StartScreen);

  background.width = app.screen.width;
  background.height = app.screen.height;

  app.stage.addChild(background);


  // The title text
  const startScreenTitle = newText(
    'eVOLUTIO',
    50,
    true,
    app.ticker
  );

  // Center the title
  startScreenTitle.position.set(
    app.renderer.width / 2,
    app.renderer.height / 6
  );

  app.stage.addChild(startScreenTitle);


  // "Press a key to start" text
  const keyToStartText = newText(
    'press a key to start',
    40,
    true,
    app.ticker
  );

  keyToStartText.position.set(
    app.renderer.width / 2,
    app.renderer.height - (app.renderer.height / 6)
  );

  app.stage.addChild(keyToStartText);


  // Start the game once a click or a key is pressed
  let startMenu = (e) => {
    window.removeEventListener('keydown', startMenu);
    app.view.removeEventListener('mousedown', startMenu);

    keyToStartText.removeGlow();
    app.stage.removeChild(keyToStartText);
    keyToStartText.destroy();

    menu();
  };

  window.addEventListener(
    'keydown', startMenu
  );
  app.view.addEventListener(
    'mousedown', startMenu
  );
}

/**
 * Main menu of the game
 *
 * here the player can chose to start a new game, load, settings, etc..
 */
function menu() {
  // Create the items of the menu
  const newGameText = newMenuItem(
    'New Game',
    40,
    app.ticker,
    () => console.log('launch game')
  );
  const loadGameText = newMenuItem(
    'Load Game',
    40,
    app.ticker,
    () => console.log('load game')
  );
  const settingsText = newMenuItem(
    'Settings',
    40,
    app.ticker,
    () => console.log('launch settings')
  );
  const exitText = newMenuItem(
    'Exit',
    40,
    app.ticker,
    () => {
      for (let item of menuList) {
        item.removeGlow();
        item.getChildAt(0).destroy();
        item.getChildAt(0).destroy();
        item.destroy();
      }
      menuList = null;
      upKey.clear();
      wKey.clear();
      sKey.clear();
      downKey.clear();
      enterKey.clear();
      init();
    }
  );


  // Initialize the menu item list with the item state
  let selected = 0;
  let menuList = [
    newGameText,
    loadGameText,
    settingsText,
    exitText,
  ];

  menuList[0].select();
  menuList[1].disable();
  menuList[2].neutral();
  menuList[3].neutral();


  // Set up the interaction within the menu
  const upMenu = (menuList) => () => {
    menuList[selected].neutral();

    do {
      const len = menuList.length;
      selected = (((selected - 1) % len) + len) % len;
    } while (menuList[selected].state == 2);


    menuList[selected].select();
  };

  const downMenu = (menuList) => () => {
    menuList[selected].neutral();

    do {
      selected = (selected + 1) % menuList.length;
    } while (menuList[selected].state == 2);

    menuList[selected].select();
  };

  const confirmMenu = (menuList) => () => {
    for (let item of menuList) {
      item.click();
    }
  };

  const upKey = new Key(38);
  const wKey = new Key(87);
  const downKey = new Key(40);
  const sKey = new Key(83);
  const enterKey = new Key(13);

  upKey.press = upMenu(menuList);
  wKey.press = upMenu(menuList);
  downKey.press = downMenu(menuList);
  sKey.press = downMenu(menuList);
  enterKey.press = confirmMenu(menuList);


  // Position the items on the screen
  let x = 100;
  let y = app.renderer.height / 5;
  let step = 50;
  for (let item of menuList) {
    item.position.set(x, y);
    app.stage.addChild(item);
    y += step;
  }
}

/**
 * Main game loop function
 *
 * @param {Int} delta is the fractional lag between 2 frames
 */
// function gameLoop(delta) {
// };
