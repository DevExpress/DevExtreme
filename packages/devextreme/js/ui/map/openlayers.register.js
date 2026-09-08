import { defaults as defaultControls } from 'ol/control/defaults.js';
import Zoom from 'ol/control/Zoom.js';
import { defaults as defaultInteractions } from 'ol/interaction/defaults.js';
import TileLayer from 'ol/layer/Tile.js';
import Map from 'ol/Map.js';
import Overlay from 'ol/Overlay.js';
import {
    getUserProjection,
    toLonLat,
    transform,
    transformExtent,
} from 'ol/proj.js';
import ImageTile from 'ol/source/ImageTile.js';
import View from 'ol/View.js';

import { setRegisteredMapEngine } from '../../__internal/ui/map/provider.dynamic.osm.engine';
import { createOpenLayersEngine } from '../../__internal/ui/map/provider.dynamic.osm.openlayers';

setRegisteredMapEngine(createOpenLayersEngine({
    Map,
    Overlay,
    View,
    control: {
        Zoom,
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
        getUserProjection,
        toLonLat,
        transform,
        transformExtent,
    },
    source: {
        ImageTile,
    },
}));
