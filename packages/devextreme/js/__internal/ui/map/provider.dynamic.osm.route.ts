import type { MapLocation } from '@js/ui/map';

import type { RouteObject } from './provider.dynamic';

export const getRouteLocations = (result: unknown): MapLocation[] | undefined => {
  const isGeoJson = result !== null && typeof result === 'object'
    && 'type' in result && result.type === 'LineString';
  const coordinates = isGeoJson && 'coordinates' in result
    ? result.coordinates
    : result;

  if (!Array.isArray(coordinates) || coordinates.length < 2) {
    return undefined;
  }

  const locations: MapLocation[] = [];
  for (const coordinate of coordinates) {
    if (!Array.isArray(coordinate)
      || (isGeoJson ? coordinate.length < 2 : coordinate.length !== 2)
      || !Number.isFinite(coordinate[0]) || !Number.isFinite(coordinate[1])) {
      return undefined;
    }

    const [first, second] = coordinate as [number, number];
    const location = isGeoJson ? { lat: second, lng: first } : { lat: first, lng: second };
    if (location.lat < -90 || location.lat > 90) {
      return undefined;
    }
    locations.push(location);
  }

  return locations;
};

export const toRouteCoordinates = (locations: MapLocation[]): [number, number][] => {
  let previousLongitude = locations[0].lng;

  return locations.map(({ lat, lng }) => {
    const longitude = lng + Math.round((previousLongitude - lng) / 360) * 360;
    previousLongitude = longitude;

    return [longitude, lat];
  });
};

export const getRouteBounds = (
  locations: MapLocation[],
): Required<Pick<RouteObject, 'northEast' | 'southWest'>> => {
  let north = locations[0].lat;
  let south = north;
  let west = locations[0].lng;
  let east = west;

  for (const [longitude, latitude] of toRouteCoordinates(locations)) {
    north = Math.max(north, latitude);
    south = Math.min(south, latitude);
    west = Math.min(west, longitude);
    east = Math.max(east, longitude);
  }

  return {
    northEast: [north, east],
    southWest: [south, west],
  };
};
