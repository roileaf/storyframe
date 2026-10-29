import assert from 'node:assert/strict';
import test from 'node:test';

const { isStoryFrameIgnored, STORYFRAME_IGNORE_SELECTOR } = await import(
  '../scripts/utils/element-utils.mjs'
);

function element(match) {
  const queried = [];
  return {
    queried,
    closest: (selector) => {
      queried.push(selector);
      return match ? {} : null;
    },
  };
}

test('images marked or wrapped with a storyframe-ignore marker are skipped', () => {
  const img = element(true);
  assert.equal(isStoryFrameIgnored(img), true);
  assert.deepEqual(img.queried, [STORYFRAME_IGNORE_SELECTOR]);
});

test('unmarked images are kept', () => {
  assert.equal(isStoryFrameIgnored(element(false)), false);
  assert.equal(isStoryFrameIgnored(null), false);
});

test('ignore selector supports class, data attribute and data-tag markers', () => {
  assert.match(STORYFRAME_IGNORE_SELECTOR, /\.storyframe-ignore/);
  assert.match(STORYFRAME_IGNORE_SELECTOR, /\[data-storyframe-ignore\]/);
  assert.match(STORYFRAME_IGNORE_SELECTOR, /\[data-tag="storyframe-ignore"\]/);
});
