import * as PIXI from 'pixi.js';

import './style.css';
import Fonts from './fonts.css';
import {newText, newMenuItem, initControls} from './utils';
import Cell from './Cell';
import Camera from './Camera';

// game ressources
import StartScreen from './assets/startScreen.png';
import GameBG from './assets/GameBG.png';
import CellImg from './assets/Cell.png';
import CoreImg from './assets/Core.png';

// Some shortcuts
const presources = PIXI.loader.resources;

const controls = initControls();

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

const textTicker = new PIXI.ticker.Ticker();

/**
 * Initialize the game
 */
function init() {
  // The ticker for text animation
  textTicker.start();


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
    textTicker
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
      textTicker,
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
      GameBG,
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
    textTicker,
    () => {
      console.log('launch game');
      // Clear the menu
      for (let item of menuList) {
        item.removeEffects();
        item.destroy(true);
      }

      // Clear the control keys
      for (let key in controls) {
        if (controls.hasOwnProperty(key)) {
          controls[key].clear();
        }
      }

      // Fade out effect for the bg and title
      const fadeOut = (item) => () => {
        item.alpha -= 0.08;
      };
      const effects = [];
      for (let item of app.stage.children) {
        const e = fadeOut(item);
        textTicker.add(e);
        effects.push(e);
      }

      // Clear the bg and title and launch a new game
      PIXI.setTimeout(
        0.25,
        () => {
          for (let e of effects) {
            textTicker.remove(e);
          }
          for (let item of app.stage.children) {
            item.destroy(true);
          }

          // Launch the actual game
          textTicker.destroy();
          game();
        }
      );
    }
  );
  const loadGameText = newMenuItem(
    'Load Game',
    40,
    textTicker,
    () => console.log('load game')
  );
  const settingsText = newMenuItem(
    'Settings',
    40,
    textTicker,
    () => console.log('launch settings')
  );
  const exitText = newMenuItem(
    'Exit',
    40,
    textTicker,
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

      // Clear the control keys
      for (let key in controls) {
        if (controls.hasOwnProperty(key)) {
          controls[key].clear();
        }
      }

      textTicker.destroy();
      app.destroy();
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
  controls.up.press = upMenu(menuList);
  controls.w.press = upMenu(menuList);
  controls.down.press = downMenu(menuList);
  controls.s.press = downMenu(menuList);
  controls.enter.press = confirmMenu(menuList);

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
  // Init the world and the camera
  const world = new PIXI.Container();
  const cam = new Camera(world, app.renderer.width, app.renderer.height);
  app.stage.addChild(world);
  app.stage.addChild(cam);


  // Load the background
  const background = new PIXI.Sprite(presources[GameBG].texture);
  world.addChild(background);


  // The Main character
  const cell = new Cell(
    presources[CellImg].texture,
    presources[CoreImg].texture,
  );

  cell.position.set(app.renderer.width / 2, app.renderer.height / 2);

  // Control the cell
  controls.left.press = cell.leftAcc;
  controls.left.release = cell.leftDec;
  controls.right.press = cell.rightAcc;
  controls.right.release = cell.rightDec;
  controls.up.press = cell.upAcc;
  controls.up.release = cell.upDec;
  controls.down.press = cell.downAcc;
  controls.down.release = cell.downDec;

  world.addChild(cell);

  cam.follow(cell);
};
