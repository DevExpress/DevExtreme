import type { Meta, StoryObj } from '@storybook/react-webpack5';

import Attribution from 'ol/control/Attribution.js';
import type OpenLayersMap from 'ol/Map.js';
import 'ol/ol.css';
import { fromLonLat, transformExtent } from 'ol/proj.js';
import View from 'ol/View.js';
import React from 'react';
import Map from 'devextreme-react/map';
import type { ReadyEvent } from 'devextreme/ui/map';
import 'devextreme/ui/map/openlayers';

const CENTER = { lat: 40.7484, lng: -73.9857 };
const EXTENT: [number, number, number, number] = [-74.08, 40.67, -73.85, 40.88];
const TILE_SERVER = {
    url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19,
};
const PROVIDER_CONFIG = { tileServer: TILE_SERVER };

interface OsmStoryArgs {
    zoom: number;
}

const configureMap = (
    { originalMap }: ReadyEvent,
    zoom: number,
): void => {
    const map = originalMap as OpenLayersMap;
    const attribution = map.getControls().getArray()
        .find((control) => control instanceof Attribution) as Attribution | undefined;

    attribution?.setCollapsed(false);
    attribution?.setCollapsible(false);
    map.setView(new View({
        center: fromLonLat([CENTER.lng, CENTER.lat]),
        extent: transformExtent(EXTENT, 'EPSG:4326', 'EPSG:3857'),
        maxZoom: 16,
        minZoom: 14,
        showFullExtent: false,
        smoothExtentConstraint: false,
        zoom,
    }));
};

const OsmMapStory = ({ zoom }: OsmStoryArgs): React.ReactElement => (
    <Map
        provider="osm"
        providerConfig={PROVIDER_CONFIG}
        center={CENTER}
        zoom={zoom}
        height={520}
        width="100%"
        onReady={(event) => configureMap(event, zoom)}
    />
);

const meta: Meta<OsmStoryArgs> = {
    title: 'Components/Map/OSM Provider',
    component: OsmMapStory,
    tags: ['!test'],
    parameters: {
        layout: 'fullscreen',
    },
    argTypes: {
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
        zoom: 15,
    },
};
