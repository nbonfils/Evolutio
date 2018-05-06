import * as PIXI from 'pixi.js';

// glowing effect for a text
const glowingEffect = (text, count) => () => {
  count += 0.03;

  let alpha = Math.sin(count);

  text.alpha = (alpha + 1) / 2;
};

/**
 * An helper function to create a new text glowing or not
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

    ticker.add(glowingEffect(blured, 0));

    container.addChild(blured);
  }

  container.pivot.set(
    container.width / 2,
    container.height / 2
  );

  return container;
}
