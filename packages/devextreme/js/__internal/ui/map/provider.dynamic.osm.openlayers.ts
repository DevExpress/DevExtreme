import type { MapLocation } from '@js/ui/map';

import type {
  MapEngine,
  MapEngineBounds,
  MapEngineClickEvent,
  MapEngineEventHandlers,
  MapEngineMap,
  MapEngineSetViewOptions,
  MapEngineTileLayerOptions,
  MapEngineViewState,
} from './provider.dynamic.osm.engine';

type Options = Record<string, unknown>;
type Coordinate = [number, number];
type Extent = [number, number, number, number];

const GEOGRAPHIC_PROJECTION = 'EPSG:4326';
const DEFAULT_VIEW_PROJECTION = 'EPSG:3857';

type ControlLike = object;

interface InteractionLike {
  getActive: () => boolean;
  setActive: (active: boolean) => void;
}

interface CollectionLike<T> {
  forEach: (callback: (item: T) => void) => void;
}

interface ViewLike {
  calculateExtent: () => Extent;
  fit: (extent: Extent) => void;
  getCenter: () => Coordinate | undefined;
  getProjection: () => unknown;
  getZoom: () => number | undefined;
  setCenter: (center: Coordinate) => void;
  setZoom: (zoom: number) => void;
}

interface TileLayerLike {
  setSource: (source: unknown) => void;
}

interface MapLike {
  addControl: (control: ControlLike) => void;
  addLayer: (layer: unknown) => void;
  getInteractions: () => CollectionLike<InteractionLike>;
  getView: () => ViewLike;
  on: (type: string, listener: (event: unknown) => void) => void;
  removeControl: (control: ControlLike) => void;
  removeLayer: (layer: unknown) => void;
  setTarget: (target?: Element) => void;
  un: (type: string, listener: (event: unknown) => void) => void;
  updateSize: () => void;
}

interface MapBrowserEventLike {
  coordinate?: Coordinate;
  originalEvent?: Event;
}

interface OpenLayersApi {
  Map: new (options: Options) => MapLike;
  View: new (options: Options) => ViewLike;
  control: {
    Zoom: new () => ControlLike;
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
    getUserProjection: () => unknown | null;
    toLonLat: (coordinate: Coordinate, projection?: unknown) => Coordinate;
    transform: (coordinate: Coordinate, source: unknown, destination: unknown) => Coordinate;
    transformExtent: (extent: Extent, source: unknown, destination: unknown) => Extent;
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
    && hasFunction(api.control, 'Zoom')
    && isRecord(api.control.defaults)
    && hasFunction(api.control.defaults, 'defaults')
    && isRecord(api.interaction)
    && isRecord(api.interaction.defaults)
    && hasFunction(api.interaction.defaults, 'defaults')
    && hasFunction(api.layer, 'Tile')
    && hasFunction(api.proj, 'getUserProjection')
    && hasFunction(api.proj, 'toLonLat')
    && hasFunction(api.proj, 'transform')
    && hasFunction(api.proj, 'transformExtent')
    && hasFunction(api.source, 'ImageTile');
};

const getCoordinateProjection = (
  api: OpenLayersApi,
  viewProjection: unknown,
): unknown => api.proj.getUserProjection() ?? viewProjection;

const areCoordinatesEqual = (
  first: Coordinate | undefined,
  second: Coordinate,
): boolean => first?.[0] === second[0] && first[1] === second[1];

const toCoordinate = (
  api: OpenLayersApi,
  location: MapLocation,
  viewProjection: unknown,
): Coordinate => api.proj.transform(
  [location.lng, location.lat],
  GEOGRAPHIC_PROJECTION,
  getCoordinateProjection(api, viewProjection),
);

const toLocation = (
  api: OpenLayersApi,
  coordinate: Coordinate,
  viewProjection: unknown,
): MapLocation => {
  const [lng, lat] = api.proj.toLonLat(
    coordinate,
    getCoordinateProjection(api, viewProjection),
  );

  return { lat, lng };
};

const createTileUrlList = (
  url: string,
  subdomains: MapEngineTileLayerOptions['subdomains'],
): string[] => {
  const values = Array.isArray(subdomains) ? subdomains : [...(subdomains ?? '')];

  return values.map((value) => url.split('{s}').join(value));
};

class OpenLayersMap implements MapEngineMap {
  readonly originalMap: MapLike;

  private readonly _container: Element;

  private _ownedKeyboardTabIndex: string | null | undefined;

  private _focusEnabled = true;

  private _tabIndex = 0;

  private readonly _zoomControl: ControlLike;

  private _controlsVisible = false;

  private _disabled = false;

  private _ownsDisabledInert = false;

  private readonly _interactionStates = new Map<InteractionLike, boolean>();

  private _eventHandlers?: {
    click: (event: unknown) => void;
    moveEnd: (event: unknown) => void;
  };

  private _tileLayer?: TileLayerLike;

  private _disposed = false;

  constructor(
    private readonly _api: OpenLayersApi,
    container: Element,
    view: MapEngineSetViewOptions = {},
  ) {
    this._container = container;
    this._ownedKeyboardTabIndex = container.hasAttribute('tabindex') ? undefined : null;
    this._syncKeyboardTabIndex();

    this.originalMap = new _api.Map({
      controls: _api.control.defaults.defaults({ attribution: true, rotate: false, zoom: false }),
      interactions: _api.interaction.defaults.defaults({
        altShiftDragRotate: false,
        onFocusOnly: false,
        pinchRotate: false,
      }),
      keyboardEventTarget: container,
      target: container,
      view: new _api.View({
        center: toCoordinate(
          _api,
          view.center ?? { lat: 0, lng: 0 },
          DEFAULT_VIEW_PROJECTION,
        ),
        projection: DEFAULT_VIEW_PROJECTION,
        zoom: view.zoom ?? 1,
      }),
    });
    this._zoomControl = new _api.control.Zoom();
  }

  attachHandlers(handlers: MapEngineEventHandlers): void {
    this._detachHandlers();

    const click = (event: unknown): void => {
      const { coordinate, originalEvent } = event as MapBrowserEventLike;
      if (!coordinate) {
        return;
      }

      const clickEvent: MapEngineClickEvent = {
        location: toLocation(
          this._api,
          coordinate,
          this.originalMap.getView().getProjection(),
        ),
      };
      if (originalEvent) {
        clickEvent.event = originalEvent;
      }
      handlers.click(clickEvent);
    };
    const moveEnd = (): void => {
      handlers.viewChange(this._getViewState());
    };

    this._eventHandlers = { click, moveEnd };
    this.originalMap.on('click', click);
    this.originalMap.on('moveend', moveEnd);
  }

  private _detachHandlers(): void {
    if (!this._eventHandlers) {
      return;
    }

    this.originalMap.un('click', this._eventHandlers.click);
    this.originalMap.un('moveend', this._eventHandlers.moveEnd);
    this._eventHandlers = undefined;
  }

  private _getViewState(): MapEngineViewState {
    const view = this.originalMap.getView();
    const center = view.getCenter();
    const zoom = view.getZoom();
    const extent = view.calculateExtent();

    const result: MapEngineViewState = {
      bounds: {
        northEast: toLocation(this._api, [extent[2], extent[3]], view.getProjection()),
        southWest: toLocation(this._api, [extent[0], extent[1]], view.getProjection()),
      },
    };

    if (center) {
      result.center = toLocation(this._api, center, view.getProjection());
    }
    if (zoom !== undefined) {
      result.zoom = zoom;
    }

    return result;
  }

  dispose(): void {
    if (this._disposed) {
      return;
    }

    this._disposed = true;
    this._detachHandlers();
    this._removeOwnedInert();
    this.setControls(false);
    if (this._tileLayer) {
      this.originalMap.removeLayer(this._tileLayer);
      this._tileLayer = undefined;
    }
    this.originalMap.setTarget(undefined);
    if (this._ownedKeyboardTabIndex !== undefined
      && this._container.getAttribute('tabindex') === this._ownedKeyboardTabIndex) {
      this._container.removeAttribute('tabindex');
    }
  }

  fitBounds(bounds: MapEngineBounds): void {
    const west = bounds.southWest.lng;
    const east = bounds.northEast.lng < west
      ? bounds.northEast.lng + 360
      : bounds.northEast.lng;
    const geographicExtent: Extent = [
      west,
      Math.min(bounds.northEast.lat, bounds.southWest.lat),
      east,
      Math.max(bounds.northEast.lat, bounds.southWest.lat),
    ];
    const view = this.originalMap.getView();
    const extent = this._api.proj.transformExtent(
      geographicExtent,
      GEOGRAPHIC_PROJECTION,
      getCoordinateProjection(this._api, view.getProjection()),
    );
    view.fit(extent);
  }

  replaceTileLayer(options: MapEngineTileLayerOptions): void {
    const sourceOptions: Options = {
      maxZoom: options.maxZoom,
      url: options.url.includes('{s}')
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

  setControls(visible: boolean): void {
    if (visible === this._controlsVisible) {
      return;
    }

    this._controlsVisible = visible;
    if (visible) {
      this.originalMap.addControl(this._zoomControl);
    } else {
      this.originalMap.removeControl(this._zoomControl);
    }
  }

  setDisabled(disabled: boolean): void {
    if (disabled === this._disabled) {
      return;
    }

    this._disabled = disabled;
    const interactions = this.originalMap.getInteractions();

    if (disabled) {
      this._disableKeyboardAccess();
      this._interactionStates.clear();
      interactions.forEach((interaction) => {
        this._interactionStates.set(interaction, interaction.getActive());
        interaction.setActive(false);
      });
    } else {
      this._restoreKeyboardAccess();
      interactions.forEach((interaction) => {
        const active = this._interactionStates.get(interaction);
        if (active !== undefined) {
          interaction.setActive(active);
        }
      });
      this._interactionStates.clear();
    }
  }

  private _disableKeyboardAccess(): void {
    if (!this._container.hasAttribute('inert')) {
      this._container.setAttribute('inert', '');
      this._ownsDisabledInert = true;
    }
    this._syncKeyboardTabIndex();
  }

  private _restoreKeyboardAccess(): void {
    this._removeOwnedInert();
    this._syncKeyboardTabIndex();
  }

  private _removeOwnedInert(): void {
    if (this._ownsDisabledInert) {
      this._container.removeAttribute('inert');
      this._ownsDisabledInert = false;
    }
  }

  setFocus(enabled: boolean, tabIndex: number): void {
    this._focusEnabled = enabled;
    this._tabIndex = tabIndex;
    this._syncKeyboardTabIndex();
  }

  private _syncKeyboardTabIndex(): void {
    if (this._ownedKeyboardTabIndex === undefined) {
      return;
    }

    if (this._container.getAttribute('tabindex') !== this._ownedKeyboardTabIndex) {
      this._ownedKeyboardTabIndex = undefined;
      return;
    }

    if (this._focusEnabled && !this._disabled) {
      const tabIndex = String(this._tabIndex);
      this._container.setAttribute('tabindex', tabIndex);
      this._ownedKeyboardTabIndex = tabIndex;
    } else {
      this._container.removeAttribute('tabindex');
      this._ownedKeyboardTabIndex = null;
    }
  }

  setView(options: MapEngineSetViewOptions): void {
    const view = this.originalMap.getView();

    if (options.center) {
      const center = toCoordinate(this._api, options.center, view.getProjection());
      if (!areCoordinatesEqual(view.getCenter(), center)) {
        view.setCenter(center);
      }
    }
    if (options.zoom !== undefined && view.getZoom() !== options.zoom) {
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
