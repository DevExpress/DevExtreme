import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { useArgs } from 'storybook/preview-api';

import Attribution from 'ol/control/Attribution.js';
import type OpenLayersMap from 'ol/Map.js';
import 'ol/ol.css';
import { fromLonLat, transformExtent } from 'ol/proj.js';
import View from 'ol/View.js';
import React from 'react';
import Map, { type MapRef } from 'devextreme-react/map';
import type {
    MapLocation,
    MapType,
    ReadyEvent,
} from 'devextreme/ui/map';
import 'devextreme/ui/map/openlayers';

const CENTER = { lat: 40.7484, lng: -73.9857 };
const CENTRAL_PARK_CENTER = { lat: 40.7829, lng: -73.9654 };
const EXTENT: [number, number, number, number] = [-74.08, 40.67, -73.85, 40.88];
const TILE_SERVER = {
    url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19,
};
const PROVIDER_CONFIG = { tileServer: () => TILE_SERVER };

interface OsmStoryArgs {
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
    const center = centerOnCentralPark ? CENTRAL_PARK_CENTER : CENTER;

    React.useEffect(() => {
        mapRef.current?.instance()?.option('center', center);
    }, [center]);

    return (
        <Map
            ref={mapRef}
            provider="osm"
            providerConfig={PROVIDER_CONFIG}
            defaultCenter={CENTER}
            controls={controls}
            disabled={disabled}
            focusStateEnabled={focusStateEnabled}
            rtlEnabled={rtlEnabled}
            type={type}
            zoom={zoom}
            height={520}
            width="100%"
            onReady={(event) => configureOpenLayersMap(event, center, zoom)}
            onZoomChange={(value) => updateArgs({ zoom: value })}
        />
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
        centerOnCentralPark: false,
        controls: true,
        disabled: false,
        focusStateEnabled: true,
        rtlEnabled: false,
        type: 'roadmap',
        zoom: 15,
    },
};
