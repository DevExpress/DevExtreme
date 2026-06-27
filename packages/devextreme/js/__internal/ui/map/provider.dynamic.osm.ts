/* eslint-disable @typescript-eslint/no-misused-promises */
import Color from '@js/color';
import $ from '@js/core/renderer';
import ajax from '@js/core/utils/ajax';
import { noop } from '@js/core/utils/common';
import { isDefined } from '@js/core/utils/type';
import { getWindow } from '@js/core/utils/window';
import type { RouteMode } from '@js/ui/map';
import errors from '@js/ui/widget/ui.errors';

import type {
  LocationOption,
  MarkerObject, MarkerOptions, PlainLocation, RouteObject, RouteOptions,
} from './provider.dynamic';
import DynamicProvider from './provider.dynamic';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare let L: any;

const window = getWindow();

let LEAFLET_JS_URL = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
let LEAFLET_CSS_URL = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';

const DEFAULT_MAX_ZOOM = 19;
const DEFAULT_SUBDOMAINS = 'abc';

interface OsmTileServerConfig {
  url: string;
  attribution?: string;
  subdomains?: string | string[];
  maxZoom?: number;
}

type OsmTileServerObject = OsmTileServerConfig
  | ((type: string) => string | OsmTileServerConfig | null | undefined);
type OsmTileServerOption = string | OsmTileServerObject;

export type OsmLocation = PlainLocation;

// @ts-expect-error ts-error
const osmMapsLoaded = (): boolean => Boolean(window.L?.map);

// eslint-disable-next-line @typescript-eslint/init-declarations
let osmMapsLoader: Promise<void> | undefined;

class OsmProvider extends DynamicProvider {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _tileLayer?: any;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _zoomControl?: any;

  _currentTileType!: string;

  _clickHandler?: (e: { latlng: OsmLocation; originalEvent: Event }) => void;

  _viewChangeHandler?: () => void;

  _preventZoomChangeEvent?: boolean;

  _movementMode(type: RouteMode | string = ''): string {
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    return type || 'driving';
  }

  _resolveLocation(location?: LocationOption | null): Promise<OsmLocation> {
    return new Promise((resolve) => {
      const latLng = this._getLatLng(location);
      if (latLng) {
        resolve(L.latLng(latLng.lat, latLng.lng));
      } else {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        this._geocodeLocation(location as string).then((geocodedLocation) => {
          resolve(geocodedLocation as OsmLocation);
        });
      }
    });
  }

  _geocodeLocationImpl(location: string): Promise<OsmLocation> {
    return new Promise((resolve) => {
      if (!isDefined(location)) {
        resolve(L.latLng(0, 0));
        return;
      }

      const geocodeFn = this._option('providerConfig')?.geocodeLocation as ((query: string) => Promise<{ lat: number; lng: number } | null | undefined>) | undefined;

      if (!geocodeFn) {
        errors.log('W1031', location);
        resolve(L.latLng(0, 0));
        return;
      }

      geocodeFn(location).then((result) => {
        if (result?.lat != null && result?.lng != null) {
          resolve(L.latLng(result.lat, result.lng));
        } else {
          resolve(L.latLng(0, 0));
        }
      }).catch(() => {
        resolve(L.latLng(0, 0));
      });
    });
  }

  _normalizeLocation(location: OsmLocation): { lat: number; lng: number } {
    return {
      lat: location.lat,
      lng: location.lng,
    };
  }

  _loadImpl(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (osmMapsLoaded()) {
        resolve();
        return;
      }

      const fail = (): void => { reject(errors.Error('W1033')); };

      osmMapsLoader ??= this._loadMapResources();

      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      osmMapsLoader.then(() => {
        if (osmMapsLoaded()) {
          resolve();
          return;
        }

        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        this._loadMapResources().then(() => {
          if (osmMapsLoaded()) {
            resolve();
          } else {
            fail();
          }
        }, fail);
      }, fail);
    });
  }

  _loadMapResources(): Promise<void> {
    return Promise.all([
      this._loadMapScript(),
      this._loadMapStyles(),
    ]).then(() => {});
  }

  _loadMapScript(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      ajax.sendRequest({
        url: LEAFLET_JS_URL,
        dataType: 'script',
      }).then(() => {
        resolve();
      }, reject);
    });
  }

  _loadMapStyles(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      ajax.sendRequest({
        url: LEAFLET_CSS_URL,
        dataType: 'text',
      }).then((css) => {
        $('<style>').html(css).appendTo($('head'));
        resolve();
      }, reject);
    });
  }

  _init(): Promise<void> {
    return this._resolveLocation(this._option('center')).then((center) => {
      const type = this._option('type') ?? 'roadmap';

      L.Icon.Default.imagePath = LEAFLET_JS_URL.replace(/leaflet\.js$/, 'images/');

      this._map = L.map(this._$container[0], {
        center,
        zoom: this._option('zoom'),
        zoomControl: false,
        attributionControl: true,
      });

      this._zoomControl = L.control.zoom();
      if (this._option('controls')) {
        this._zoomControl.addTo(this._map);
      }

      this._currentTileType = type;
      this._tileLayer = this._buildTileLayer(type);
      this._tileLayer?.addTo(this._map);

      this._option('center', this._normalizeLocation(center));
    });
  }

  _resolveTileConfig(type: string): OsmTileServerConfig | undefined {
    const option = this._option('providerConfig')?.tileServer as OsmTileServerOption | null | undefined;

    const resolved = typeof option === 'function' ? option(type) : option;

    if (!resolved) {
      return undefined;
    }

    return typeof resolved === 'string' ? { url: resolved } : resolved;
  }

  _buildTileLayer(type: string): unknown {
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
      options.subdomains = config.subdomains ?? DEFAULT_SUBDOMAINS;
    }

    return L.tileLayer(config.url, options);
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
    if (!currentCenter || currentCenter.lat !== center.lat || currentCenter.lng !== center.lng) {
      this._option('center', center);
    }

    if (!this._preventZoomChangeEvent) {
      this._option('zoom', this._map.getZoom());
    }
  }

  _onMapClick(e: { latlng: OsmLocation; originalEvent: Event }): void {
    this._fireClickAction({
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
      this._currentTileType = type;
      this._rebuildTileLayer(type);
    }

    return Promise.resolve();
  }

  updateTileServer(): Promise<void> {
    this._rebuildTileLayer(this._currentTileType);

    return Promise.resolve();
  }

  _rebuildTileLayer(type: string): void {
    if (this._tileLayer) {
      this._map.removeLayer(this._tileLayer);
    }
    this._tileLayer = this._buildTileLayer(type);
    this._tileLayer?.addTo(this._map);
  }

  updateDisabled(): Promise<void> {
    const disabled = this._option('disabled');
    const handlers = [
      this._map.dragging,
      this._map.touchZoom,
      this._map.doubleClickZoom,
      this._map.scrollWheelZoom,
      this._map.boxZoom,
      this._map.keyboard,
    ];

    handlers.forEach((handler) => {
      if (handler) {
        if (disabled) {
          handler.disable();
        } else {
          handler.enable();
        }
      }
    });

    return Promise.resolve();
  }

  updateBounds(): Promise<void> {
    const bounds = this._option('bounds');

    return Promise.all([
      this._resolveLocation(bounds?.northEast),
      this._resolveLocation(bounds?.southWest),
    ]).then((result) => {
      this._map.fitBounds(L.latLngBounds(result[1], result[0]));
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
      this._zoomControl.addTo(this._map);
    } else {
      this._zoomControl.remove();
    }

    return Promise.resolve();
  }

  _anchorIconBottomCenter(marker: unknown): void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const leafletMarker = marker as any;
    const iconElement = leafletMarker.getElement?.() ?? leafletMarker._icon;
    if (!iconElement || typeof iconElement.addEventListener !== 'function') {
      return;
    }
    const applyAnchor = (): void => {
      const iconWidth = iconElement.naturalWidth;
      const iconHeight = iconElement.naturalHeight;
      if (!iconWidth || !iconHeight) {
        return;
      }
      iconElement.style.marginLeft = `${-iconWidth / 2}px`;
      iconElement.style.marginTop = `${-iconHeight}px`;

      const popup = leafletMarker.getPopup?.();
      if (popup) {
        popup.options.offset = L.point(0, -iconHeight);
        if (leafletMarker.isPopupOpen()) {
          leafletMarker.openPopup();
        }
      }
    };
    if (iconElement.complete && iconElement.naturalWidth) {
      applyAnchor();
    } else {
      iconElement.addEventListener('load', applyAnchor, { once: true });
    }
  }

  _renderMarker(options: MarkerOptions): Promise<MarkerObject> {
    return this._resolveLocation(options.location).then((location) => {
      // eslint-disable-next-line @typescript-eslint/init-declarations
      let marker;
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      const icon = options.iconSrc || this._option('markerIconSrc');

      if (options.html) {
        const divIcon = L.divIcon({
          html: options.html,
          className: '',
          iconAnchor: options.htmlOffset
            ? [-options.htmlOffset.left, -options.htmlOffset.top]
            : [0, 0],
        });
        marker = L.marker(location, { icon: divIcon });
      } else if (icon) {
        const customIcon = L.icon({
          iconUrl: icon,
          className: 'dx-map-marker',
        });
        marker = L.marker(location, { icon: customIcon });
      } else {
        marker = L.marker(location);
      }

      marker.addTo(this._map);

      const popup = this._renderTooltip(marker, options.tooltip);

      if (icon && !options.html) {
        this._anchorIconBottomCenter(marker);
      }

      // eslint-disable-next-line @typescript-eslint/init-declarations
      let clickHandler: (() => void) | undefined;
      if (options.onClick || options.tooltip) {
        const markerClickAction = this._mapWidget._createAction(options.onClick ?? noop);
        const normalizedLocation = this._normalizeLocation(location);

        clickHandler = (): void => {
          markerClickAction({ location: normalizedLocation });

          if (popup) {
            if (marker.isPopupOpen()) {
              marker.closePopup();
            } else {
              marker.openPopup();
            }
          }
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _renderTooltip(marker: unknown, options: MarkerOptions['tooltip']): any {
    if (!options) {
      return undefined;
    }

    const parsedOptions = this._parseTooltipOptions(options);
    const popup = L.popup({ autoClose: false, closeOnClick: false }).setContent(parsedOptions.text);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const leafletMarker = marker as any;
    leafletMarker.bindPopup(popup);

    if (parsedOptions.visible) {
      // eslint-disable-next-line no-restricted-globals
      setTimeout(() => { leafletMarker.openPopup(); }, 0);
    }

    return popup;
  }

  _destroyMarker(markerObj: {
    marker: { off: (event: string, fn: unknown) => void; remove: () => void };
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
      .then((resolvedLocations) => new Promise((resolve) => {
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        const color = new Color(options.color || this._defaultRouteColor()).toHex();
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        const opacity = options.opacity || this._defaultRouteOpacity();
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        const weight = options.weight || this._defaultRouteWeight();
        const mode = this._movementMode(options.mode);

        const polylineOptions = { color, opacity, weight };
        const normalizedLocations = resolvedLocations.map((loc) => this._normalizeLocation(loc));

        const getRouteFn = this._option('providerConfig')?.getRoute as ((params: { locations: { lat: number; lng: number }[]; mode: string }) => Promise<[number, number][]>) | undefined;

        const drawPolyline = (coords: [number, number][]): void => {
          const polyline = L.polyline(coords, polylineOptions).addTo(this._map);
          const routeBounds = polyline.getBounds();

          resolve({
            instance: polyline,
            northEast: [routeBounds.getNorthEast().lat, routeBounds.getNorthEast().lng],
            southWest: [routeBounds.getSouthWest().lat, routeBounds.getSouthWest().lng],
          });
        };

        if (!getRouteFn) {
          drawPolyline(resolvedLocations.map((loc) => [loc.lat, loc.lng] as [number, number]));
          return;
        }

        getRouteFn({ locations: normalizedLocations, mode }).then((coords) => {
          drawPolyline(coords);
        }).catch((e: unknown) => {
          errors.log('W1006', e);

          drawPolyline(resolvedLocations.map((loc) => [loc.lat, loc.lng] as [number, number]));
        });
      }));
  }

  _destroyRoute(routeObj: { instance: { remove: () => void } }): void {
    routeObj.instance.remove();
  }

  _fitBounds(): Promise<void> {
    this._updateBounds();

    if (this._bounds && this._option('autoAdjust')) {
      const zoomBeforeFitting = this._map.getZoom();
      this._preventZoomChangeEvent = true;

      this._map.fitBounds(this._bounds);

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
    const latLng = Array.isArray(loc)
      ? L.latLng(loc[0], loc[1])
      : L.latLng(loc.lat, loc.lng);

    if (this._bounds) {
      this._bounds.extend(latLng);
    } else {
      this._bounds = L.latLngBounds(latLng, latLng);
    }
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

/// #DEBUG
// @ts-expect-error ts-error
OsmProvider.remapConstant = (newValue: string): void => {
  LEAFLET_JS_URL = newValue;
  LEAFLET_CSS_URL = newValue;
};

/// #ENDDEBUG

export default OsmProvider;
