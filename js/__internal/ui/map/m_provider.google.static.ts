import Color from '@js/color';
import { each } from '@js/core/utils/iterator';
import { getHeight, getWidth } from '@js/core/utils/size';
import { name as clickEventName } from '@js/events/click';
import eventsEngine from '@js/events/core/events_engine';

import Provider from './m_provider';

let GOOGLE_STATIC_URL = 'https://maps.google.com/maps/api/staticmap?';

class GoogleStaticProvider extends Provider {
  _locationToString(location): string {
    const latLng = this._getLatLng(location);
    return latLng ? `${latLng.lat},${latLng.lng}` : location.toString().replace(/ /g, '+');
  }

  _renderImpl() {
    return this._updateMap();
  }

  updateDimensions() {
    return this._updateMap();
  }

  updateMapType() {
    return this._updateMap();
  }

  updateBounds() {
    return Promise.resolve();
  }

  updateCenter() {
    return this._updateMap();
  }

  updateZoom() {
    return this._updateMap();
  }

  updateControls() {
    return Promise.resolve();
  }

  addMarkers(options) {
    const that = this;

    return this._updateMap().then((result) => {
      each(options, (_, options) => {
        that._fireMarkerAddedAction({
          options,
        });
      });
      return result;
    });
  }

  removeMarkers(options) {
    const that = this;

    return this._updateMap().then((result) => {
      each(options, (_, options) => {
        that._fireMarkerRemovedAction({
          options,
        });
      });
      return result;
    });
  }

  adjustViewport() {
    return Promise.resolve();
  }

  addRoutes(options) {
    const that = this;

    return this._updateMap().then((result) => {
      each(options, (_, options) => {
        that._fireRouteAddedAction({
          options,
        });
      });
      return result;
    });
  }

  removeRoutes(options) {
    const that = this;

    return this._updateMap().then((result) => {
      each(options, (_, options) => {
        that._fireRouteRemovedAction({
          options,
        });
      });
      return result;
    });
  }

  clean() {
    this._$container.css('backgroundImage', 'none');
    eventsEngine.off(this._$container, this._addEventNamespace(clickEventName));

    return Promise.resolve();
  }

  mapRendered(): boolean {
    return true;
  }

  _updateMap() {
    const key = this._keyOption('googleStatic');
    const $container = this._$container;

    const requestOptions = [
      'sensor=false',
      `size=${Math.round(getWidth($container))}x${Math.round(getHeight($container))}`,
      `maptype=${this._option('type')}`,
      `center=${this._locationToString(this._option('center'))}`,
      `zoom=${this._option('zoom')}`,
      this._markersSubstring(),
    ];
    requestOptions.push.apply(requestOptions, this._routeSubstrings());
    if (key) {
      requestOptions.push(`key=${key}`);
    }

    const request = GOOGLE_STATIC_URL + requestOptions.join('&');

    this._$container.css('background', `url("${request}") no-repeat 0 0`);

    this._attachClickEvent();

    return Promise.resolve();
  }

  _markersSubstring(): string {
    const markers: string[] = [];
    const markerIcon = this._option('markerIconSrc');

    if (markerIcon) {
      markers.push(`icon:${markerIcon}`);
    }

    each(this._option('markers'), (_, marker) => {
      markers.push(this._locationToString(marker.location));
    });

    return `markers=${markers.join('|')}`;
  }

  _routeSubstrings(): string[] {
    const routes: string[] = [];

    each(this._option('routes'), (_, route) => {
      const color = new Color(route.color || this._defaultRouteColor()).toHex().replace('#', '0x');
      const opacity = Math.round((route.opacity || this._defaultRouteOpacity()) * 255).toString(16);
      const width = route.weight || this._defaultRouteWeight();
      const locations: string[] = [];
      each(route.locations, (_, routePoint) => {
        locations.push(this._locationToString(routePoint));
      });

      routes.push(`path=color:${color}${opacity}|weight:${width}|${locations.join('|')}`);
    });

    return routes;
  }

  _attachClickEvent() {
    const eventName = this._addEventNamespace(clickEventName);

    eventsEngine.off(this._$container, eventName);
    eventsEngine.on(this._$container, eventName, (e) => {
      this._fireClickAction({ event: e });
    });
  }
}

/// #DEBUG
(GoogleStaticProvider as any).remapConstant = function (newValue) {
  GOOGLE_STATIC_URL = newValue;
};

/// #ENDDEBUG

export default GoogleStaticProvider;
