import { describe, expect, it } from '@jest/globals';

import { createBounds, normalizeLongitude } from './provider.dynamic.osm';
import { getRouteBounds } from './provider.dynamic.osm.route';

describe('OSM bounds', () => {
  describe('normalizeLongitude', () => {
    it.each([-180, -74.25, 0, 120.5, 180])('preserves longitude %s inside the geographic range', (longitude) => {
      expect(normalizeLongitude(longitude)).toBe(longitude);
    });

    it.each([
      [181, -179],
      [-181, 179],
      [360, 0],
      [-360, 0],
      [540, -180],
      [-540, -180],
      [1081, 1],
      [-1081, -1],
      [720.25, 0.25],
      [-720.25, -0.25],
    ])('wraps longitude %s to %s', (longitude, expected) => {
      expect(normalizeLongitude(longitude)).toBe(expected);
    });
  });

  describe('createBounds', () => {
    it('returns no bounds for an empty location list', () => {
      expect(createBounds([])).toBeUndefined();
    });

    it.each([-74, 286])('creates zero-sized bounds for a single location at longitude %s', (lng) => {
      expect(createBounds([{ lat: 40.7, lng }])).toEqual({
        northEast: { lat: 40.7, lng: -74 },
        southWest: { lat: 40.7, lng: -74 },
      });
    });

    it('finds latitude and longitude limits in an unordered location list', () => {
      expect(createBounds([
        { lat: 40.7, lng: -74 },
        { lat: -12, lng: 20 },
        { lat: 52, lng: 15 },
      ])).toEqual({
        northEast: { lat: 52, lng: 20 },
        southWest: { lat: -12, lng: -74 },
      });
    });

    it('uses the shorter interval across the antimeridian', () => {
      expect(createBounds([
        { lat: 10, lng: 179 },
        { lat: 20, lng: -179 },
        { lat: 15, lng: 178 },
      ])).toEqual({
        northEast: { lat: 20, lng: -179 },
        southWest: { lat: 10, lng: 178 },
      });
    });

    it('normalizes wrapped locations before selecting the shorter interval', () => {
      expect(createBounds([
        { lat: 10, lng: 539 },
        { lat: 20, lng: -539 },
      ])).toEqual({
        northEast: { lat: 20, lng: -179 },
        southWest: { lat: 10, lng: 179 },
      });
    });

    it('does not expand bounds for duplicate locations in different world copies', () => {
      expect(createBounds([
        { lat: 40.7, lng: -74 },
        { lat: 40.7, lng: 286 },
        { lat: 40.7, lng: -434 },
      ])).toEqual({
        northEast: { lat: 40.7, lng: -74 },
        southWest: { lat: 40.7, lng: -74 },
      });
    });

    it('treats both antimeridian endpoints as the same longitude', () => {
      expect(createBounds([
        { lat: 10, lng: -180 },
        { lat: 20, lng: 180 },
      ])).toEqual({
        northEast: { lat: 20, lng: -180 },
        southWest: { lat: 10, lng: 180 },
      });
    });

    it.each([
      [[-120, 0, 120]],
      [[0, 120, -120]],
      [[120, -120, 0]],
    ])('selects a minimal interval for evenly spaced longitudes %j', (longitudes) => {
      const bounds = createBounds(longitudes.map((lng) => ({ lat: 0, lng })));

      expect([
        { northEast: { lat: 0, lng: -120 }, southWest: { lat: 0, lng: 0 } },
        { northEast: { lat: 0, lng: 0 }, southWest: { lat: 0, lng: 120 } },
        { northEast: { lat: 0, lng: 120 }, southWest: { lat: 0, lng: -120 } },
      ]).toContainEqual(bounds);
    });

    it.each([
      [[[-120, 0, 120]], [], -120, 120],
      [[[120, 0, -120]], [], -120, 120],
      [[[179, -179]], [178], 178, -179],
      [[[-179, 179]], [-178], 179, -178],
      [[[170, -175], [-170, 175]], [], 170, -170],
      [[[-120, 0, 120], [120, -120]], [], -180, 180],
      [[[0, 120, -120, 0]], [], -180, 180],
      [[[0, 90, 180, 270, 360, 450, 540]], [], -180, 180],
      [[[-180, 180]], [], -180, -180],
      [[[539, -539]], [], 179, -179],
      [[[10, 10]], [], 10, 10],
      [[[]], [15], 15, 15],
    ] as [number[][], number[], number, number][])(
      'does not cut route segments in %j with markers %j',
      (routeLongitudes, markerLongitudes, west, east) => {
        const routes = routeLongitudes
          .filter((longitudes) => longitudes.length)
          .map((longitudes) => getRouteBounds(longitudes.map((lng) => ({ lat: 10, lng }))));
        const markers = markerLongitudes.map((lng) => ({ lat: 10, lng }));
        const routeCorners = routes.flatMap(({ northEast, southWest }) => (
          [northEast, southWest].map(([lat, lng]) => ({ lat, lng }))
        ));
        expect(createBounds([...routeCorners, ...markers], routes)).toEqual({
          northEast: { lat: 10, lng: east },
          southWest: { lat: 10, lng: west },
        });
      },
    );
  });
});
