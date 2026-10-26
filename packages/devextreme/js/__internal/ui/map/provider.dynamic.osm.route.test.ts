import { describe, expect, it } from '@jest/globals';

import { getRouteBounds, getRouteLocations, toRouteCoordinates } from './provider.dynamic.osm.route';

describe('OSM route results', () => {
  const locations = [{ lat: 40.7, lng: -74 }, { lat: 40.8, lng: -73.9 }];

  it('reads latitude-longitude tuples without modifying the result', () => {
    const result = Object.freeze([Object.freeze([40.7, -74]), Object.freeze([40.8, -73.9])]);
    expect(getRouteLocations(result)).toEqual(locations);
  });

  it('reads GeoJSON longitude-latitude positions and ignores elevation', () => {
    expect(getRouteLocations({
      type: 'LineString',
      coordinates: [[-74, 40.7, 20], [-73.9, 40.8, 30]],
    })).toEqual(locations);
  });

  it.each([false, true])('accepts latitude limits and wrapped longitudes (GeoJSON: %s)', (isGeoJson) => {
    const coordinates = [[-90, -540], [90, 540]];
    const result = isGeoJson
      ? { type: 'LineString', coordinates: coordinates.map(([lat, lng]) => [lng, lat]) }
      : coordinates;

    expect(getRouteLocations(result)).toEqual([{ lat: -90, lng: -540 }, { lat: 90, lng: 540 }]);
  });

  it.each([-90.001, 90.001])('rejects latitude %s in either coordinate order', (latitude) => {
    expect(getRouteLocations([[0, 10], [latitude, 11]])).toBeUndefined();
    expect(getRouteLocations({
      type: 'LineString', coordinates: [[10, 0], [11, latitude]],
    })).toBeUndefined();
  });

  it.each([
    undefined, null, '', {}, [], [[40.7, -74]],
    [[40.7, -74], [NaN, -73]], [[40.7, -74], [40.8, Infinity]],
    [[40.7, -74], ['40.8', -73]], [[40.7, -74], [40.8]],
    [[40.7, -74], [40.8, -73, 0]], [[40.7, -74], null],
    new Array(2), [[40.7, -74], new Array(2)],
    { type: 'LineString', coordinates: [[-74, 40.7]] },
    { type: 'LineString', coordinates: [[-74, 40.7], []] },
    { type: 'MultiLineString', coordinates: [[[-74, 40.7], [-73, 40.8]]] },
    { type: 'Feature', geometry: { type: 'LineString', coordinates: [[-74, 40.7], [-73, 40.8]] } },
  ])('rejects an unsupported result: %j', (result) => {
    expect(getRouteLocations(result)).toBeUndefined();
  });
});

describe('toRouteCoordinates', () => {
  it.each([
    [[179, -179], [179, 181]],
    [[-179, 179], [-179, -181]],
    [[-74, -73], [-74, -73]],
    [[-120, 0, 120], [-120, 0, 120]],
  ])('keeps consecutive longitudes %j in the nearest world', (longitudes, expected) => {
    expect(toRouteCoordinates(longitudes.map((lng) => ({ lat: 10, lng }))))
      .toEqual(expected.map((lng) => [lng, 10]));
  });
});

describe('getRouteBounds', () => {
  it.each([
    [[-74, -73, -75], [-75, -73]],
    [[179, -179], [179, 181]],
    [[-179, 179], [-181, -179]],
    [[-120, 0, 120], [-120, 120]],
    [[0, 120, -120, 0], [0, 360]],
    [[10, 10], [10, 10]],
  ])('finds the continuous range of longitudes %j', (longitudes, expected) => {
    expect(getRouteBounds(longitudes.map((lng) => ({ lat: 10, lng }))))
      .toEqual({ northEast: [10, expected[1]], southWest: [10, expected[0]] });
  });

  it('includes interior latitude extremes without modifying the route', () => {
    const locations = Object.freeze([
      Object.freeze({ lat: 10, lng: 179 }),
      Object.freeze({ lat: 30, lng: -178 }),
      Object.freeze({ lat: -20, lng: -179 }),
      Object.freeze({ lat: 15, lng: 178 }),
    ]);

    expect(getRouteBounds([...locations])).toEqual({
      northEast: [30, 182],
      southWest: [-20, 178],
    });
  });
});
