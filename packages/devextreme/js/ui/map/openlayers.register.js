import { defaults as defaultControls } from 'ol/control/defaults.js';
import { defaults as defaultInteractions } from 'ol/interaction/defaults.js';
import TileLayer from 'ol/layer/Tile.js';
import Map from 'ol/Map.js';
import { fromLonLat } from 'ol/proj.js';
import ImageTile from 'ol/source/ImageTile.js';
import View from 'ol/View.js';

import { setRegisteredMapEngine } from '../../__internal/ui/map/provider.dynamic.osm.engine';
import { createOpenLayersEngine } from '../../__internal/ui/map/provider.dynamic.osm.openlayers';

setRegisteredMapEngine(createOpenLayersEngine({
    Map,
    View,
    control: {
        defaults: {
            defaults: defaultControls,
        },
    },
    interaction: {
        defaults: {
            defaults: defaultInteractions,
        },
    },
    layer: {
        Tile: TileLayer,
    },
    proj: {
        fromLonLat,
    },
    source: {
        ImageTile,
    },
}));
