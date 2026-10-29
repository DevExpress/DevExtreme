// Loaded only by the demo test runners. Do not send CI requests to Stadia Maps.
(() => {
  const tileImage = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256"><rect width="256" height="256" fill="#eee"/></svg>')}`;
  const imageSource = Object.getOwnPropertyDescriptor(window.HTMLImageElement.prototype, 'src');

  Object.defineProperty(window.HTMLImageElement.prototype, 'src', {
    ...imageSource,
    set(value) {
      const isDemoTile = /^https:\/\/tiles-eu\.stadiamaps\.com\/tiles\/alidade_bright\/\d+\/\d+\/\d+\.png(?:\?.*)?$/.test(String(value));
      imageSource.set.call(this, isDemoTile ? tileImage : value);
    },
  });

  const nativeFetch = window.fetch;
  window.fetch = function fetch(input, options) {
    const url = input instanceof window.Request ? input.url : String(input);
    if (/^https:\/\/api-eu\.stadiamaps\.com\/route\/v1(?:\?.*)?$/.test(url)) {
      // Polyline6 connecting the demo's four waypoints; not real routing service data.
      const shape = 'gidxlA|`palCtas@jrf@nxBowH||mAddn@';
      return Promise.resolve(new window.Response(JSON.stringify({ trip: { legs: [{ shape }] } }), {
        headers: { 'Content-Type': 'application/json' },
      }));
    }
    return nativeFetch.call(this, input, options);
  };
})();
