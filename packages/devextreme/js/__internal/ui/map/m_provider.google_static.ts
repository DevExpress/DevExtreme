/* eslint-disable class-methods-use-this */
/* eslint-disable @typescript-eslint/no-misused-promises */
import Color from '@js/color';
import { name as clickEventName } from '@js/common/core/events/click';
import eventsEngine from '@js/common/core/events/core/events_engine';
import { getHeight, getWidth } from '@js/core/utils/size';

import Provider from './m_provider';

let GOOGLE_STATIC_URL = 'https://maps.google.com/maps/api/staticmap?';

class GoogleStaticProvider extends Provider {
  _locationToString(location: unknown): string {
    const latLng = this._getLatLng(location);
    return latLng ? `${latLng.lat},${latLng.lng}` : String(location).replace(/ /g, '+');
  }

  _renderImpl(): Promise<boolean> {
    return this._updateMap();
  }

  updateDimensions(): Promise<boolean> {
    return this._updateMap();
  }

  updateMapType(): Promise<boolean> {
    return this._updateMap();
  }

  updateBounds(): Promise<void> {
    return Promise.resolve();
  }

  updateCenter(): Promise<boolean> {
    return this._updateMap();
  }

  updateZoom(): Promise<boolean> {
    return this._updateMap();
  }

  updateControls(): Promise<void> {
    return Promise.resolve();
  }

  addMarkers(markers = []): Promise<boolean> {
    return this._updateMap().then((result) => {
      markers.forEach((options) => {
        this._fireMarkerAddedAction({
          options,
        });
      });
      return result;
    });
  }

  removeMarkers(markers = []): Promise<boolean> {
    return this._updateMap().then((result) => {
      markers.forEach((options) => {
        this._fireMarkerRemovedAction({
          options,
        });
      });
      return result;
    });
  }

  adjustViewport(): Promise<void> {
    return Promise.resolve();
  }

  addRoutes(routes = []): Promise<boolean> {
    return this._updateMap().then((result) => {
      routes.forEach((options) => {
        this._fireRouteAddedAction({
          options,
        });
      });
      return result;
    });
  }

  removeRoutes(routes = []): Promise<boolean> {
    return this._updateMap().then((result) => {
      routes.forEach((options) => {
        this._fireRouteRemovedAction({
          options,
        });
      });
      return result;
    });
  }

  clean(): Promise<void> {
    this._$container.css('backgroundImage', 'none');
    eventsEngine.off(this._$container, this._addEventNamespace(clickEventName));

    return Promise.resolve();
  }

  mapRendered(): boolean {
    return true;
  }

  _updateMap(): Promise<boolean> {
    const key = this._keyOption('googleStatic');
    const providerConfig = this._option('providerConfig');
    const mapId = providerConfig?.mapId;
    const $container = this._$container;

    const requestOptions = [
      'sensor=false',
      `size=${Math.round(getWidth($container))}x${Math.round(getHeight($container))}`,

      `maptype=${this._option('type')}`,
      `center=${this._locationToString(this._option('center'))}`,

      `zoom=${this._option('zoom')}`,
      this._markersSubstring(),
    ];
    requestOptions.push(...this._routeSubstrings());
    if (key) {
      requestOptions.push(`key=${key}`);
    }

    if (mapId) {
      requestOptions.push(`map_id=${mapId}`);
    }

    const request = GOOGLE_STATIC_URL + requestOptions.join('&');

    this._$container.css('background', `url("${request}") no-repeat 0 0`);

    this._attachClickEvent();

    return Promise.resolve(true);
  }

  _markersSubstring(): string {
    const markers: string[] = [];
    const markerIcon = this._option('markerIconSrc');
    const markersOption = this._option('markers') ?? [];
    if (markerIcon) {
      markers.push(`icon:${markerIcon}`);
    }

    markersOption.forEach((marker) => {
      markers.push(this._locationToString(marker.location));
    });

    return `markers=${markers.join('|')}`;
  }

  _routeSubstrings(): string[] {
    const routes: string[] = [];
    const routesOptions = this._option('routes') ?? [];

    routesOptions.forEach((route) => {
      const color = new Color(route.color ?? this._defaultRouteColor()).toHex().replace('#', '0x');
      const opacity = Math.round((route.opacity ?? this._defaultRouteOpacity()) * 255).toString(16);
      const width = route.weight ?? this._defaultRouteWeight();
      const locations: string[] = [];
      const routeLocations = route.locations ?? [];

      routeLocations.forEach((routePoint) => {
        locations.push(this._locationToString(routePoint));
      });

      routes.push(`path=color:${color}${opacity}|weight:${width}|${locations.join('|')}`);
    });

    return routes;
  }

  _attachClickEvent(): void {
    const eventName = this._addEventNamespace(clickEventName);

    eventsEngine.off(this._$container, eventName);
    eventsEngine.on(this._$container, eventName, (e) => {
      this._fireClickAction({ event: e });
    });
  }
}

/// #DEBUG
// @ts-expect-error ts-error
GoogleStaticProvider.remapConstant = (newValue: string): void => {
  GOOGLE_STATIC_URL = newValue;
};

/// #ENDDEBUG

export default GoogleStaticProvider;
