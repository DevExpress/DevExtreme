import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { useArgs } from 'storybook/preview-api';
import { fn } from 'storybook/test';

import Attribution from 'ol/control/Attribution.js';
import type OpenLayersMap from 'ol/Map.js';
import 'ol/ol.css';
import { fromLonLat, transformExtent } from 'ol/proj.js';
import View from 'ol/View.js';
import React from 'react';
import Button from 'devextreme-react/button';
import Map, { type MapRef } from 'devextreme-react/map';
import type {
    CalculateOsmRouteInfo,
    MapLocation,
    MapType,
    ReadyEvent,
    OsmRouteResult,
} from 'devextreme/ui/map';
import 'devextreme/ui/map/openlayers';

import { ROUTE_PATHS } from './routes';

const CENTRAL_PARK_CENTER = { lat: 40.7829, lng: -73.9654 };
const EXTENT: [number, number, number, number] = [-74.08, 40.67, -73.85, 40.88];
const TILE_SERVER = {
    url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19,
};
const MARKER_LOCATIONS: Record<string, MapLocation> = {
    'Columbus Circle': { lat: 40.768161, lng: -73.981906 },
    'Belvedere Castle': { lat: 40.779316, lng: -73.968882 },
    'Great Hill': { lat: 40.797269, lng: -73.958993 },
    'Dana Discovery Center': { lat: 40.797064, lng: -73.951349 },
    'Conservatory Garden': { lat: 40.793621, lng: -73.95261 },
    'Bethesda Fountain': { lat: 40.774498, lng: -73.970867 },
};
const ROUTE_PRESETS = {
    centralParkRun: {
        mode: 'walking',
        title: 'Central Park Run — approx. 10.1 km',
        markerDescription: 'Blue: Columbus Circle start / finish. Red: Dana Discovery Center.',
        center: { lat: 40.7827, lng: -73.9666 },
        zoom: 14,
        locations: [
            'Columbus Circle',
            'Belvedere Castle',
            'Great Hill',
            'Dana Discovery Center',
            'Conservatory Garden',
            'Bethesda Fountain',
            'Columbus Circle',
        ],
        markers: [{
            location: 'Columbus Circle',
        }, {
            location: 'Dana Discovery Center',
            iconSrc: 'images/maps/map-marker.png',
        }],
        extraMarker: MARKER_LOCATIONS['Belvedere Castle'],
    },
    manhattanDrive: {
        mode: 'driving',
        title: 'Manhattan Drive — official Routes demo waypoints, approx. 11 km',
        markerDescription: 'Four markers: coordinate string, arrays and an object. Red: custom icon.',
        center: { lat: 40.75, lng: -73.986 },
        zoom: 14,
        locations: [
            [40.7825, -73.966111],
            [40.755833, -73.986389],
            [40.753889, -73.981389],
            [40.713474, -74.005536],
        ],
        markers: [{
            location: '40.7825, -73.966111',
        }, {
            location: [40.755833, -73.986389],
            iconSrc: 'images/maps/map-marker.png',
        }, {
            location: { lat: 40.753889, lng: -73.981389 },
        }, {
            location: [40.713474, -74.005536],
        }],
        extraMarker: { lat: 40.748441, lng: -73.985664 },
    },
};
const PROVIDER_CONFIG = {
    calculateLocation: (query: string): Promise<MapLocation | undefined> => (
        Promise.resolve(MARKER_LOCATIONS[query])
    ),
    calculateRoute: ({ mode }: CalculateOsmRouteInfo): Promise<OsmRouteResult> => (
        Promise.resolve(mode === 'walking'
            ? ROUTE_PATHS.walking
            : ROUTE_PATHS.driving.coordinates.map(([lng, lat]) => [lat, lng]))
    ),
    tileServer: () => TILE_SERVER,
};
const handleMarkerClick = fn();
const handleRouteAdded = fn();
const handleRouteRemoved = fn();
const STORY_STYLE: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    padding: 8,
};
const TOOLBAR_STYLE: React.CSSProperties = {
    display: 'flex',
    gap: 8,
};

interface OsmStoryArgs {
    autoAdjust: boolean;
    centerOnCentralPark: boolean;
    controls: boolean;
    disabled: boolean;
    focusStateEnabled: boolean;
    tooltipsEnabled: boolean;
    tooltipsInitiallyShown: boolean;
    rtlEnabled: boolean;
    showRoute: boolean;
    routeColor: string;
    routePreset: keyof typeof ROUTE_PRESETS;
    routeOpacity: number;
    routeWeight: number;
    type: MapType;
    zoom: number;
}

interface OsmMapStoryProps extends OsmStoryArgs {
    updateArgs: (args: Partial<OsmStoryArgs>) => void;
}

const configureOpenLayersMap = (
    { originalMap }: ReadyEvent,
    center: MapLocation,
    zoom: number,
): void => {
    const map = originalMap as OpenLayersMap;
    const attribution = map.getControls().getArray()
        .find((control) => control instanceof Attribution) as Attribution | undefined;

    attribution?.setCollapsed(false);
    attribution?.setCollapsible(false);
    map.setView(new View({
        center: fromLonLat([center.lng, center.lat]),
        extent: transformExtent(EXTENT, 'EPSG:4326', 'EPSG:3857'),
        maxZoom: 16,
        minZoom: 14,
        smoothExtentConstraint: false,
        zoom,
    }));
};

const OsmMapStory = ({
    autoAdjust,
    centerOnCentralPark,
    controls,
    disabled,
    focusStateEnabled,
    tooltipsEnabled,
    tooltipsInitiallyShown,
    rtlEnabled,
    showRoute,
    routeColor,
    routePreset,
    routeOpacity,
    routeWeight,
    type,
    updateArgs,
    zoom,
}: OsmMapStoryProps): React.ReactElement => {
    const mapRef = React.useRef<MapRef>(null);
    const [markerAdded, setMarkerAdded] = React.useState(false);
    const preset = ROUTE_PRESETS[routePreset];
    const markers = React.useMemo(() => preset.markers.map((marker, index) => ({
        ...marker,
        onClick: handleMarkerClick,
        tooltip: tooltipsEnabled
            ? index === 0 ? 'Start' : {
                text: `<strong>Stop ${index + 1}</strong><br>Explore this location.`,
                isShown: tooltipsInitiallyShown,
            }
            : undefined,
    })), [preset, tooltipsEnabled, tooltipsInitiallyShown]);
    const addedMarker = React.useMemo(() => ({
        location: preset.extraMarker,
        tooltip: tooltipsEnabled ? 'Additional stop' : undefined,
    }), [preset, tooltipsEnabled]);
    const routes = React.useMemo(() => showRoute ? [{
        locations: preset.locations,
        color: routeColor,
        mode: preset.mode,
        opacity: routeOpacity,
        weight: routeWeight,
    }] : [], [preset, showRoute, routeColor, routeOpacity, routeWeight]);
    const center = centerOnCentralPark ? CENTRAL_PARK_CENTER : preset.center;

    React.useEffect(() => {
        setMarkerAdded(false);
    }, [preset, tooltipsEnabled, tooltipsInitiallyShown]);

    React.useEffect(() => {
        mapRef.current?.instance()?.option('zoom', preset.zoom);
    }, [preset]);

    React.useEffect(() => {
        mapRef.current?.instance()?.option('center', center);
    }, [center]);

    const addMarker = (): void => {
        const map = mapRef.current?.instance();
        if (!map || markerAdded) {
            return;
        }

        setMarkerAdded(true);
        void map.addMarker(addedMarker).then(undefined, () => setMarkerAdded(false));
    };

    const removeMarker = (): void => {
        const map = mapRef.current?.instance();
        if (!map || !markerAdded) {
            return;
        }

        setMarkerAdded(false);
        void map.removeMarker(addedMarker).then(undefined, () => setMarkerAdded(true));
    };

    return (
        <div style={STORY_STYLE}>
            <div>{preset.title}. {preset.markerDescription}</div>
            <div style={TOOLBAR_STYLE}>
                <Button
                    text="Add Marker"
                    type="default"
                    disabled={markerAdded}
                    onClick={addMarker}
                />
                <Button
                    text="Remove Marker"
                    disabled={!markerAdded}
                    onClick={removeMarker}
                />
            </div>
            <Map
                ref={mapRef}
                provider="osm"
                providerConfig={PROVIDER_CONFIG}
                autoAdjust={autoAdjust}
                defaultCenter={preset.center}
                controls={controls}
                disabled={disabled}
                focusStateEnabled={focusStateEnabled}
                markers={markers}
                routes={routes}
                onRouteAdded={handleRouteAdded}
                onRouteRemoved={handleRouteRemoved}
                rtlEnabled={rtlEnabled}
                type={type}
                zoom={zoom}
                height={520}
                width="100%"
                onReady={(event) => configureOpenLayersMap(event, center, zoom)}
                onZoomChange={(value) => updateArgs({ zoom: value })}
            />
        </div>
    );
};

const meta: Meta<OsmStoryArgs> = {
    title: 'Components/Map/OSM Provider',
    tags: ['!test'],
    render: function Render() {
        const [args, updateArgs] = useArgs<OsmStoryArgs>();

        return <OsmMapStory {...args} updateArgs={updateArgs} />;
    },
    parameters: {
        layout: 'fullscreen',
    },
    argTypes: {
        autoAdjust: {
            control: 'boolean',
            description: 'Automatically adjusts the map viewport when markers or routes are added.',
        },
        centerOnCentralPark: {
            control: 'boolean',
            description: 'Switches the map center between the selected route and Central Park.',
        },
        controls: {
            control: 'boolean',
        },
        disabled: {
            control: 'boolean',
        },
        focusStateEnabled: {
            control: 'boolean',
        },
        tooltipsEnabled: { control: 'boolean' },
        tooltipsInitiallyShown: {
            control: 'boolean',
            description: 'Sets isShown for object-form tooltips. The Start marker uses a string tooltip.',
        },
        rtlEnabled: {
            control: 'boolean',
        },
        showRoute: { control: 'boolean' },
        routeColor: {
            control: {
                type: 'select',
                labels: { '#0000ff': 'Blue', '#008000': 'Green', '#ff0000': 'Red' },
            },
            options: ['#0000ff', '#008000', '#ff0000'],
        },
        routePreset: {
            control: {
                type: 'select',
                labels: { manhattanDrive: 'Manhattan Drive', centralParkRun: 'Central Park Run' },
            },
            options: ['manhattanDrive', 'centralParkRun'],
            description: 'Saved OSRM routes: official Routes demo waypoints or an independently calculated Central Park loop. '
                + 'Driving returns coordinate tuples; walking returns a GeoJSON LineString. No routing service is called.',
        },
        routeOpacity: { control: { type: 'range', min: 0, max: 1, step: 0.1 } },
        routeWeight: { control: { type: 'number', min: 0, max: 20 } },
        type: {
            control: 'select',
            options: ['roadmap', 'satellite', 'hybrid'],
            description: 'The public OSM tile server provides one style, so this control exercises '
                + 'type changes without changing the map appearance.',
        },
        zoom: {
            control: {
                type: 'number',
                min: 14,
                max: 16,
                step: 0.25,
            },
        },
    },
};

export default meta;

type Story = StoryObj<OsmStoryArgs>;

export const Default: Story = {
    args: {
        autoAdjust: false,
        centerOnCentralPark: false,
        controls: true,
        disabled: false,
        focusStateEnabled: true,
        tooltipsEnabled: true,
        tooltipsInitiallyShown: false,
        rtlEnabled: false,
        showRoute: true,
        routeColor: '#0000ff',
        routePreset: 'manhattanDrive',
        routeOpacity: 0.5,
        routeWeight: 6,
        type: 'roadmap',
        zoom: 14,
    },
};
