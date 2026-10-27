const TILE_URL = 'https://tiles-eu.stadiamaps.com/tiles/alidade_bright/12/1206/1538.png';
const ROUTE_URL = 'https://api-eu.stadiamaps.com/route/v1';

let nativeFetch;
let nativeImageSource;

beforeEach(() => {
  class TestImage {
    get src() { return this.source; }

    set src(value) { this.source = String(value); }
  }

  nativeFetch = jest.fn().mockResolvedValue('native response');
  nativeImageSource = Object.getOwnPropertyDescriptor(TestImage.prototype, 'src');
  global.window = {
    HTMLImageElement: TestImage,
    Request,
    Response,
    fetch: nativeFetch,
  };
  jest.resetModules();
  jest.requireActual('../../../Demos/Map/OpenStreetMapProvider/client-script');
});

afterEach(() => {
  delete global.window;
});

test.each([TILE_URL, `${TILE_URL}?test=1`, new URL(TILE_URL)])('replaces demo tile %s with a synthetic image', (url) => {
  const image = new window.HTMLImageElement();
  image.src = url;

  expect(image.src).toMatch(/^data:image\/svg\+xml,/);
  expect(decodeURIComponent(image.src)).toContain('width="256" height="256"');
});

test.each([
  '/images/Maps/map-marker.png',
  'data:image/png;base64,test',
  'https://other.example/tiles/alidade_bright/12/1206/1538.png',
  `${TILE_URL}.html`,
  'https://tiles-eu.stadiamaps.com/other.png',
  'https://tiles-eu.stadiamaps.com.example/tiles/alidade_bright/12/1206/1538.png',
])('preserves unrelated image %s', (url) => {
  const image = new window.HTMLImageElement();
  image.src = url;

  expect(image.src).toBe(url);
});

test('preserves the native image getter and property flags', () => {
  const descriptor = Object.getOwnPropertyDescriptor(window.HTMLImageElement.prototype, 'src');

  expect(descriptor.get).toBe(nativeImageSource.get);
  expect(descriptor.configurable).toBe(nativeImageSource.configurable);
  expect(descriptor.enumerable).toBe(nativeImageSource.enumerable);
});

test.each([
  ROUTE_URL,
  `${ROUTE_URL}?test=1`,
  new URL(ROUTE_URL),
  new Request(ROUTE_URL, { method: 'POST', body: '{}' }),
])('returns a routing fixture for %s without a network request', async (input) => {
  const response = await window.fetch(input, { method: 'POST' });

  expect(response.ok).toBe(true);
  expect(response.headers.get('Content-Type')).toBe('application/json');
  await expect(response.json()).resolves.toEqual({
    trip: { legs: [{ shape: 'gidxlA|`palCtas@jrf@nxBowH||mAddn@' }] },
  });
  expect(nativeFetch).not.toHaveBeenCalled();
});

test('creates a fresh response for each route request', async () => {
  const first = await window.fetch(ROUTE_URL);
  const second = await window.fetch(ROUTE_URL);

  expect(first).not.toBe(second);
  expect(await first.json()).toEqual(await second.json());
});

test.each([
  '/local-data',
  'https://other.example/route/v1',
  'https://api-eu.stadiamaps.com/other',
  'https://api-eu.stadiamaps.com/route/v10',
  'https://api-eu.stadiamaps.com.example/route/v1',
  new URL('https://other.example/route/v1'),
  new Request('https://other.example/route/v1'),
])('forwards unrelated request %s with its options and receiver', async (input) => {
  const options = { method: 'POST', body: 'original body' };

  await expect(window.fetch(input, options)).resolves.toBe('native response');
  expect(nativeFetch).toHaveBeenCalledTimes(1);
  expect(nativeFetch).toHaveBeenCalledWith(input, options);
  expect(nativeFetch.mock.contexts[0]).toBe(window);
});
