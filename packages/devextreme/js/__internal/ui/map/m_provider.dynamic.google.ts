// eslint-disable-next-line @typescript-eslint/no-unused-vars
/* global google */

import Color from '@js/color';
import devices from '@js/core/devices';
import $ from '@js/core/renderer';
import ajax from '@js/core/utils/ajax';
import { noop } from '@js/core/utils/common';
import { extend } from '@js/core/utils/extend';
import { map } from '@js/core/utils/iterator';
import { isDefined } from '@js/core/utils/type';
import { getWindow } from '@js/core/utils/window';
import errors from '@js/ui/widget/ui.errors';

import DynamicProvider from './m_provider.dynamic';

declare let google: any;

const window = getWindow();

const GOOGLE_MAP_READY = '_googleScriptReady';
let GOOGLE_URL = `https://maps.googleapis.com/maps/api/js?callback=${GOOGLE_MAP_READY}&libraries=marker&loading=async`;
const INFO_WINDOW_CLASS = 'gm-style-iw';

let CustomMarker;

const initCustomMarkerClass = function () {
  CustomMarker = function (options) {
    this._position = options.position;
    this._offset = options.offset;

    this._$overlayContainer = $('<div>')
      // @ts-expect-error
      .css({
        position: 'absolute',
        display: 'none',
        cursor: 'pointer',
      })
      .append(options.html);

    this.setMap(options.map);
  };

  CustomMarker.prototype = new google.maps.OverlayView();

  CustomMarker.prototype.onAdd = function () {
    const $pane = $(this.getPanes().overlayMouseTarget);
    $pane.append(this._$overlayContainer);

    this._clickListener = google.maps.event.addDomListener(this._$overlayContainer.get(0), 'click', (e) => {
      google.maps.event.trigger(this, 'click');
      e.preventDefault();
    });

    this.draw();
  };

  CustomMarker.prototype.onRemove = function () {
    google.maps.event.removeListener(this._clickListener);

    this._$overlayContainer.remove();
  };

  CustomMarker.prototype.draw = function () {
    const position = this.getProjection().fromLatLngToDivPixel(this._position);

    this._$overlayContainer.css({
      left: position.x + this._offset.left,
      top: position.y + this._offset.top,
      display: 'block',
    });
  };
};

const googleMapsLoaded = function () {
  // @ts-expect-error
  return window.google && window.google.maps;
};

let googleMapsLoader;

const GoogleProvider = DynamicProvider.inherit({

  _mapType(type) {
    const mapTypes = {
      hybrid: google.maps.MapTypeId.HYBRID,
      roadmap: google.maps.MapTypeId.ROADMAP,
      satellite: google.maps.MapTypeId.SATELLITE,
    };
    return mapTypes[type] || mapTypes.hybrid;
  },

  _movementMode(type) {
    const movementTypes = {
      driving: google.maps.TravelMode.DRIVING,
      walking: google.maps.TravelMode.WALKING,
    };
    return movementTypes[type] || movementTypes.driving;
  },

  _resolveLocation(location) {
    return new Promise((resolve) => {
      const latLng = this._getLatLng(location);
      if (latLng) {
        resolve(new google.maps.LatLng(latLng.lat, latLng.lng));
      } else {
        this._geocodeLocation(location).then((geocodedLocation) => {
          resolve(geocodedLocation);
        });
      }
    });
  },

  _geocodedLocations: {},
  _geocodeLocationImpl(location) {
    return new Promise((resolve) => {
      if (!isDefined(location)) {
        resolve(new google.maps.LatLng(0, 0));
        return;
      }

      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ address: location }, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK) {
          resolve(results[0].geometry.location);
        } else {
          errors.log('W1006', status);
          resolve(new google.maps.LatLng(0, 0));
        }
      });
    });
  },

  _normalizeLocation(location) {
    return {
      lat: location.lat(),
      lng: location.lng(),
    };
  },

  _normalizeLocationRect(locationRect) {
    return {
      northEast: this._normalizeLocation(locationRect.getNorthEast()),
      southWest: this._normalizeLocation(locationRect.getSouthWest()),
    };
  },

  _loadImpl() {
    return new Promise((resolve) => {
      if (googleMapsLoaded()) {
        // @ts-expect-error
        resolve();
      } else {
        if (!googleMapsLoader) {
          googleMapsLoader = this._loadMapScript();
        }

        googleMapsLoader.then(() => {
          if (googleMapsLoaded()) {
            // @ts-expect-error
            resolve();
            return;
          }

          this._loadMapScript().then(resolve);
        });
      }
    }).then(() => {
      initCustomMarkerClass();
    });
  },

  _loadMapScript() {
    return new Promise((resolve) => {
      const key = this._keyOption('google');

      window[GOOGLE_MAP_READY] = resolve;
      ajax.sendRequest({
        url: GOOGLE_URL + (key ? `&key=${key}` : ''),
        dataType: 'script',
      });
    }).then(() => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete window[GOOGLE_MAP_READY];
      } catch (e) {
        window[GOOGLE_MAP_READY] = undefined;
      }
    });
  },

  _init() {
    return new Promise((resolve) => {
      this._resolveLocation(this._option('center')).then((center) => {
        const disableDefaultUI = !this._option('controls');
        const providerConfig = this._option('providerConfig');
        const mapId = providerConfig?.mapId ?? '';
        this._map = new google.maps.Map(this._$container[0], {
          center,
          disableDefaultUI,
          mapId,
          zoom: this._option('zoom'),
        });

        const listener = google.maps.event.addListener(this._map, 'idle', () => {
          resolve(listener);
        });
      });
    }).then((listener) => {
      google.maps.event.removeListener(listener);
    });
  },

  _attachHandlers() {
    this._boundsChangeListener = google.maps.event.addListener(this._map, 'bounds_changed', this._boundsChangeHandler.bind(this));
    this._clickListener = google.maps.event.addListener(this._map, 'click', this._clickActionHandler.bind(this));
  },

  _boundsChangeHandler() {
    const bounds = this._map.getBounds();
    this._option('bounds', this._normalizeLocationRect(bounds));

    const center = this._map.getCenter();
    this._option('center', this._normalizeLocation(center));

    if (!this._preventZoomChangeEvent) {
      this._option('zoom', this._map.getZoom());
    }
  },

  _clickActionHandler(e) {
    this._fireClickAction({ location: this._normalizeLocation(e.latLng) });
  },

  updateDimensions() {
    const center = this._option('center');
    google.maps.event.trigger(this._map, 'resize');
    this._option('center', center);

    return this.updateCenter();
  },

  updateMapType() {
    this._map.setMapTypeId(this._mapType(this._option('type')));

    return Promise.resolve();
  },

  updateBounds() {
    return Promise.all([
      this._resolveLocation(this._option('bounds.northEast')),
      this._resolveLocation(this._option('bounds.southWest')),
    ]).then((result) => {
      const bounds = new google.maps.LatLngBounds();
      bounds.extend(result[0]);
      bounds.extend(result[1]);

      this._map.fitBounds(bounds);
    });
  },

  updateCenter() {
    return this._resolveLocation(this._option('center')).then((center) => {
      this._map.setCenter(center);
      this._option('center', this._normalizeLocation(center));
    });
  },

  updateZoom() {
    this._map.setZoom(this._option('zoom'));

    return Promise.resolve();
  },

  updateControls() {
    const showDefaultUI = this._option('controls');

    this._map.setOptions({
      disableDefaultUI: !showDefaultUI,
    });

    return Promise.resolve();
  },

  isEventsCanceled(e) {
    const gestureHandling = this._map && this._map.get('gestureHandling');
    const isInfoWindowContent = $(e.target).closest(`.${INFO_WINDOW_CLASS}`).length > 0;
    if (isInfoWindowContent || devices.real().deviceType !== 'desktop' && gestureHandling === 'cooperative') {
      return false;
    }
    return this.callBase();
  },

  _renderMarker(options) {
    return this._resolveLocation(options.location).then((location) => {
      let marker;
      if (options.html) {
        marker = new CustomMarker({
          map: this._map,
          position: location,
          html: options.html,
          offset: extend({
            top: 0,
            left: 0,
          }, options.htmlOffset),
        });
      } else {
        const providerConfig = this._option('providerConfig');
        const useAdvancedMarkers = providerConfig?.useAdvancedMarkers ?? true;
        const icon = options.iconSrc || this._option('markerIconSrc');
        if (useAdvancedMarkers) {
          const content = icon ? this._createIconTemplate(icon) : undefined;
          marker = new google.maps.marker.AdvancedMarkerElement({
            position: location,
            map: this._map,
            content,
          });
        } else {
          marker = new google.maps.Marker({
            position: location,
            map: this._map,
            icon,
          });
        }
      }

      const infoWindow = this._renderTooltip(marker, options.tooltip);
      let listener;
      if (options.onClick || options.tooltip) {
        const markerClickAction = this._mapWidget._createAction(options.onClick || noop);
        const markerNormalizedLocation = this._normalizeLocation(location);

        listener = google.maps.event.addListener(marker, 'click', () => {
          markerClickAction({
            location: markerNormalizedLocation,
          });

          if (infoWindow) {
            infoWindow.open(this._map, marker);
          }
        });
      }

      return {
        location,
        marker,
        listener,
      };
    });
  },

  _renderTooltip(marker, options) {
    if (!options) {
      return;
    }

    options = this._parseTooltipOptions(options);

    const infoWindow = new google.maps.InfoWindow({
      content: options.text,
    });
    if (options.visible) {
      infoWindow.open(this._map, marker);
    }

    return infoWindow;
  },

  _destroyMarker(marker) {
    marker.marker.setMap(null);
    if (marker.listener) {
      google.maps.event.removeListener(marker.listener);
    }
  },

  _renderRoute(options) {
    return Promise.all(map(options.locations, (point) => this._resolveLocation(point))).then((locations) => new Promise((resolve) => {
      const origin = locations.shift();
      const destination = locations.pop();
      const waypoints = map(locations, (location) => ({ location, stopover: true }));

      const request = {
        origin,
        destination,
        waypoints,
        optimizeWaypoints: true,
        travelMode: this._movementMode(options.mode),
      };

      new google.maps.DirectionsService().route(request, (response, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          const color = new Color(options.color || this._defaultRouteColor()).toHex();
          const directionOptions = {
            directions: response,
            map: this._map,
            suppressMarkers: true,
            preserveViewport: true,
            polylineOptions: {
              strokeWeight: options.weight || this._defaultRouteWeight(),
              strokeOpacity: options.opacity || this._defaultRouteOpacity(),
              strokeColor: color,
            },
          };

          const route = new google.maps.DirectionsRenderer(directionOptions);
          const { bounds } = response.routes[0];

          resolve({
            instance: route,
            northEast: bounds.getNorthEast(),
            southWest: bounds.getSouthWest(),
          });
        } else {
          errors.log('W1006', status);
          resolve({
            instance: new google.maps.DirectionsRenderer({}),
          });
        }
      });
    }));
  },

  _destroyRoute(routeObject) {
    routeObject.instance.setMap(null);
  },

  _fitBounds() {
    this._updateBounds();

    if (this._bounds && this._option('autoAdjust')) {
      const zoomBeforeFitting = this._map.getZoom();
      this._preventZoomChangeEvent = true;

      this._map.fitBounds(this._bounds);
      this._boundsChangeHandler();

      const zoomAfterFitting = this._map.getZoom();
      if (zoomBeforeFitting < zoomAfterFitting) {
        this._map.setZoom(zoomBeforeFitting);
      } else {
        this._option('zoom', zoomAfterFitting);
      }
      delete this._preventZoomChangeEvent;
    }

    return Promise.resolve();
  },

  _extendBounds(location) {
    if (this._bounds) {
      this._bounds.extend(location);
    } else {
      this._bounds = new google.maps.LatLngBounds();
      this._bounds.extend(location);
    }
  },

  clean() {
    if (this._map) {
      google.maps.event.removeListener(this._boundsChangeListener);
      google.maps.event.removeListener(this._clickListener);

      this._clearMarkers();
      this._clearRoutes();

      delete this._map;
      this._$container.empty();
    }

    return Promise.resolve();
  },

});

/// #DEBUG
// @ts-expect-error
GoogleProvider.remapConstant = function (newValue) {
  GOOGLE_URL = newValue;
};

/// #ENDDEBUG

export default GoogleProvider;
