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
    MapLocation,
    MapType,
    ReadyEvent,
} from 'devextreme/ui/map';
import 'devextreme/ui/map/openlayers';

const CENTER = { lat: 40.7484, lng: -73.9857 };
const CENTRAL_PARK_CENTER = { lat: 40.7829, lng: -73.9654 };
const DEFAULT_MARKER_LOCATION = 'Empire State Building';
const CUSTOM_MARKER_LOCATION = 'Bryant Park';
const ADDED_MARKER_LOCATION = 'Times Square';
const EXTENT: [number, number, number, number] = [-74.08, 40.67, -73.85, 40.88];
const TILE_SERVER = {
    url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19,
};
const MARKER_LOCATIONS: Record<string, MapLocation> = {
    [DEFAULT_MARKER_LOCATION]: CENTER,
    [CUSTOM_MARKER_LOCATION]: { lat: 40.7536, lng: -73.9832 },
    [ADDED_MARKER_LOCATION]: { lat: 40.758, lng: -73.9855 },
};
const PROVIDER_CONFIG = {
    calculateLocation: (query: string): Promise<MapLocation | undefined> => (
        Promise.resolve(MARKER_LOCATIONS[query])
    ),
    tileServer: () => TILE_SERVER,
};
const handleMarkerClick = fn();
const DEFAULT_MARKER = {
    location: DEFAULT_MARKER_LOCATION,
    onClick: handleMarkerClick,
};
const CUSTOM_MARKER = {
    location: CUSTOM_MARKER_LOCATION,
    iconSrc: 'images/maps/map-marker.png',
    onClick: handleMarkerClick,
};
const ADDED_MARKER = {
    location: ADDED_MARKER_LOCATION,
    onClick: handleMarkerClick,
};
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
    rtlEnabled: boolean;
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
    rtlEnabled,
    type,
    updateArgs,
    zoom,
}: OsmMapStoryProps): React.ReactElement => {
    const mapRef = React.useRef<MapRef>(null);
    const [markerAdded, setMarkerAdded] = React.useState(false);
    const markers = React.useMemo(() => [DEFAULT_MARKER, CUSTOM_MARKER], []);
    const center = centerOnCentralPark ? CENTRAL_PARK_CENTER : CENTER;

    React.useEffect(() => {
        mapRef.current?.instance()?.option('center', center);
    }, [center]);

    const addMarker = (): void => {
        const map = mapRef.current?.instance();
        if (!map || markerAdded) {
            return;
        }

        setMarkerAdded(true);
        void map.addMarker(ADDED_MARKER).then(undefined, () => setMarkerAdded(false));
    };

    const removeMarker = (): void => {
        const map = mapRef.current?.instance();
        if (!map || !markerAdded) {
            return;
        }

        setMarkerAdded(false);
        void map.removeMarker(ADDED_MARKER).then(undefined, () => setMarkerAdded(true));
    };

    return (
        <div style={STORY_STYLE}>
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
                defaultCenter={CENTER}
                controls={controls}
                disabled={disabled}
                focusStateEnabled={focusStateEnabled}
                markers={markers}
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
            description: 'Automatically adjusts the map viewport when markers change.',
        },
        centerOnCentralPark: {
            control: 'boolean',
            description: 'Switches the map center between the default New York location and Central Park.',
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
        rtlEnabled: {
            control: 'boolean',
        },
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
        rtlEnabled: false,
        type: 'roadmap',
        zoom: 15,
    },
};
