/* eslint-disable class-methods-use-this */
import { addNamespace } from '@js/common/core/events/utils/index';
import Class from '@js/core/class';
import type { dxElementWrapper } from '@js/core/renderer';
import { isNumeric, isPlainObject } from '@js/core/utils/type';
import type { MapProvider } from '@js/ui/map';
import { isDefined } from '@ts/core/utils/m_type';

import type Map from './m_map';
import type { MapProperties } from './m_map';

class Provider {
  _mapWidget!: Map;

  _map?: any;

  _$container!: dxElementWrapper;

  constructor(map: Map, $container: dxElementWrapper) {
    this._mapWidget = map;
    this._$container = $container;
  }

  _defaultRouteWeight(): number {
    return 5;
  }

  _defaultRouteOpacity(): number {
    return 0.5;
  }

  _defaultRouteColor(): string {
    return '#0000FF';
  }

  render(
    markerOptions,
    routeOptions,
  ): Promise<void> {
    // @ts-expect-error ts-error
    return this._renderImpl().then(() => Promise.all([
      this._applyFunctionIfNeeded('addMarkers', markerOptions),
      this._applyFunctionIfNeeded('addRoutes', routeOptions),
    ]).then(() => true));
  }

  _renderImpl(): void {
    Class.abstract();
  }

  updateDimensions(): void {
    Class.abstract();
  }

  updateMapType(): void {
    Class.abstract();
  }

  updateDisabled(): void {
    Class.abstract();
  }

  updateBounds(): void {
    Class.abstract();
  }

  updateCenter(): void {
    Class.abstract();
  }

  updateZoom(): void {
    Class.abstract();
  }

  updateControls(): void {
    Class.abstract();
  }

  updateMarkers(markerOptionsToRemove, markerOptionsToAdd) {
    // eslint-disable-next-line no-promise-executor-return
    return new Promise((resolve) => this._applyFunctionIfNeeded('removeMarkers', markerOptionsToRemove).then((removeValue) => {
      this._applyFunctionIfNeeded('addMarkers', markerOptionsToAdd).then((addValue) => {
        resolve(addValue || removeValue);
      });
    }));
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  addMarkers(options): void {
    Class.abstract();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  removeMarkers(options): void {
    Class.abstract();
  }

  adjustViewport(): void {
    Class.abstract();
  }

  updateRoutes(routeOptionsToRemove, routeOptionsToAdd) {
    // eslint-disable-next-line no-promise-executor-return
    return new Promise((resolve) => this._applyFunctionIfNeeded('removeRoutes', routeOptionsToRemove).then((removeValue) => {
      this._applyFunctionIfNeeded('addRoutes', routeOptionsToAdd).then((addValue) => {
        resolve(addValue || removeValue);
      });
    }));
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  addRoutes(options) {
    Class.abstract();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  removeRoutes(options) {
    Class.abstract();
  }

  clean(): void {
    Class.abstract();
  }

  map() {
    return this._map;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isEventsCanceled(e) {
    return false;
  }

  _option<K extends keyof MapProperties>(name: K): MapProperties[K];
  _option<K extends keyof MapProperties>(name: K, value: MapProperties[K]): undefined;
  _option<K extends keyof MapProperties>(
    name: K,
    value?: MapProperties[K],
  ): MapProperties[K] | undefined {
    if (value === undefined) {
      const mapOptions = this._mapWidget.option();
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return mapOptions[name];
    }

    this._mapWidget.setOptionSilent(name, value);

    return undefined;
  }

  _keyOption(providerName: MapProvider) {
    const key = this._option('apiKey') ?? '';

    return key[providerName] === undefined ? key : key[providerName];
  }

  _parseTooltipOptions(option) {
    return {
      text: option.text || option,
      visible: option.isShown || false,
    };
  }

  _getLatLng(location): { lat: number; lng: number } | null {
    if (typeof location === 'string') {
      const coords = location.split(',').map((item) => item.trim());
      const numericRegex = /^[-+]?[0-9]*\.?[0-9]*$/;

      if (coords.length === 2 && numericRegex.exec(coords[0]) && numericRegex.exec(coords[1])) {
        return { lat: parseFloat(coords[0]), lng: parseFloat(coords[1]) };
      }
    } else if (Array.isArray(location) && location.length === 2) {
      return { lat: location[0], lng: location[1] };
    } else if (isPlainObject(location) && isNumeric(location.lat) && isNumeric(location.lng)) {
      return location as { lat: number; lng: number };
    }

    return null;
  }

  _areBoundsSet(): boolean {
    const bounds = this._option('bounds');

    return isDefined(bounds?.northEast) && isDefined(bounds?.southWest);
  }

  _addEventNamespace(name: string): string {
    // @ts-expect-error ts-error
    return addNamespace(name, this._mapWidget.NAME);
  }

  _applyFunctionIfNeeded(fnName, array: any[]) {
    if (!array.length) {
      return Promise.resolve();
    }

    return this[fnName](array);
  }

  _fireAction(name, actionArguments): void {
    this._mapWidget._createActionByOption(name)(actionArguments);
  }

  _fireClickAction(actionArguments): void {
    this._fireAction('onClick', actionArguments);
  }

  _fireMarkerAddedAction(actionArguments): void {
    this._fireAction('onMarkerAdded', actionArguments);
  }

  _fireMarkerRemovedAction(actionArguments): void {
    this._fireAction('onMarkerRemoved', actionArguments);
  }

  _fireRouteAddedAction(actionArguments): void {
    this._fireAction('onRouteAdded', actionArguments);
  }

  _fireRouteRemovedAction(actionArguments): void {
    this._fireAction('onRouteRemoved', actionArguments);
  }
}

export default Provider;
