declare module 'devextreme-dist/js/vectormap-data/world.js' {
  type Position = number[];
  type Geometry =
    | { type: 'Point'; coordinates: Position }
    | { type: 'MultiPoint'; coordinates: Position[] }
    | { type: 'LineString'; coordinates: Position[] }
    | { type: 'MultiLineString'; coordinates: Position[][] }
    | { type: 'Polygon'; coordinates: Position[][] }
    | { type: 'MultiPolygon'; coordinates: Position[][][] };

  interface Feature {
    type: 'Feature';
    geometry: Geometry;
    properties: Record<string, unknown>;
  }

  interface FeatureCollection {
    type: 'FeatureCollection';
    features: Feature[];
    // eslint-disable-next-line spellcheck/spell-checker
    bbox?: number[];
  }

  const world: FeatureCollection;
  export { world };
  export default world;
}
