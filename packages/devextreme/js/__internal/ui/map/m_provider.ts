import { addNamespace } from '@js/common/core/events/utils/index';
import Class from '@js/core/class';
import type { dxElementWrapper } from '@js/core/renderer';
import { isNumeric, isPlainObject } from '@js/core/utils/type';
import type { DxEvent } from '@js/events';
import type { MapProvider } from '@js/ui/map';
import { isDefined } from '@ts/core/utils/m_type';

import type Map from './m_map';
import type { MapProperties } from './m_map';
import type { LocationOption, MarkerOptions, RouteOptions } from './m_provider.dynamic';

class Provider {
  _mapWidget!: Map;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    markerOptions: MarkerOptions[],
    routeOptions: RouteOptions[],
  ): Promise<unknown> {
    return this._renderImpl().then(() => Promise.all([
      this._applyFunctionIfNeeded('addMarkers', markerOptions),
      this._applyFunctionIfNeeded('addRoutes', routeOptions),
    ]).then(() => true));
  }

  _renderImpl(): Promise<unknown> {
    return Promise.resolve();
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  updateControls(markers: MarkerOptions[], routes: RouteOptions[]): Promise<unknown> {
    return Promise.resolve();
  }

  updateMarkers(
    markerOptionsToRemove: MarkerOptions[],
    markerOptionsToAdd: MarkerOptions[],
  ): Promise<unknown> {
    return new Promise((resolve) => {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this._applyFunctionIfNeeded('removeMarkers', markerOptionsToRemove)
        .then((removeValue) => {
          // eslint-disable-next-line @typescript-eslint/no-floating-promises
          this._applyFunctionIfNeeded('addMarkers', markerOptionsToAdd)
            .then((addValue) => {
              resolve(addValue || removeValue);
            });
        });
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  addMarkers(options: MarkerOptions[]): Promise<unknown> {
    return Promise.resolve();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  removeMarkers(options: MarkerOptions[]): Promise<unknown> {
    return Promise.resolve();
  }

  adjustViewport(): void {
    Class.abstract();
  }

  updateRoutes(
    routeOptionsToRemove: RouteOptions[],
    routeOptionsToAdd: RouteOptions[],
  ): Promise<unknown> {
    return new Promise((resolve) => {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this._applyFunctionIfNeeded('removeRoutes', routeOptionsToRemove)
        .then((removeValue) => {
          // eslint-disable-next-line @typescript-eslint/no-floating-promises
          this._applyFunctionIfNeeded('addRoutes', routeOptionsToAdd)
            .then((addValue) => {
              resolve(addValue || removeValue);
            });
        });
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  addRoutes(options: RouteOptions[]): Promise<unknown> {
    return Promise.resolve();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  removeRoutes(options: RouteOptions[]): Promise<unknown> {
    return Promise.resolve();
  }

  clean(): void {
    Class.abstract();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  map(): any {
    return this._map;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isEventsCanceled(e: DxEvent): boolean {
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

  _keyOption(providerName: MapProvider): string {
    const key = this._option('apiKey') ?? '';
    if (typeof key === 'string') {
      return key;
    }
    if (isPlainObject(key)) {
      return key[providerName] ?? '';
    }
    return '';
  }

  _parseTooltipOptions(
    option: string | { text?: string; isShown?: boolean },
  ): { text: string; visible: boolean } {
    const isStringOption = typeof option === 'string';

    return {
      text: isStringOption ? option : option.text ?? '',
      visible: isStringOption ? false : option.isShown ?? false,
    };
  }

  _getLatLng(location?: LocationOption | null): { lat: number; lng: number } | null {
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

  _applyFunctionIfNeeded(
    fnName: 'addMarkers' | 'removeMarkers' | 'addRoutes' | 'removeRoutes',
    array: MarkerOptions[] | RouteOptions[],
  ): Promise<unknown> {
    if (!array.length) {
      return Promise.resolve();
    }

    const isMarkersUpdate = fnName === 'addMarkers' || fnName === 'removeMarkers';
    if (isMarkersUpdate) {
      return this[fnName](array as MarkerOptions[]);
    }
    return this[fnName](array as RouteOptions[]);
  }

  _fireClickAction(
    actionArguments: { location?: { lat: number; lng: number }; event?: Event },
  ): void {
    this._mapWidget._createActionByOption('onClick')(actionArguments);
  }

  _fireMarkerAddedAction(
    actionArguments: { options: MarkerOptions; originalMarker?: unknown },
  ): void {
    this._mapWidget._createActionByOption('onMarkerAdded')(actionArguments);
  }

  _fireMarkerRemovedAction(
    actionArguments: { options: MarkerOptions; originalMarker?: unknown },
  ): void {
    this._mapWidget._createActionByOption('onMarkerRemoved')(actionArguments);
  }

  _fireRouteAddedAction(
    actionArguments: { options: RouteOptions; originalRoute?: unknown },
  ): void {
    this._mapWidget._createActionByOption('onRouteAdded')(actionArguments);
  }

  _fireRouteRemovedAction(
    actionArguments: { options: RouteOptions; originalRoute?: unknown },
  ): void {
    this._mapWidget._createActionByOption('onRouteRemoved')(actionArguments);
  }
}

export default Provider;
