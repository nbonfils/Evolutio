import * as PIXI from 'pixi.js';

import './style.css';
import Fonts from './fonts.css';
import Key from './Keyboard.js';
import {newText, newMenuItem} from './utils';

// game ressources
import StartScreen from './assets/startScreen.png';
import GameBackground from './assets/plain.png';
import CellImg from './assets/Cell.png';
import CoreImg from './assets/Core.png';

// Some shortcuts
const presources = PIXI.loader.resources;

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


  // When game is loading assets
  const loading = (loader, ressource) => {
    console.log('loading: ' + loader.progress + '%');
  };


  // When game is ready
  const ready = () => {
    // "Press a key to start" text
    const keyToStart = newMenuItem(
      'press a key to start',
      40,
      app.ticker,
      () => {
        window.removeEventListener('keydown', start);
        app.view.removeEventListener('mousedown', start);

        keyToStart.removeEffects();
        keyToStart.destroy();

        menu();
      }
    );
    keyToStart.select();
    keyToStart.buttonMode = false;

    keyToStart.position.set(
      app.renderer.width / 2,
      app.renderer.height - (app.renderer.height / 6)
    );

    app.stage.addChild(keyToStart);

    // Start the game once a click or a key is pressed
    const start = (e) => {
      keyToStart.clickItem();
    };

    window.addEventListener(
      'keydown', start
    );
    app.view.addEventListener(
      'mousedown', start
    );
  };


  // Load all the assets for the game before launching
  PIXI.loader
    .add([
      GameBackground,
      CellImg,
      CoreImg,
    ])
    .on('progress', loading)
    .load(ready);
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
    () => {
      console.log('launch game');
      // clear the menu
      for (let item of menuList) {
        item.removeEffects();
        item.destroy(true);
      }

      // fade out effect for the bg and title
      const fadeOut = (item) => () => {
        item.alpha -= 0.08;
      };
      const effects = [];
      for (let item of app.stage.children) {
        const e = fadeOut(item);
        app.ticker.add(e);
        effects.push(e);
      }

      // clear the bg and title and launch a new game
      window.setTimeout(
        () => {
          for (let e of effects) {
            app.ticker.remove(e);
          }
          for (let item of app.stage.children) {
            item.destroy(true);
          }

          // launch the actual game
          game();
        },
        250
      );
    }
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
      console.log('exit');
      for (let item of menuList) {
        item.removeEffects();
        item.destroy(true);
      }
      for (let item of app.stage.children) {
        item.destroy(true);
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
    newGameText.select(),
    loadGameText.disable(),
    settingsText.neutral(),
    exitText.neutral(),
  ];


  // When the mouse goes over the item, select it
  const hover = (item, menuList) => () => {
    for (let i of menuList) {
      if (i.state == 2) continue;
      i.neutral();
    }

    selected = menuList.indexOf(item);
    item.select();
  };


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
      item.clickItem();
    }
  };


  // Menu controls (Key + mouse)
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

  for (let item of menuList) {
    item.on('pointerover', hover(item, menuList));
    item.on('pointertap', confirmMenu(menuList));
  }


  // Position the items on the screen
  let x = app.renderer.width / 2;
  let y = app.renderer.height / 2 - 60;
  let step = 60;
  for (let item of menuList) {
    item.position.set(x, y);
    app.stage.addChild(item);
    y += step;
  }
}

/**
 * Main game function
 */
function game() {
  // Load the background
  const background = new PIXI.Sprite(presources[GameBackground].texture);

  background.width = app.screen.width;
  background.height = app.screen.height;

  app.stage.addChild(background);


  //  const Cell = new PIXI.Container();
};
