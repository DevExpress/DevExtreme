import type { MapLocation } from '@js/ui/map';

import type {
  MapEngine,
  MapEngineMap,
  MapEngineSetViewOptions,
  MapEngineTileLayerOptions,
} from './provider.dynamic.osm.engine';

type Options = Record<string, unknown>;
type Coordinate = [number, number];

interface ViewLike {
  setCenter: (center: Coordinate) => void;
  setZoom: (zoom: number) => void;
}

interface TileLayerLike {
  setSource: (source: unknown) => void;
}

interface MapLike {
  addLayer: (layer: unknown) => void;
  getView: () => ViewLike;
  removeLayer: (layer: unknown) => void;
  setTarget: (target?: Element) => void;
  updateSize: () => void;
}

interface OpenLayersApi {
  Map: new (options: Options) => MapLike;
  View: new (options: Options) => ViewLike;
  control: {
    defaults: {
      defaults: (options?: Options) => unknown;
    };
  };
  interaction: {
    defaults: {
      defaults: (options?: Options) => unknown;
    };
  };
  layer: {
    Tile: new (options: Options) => TileLayerLike;
  };
  proj: {
    fromLonLat: (coordinate: Coordinate) => Coordinate;
  };
  source: {
    ImageTile: new (options: Options) => unknown;
  };
}

const isRecord = (value: unknown): value is Record<string, unknown> => (
  Boolean(value) && (typeof value === 'object' || typeof value === 'function')
);

const hasFunction = (value: unknown, property: string): boolean => (
  isRecord(value) && typeof value[property] === 'function'
);

const isOpenLayersApi = (api: unknown): api is OpenLayersApi => {
  if (!isRecord(api)) {
    return false;
  }

  return typeof api.Map === 'function'
    && typeof api.View === 'function'
    && isRecord(api.control)
    && isRecord(api.control.defaults)
    && hasFunction(api.control.defaults, 'defaults')
    && isRecord(api.interaction)
    && isRecord(api.interaction.defaults)
    && hasFunction(api.interaction.defaults, 'defaults')
    && hasFunction(api.layer, 'Tile')
    && hasFunction(api.proj, 'fromLonLat')
    && hasFunction(api.source, 'ImageTile');
};

const toCoordinate = (api: OpenLayersApi, location: MapLocation): Coordinate => (
  api.proj.fromLonLat([location.lng, location.lat])
);

const createTileUrlList = (
  url: string,
  // eslint-disable-next-line spellcheck/spell-checker -- tile server option name
  subdomains: MapEngineTileLayerOptions['subdomains'],
): string[] => {
  // eslint-disable-next-line spellcheck/spell-checker -- tile server option name
  const values = Array.isArray(subdomains) ? subdomains : [...(subdomains ?? '')];

  return values.map((value) => url.replace('{s}', value));
};

class OpenLayersMap implements MapEngineMap {
  readonly originalMap: MapLike;

  private readonly _keyboardEventTarget: Element;

  private readonly _ownsKeyboardTabIndex: boolean;

  private _tileLayer?: TileLayerLike;

  private _disposed = false;

  constructor(
    private readonly _api: OpenLayersApi,
    container: Element,
    view: MapEngineSetViewOptions = {},
  ) {
    const rootNode = container.getRootNode();
    const ShadowRootConstructor = container.ownerDocument.defaultView?.ShadowRoot;
    const shadowRoot = ShadowRootConstructor && rootNode instanceof ShadowRootConstructor
      ? rootNode
      : undefined;

    this._keyboardEventTarget = shadowRoot?.host ?? container;
    this._ownsKeyboardTabIndex = !this._keyboardEventTarget.hasAttribute('tabindex');
    if (this._ownsKeyboardTabIndex) {
      this._keyboardEventTarget.setAttribute('tabindex', '0');
    }

    this.originalMap = new _api.Map({
      controls: _api.control.defaults.defaults({ attribution: true, rotate: false, zoom: false }),
      interactions: _api.interaction.defaults.defaults({ onFocusOnly: false }),
      target: container,
      view: new _api.View({
        center: toCoordinate(_api, view.center ?? { lat: 0, lng: 0 }),
        zoom: view.zoom ?? 1,
      }),
    });
  }

  dispose(): void {
    if (this._disposed) {
      return;
    }

    this._disposed = true;
    if (this._tileLayer) {
      this.originalMap.removeLayer(this._tileLayer);
      this._tileLayer = undefined;
    }
    this.originalMap.setTarget(undefined);
    if (this._ownsKeyboardTabIndex && this._keyboardEventTarget.getAttribute('tabindex') === '0') {
      this._keyboardEventTarget.removeAttribute('tabindex');
    }
  }

  replaceTileLayer(options: MapEngineTileLayerOptions): void {
    const sourceOptions: Options = {
      maxZoom: options.maxZoom,
      url: options.url.includes('{s}')
        // eslint-disable-next-line spellcheck/spell-checker -- tile server option name
        ? createTileUrlList(options.url, options.subdomains)
        : options.url,
    };

    if (options.attribution !== undefined) {
      sourceOptions.attributions = options.attribution;
    }

    const source = new this._api.source.ImageTile(sourceOptions);

    if (this._tileLayer) {
      this._tileLayer.setSource(source);
      return;
    }

    this._tileLayer = new this._api.layer.Tile({ source });
    this.originalMap.addLayer(this._tileLayer);
  }

  setView(options: MapEngineSetViewOptions): void {
    const view = this.originalMap.getView();

    if (options.center) {
      view.setCenter(toCoordinate(this._api, options.center));
    }
    if (options.zoom !== undefined) {
      view.setZoom(options.zoom);
    }
  }

  updateDimensions(): void {
    this.originalMap.updateSize();
  }
}

export const createOpenLayersEngine = (api: unknown): MapEngine | undefined => (
  isOpenLayersApi(api)
    ? { createMap: (container, view) => new OpenLayersMap(api, container, view) }
    : undefined
);
