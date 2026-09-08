import {
  describe, expect, it, jest,
} from '@jest/globals';

import type { OpenLayersApi } from './provider.dynamic.osm.openlayers.utils';
import {
  areCoordinatesEqual,
  createTileUrlList,
  isOpenLayersApi,
  toCoordinate,
  toLocation,
} from './provider.dynamic.osm.openlayers.utils';

const createApi = (): unknown => ({
  Map: jest.fn(),
  Overlay: jest.fn(),
  View: jest.fn(),
  control: {
    Zoom: jest.fn(),
    defaults: { defaults: () => [] },
  },
  interaction: {
    defaults: { defaults: () => [] },
  },
  layer: { Tile: jest.fn() },
  proj: {
    getUserProjection: () => null,
    toLonLat: () => [0, 0],
    transform: () => [0, 0],
    transformExtent: () => [0, 0, 0, 0],
  },
  source: { ImageTile: jest.fn() },
});

describe('OpenLayers utils', () => {
  describe('isOpenLayersApi', () => {
    it('returns true for a complete OpenLayers API', () => {
      expect(isOpenLayersApi(createApi())).toBe(true);
    });

    it('returns false when a required API member is missing', () => {
      const api = createApi() as Record<string, unknown>;

      delete api.Overlay;

      expect(isOpenLayersApi(api)).toBe(false);
    });
  });

  describe('coordinate conversion', () => {
    it('converts a Map location to the active OpenLayers projection', () => {
      const transform = jest.fn(() => [100, 200] as [number, number]);
      const api = {
        proj: {
          getUserProjection: () => 'user-projection',
          transform,
        },
      } as unknown as OpenLayersApi;

      expect(toCoordinate(api, { lat: 40.7, lng: -74 }, 'view-projection'))
        .toEqual([100, 200]);
      expect(transform).toHaveBeenCalledWith(
        [-74, 40.7],
        'EPSG:4326',
        'user-projection',
      );
    });

    it('converts an OpenLayers coordinate to a Map location', () => {
      const toLonLat = jest.fn(() => [-74, 40.7] as [number, number]);
      const api = {
        proj: {
          getUserProjection: () => null,
          toLonLat,
        },
      } as unknown as OpenLayersApi;

      expect(toLocation(api, [100, 200], 'view-projection'))
        .toEqual({ lat: 40.7, lng: -74 });
      expect(toLonLat).toHaveBeenCalledWith([100, 200], 'view-projection');
    });
  });

  describe('areCoordinatesEqual', () => {
    it('compares both coordinate values', () => {
      expect(areCoordinatesEqual([1, 2], [1, 2])).toBe(true);
      expect(areCoordinatesEqual([1, 2], [1, 3])).toBe(false);
      expect(areCoordinatesEqual(undefined, [1, 2])).toBe(false);
    });
  });

  describe('createTileUrlList', () => {
    it('expands string subdomains and replaces every placeholder', () => {
      expect(createTileUrlList('https://{s}.example.com/{s}/{z}', 'ab')).toEqual([
        'https://a.example.com/a/{z}',
        'https://b.example.com/b/{z}',
      ]);
    });

    it('expands array subdomains', () => {
      expect(createTileUrlList('https://{s}.example.com/{z}', ['one', 'two'])).toEqual([
        'https://one.example.com/{z}',
        'https://two.example.com/{z}',
      ]);
    });
  });
});
