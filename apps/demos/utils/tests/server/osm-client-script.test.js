const TILE_URL = 'https://tiles-eu.stadiamaps.com/tiles/alidade_bright/12/1206/1538.png';
const ROUTE_URL = 'https://api-eu.stadiamaps.com/route/v1';

let nativeFetch;

beforeEach(() => {
  class TestImage {
    get src() { return this.source; }

    set src(value) { this.source = String(value); }
  }

  nativeFetch = jest.fn().mockResolvedValue('native response');
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

test('replaces demo tiles with a synthetic image', () => {
  const image = new window.HTMLImageElement();
  image.src = TILE_URL;

  expect(image.src).toMatch(/^data:image\/svg\+xml,/);
});

test('preserves the marker image', () => {
  const image = new window.HTMLImageElement();
  image.src = '/images/Maps/map-marker.png';

  expect(image.src).toBe('/images/Maps/map-marker.png');
});

test.each([ROUTE_URL, new Request(ROUTE_URL)])('mocks repeated route requests for %s without using the network', async (input) => {
  const first = await window.fetch(input);
  const route = await first.json();

  expect(first.ok).toBe(true);
  expect(route).toEqual({
    trip: { legs: [{ shape: expect.stringMatching(/.+/) }] },
  });

  const second = await window.fetch(input);
  await expect(second.json()).resolves.toEqual(route);
  expect(nativeFetch).not.toHaveBeenCalled();
});

test('forwards unrelated requests with their options', async () => {
  const options = { method: 'POST', body: 'original body' };

  await expect(window.fetch('/local-data', options)).resolves.toBe('native response');
  expect(nativeFetch).toHaveBeenCalledWith('/local-data', options);
});
