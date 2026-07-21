/* eslint-disable @typescript-eslint/no-misused-promises */
import Color from '@js/color';
import { isDefined } from '@js/core/utils/type';
import { getWindow } from '@js/core/utils/window';
import type {
  MapType,
  // eslint-disable-next-line spellcheck/spell-checker -- OpenStreetMap API identifier
  OsmRouteResult as RouteResult,
  // eslint-disable-next-line spellcheck/spell-checker -- OpenStreetMap API identifier
  OsmTileServerConfig as TileServerConfig,
  RouteMode,
} from '@js/ui/map';
import errors from '@js/ui/widget/ui.errors';

import type {
  LocationOption,
  MarkerObject, MarkerOptions, PlainLocation, RouteObject, RouteOptions,
} from './provider.dynamic';
import DynamicProvider from './provider.dynamic';
import type {
  LeafletAdapter,
  LeafletBounds,
  LeafletLayer,
  LeafletMarker,
  LeafletPopup,
  LeafletZoomControl,
} from './provider.dynamic.osm.leaflet';
import {
  createLeafletAdapter,
} from './provider.dynamic.osm.leaflet';

const window = getWindow();

const DEFAULT_MAX_ZOOM = 19;
const DEFAULT_SUBDOMAINS = 'abc';
const MARKER_ICON_SIZE = [25, 41];
const MARKER_ICON_ANCHOR = [12, 41];
const MARKER_POPUP_ANCHOR = [1, -34];
const GEOCODING_FAILED = new Error('Geocoding failed');

const normalizeRouteResult = (result: RouteResult): [number, number][] => {
  if (Array.isArray(result)) {
    return result;
  }

  if (result?.type === 'LineString' && Array.isArray(result.coordinates)) {
    return result.coordinates.map(([lng, lat]) => [lat, lng]);
  }

  throw new Error('Unsupported route result');
};

// eslint-disable-next-line spellcheck/spell-checker -- OpenStreetMap API identifier
export type OsmLocation = PlainLocation;

// eslint-disable-next-line spellcheck/spell-checker -- OpenStreetMap API identifier
class OsmProvider extends DynamicProvider {
  _leaflet!: LeafletAdapter;

  _tileLayer?: LeafletLayer;

  _zoomControl?: LeafletZoomControl;

  _currentTileType!: MapType;

  // eslint-disable-next-line spellcheck/spell-checker -- Leaflet/OpenStreetMap API identifiers
  _clickHandler?: (e: { latlng: OsmLocation; originalEvent: Event }) => void;

  _viewChangeHandler?: () => void;

  _preventZoomChangeEvent?: boolean;

  _movementMode(type: RouteMode | string = ''): string {
    return type || 'driving';
  }

  // eslint-disable-next-line spellcheck/spell-checker -- OpenStreetMap API identifier
  _resolveLocation(location?: LocationOption | null): Promise<OsmLocation> {
    return new Promise((resolve) => {
      const latLng = this._getLatLng(location);
      if (latLng) {
        resolve({ lat: latLng.lat, lng: latLng.lng });
      } else {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        this._geocodeLocation(location as string).then((geocodedLocation) => {
          resolve(geocodedLocation);
        });
      }
    });
  }

  // eslint-disable-next-line spellcheck/spell-checker -- OpenStreetMap API identifier
  _geocodeLocation(location: string): Promise<OsmLocation> {
    // eslint-disable-next-line spellcheck/spell-checker -- OpenStreetMap API identifier
    const cachedLocation = this._geocodedLocations[location] as OsmLocation | undefined;

    if (cachedLocation) {
      return Promise.resolve(cachedLocation);
    }

    return this._geocodeLocationImpl(location)
      .then((geocodedLocation) => {
        this._geocodedLocations[location] = geocodedLocation;

        return geocodedLocation;
      })
      .catch(() => ({ lat: 0, lng: 0 }));
  }

  // eslint-disable-next-line spellcheck/spell-checker -- OpenStreetMap API identifier
  _geocodeLocationImpl(location: string): Promise<OsmLocation> {
    if (!isDefined(location)) {
      return Promise.reject(GEOCODING_FAILED);
    }

    const geocodeFn = this._option('providerConfig')?.geocodeLocation as ((query: string) => Promise<{ lat: number; lng: number } | null | undefined>) | undefined;

    if (!geocodeFn) {
      errors.log('W1031', location);

      return Promise.reject(GEOCODING_FAILED);
    }

    return Promise.resolve()
      .then(() => geocodeFn(location))
      .then((result) => {
        if (result?.lat != null && result?.lng != null) {
          return { lat: result.lat, lng: result.lng };
        }

        return Promise.reject(GEOCODING_FAILED);
      });
  }

  // eslint-disable-next-line spellcheck/spell-checker -- OpenStreetMap API identifier
  _normalizeLocation(location: OsmLocation): { lat: number; lng: number } {
    return {
      lat: location.lat,
      lng: location.lng,
    };
  }

  _loadImpl(): Promise<void> {
    const configuredEngine = this._option('providerConfig')?.mapEngine;
    const globalEngine = (window as Window & { L?: unknown }).L;
    const engine = configuredEngine ?? globalEngine;
    const leaflet = createLeafletAdapter(engine);

    if (!leaflet) {
      return Promise.reject(errors.Error('E1069'));
    }

    this._leaflet = leaflet;

    return Promise.resolve();
  }

  _init(): Promise<void> {
    return this._resolveLocation(this._option('center')).then((center) => {
      const type = this._option('type') ?? 'roadmap';
      const interactionsEnabled = !this._option('disabled');

      this._map = this._leaflet.createMap(this._$container[0], {
        center,
        interactionsEnabled,
        zoom: this._option('zoom'),
      });

      this._zoomControl = this._leaflet.createZoomControl();
      if (this._option('controls')) {
        this._zoomControl.addTo(this._map);
      }

      this._currentTileType = type;
      this._tileLayer = this._buildTileLayer(type);
      this._tileLayer?.addTo(this._map);

      this._option('center', this._normalizeLocation(center));
    });
  }

  _resolveTileConfig(type: MapType): TileServerConfig | undefined {
    const option = this._option('providerConfig')?.tileServer;

    const resolved = typeof option === 'function' ? option(type) : option;

    if (!resolved) {
      return undefined;
    }

    return typeof resolved === 'string' ? { url: resolved } : resolved;
  }

  _buildTileLayer(type: MapType): LeafletLayer | undefined {
    const config = this._resolveTileConfig(type);

    if (!config?.url) {
      errors.log('W1030');
      return undefined;
    }

    if (!config.attribution) {
      errors.log('W1032');
    }

    const options: Record<string, unknown> = {
      attribution: config.attribution ?? '',
      maxZoom: config.maxZoom ?? DEFAULT_MAX_ZOOM,
    };

    if (config.url.includes('{s}')) {
      // eslint-disable-next-line spellcheck/spell-checker -- Leaflet tile server option name
      options.subdomains = config.subdomains ?? DEFAULT_SUBDOMAINS;
    }

    return this._leaflet.createTileLayer(config.url, options);
  }

  _attachHandlers(): void {
    this._viewChangeHandler = this._onViewChange.bind(this);
    this._clickHandler = this._onMapClick.bind(this);

    this._map.on('moveend', this._viewChangeHandler);
    this._map.on('zoomend', this._viewChangeHandler);
    this._map.on('click', this._clickHandler);
  }

  _onViewChange(): void {
    const bounds = this._map.getBounds();
    this._option('bounds', {
      northEast: { lat: bounds.getNorthEast().lat, lng: bounds.getNorthEast().lng },
      southWest: { lat: bounds.getSouthWest().lat, lng: bounds.getSouthWest().lng },
    });

    const center = this._normalizeLocation(this._map.getCenter());
    const currentCenter = this._getLatLng(this._option('center'));
    if (currentCenter?.lat !== center.lat || currentCenter?.lng !== center.lng) {
      this._option('center', center);
    }

    if (!this._preventZoomChangeEvent) {
      this._option('zoom', this._map.getZoom());
    }
  }

  // eslint-disable-next-line spellcheck/spell-checker -- Leaflet/OpenStreetMap API identifiers
  _onMapClick(e: { latlng: OsmLocation; originalEvent: Event }): void {
    this._fireClickAction({
      // eslint-disable-next-line spellcheck/spell-checker -- Leaflet event field name
      location: this._normalizeLocation(e.latlng),
      event: e.originalEvent,
    });
  }

  updateDimensions(): Promise<void> {
    this._map.invalidateSize();

    return Promise.resolve();
  }

  updateMapType(): Promise<void> {
    const type = this._option('type') ?? this._currentTileType;

    if (type !== this._currentTileType) {
      this._rebuildTileLayer(type);
      this._currentTileType = type;
    }

    return Promise.resolve();
  }

  _rebuildTileLayer(type: MapType): void {
    const tileLayer = this._buildTileLayer(type);
    tileLayer?.addTo(this._map);

    if (this._tileLayer) {
      this._map.removeLayer(this._tileLayer);
    }

    this._tileLayer = tileLayer;
  }

  updateDisabled(): Promise<void> {
    this._leaflet.setInteractionsEnabled(this._map, !this._option('disabled'));

    return Promise.resolve();
  }

  updateBounds(): Promise<void> {
    const bounds = this._option('bounds');

    return Promise.all([
      this._resolveLocation(bounds?.northEast),
      this._resolveLocation(bounds?.southWest),
    ]).then((result) => {
      this._map.fitBounds(this._leaflet.createBounds(result[1], result[0]));
    });
  }

  updateCenter(): Promise<void> {
    return this._resolveLocation(this._option('center')).then((center) => {
      this._map.setView(center, this._option('zoom'));
      this._option('center', this._normalizeLocation(center));
    });
  }

  updateZoom(): Promise<void> {
    this._map.setZoom(this._option('zoom'));

    return Promise.resolve();
  }

  updateControls(): Promise<void> {
    const controls = this._option('controls');

    if (controls) {
      this._zoomControl?.addTo(this._map);
    } else {
      this._zoomControl?.remove();
    }

    return Promise.resolve();
  }

  _renderMarker(options: MarkerOptions): Promise<MarkerObject> {
    return this._resolveLocation(options.location).then((location) => {
      // eslint-disable-next-line @typescript-eslint/init-declarations
      let marker: LeafletMarker;
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      const icon = options.iconSrc || this._option('markerIconSrc');

      if (options.html) {
        const divIcon = this._leaflet.createDivIcon({
          html: options.html,
          className: '',
          iconAnchor: options.htmlOffset
            ? [-options.htmlOffset.left, -options.htmlOffset.top]
            : [0, 0],
        });
        marker = this._leaflet.createMarker(location, { icon: divIcon });
      } else if (icon) {
        const customIcon = this._leaflet.createIcon({
          iconUrl: icon,
          className: 'dx-map-marker',
          iconSize: MARKER_ICON_SIZE,
          iconAnchor: MARKER_ICON_ANCHOR,
          popupAnchor: MARKER_POPUP_ANCHOR,
        });
        marker = this._leaflet.createMarker(location, { icon: customIcon });
      } else {
        marker = this._leaflet.createMarker(location);
      }

      marker.addTo(this._map);

      const popup = this._renderTooltip(marker, options.tooltip);

      // eslint-disable-next-line @typescript-eslint/init-declarations
      let clickHandler: (() => void) | undefined;
      if (options.onClick) {
        const markerClickAction = this._mapWidget._createAction(options.onClick);
        const normalizedLocation = this._normalizeLocation(location);

        clickHandler = (): void => {
          markerClickAction({ location: normalizedLocation });
        };

        marker.on('click', clickHandler);
      }

      return {
        location,
        marker,
        popup,
        handler: clickHandler,
      };
    });
  }

  _renderTooltip(
    marker: LeafletMarker,
    options: MarkerOptions['tooltip'],
  ): LeafletPopup | undefined {
    if (!options) {
      return undefined;
    }

    const parsedOptions = this._parseTooltipOptions(options);
    const popup = this._leaflet.createPopup({ autoClose: false, closeOnClick: false })
      .setContent(parsedOptions.text);
    marker.bindPopup(popup);

    if (parsedOptions.visible) {
      marker.openPopup();
    }

    return popup;
  }

  _destroyMarker(markerObj: {
    marker: LeafletMarker;
    handler?: () => void;
  }): void {
    if (markerObj.handler) {
      markerObj.marker.off('click', markerObj.handler);
    }
    markerObj.marker.remove();
  }

  _renderRoute(options: RouteOptions): Promise<RouteObject> {
    const locations = options.locations ?? [];

    return Promise.all(locations.map((point) => this._resolveLocation(point)))
      .then((resolvedLocations) => {
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        const color = new Color(options.color || this._defaultRouteColor()).toHex();
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        const opacity = options.opacity || this._defaultRouteOpacity();
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        const weight = options.weight || this._defaultRouteWeight();
        const mode = this._movementMode(options.mode);

        const polylineOptions = { color, opacity, weight };
        const normalizedLocations = resolvedLocations.map((loc) => this._normalizeLocation(loc));

        const getRouteFn = this._option('providerConfig')?.getRoute;

        const drawPolyline = (coords: [number, number][]): RouteObject => {
          const polyline = this._leaflet.createPolyline(coords, polylineOptions);
          polyline.addTo(this._map);
          const routeBounds = polyline.getBounds();
          const northEast = routeBounds.getNorthEast();
          const southWest = routeBounds.getSouthWest();
          const routeObject: RouteObject = { instance: polyline };

          if (northEast && southWest) {
            routeObject.northEast = [northEast.lat, northEast.lng];
            routeObject.southWest = [southWest.lat, southWest.lng];
          }

          return routeObject;
        };

        if (!getRouteFn) {
          errors.log('W1033');
          return drawPolyline(
            resolvedLocations.map((loc) => [loc.lat, loc.lng] as [number, number]),
          );
        }

        return Promise.resolve()
          .then(() => getRouteFn({ locations: normalizedLocations, mode }))
          .then((result) => drawPolyline(normalizeRouteResult(result)))
          .catch((e: unknown) => {
            errors.log('W1006', e);

            return drawPolyline(
              resolvedLocations.map((loc) => [loc.lat, loc.lng] as [number, number]),
            );
          });
      });
  }

  _destroyRoute(routeObj: { instance: LeafletLayer }): void {
    routeObj.instance.remove();
  }

  _fitBounds(): Promise<void> {
    this._updateBounds();

    if (this._bounds && this._option('autoAdjust')) {
      const zoomBeforeFitting = this._map.getZoom();
      this._preventZoomChangeEvent = true;

      this._map.fitBounds(this._bounds, { animate: false });

      const zoomAfterFitting = this._map.getZoom();
      if (zoomBeforeFitting < zoomAfterFitting) {
        this._map.setZoom(zoomBeforeFitting);
      } else {
        this._option('zoom', zoomAfterFitting);
      }

      delete this._preventZoomChangeEvent;
    }

    return Promise.resolve();
  }

  _extendBounds(location: unknown): void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const loc = location as any;
    const normalizedLocation = Array.isArray(loc)
      ? { lat: loc[0], lng: loc[1] }
      : { lat: loc.lat, lng: loc.lng };

    this._bounds = this._leaflet.extendBounds(
      this._bounds as LeafletBounds | undefined,
      normalizedLocation,
    );
  }

  clean(): Promise<void> {
    if (this._map) {
      this._map.off('moveend', this._viewChangeHandler);
      this._map.off('zoomend', this._viewChangeHandler);
      this._map.off('click', this._clickHandler);

      this._clearMarkers();
      this._clearRoutes();

      this._map.remove();
      this._map = undefined;
      this._zoomControl = undefined;
    }

    return Promise.resolve();
  }
}

// eslint-disable-next-line spellcheck/spell-checker -- OpenStreetMap API identifier
export default OsmProvider;
