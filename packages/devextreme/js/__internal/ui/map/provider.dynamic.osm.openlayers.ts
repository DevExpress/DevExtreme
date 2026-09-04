import messageLocalization from '@js/common/core/localization/message';
import { ALL_FOCUSABLE_ELEMENTS_SELECTOR } from '@ts/core/utils/m_selectors';

import type {
  MapEngine,
  MapEngineBounds,
  MapEngineClickEvent,
  MapEngineEventHandlers,
  MapEngineFitBoundsOptions,
  MapEngineMap,
  MapEngineMarker,
  MapEngineMarkerOptions,
  MapEngineSetViewOptions,
  MapEngineTileLayerOptions,
  MapEngineViewState,
} from './provider.dynamic.osm.engine';
import { SUBDOMAIN_PLACEHOLDER } from './provider.dynamic.osm.engine';
import {
  createMarkerElement,
  DEFAULT_MARKER_CLASS,
  DEFAULT_MARKER_SIZE,
  MARKER_FALLBACK_HEIGHT,
  MARKER_FALLBACK_WIDTH,
} from './provider.dynamic.osm.openlayers.marker';
import type {
  ControlLike,
  Coordinate,
  Extent,
  InteractionLike,
  MapLike,
  OpenLayersApi,
  Options,
  OverlayLike,
  TileLayerLike,
  ViewLike,
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

const KEY_RELEASE_EVENT = 'keyup';

interface MarkerFocusTarget {
  element: HTMLElement;
  tabIndex: string | null;
}

interface MarkerElementBinding {
  focusTargets: MarkerFocusTarget[];
  detach: () => void;
}

interface OpenLayersMarker extends MapEngineMarker {
  element: HTMLElement;
  focusTargets: MarkerFocusTarget[];
  location: MapEngineMarkerOptions['location'];
  offset: number[];
  overlay: OverlayLike;
  positioning: string;
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

  private readonly _markers = new Set<OpenLayersMarker>();

  private _eventHandlers?: {
    click: (event: unknown) => void;
    markerSizeChange: () => void;
    moveEnd: (event: unknown) => void;
  };

  private _tileLayer?: TileLayerLike;

  private _disposed = false;

  private _markerFitNeedsLayout = false;

  private _subscribedView: ViewLike;

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
    this.originalMap.getOverlayContainer().setAttribute('dir', 'ltr');
    this.originalMap.getOverlayContainerStopEvent().setAttribute('dir', 'ltr');
    this._subscribedView = this.originalMap.getView();
    this._subscribedView.on('change:center', this._viewCenterChangeHandler);
    this.originalMap.on('change:view', this._viewChangeHandler);
    this._zoomControl = new _api.control.Zoom();
  }

  private readonly _viewCenterChangeHandler = (): void => {
    this._syncMarkerPositions();
  };

  private readonly _viewChangeHandler = (): void => {
    const view = this.originalMap.getView();

    if (view === this._subscribedView) {
      return;
    }

    this._subscribedView.un('change:center', this._viewCenterChangeHandler);
    this._subscribedView = view;
    this._subscribedView.on('change:center', this._viewCenterChangeHandler);
    this._syncMarkerPositions();
    this._syncMarkerTabIndexes();
  };

  attachHandlers(handlers: MapEngineEventHandlers): void {
    this._detachHandlers();
    this._initHandlers(handlers);
  }

  private _attachMarkerElementHandlers(
    element: HTMLElement,
    onClick: MapEngineMarkerOptions['onClick'],
  ): MarkerElementBinding {
    const keyboardInteractive = Boolean(onClick)
      && !element.querySelector(ALL_FOCUSABLE_ELEMENTS_SELECTOR);
    const focusTargets: MarkerFocusTarget[] = keyboardInteractive
      ? [{ element, tabIndex: '0' }]
      : Array.from(element.querySelectorAll<HTMLElement>(ALL_FOCUSABLE_ELEMENTS_SELECTOR))
        .map((focusTarget) => ({
          element: focusTarget,
          tabIndex: focusTarget.getAttribute('tabindex'),
        }));
    const clickHandler: EventListener | undefined = onClick
      ? (event): void => {
        event.stopPropagation();
        onClick();
      }
      : undefined;
    const keydownHandler: EventListener | undefined = focusTargets.length
      ? (event): void => {
        event.stopPropagation();

        if (!keyboardInteractive) {
          return;
        }

        const keyboardEvent = event as KeyboardEvent;
        if (keyboardEvent.key !== 'Enter' && keyboardEvent.key !== ' ') {
          return;
        }

        event.preventDefault();
        if (keyboardEvent.key === 'Enter' && !keyboardEvent.repeat) {
          element.click();
        }
      }
      : undefined;
    const keyReleaseHandler: EventListener | undefined = keyboardInteractive
      ? (event): void => {
        const keyboardEvent = event as KeyboardEvent;
        if (keyboardEvent.key !== ' ') {
          return;
        }

        event.preventDefault();
        event.stopPropagation();
        element.click();
      }
      : undefined;
    const hasImage = element.tagName === 'IMG' || element.querySelector('img') !== null;
    const imageLoadHandler: EventListener | undefined = hasImage
      ? (): void => this._eventHandlers?.markerSizeChange()
      : undefined;

    if (clickHandler) {
      element.addEventListener('click', clickHandler);
    }
    if (keyboardInteractive) {
      element.setAttribute('role', 'button');
      if (!element.textContent?.trim() && !element.getAttribute('alt')) {
        element.setAttribute(
          'aria-label',
          messageLocalization.format('dxMap-markerAriaLabel'),
        );
      }
    }
    if (keydownHandler) {
      element.addEventListener('keydown', keydownHandler);
    }
    if (keyReleaseHandler) {
      element.addEventListener(KEY_RELEASE_EVENT, keyReleaseHandler);
    }
    if (imageLoadHandler) {
      element.addEventListener('load', imageLoadHandler, true);
    }

    return {
      focusTargets,
      detach: (): void => {
        if (clickHandler) {
          element.removeEventListener('click', clickHandler);
        }
        if (keydownHandler) {
          element.removeEventListener('keydown', keydownHandler);
        }
        if (keyReleaseHandler) {
          element.removeEventListener(KEY_RELEASE_EVENT, keyReleaseHandler);
        }
        if (imageLoadHandler) {
          element.removeEventListener('load', imageLoadHandler, true);
        }
      },
    };
  }

  addMarker(options: MapEngineMarkerOptions): MapEngineMarker {
    const { element, offset, positioning } = createMarkerElement(
      this._container.ownerDocument,
      options,
    );
    const marker = new this._api.Overlay({
      element,
      insertFirst: true,
      offset,
      position: this._getMarkerPosition(options.location),
      positioning,
      stopEvent: false,
    });
    const markerElementBinding = this._attachMarkerElementHandlers(element, options.onClick);
    this.originalMap.addOverlay(marker);

    let disposed = false;
    const handle: OpenLayersMarker = {
      element,
      focusTargets: markerElementBinding.focusTargets,
      location: { ...options.location },
      offset,
      overlay: marker,
      positioning,
      originalMarker: marker,
      dispose: (): void => {
        if (disposed) {
          return;
        }

        disposed = true;
        markerElementBinding.detach();
        this.originalMap.removeOverlay(marker);
        this._markers.delete(handle);
      },
    };

    this._markers.add(handle);
    this._syncMarkerTabIndex(handle);

    return handle;
  }

  private _getMarkerPosition(location: MapEngineMarkerOptions['location']): Coordinate {
    const view = this.originalMap.getView();
    const projection = view.getProjection();
    const coordinate = toCoordinate(this._api, location, projection);
    const center = view.getCenter();

    if (!center) {
      return coordinate;
    }

    const west = toCoordinate(this._api, { lat: 0, lng: -180 }, projection)[0];
    const east = toCoordinate(this._api, { lat: 0, lng: 180 }, projection)[0];
    const worldWidth = Math.abs(east - west);

    if (Number.isFinite(worldWidth) && worldWidth > 0) {
      coordinate[0] += Math.round((center[0] - coordinate[0]) / worldWidth) * worldWidth;
    }

    return coordinate;
  }

  private _syncMarkerPositions(): void {
    this._markers.forEach((marker) => {
      marker.overlay.setPosition(this._getMarkerPosition(marker.location));
    });
  }

  private _syncMarkerTabIndex(marker: OpenLayersMarker, viewExtent?: Extent): void {
    const extent = viewExtent ?? this.originalMap.getView().calculateExtent();
    const isVisible = this._isMarkerVisible(marker, extent);

    marker.focusTargets.forEach(({ element, tabIndex }) => {
      if (!this._focusEnabled || this._disabled || !isVisible) {
        element.setAttribute('tabindex', '-1');
      } else if (tabIndex === null) {
        element.removeAttribute('tabindex');
      } else {
        element.setAttribute('tabindex', tabIndex);
      }
    });

    if (this._focusEnabled && !this._disabled && !isVisible) {
      this._moveMarkerFocusToMap(marker);
    }
  }

  private _syncMarkerTabIndexes(): void {
    const viewExtent = this.originalMap.getView().calculateExtent();

    this._markers.forEach((marker) => this._syncMarkerTabIndex(marker, viewExtent));
  }

  private _isMarkerVisible(marker: OpenLayersMarker, viewExtent: Extent): boolean {
    const position = marker.overlay.getPosition();
    if (!position) {
      return false;
    }

    const [minX, minY, maxX, maxY] = viewExtent;
    const [x, y] = position;

    return x >= minX
      && x <= maxX
      && y >= minY
      && y <= maxY;
  }

  private _moveMarkerFocusToMap(marker: OpenLayersMarker): void {
    const markerRoot = marker.element.getRootNode() as Document | ShadowRoot;
    const { activeElement } = markerRoot;
    const markerHasFocus = marker.focusTargets.some(({ element }) => element === activeElement);
    const container = this._container as HTMLElement;

    if (markerHasFocus && typeof container.focus === 'function') {
      container.focus({ preventScroll: true });
    }
  }

  private _getMarkerFitPadding(): { padding: number[]; needsLayout: boolean } {
    const padding = [0, 0, 0, 0];
    let needsLayout = false;

    this._markers.forEach(({ element, offset, positioning }) => {
      const isDefault = element.classList.contains(DEFAULT_MARKER_CLASS);
      const rect = isDefault ? undefined : element.getBoundingClientRect();
      needsLayout ||= !isDefault && (!rect?.width || !rect.height);
      const defaultSize = isDefault
        ? DEFAULT_MARKER_SIZE
        : undefined;
      const width = Math.max(rect?.width ?? 0, defaultSize ?? MARKER_FALLBACK_WIDTH);
      const height = Math.max(rect?.height ?? 0, defaultSize ?? MARKER_FALLBACK_HEIGHT);
      let left = offset[0];
      let top = offset[1];

      if (positioning === 'bottom-center') {
        left -= width / 2;
        top -= height;
      }

      padding[0] = Math.max(padding[0], Math.ceil(Math.max(0, -top)));
      padding[1] = Math.max(padding[1], Math.ceil(Math.max(0, left + width)));
      padding[2] = Math.max(padding[2], Math.ceil(Math.max(0, top + height)));
      padding[3] = Math.max(padding[3], Math.ceil(Math.max(0, -left)));
    });

    return { needsLayout, padding };
  }

  private _initHandlers(handlers: MapEngineEventHandlers): void {
    const click = (event: unknown): void => {
      const { coordinate, originalEvent } = event as MapBrowserEventLike;
      if (!coordinate || this._isMarkerEvent(originalEvent)) {
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
      this._syncMarkerTabIndexes();
      handlers.viewChange(this._getViewState());
    };

    this._eventHandlers = {
      click,
      markerSizeChange: handlers.markerSizeChange,
      moveEnd,
    };
    this.originalMap.on('click', click);
    this.originalMap.on('moveend', moveEnd);
  }

  private _isMarkerEvent(event?: Event): boolean {
    const eventTarget = event?.target;
    const NodeConstructor = this._container.ownerDocument.defaultView?.Node;

    if (!eventTarget || !NodeConstructor || !(eventTarget instanceof NodeConstructor)) {
      return false;
    }

    return [...this._markers].some(({ element }) => element.contains(eventTarget));
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
    this.originalMap.un('change:view', this._viewChangeHandler);
    this._subscribedView.un('change:center', this._viewCenterChangeHandler);
    this._removeOwnedInert();
    [...this._markers].forEach((marker) => marker.dispose());
    this.setControls(false);
    if (this._tileLayer) {
      this.originalMap.removeLayer(this._tileLayer);
      this._tileLayer = undefined;
    }
    this.originalMap.setTarget(undefined);
    this._container.removeAttribute('tabindex');
  }

  fitBounds(bounds: MapEngineBounds, options?: MapEngineFitBoundsOptions): void {
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
    const markerFit = options?.includeMarkerPadding
      ? this._getMarkerFitPadding()
      : undefined;
    this._markerFitNeedsLayout = Boolean(markerFit?.needsLayout);
    view.fit(extent, markerFit ? { padding: markerFit.padding } : undefined);
    this._syncMarkerTabIndexes();
  }

  getZoom(): number | undefined {
    return this.originalMap.getView().getZoom();
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
    this._markers.forEach((marker) => this._syncMarkerTabIndex(marker));
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

    this._syncMarkerTabIndexes();
  }

  updateDimensions(): boolean {
    this.originalMap.updateSize();
    this._syncMarkerTabIndexes();
    const needsViewportAdjustment = this._markerFitNeedsLayout;
    this._markerFitNeedsLayout = false;

    return needsViewportAdjustment;
  }
}

export const createOpenLayersEngine = (api: unknown): MapEngine | undefined => (
  isOpenLayersApi(api)
    ? { createMap: (container, view) => new OpenLayersMap(api, container, view) }
    : undefined
);
