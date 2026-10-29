const fs = require('fs');
const {
  extractHeadExtras, extractBodyInner, extractDemoHeadExtras, extractDemoBodyInner,
} = require('../../server/demo-html');

afterEach(() => {
  jest.restoreAllMocks();
});

test.each(['', '<head><meta name="viewport" content="width=device-width"></head>'])('returns no extras without supported head tags: %s', (html) => {
  expect(extractHeadExtras(html)).toEqual([]);
});

test('preserves referrer policy, styles and external scripts in order', () => {
  const html = `<head>
    <link rel="stylesheet" href="styles.css">
    <meta name="referrer" content="strict-origin-when-cross-origin">
    <script src="https://example.com/library.js"></script>
  </head>`;

  expect(extractHeadExtras(html)).toEqual([
    '<link rel="stylesheet" href="styles.css" />',
    '<meta name="referrer" content="strict-origin-when-cross-origin" />',
    '<script src="https://example.com/library.js"></script>',
  ]);
});

test('omits comments, duplicate policies and resources handled by the bundle', () => {
  const html = `<head>
    <!-- <meta name="referrer" content="no-referrer"> -->
    <meta name="referrer" content="strict-origin-when-cross-origin">
    <meta name="referrer" content="no-referrer">
    <link href="../../node_modules/devextreme-dist/css/dx.light.css">
    <link href="bundle.css">
    <script src="index.js"></script>
  </head>`;

  expect(extractHeadExtras(html)).toEqual([
    '<meta name="referrer" content="strict-origin-when-cross-origin" />',
  ]);
});

test.each([undefined, 'Map/OpenStreetMapProvider/React'])('warns about discarded inline scripts (context: %s)', (context) => {
  const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});

  expect(extractHeadExtras('<head><script>initialize();</script></head>', context)).toEqual([]);
  expect(warn).toHaveBeenCalledWith(expect.stringContaining('initialize();'));
});

test('ignores empty scripts without a warning', () => {
  const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});

  expect(extractHeadExtras('<head><script></script></head>')).toEqual([]);
  expect(warn).not.toHaveBeenCalled();
});

test.each(['', '<body><script src="index.js"></script></body>'])('returns null without body markup: %s', (html) => {
  expect(extractBodyInner(html)).toBeNull();
});

test('preserves body markup without scripts', () => {
  expect(extractBodyInner('<body><script>initialize();</script><div id="map"></div></body>'))
    .toBe('<div id="map"></div>');
});

test('reads head and body from the demo HTML', () => {
  jest.spyOn(fs, 'readFileSync').mockReturnValue(
    '<head><meta name="referrer" content="origin"></head><body><div id="map"></div></body>',
  );

  expect(extractDemoHeadExtras('demo')).toEqual(['<meta name="referrer" content="origin" />']);
  expect(extractDemoBodyInner('demo')).toBe('<div id="map"></div>');
});

test('handles a missing demo HTML file', () => {
  jest.spyOn(fs, 'readFileSync').mockImplementation(() => {
    throw new Error('File not found');
  });

  expect(extractDemoHeadExtras('demo')).toEqual([]);
  expect(extractDemoBodyInner('demo')).toBeNull();
});

test('does not read a file without a demo directory', () => {
  const read = jest.spyOn(fs, 'readFileSync');

  expect(extractDemoHeadExtras()).toEqual([]);
  expect(extractDemoBodyInner()).toBeNull();
  expect(read).not.toHaveBeenCalled();
});
