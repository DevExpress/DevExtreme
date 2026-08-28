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
import { SUBDOMAIN_PLACEHOLDER } from './provider.dynamic.osm.engine';
import type {
  ControlLike,
  Coordinate,
  Extent,
  InteractionLike,
  MapLike,
  OpenLayersApi,
  Options,
  TileLayerLike,
} from './provider.dynamic.osm.openlayers.utils';
import {
  areCoordinatesEqual,
  createTileUrlList,
  DEFAULT_VIEW_PROJECTION,
  GEOGRAPHIC_PROJECTION,
  getCoordinateProjection,
  isOpenLayersApi,
  toCoordinate,
  toLocation,
} from './provider.dynamic.osm.openlayers.utils';

interface MapBrowserEventLike {
  coordinate?: Coordinate;
  originalEvent?: Event;
}

class OpenLayersMap implements MapEngineMap {
  readonly originalMap: MapLike;

  private readonly _container: Element;

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
    this._initHandlers(handlers);
  }

  private _initHandlers(handlers: MapEngineEventHandlers): void {
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
    this._container.removeAttribute('tabindex');
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
      url: options.url.includes(SUBDOMAIN_PLACEHOLDER)
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
    if (this._focusEnabled && !this._disabled) {
      this._container.setAttribute('tabindex', String(this._tabIndex));
    } else {
      this._container.removeAttribute('tabindex');
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
