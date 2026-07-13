import type { Meta, StoryObj } from '@storybook/react-webpack5';

import React, { useMemo, useRef } from 'react';
import Button from 'devextreme-react/button';
import Map, { type MapRef } from 'devextreme-react/map';
import type { OsmGetRouteFunction } from 'devextreme/ui/map';

// OpenStreetMap (OSM) provider for the DevExtreme Map — powered by client-owned Leaflet.
// This Storybook loads Leaflet in `.storybook/preview-head.html`, which demonstrates the global
// `window.L` setup. Applications can instead pass an imported API through `providerConfig.mapEngine`.
// The provider needs no API key of its own, but it does not bundle a tile/geocoding/routing service:
// you supply them via `providerConfig` (tileServer / geocodeLocation / getRoute).
//
// This story lets you switch between several commercial OSM-based tile providers and paste your
// own key for each (the "Tile provider" controls). The public OpenStreetMap tile service is
// best-effort and subject to the OSM Tile Usage Policy, so it is intentionally not offered here.
// Routing uses the public OSRM demo server (evaluation only).
//
// NOTE: there is deliberately no "self-hosted" option in this published Storybook — a localhost
// URL would point at the viewer's own machine, not a shared server. For the fully free, no-key,
// self-hosted setup (tiles + routing + geocoding), run the OSM_SelfHosted_Server Docker stack
// locally (see the devextreme-how-to-use-openstreetmap example repo).
const OSM_ATTR = '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
const OPENMAPTILES_ATTR = '© <a href="https://openmaptiles.org/">OpenMapTiles</a>';
const STADIA_ATTR = `© <a href="https://stadiamaps.com/">Stadia Maps</a> ${OPENMAPTILES_ATTR} ${OSM_ATTR}`;
const STADIA_SATELLITE_ATTR = `${STADIA_ATTR} © CNES, Distribution Airbus DS, © Airbus DS, © PlanetObserver (Contains Copernicus Data)`;
const markerUrl = 'https://js.devexpress.com/Demos/WidgetsGallery/JSDemos/images/maps/map-marker.png';

type TileProvider = 'MapTiler' | 'Thunderforest' | 'Stadia Maps';
type MapType = 'roadmap' | 'satellite' | 'hybrid';

interface ProviderKeys {
  maptiler: string;
  thunderforest: string;
  stadia: string;
}

// Resolve a Leaflet tile-layer config for the selected provider and map type. Each provider is a
// function of the type so switching the "Map type" control re-resolves the tiles.
const buildTileServer = (provider: TileProvider, type: string, keys: ProviderKeys) => {
  switch (provider) {
    case 'Thunderforest': {
      // Thunderforest has no satellite/aerial imagery, so the type slots map to distinct
      // cartographic styles to demonstrate type switching.
      const style = { roadmap: 'atlas', satellite: 'landscape', hybrid: 'outdoors' }[type] ?? 'atlas';
      return {
        url: `https://{s}.tile.thunderforest.com/${style}/{z}/{x}/{y}.png?apikey=${keys.thunderforest}`,
        attribution: `Maps © <a href="https://www.thunderforest.com/">Thunderforest</a>, ${OSM_ATTR}`,
        subdomains: 'abc',
        maxZoom: 22,
      };
    }
    case 'Stadia Maps': {
      const style = { roadmap: 'alidade_smooth', satellite: 'alidade_satellite', hybrid: 'alidade_satellite' }[type] ?? 'alidade_smooth';
      return {
        url: `https://tiles.stadiamaps.com/tiles/${style}/{z}/{x}/{y}.png?api_key=${keys.stadia}`,
        attribution: style === 'alidade_satellite' ? STADIA_SATELLITE_ATTR : STADIA_ATTR,
        maxZoom: 20,
      };
    }
    case 'MapTiler':
    default: {
      const style = { roadmap: 'streets-v2', satellite: 'satellite', hybrid: 'hybrid' }[type] ?? 'streets-v2';
      return {
        url: `https://api.maptiler.com/maps/${style}/{z}/{x}/{y}.png?key=${keys.maptiler}`,
        attribution: `© <a href="https://www.maptiler.com/copyright/">MapTiler</a> ${OSM_ATTR}`,
        maxZoom: 20,
      };
    }
  }
};

// Real road routing via the public OSRM demo server (evaluation only; host your own in production).
const getRoute: OsmGetRouteFunction = ({ locations }) => {
  const coords = locations.map((l) => `${l.lng},${l.lat}`).join(';');
  return fetch(`https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson`)
    .then((r) => r.json())
    .then((res) => res.routes[0].geometry);
};

const markersData = [
  { location: { lat: 40.755833, lng: -73.986389 }, tooltip: { text: 'Times Square' } },
  { location: { lat: 40.7825, lng: -73.966111 }, tooltip: { text: 'Central Park' } },
  { location: { lat: 40.753889, lng: -73.981389 }, tooltip: { text: 'Fifth Avenue' } },
  { location: { lat: 40.705748, lng: -73.996299 }, tooltip: { text: 'Brooklyn Bridge' } },
];

const routeWaypoints: [number, number][] = [
  [40.7825, -73.966111],
  [40.755833, -73.986389],
  [40.753889, -73.981389],
  [40.705748, -73.996299],
];

const addedMarkerLocation = { lat: 40.748817, lng: -73.985428 };
const addedRouteWaypoints: [number, number][] = [
  [40.758896, -73.98513],
  [40.748817, -73.985428],
  [40.74106, -73.989699],
];

const centers: Record<string, { lat: number; lng: number }> = {
  'New York': { lat: 40.74, lng: -73.985 },
  London: { lat: 51.5074, lng: -0.1278 },
  Tokyo: { lat: 35.6762, lng: 139.7649 },
};

// Custom args (not native Map props) used to drive the story controls.
interface OsmStoryArgs {
  tileProvider: TileProvider;
  maptilerKey: string;
  thunderforestKey: string;
  stadiaKey: string;
  type: MapType;
  center: keyof typeof centers;
  zoom: number;
  controls: boolean;
  disabled: boolean;
  autoAdjust: boolean;
  customMarkerIcons: boolean;
  showMarkers: boolean;
  showRoutes: boolean;
  routeColor: string;
  height: number;
  width: string;
}

const meta: Meta<OsmStoryArgs> = {
  title: 'Map/OSM Provider',
  component: Map,
  parameters: { layout: 'fullscreen' },
  argTypes: {
    // --- Tile provider ---
    tileProvider: {
      control: 'select',
      options: ['MapTiler', 'Thunderforest', 'Stadia Maps'],
      table: { category: 'Tile provider' },
      description: 'Which commercial OSM tile provider to render.',
    },
    maptilerKey: {
      control: 'text',
      table: { category: 'Tile provider' },
      description: 'Your MapTiler API key (https://cloud.maptiler.com). Required to see MapTiler tiles.',
    },
    thunderforestKey: {
      control: 'text',
      table: { category: 'Tile provider' },
      description: 'Your Thunderforest API key (https://www.thunderforest.com).',
    },
    stadiaKey: {
      control: 'text',
      table: { category: 'Tile provider' },
      description: 'Your Stadia Maps API key (https://stadiamaps.com).',
    },
    // --- Map ---
    type: { control: 'select', options: ['roadmap', 'satellite', 'hybrid'], table: { category: 'Map' } },
    center: {
      control: 'select', options: Object.keys(centers), table: { category: 'Map' },
      description: 'Initial center — the map can be freely panned afterwards.',
    },
    zoom: {
      control: { type: 'number', min: 1, max: 19 }, table: { category: 'Map' },
      description: 'Initial zoom — the map can be freely zoomed afterwards.',
    },
    controls: { control: 'boolean', table: { category: 'Map' } },
    disabled: { control: 'boolean', table: { category: 'Map' } },
    autoAdjust: {
      control: 'boolean',
      table: { category: 'Map' },
      description: 'Auto-fit the viewport to the markers/routes.',
    },
    // --- Markers ---
    showMarkers: { control: 'boolean', table: { category: 'Markers' } },
    customMarkerIcons: {
      control: 'boolean',
      table: { category: 'Markers' },
      description: 'Use a custom pushpin image instead of the default Leaflet marker.',
    },
    // --- Routes ---
    showRoutes: { control: 'boolean', table: { category: 'Routes' } },
    routeColor: {
      control: 'select',
      options: ['blue', 'green', 'red', 'purple', 'orange'],
      table: { category: 'Routes' },
    },
    // --- Layout ---
    height: { control: 'number', table: { category: 'Layout' } },
    width: { control: 'text', table: { category: 'Layout' } },
  },
};

export default meta;

type Story = StoryObj<OsmStoryArgs>;

const render: Story['render'] = (args) => {
  const mapRef = useRef<MapRef>(null);
  const {
    tileProvider, maptilerKey, thunderforestKey, stadiaKey,
    type, center, zoom, controls, disabled, autoAdjust,
    customMarkerIcons, showMarkers, showRoutes, routeColor, height, width,
  } = args;

  // providerConfig identity changes only when the provider or a key changes, so the map rebuilds
  // its tile layer then — not on every unrelated control change.
  const providerConfig = useMemo(() => ({
    tileServer: (t: string) => buildTileServer(tileProvider, t, {
      maptiler: maptilerKey, thunderforest: thunderforestKey, stadia: stadiaKey,
    }),
    getRoute,
  }), [tileProvider, maptilerKey, thunderforestKey, stadiaKey]);

  const markers = useMemo(() => (showMarkers ? markersData : []), [showMarkers]);
  const routes = useMemo(() => (showRoutes
    ? [{ weight: 6, opacity: 0.6, color: routeColor, locations: routeWaypoints }]
    : []), [showRoutes, routeColor]);

  const addMarker = () => {
    mapRef.current?.instance().addMarker({
      location: addedMarkerLocation,
      tooltip: { text: 'Empire State Building' },
    });
  };

  const addRoute = () => {
    mapRef.current?.instance().addRoute({
      weight: 6,
      opacity: 0.7,
      color: routeColor,
      locations: addedRouteWaypoints,
    });
  };

  const showAllTooltips = () => {
    const map = mapRef.current?.instance();
    const currentMarkers = map?.option('markers') ?? [];

    map?.option('markers', currentMarkers.map((marker) => ({
      ...marker,
      tooltip: {
        ...((marker.tooltip ?? {}) as Record<string, any>),
        isShown: true,
      },
    })));
  };

  return (
    <>
      <div style={{ display: 'flex', gap: 8, padding: 12 }}>
        <Button text="Add marker" onClick={addMarker} />
        <Button text="Add route" onClick={addRoute} />
        <Button text="Show all tooltips" onClick={showAllTooltips} />
      </div>
      <div style={{ position: 'relative', width }}>
        <Map
          ref={mapRef}
          // Center, zoom, markers, and routes are uncontrolled so the user and the method buttons can
          // mutate the Map instance. The key re-mounts it when the corresponding Storybook controls
          // change, which re-seeds those defaults.
          key={`${center}|${zoom}|${showMarkers}|${showRoutes}|${routeColor}`}
          provider="osm"
          providerConfig={providerConfig}
          defaultCenter={centers[center]}
          defaultZoom={zoom}
          type={type}
          height={height}
          width="100%"
          controls={controls}
          disabled={disabled}
          autoAdjust={autoAdjust}
          markerIconSrc={customMarkerIcons ? markerUrl : undefined}
          defaultMarkers={markers}
          defaultRoutes={routes}
        />
        {tileProvider === 'MapTiler' && (
          <a
            href="https://www.maptiler.com"
            style={{ position: 'absolute', left: 10, bottom: 10, zIndex: 999 }}
          >
            <img src="https://api.maptiler.com/resources/logo.svg" alt="MapTiler logo" />
          </a>
        )}
      </div>
    </>
  );
};

export const Default: Story = {
  args: {
    tileProvider: 'MapTiler',
    // Paste your own keys here in the controls panel to see tiles render.
    maptilerKey: 'YOUR_MAPTILER_KEY',
    thunderforestKey: 'YOUR_THUNDERFOREST_KEY',
    stadiaKey: 'YOUR_STADIA_KEY',
    type: 'roadmap',
    center: 'New York',
    zoom: 12,
    controls: true,
    disabled: false,
    autoAdjust: false,
    showMarkers: true,
    customMarkerIcons: true,
    showRoutes: true,
    routeColor: 'blue',
    height: 520,
    width: '100%',
  },
  render,
};
