import * as PIXI from 'pixi.js';

// glowing effect for a text
const glowingEffect = (text, count) => () => {
  count += 0.03;

  let alpha = Math.sin(count);

  text.alpha = (alpha + 1) / 2;
};

// fade out effect for a selected text
const fadeOutSelected = (text) => () => {
  text.alpha -= 0.05;
  text.scale.x += 0.05;
  text.scale.y += 0.05;
};

// fade out effect for other than selected text
const fadeOutOther = (text) => () => {
  text.alpha -= 0.05;
};

/**
 * An helper function to create a new text glowing or not
 * call .removeGlow() before destroying
 *
 * @param {String} s is the text to display
 * @param {Int} size is the size of the text
 * @param {Boolean} isGlowing define if the text should be glowing
 * @param {PIXI.Ticker} ticker is the ticker to which we add the animation
 *
 * @return {PIXI.Container} the display object containing the text
 */
export function newText(s, size, isGlowing, ticker) {
  const container = new PIXI.Container();

  const text = new PIXI.Text(s, {
    fontFamily: 'acherus_grotesqueregular',
    fontSize: size,
    fill: 'white',
  });

  container.addChild(text);

  if (isGlowing) {
    const blured = new PIXI.Text(s, {
      fontFamily: 'acherus_grotesqueregular',
      fontSize: size,
      fill: 0xd7f4e3,
    });

    // apply blur to one of the text occurence
    const blurFilter = new PIXI.filters.BlurFilter();
    blured.filters = [blurFilter];

    const glow = glowingEffect(blured, 0);

    ticker.add(glow);

    container.removeEffects = () => {
      ticker.remove(glow);
    };

    container.addChild(blured);
  }

  container.pivot.set(
    container.width / 2,
    container.height / 2
  );

  return container;
}

/**
 * An helper to create items in a menu,
 * each created item will have different states:
 * 0 selected
 * 1 neutral
 * 2 disabled
 *
 * -1 -> no state defined yet
 *
 * don't forget to .removeGlow when removing the item
 *
 * @param {String} s is the text to be displayed
 * @param {Int} size is the size of the text
 * @param {PIXI.Ticker} ticker is the ticker to which we add the animations
 * @param {function} callback executes when the item is clicked and selected
 *
 * @return {PIXI.Container} the display object containing the item
 */
export function newMenuItem(s, size, ticker, callback) {
  const container = new PIXI.Container();

  const text = new PIXI.Text(s, {
    fontFamily: 'acherus_grotesqueregular',
    fontSize: size,
  });

  const blured = new PIXI.Text(s, {
    fontFamily: 'acherus_grotesqueregular',
    fontSize: size,
  });

  const blurFilter = new PIXI.filters.BlurFilter();
  blured.filters = [blurFilter];

  // the effect that may be applied to the menu item
  const glow = glowingEffect(blured, 0);
  const fadeOutS = fadeOutSelected(container);
  const fadeOutO = fadeOutOther(container);

  // all the effects that are applied to the object
  container.effects = [];

  ticker.add(glow);
  container.effects.push(glow);

  container.addChild(text);
  container.addChild(blured);

  // call before destroying this object
  container.removeEffects = () => {
    for (let effect of container.effects) {
      ticker.remove(effect);
    }
  };

  // the selected state
  container.select = () => {
    text.style.fill = 'white';

    blured.style.fill = '0xd7f4e3';
    blured.visible = true;
    blured.updateTransform();

    container.interactive = true;
    container.buttonMode = true;

    container.state = 0;

    return container;
  };

  // the neutral state
  container.neutral = () => {
    text.style.fill = 'blue';

    blured.visible = false;
    blured.updateTransform();

    container.interactive = true;
    container.buttonMode = true;

    container.state = 1;

    return container;
  };

  // the disabled state
  container.disable = () => {
    text.style.fill = 'blue';
    text.alpha = 0.6;

    blured.visible = false;
    blured.updateTransform();

    container.interactive = false;
    container.buttonMode = false;

    container.state = 2;

    return container;
  };

  container.state = -1;

  container.clickItem = () => {
    if (container.state == 0) {
      ticker.add(fadeOutS);
      container.effects.push(fadeOutS);
      window.setTimeout(callback, 850);
    } else {
      ticker.add(fadeOutO);
      container.effects.push(fadeOutO);
    }
  };

  container.pivot.set(
    container.width / 2,
    container.height / 2
  );

  return container;
}
