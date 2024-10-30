import Color from '@js/color';
import ajax from '@js/core/utils/ajax';
import { noop } from '@js/core/utils/common';
import { extend } from '@js/core/utils/extend';
import { each, map } from '@js/core/utils/iterator';
import { getHeight, getWidth } from '@js/core/utils/size';
import { isDefined } from '@js/core/utils/type';
import { getWindow } from '@js/core/utils/window';
import errors from '@js/ui/widget/ui.errors';

import DynamicProvider from './m_provider.dynamic';

const window = getWindow();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
/* global Microsoft */
declare let Microsoft: any;

const BING_MAP_READY = '_bingScriptReady';
let BING_URL_V8 = `https://www.bing.com/api/maps/mapcontrol?callback=${BING_MAP_READY}`;

const INFOBOX_V_OFFSET_V8 = 13;
const MIN_LOCATION_RECT_LENGTH = 0.0000000000000001;

const msMapsLoaded = function () {
  // @ts-expect-error
  return window.Microsoft && window.Microsoft.Maps;
};

let msMapsLoader;

const BingProvider = DynamicProvider.inherit({
  _mapType(type) {
    const mapTypes = {
      roadmap: Microsoft.Maps.MapTypeId.road,
      hybrid: Microsoft.Maps.MapTypeId.aerial,
      satellite: Microsoft.Maps.MapTypeId.aerial,
    };
    // @ts-expect-error
    return mapTypes[type] || mapTypes.road;
  },

  _movementMode(type) {
    const movementTypes = {
      driving: Microsoft.Maps.Directions.RouteMode.driving,
      walking: Microsoft.Maps.Directions.RouteMode.walking,
    };
    return movementTypes[type] || movementTypes.driving;
  },

  _resolveLocation(location) {
    return new Promise((resolve) => {
      const latLng = this._getLatLng(location);
      if (latLng) {
        resolve(new Microsoft.Maps.Location(latLng.lat, latLng.lng));
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
        resolve(new Microsoft.Maps.Location(0, 0));
        return;
      }

      const searchManager = new Microsoft.Maps.Search.SearchManager(this._map);
      const searchRequest = {
        where: location,
        count: 1,
        callback(searchResponse) {
          const result = searchResponse.results[0];
          if (result) {
            const boundsBox = searchResponse.results[0].location;

            resolve(new Microsoft.Maps.Location(boundsBox.latitude, boundsBox.longitude));
          } else {
            resolve(new Microsoft.Maps.Location(0, 0));
          }
        },
      };

      searchManager.geocode(searchRequest);
    });
  },

  _normalizeLocation(location) {
    return {
      lat: location.latitude,
      lng: location.longitude,
    };
  },

  _normalizeLocationRect(locationRect) {
    const northWest = this._normalizeLocation(locationRect.getNorthwest());
    const southEast = this._normalizeLocation(locationRect.getSoutheast());

    return {
      northEast: {
        lat: northWest.lat,
        lng: southEast.lng,
      },
      southWest: {
        lat: southEast.lat,
        lng: northWest.lng,
      },
    };
  },

  _loadImpl() {
    return new Promise((resolve) => {
      if (msMapsLoaded()) {
        // @ts-expect-error
        resolve();
      } else {
        if (!msMapsLoader) {
          msMapsLoader = this._loadMapScript();
        }

        msMapsLoader.then(() => {
          if (msMapsLoaded()) {
            // @ts-expect-error
            resolve();
            return;
          }

          this._loadMapScript().then(resolve);
        });
      }
    }).then(() => Promise.all([
      new Promise((resolve) => {
        Microsoft.Maps.loadModule('Microsoft.Maps.Search', { callback: resolve });
      }),
      new Promise((resolve) => {
        Microsoft.Maps.loadModule('Microsoft.Maps.Directions', { callback: resolve });
      }),
    ]));
  },

  _loadMapScript() {
    return new Promise((resolve) => {
      window[BING_MAP_READY] = resolve;
      ajax.sendRequest({
        url: BING_URL_V8,
        dataType: 'script',
      });
    }).then(() => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete window[BING_MAP_READY];
      } catch (e) {
        window[BING_MAP_READY] = undefined;
      }
    });
  },

  _init() {
    this._createMap();

    return Promise.resolve();
  },

  _createMap() {
    const controls = this._option('controls');

    this._map = new Microsoft.Maps.Map(this._$container[0], {
      credentials: this._keyOption('bing'),
      zoom: this._option('zoom'),
      showDashboard: controls,
      showMapTypeSelector: controls,
      showScalebar: controls,
    });
  },

  _attachHandlers() {
    this._providerViewChangeHandler = Microsoft.Maps.Events.addHandler(this._map, 'viewchange', this._viewChangeHandler.bind(this));
    this._providerClickHandler = Microsoft.Maps.Events.addHandler(this._map, 'click', this._clickActionHandler.bind(this));
  },

  _viewChangeHandler() {
    const bounds = this._map.getBounds();
    this._option('bounds', this._normalizeLocationRect(bounds));

    const center = this._map.getCenter();
    this._option('center', this._normalizeLocation(center));

    if (!this._preventZoomChangeEvent) {
      this._option('zoom', this._map.getZoom());
    }
  },

  _clickActionHandler(e) {
    if (e.targetType === 'map') {
      this._fireClickAction({ location: this._normalizeLocation(e.location) });
    }
  },

  updateDimensions() {
    const $container = this._$container;

    this._map.setOptions({
      width: getWidth($container),
      height: getHeight($container),
    });

    return Promise.resolve();
  },

  updateMapType() {
    const type = this._option('type');
    const labelOverlay = Microsoft.Maps.LabelOverlay;

    this._map.setView({
      animate: false,
      mapTypeId: this._mapType(type),
      labelOverlay: type === 'satellite' ? labelOverlay.hidden : labelOverlay.visible,
    });

    return Promise.resolve();
  },

  updateBounds() {
    return Promise.all([
      this._resolveLocation(this._option('bounds.northEast')),
      this._resolveLocation(this._option('bounds.southWest')),
    ]).then((result) => {
      // eslint-disable-next-line new-cap
      const bounds = new Microsoft.Maps.LocationRect.fromLocations(result[0], result[1]);

      this._map.setView({
        animate: false,
        bounds,
      });
    });
  },

  updateCenter() {
    return this._resolveLocation(this._option('center')).then((center) => {
      this._map.setView({
        animate: false,
        center,
      });
    });
  },

  updateZoom() {
    this._map.setView({
      animate: false,
      zoom: this._option('zoom'),
    });

    return Promise.resolve();
  },

  updateControls() {
    this.clean();
    return this.render.apply(this, arguments);
  },

  _renderMarker(options) {
    return this._resolveLocation(options.location).then((location) => {
      const pushpinOptions = {
        icon: options.iconSrc || this._option('markerIconSrc'),
      };
      if (options.html) {
        extend(pushpinOptions, {
          htmlContent: options.html,
          width: null,
          height: null,
        });

        const { htmlOffset } = options;
        if (htmlOffset) {
          // @ts-expect-error
          pushpinOptions.anchor = new Microsoft.Maps.Point(-htmlOffset.left, -htmlOffset.top);
        }
      }

      const pushpin = new Microsoft.Maps.Pushpin(location, pushpinOptions);
      this._map.entities.push(pushpin);

      const infobox = this._renderTooltip(location, options.tooltip);
      let handler;
      if (options.onClick || options.tooltip) {
        const markerClickAction = this._mapWidget._createAction(options.onClick || noop);
        const markerNormalizedLocation = this._normalizeLocation(location);

        handler = Microsoft.Maps.Events.addHandler(pushpin, 'click', () => {
          markerClickAction({
            location: markerNormalizedLocation,
          });

          if (infobox) {
            infobox.setOptions({ visible: true });
          }
        });
      }

      return {
        location,
        marker: pushpin,
        infobox,
        handler,
      };
    });
  },

  _renderTooltip(location, options) {
    if (!options) {
      return;
    }

    options = this._parseTooltipOptions(options);

    const infobox = new Microsoft.Maps.Infobox(location, {
      description: options.text,
      offset: new Microsoft.Maps.Point(0, INFOBOX_V_OFFSET_V8),
      visible: options.visible,
    });

    infobox.setMap(this._map);

    return infobox;
  },

  _destroyMarker(marker) {
    this._map.entities.remove(marker.marker);
    if (marker.infobox) {
      marker.infobox.setMap(null);
    }
    if (marker.handler) {
      Microsoft.Maps.Events.removeHandler(marker.handler);
    }
  },

  _renderRoute(options) {
    return Promise.all(map(options.locations, (point) => this._resolveLocation(point))).then((locations) => new Promise((resolve) => {
      const direction = new Microsoft.Maps.Directions.DirectionsManager(this._map);
      const color = new Color(options.color || this._defaultRouteColor()).toHex();
      // eslint-disable-next-line new-cap
      const routeColor = new Microsoft.Maps.Color.fromHex(color);
      routeColor.a = (options.opacity || this._defaultRouteOpacity()) * 255;

      direction.setRenderOptions({
        autoUpdateMapView: false,
        displayRouteSelector: false,
        waypointPushpinOptions: { visible: false },
        drivingPolylineOptions: {
          strokeColor: routeColor,
          strokeThickness: options.weight || this._defaultRouteWeight(),
        },
        walkingPolylineOptions: {
          strokeColor: routeColor,
          strokeThickness: options.weight || this._defaultRouteWeight(),
        },
      });
      direction.setRequestOptions({
        routeMode: this._movementMode(options.mode),
        routeDraggable: false,
      });

      each(locations, (_, location) => {
        const waypoint = new Microsoft.Maps.Directions.Waypoint({ location });
        direction.addWaypoint(waypoint);
      });

      const directionHandlers = [];
      // @ts-expect-error
      directionHandlers.push(Microsoft.Maps.Events.addHandler(direction, 'directionsUpdated', (args) => {
        while (directionHandlers.length) {
          Microsoft.Maps.Events.removeHandler(directionHandlers.pop());
        }

        const routeSummary = args.routeSummary[0];

        resolve({
          instance: direction,
          northEast: routeSummary.northEast,
          southWest: routeSummary.southWest,
        });
      }));
      // @ts-expect-error
      directionHandlers.push(Microsoft.Maps.Events.addHandler(direction, 'directionsError', (args) => {
        while (directionHandlers.length) {
          Microsoft.Maps.Events.removeHandler(directionHandlers.pop());
        }

        const status = `RouteResponseCode: ${args.responseCode} - ${args.message}`;
        errors.log('W1006', status);

        resolve({
          instance: direction,
        });
      }));

      direction.calculateDirections();
    }));
  },

  _destroyRoute(routeObject) {
    routeObject.instance.dispose();
  },

  _fitBounds() {
    this._updateBounds();

    if (this._bounds && this._option('autoAdjust')) {
      const zoomBeforeFitting = this._map.getZoom();
      this._preventZoomChangeEvent = true;

      const bounds = this._bounds.clone();
      bounds.height *= 1.1;
      bounds.width *= 1.1;
      this._map.setView({
        animate: false,
        bounds,
        zoom: zoomBeforeFitting,
      });

      const zoomAfterFitting = this._map.getZoom();
      if (zoomBeforeFitting < zoomAfterFitting) {
        this._map.setView({
          animate: false,
          zoom: zoomBeforeFitting,
        });
      } else {
        this._option('zoom', zoomAfterFitting);
      }
      delete this._preventZoomChangeEvent;
    }

    return Promise.resolve();
  },

  _extendBounds(location) {
    if (this._bounds) {
      // eslint-disable-next-line max-len, new-cap
      this._bounds = new Microsoft.Maps.LocationRect.fromLocations(this._bounds.getNorthwest(), this._bounds.getSoutheast(), location);
    } else {
      this._bounds = new Microsoft.Maps.LocationRect(location, MIN_LOCATION_RECT_LENGTH, MIN_LOCATION_RECT_LENGTH);
    }
  },

  clean() {
    if (this._map) {
      Microsoft.Maps.Events.removeHandler(this._providerViewChangeHandler);
      Microsoft.Maps.Events.removeHandler(this._providerClickHandler);

      this._clearMarkers();
      this._clearRoutes();

      this._map.dispose();
    }

    return Promise.resolve();
  },

});

/// #DEBUG
BingProvider.remapConstant = function (newValue) {
  BING_URL_V8 = newValue;
};

/// #ENDDEBUG

export default BingProvider;
