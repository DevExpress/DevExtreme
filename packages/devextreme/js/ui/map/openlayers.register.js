import { defaults as defaultControls } from 'ol/control/defaults.js';
import Zoom from 'ol/control/Zoom.js';
import Feature from 'ol/Feature.js';
import LineString from 'ol/geom/LineString.js';
import { defaults as defaultInteractions } from 'ol/interaction/defaults.js';
import TileLayer from 'ol/layer/Tile.js';
import VectorLayer from 'ol/layer/Vector.js';
import Map from 'ol/Map.js';
import Overlay from 'ol/Overlay.js';
import {
    getUserProjection,
    toLonLat,
    transform,
    transformExtent,
} from 'ol/proj.js';
import ImageTile from 'ol/source/ImageTile.js';
import VectorSource from 'ol/source/Vector.js';
import Stroke from 'ol/style/Stroke.js';
import Style from 'ol/style/Style.js';
import View from 'ol/View.js';

import { setRegisteredMapEngine } from '../../__internal/ui/map/provider.dynamic.osm.engine';
import { createOpenLayersEngine } from '../../__internal/ui/map/provider.dynamic.osm.openlayers';

setRegisteredMapEngine(createOpenLayersEngine({
    Feature,
    Map,
    Overlay,
    View,
    geom: { LineString },
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
        Vector: VectorLayer,
    },
    proj: {
        getUserProjection,
        toLonLat,
        transform,
        transformExtent,
    },
    source: {
        ImageTile,
        Vector: VectorSource,
    },
    style: { Stroke, Style },
}));
