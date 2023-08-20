import { map } from '@js/core/utils/iterator';
import { isNumeric, isPlainObject } from '@js/core/utils/type';
import { addNamespace } from '@js/events/utils/index';

type Location = string | { lat: number; lng: number };
abstract class Provider {
  _mapWidget: any;

  _$container: any;

  _map: any;

  constructor(map, $container) {
    this._mapWidget = map;
    this._$container = $container;
  }

  abstract _renderImpl(): Promise<void>;
  abstract updateDimensions(): Promise<void>;
  abstract updateMapType(): Promise<void>;
  abstract updateBounds(): Promise<void>;
  abstract updateCenter(): Promise<void>;
  abstract updateZoom(): Promise<void>;
  abstract updateControls(): any;
  // abstract addMarkers(options: any): Promise<any[]>;
  abstract removeMarkers(options: any): Promise<void>;
  abstract adjustViewport(): Promise<void>;
  // abstract addRoutes(options: any): Promise<boolean | any[]>;
  abstract removeRoutes(options: any): Promise<void>;
  abstract clean(): Promise<void>;

  _defaultRouteWeight(): number {
    return 5;
  }

  _defaultRouteOpacity(): number {
    return 0.5;
  }

  _defaultRouteColor() {
    return '#0000FF';
  }

  render(markerOptions, routeOptions) {
    return this._renderImpl().then(() => Promise.all([
      this._applyFunctionIfNeeded('addMarkers', markerOptions),
      this._applyFunctionIfNeeded('addRoutes', routeOptions),
    ]).then(() => true));
  }

  updateMarkers(markerOptionsToRemove, markerOptionsToAdd) {
    return new Promise((resolve) => {
      this._applyFunctionIfNeeded('removeMarkers', markerOptionsToRemove)
        .then((removeValue) => {
          this._applyFunctionIfNeeded('addMarkers', markerOptionsToAdd).then((addValue) => {
            resolve(addValue || removeValue);
          });
        });
    });
  }

  updateRoutes(routeOptionsToRemove, routeOptionsToAdd) {
    return new Promise((resolve) => {
      this._applyFunctionIfNeeded('removeRoutes', routeOptionsToRemove).then((removeValue) => {
        this._applyFunctionIfNeeded('addRoutes', routeOptionsToAdd).then((addValue) => {
          resolve(addValue || removeValue);
        });
      });
    });
  }

  map() {
    return this._map;
  }

  isEventsCanceled() {
    return false;
  }

  _option(name, value?): any | undefined {
    if (value === undefined) {
      return this._mapWidget.option(name);
    }

    this._mapWidget.setOptionSilent(name, value);
  }

  _keyOption(providerName) {
    const key = this._option('apiKey');

    return key[providerName] === undefined ? key : key[providerName];
  }

  _parseTooltipOptions(option) {
    return {
      text: option.text || option,
      visible: option.isShown || false,
    };
  }

  _getLatLng(location: Location): { lat: number; lng: number } | null {
    if (typeof location === 'string') {
      const coords = map(location.split(','), (item) => item.trim());
      const numericRegex = /^[-+]?[0-9]*\.?[0-9]*$/;

      if (coords.length === 2 && coords[0].match(numericRegex) && coords[1].match(numericRegex)) {
        return { lat: parseFloat(coords[0]), lng: parseFloat(coords[1]) };
      }
    } else if (Array.isArray(location) && location.length === 2) {
      return { lat: location[0], lng: location[1] };
    } else if (isPlainObject(location) && isNumeric(location.lat) && isNumeric(location.lng)) {
      return location;
    }

    return null;
  }

  _areBoundsSet(): boolean {
    return this._option('bounds.northEast') && this._option('bounds.southWest');
  }

  _addEventNamespace(name: string): string {
    return addNamespace(name, this._mapWidget.NAME);
  }

  _applyFunctionIfNeeded(fnName: string, array): Promise<any> {
    if (!array.length) {
      return Promise.resolve();
    }

    return this[fnName](array) as Promise<any>;
  }

  _fireAction(name: string, actionArguments: any): void {
    this._mapWidget._createActionByOption(name)(actionArguments);
  }

  _fireClickAction(actionArguments: any): void {
    this._fireAction('onClick', actionArguments);
  }

  _fireMarkerAddedAction(actionArguments: any): void {
    this._fireAction('onMarkerAdded', actionArguments);
  }

  _fireMarkerRemovedAction(actionArguments: any): void {
    this._fireAction('onMarkerRemoved', actionArguments);
  }

  _fireRouteAddedAction(actionArguments: any): void {
    this._fireAction('onRouteAdded', actionArguments);
  }

  _fireRouteRemovedAction(actionArguments: any): void {
    this._fireAction('onRouteRemoved', actionArguments);
  }
}

export default Provider;
