import type { DefaultOptionsRule } from '@js/common';
import eventsEngine from '@js/common/core/events/core/events_engine';
import pointerEvents from '@js/common/core/events/pointer';
import { addNamespace } from '@js/common/core/events/utils/index';
import registerComponent from '@js/core/component_registrator';
import devices from '@js/core/devices';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { wrapToArray } from '@js/core/utils/array';
import { extend } from '@js/core/utils/extend';
import { titleize } from '@js/core/utils/inflector';
import { isNumeric } from '@js/core/utils/type';
import type { DxEvent } from '@js/events';
import type { Properties } from '@js/ui/map';
import errors from '@js/ui/widget/ui.errors';
import { fromPromise } from '@ts/core/utils/m_deferred';
import type { OptionChanged } from '@ts/core/widget/types';
import Widget from '@ts/core/widget/widget';

import type { LocationOption } from './provider.dynamic';
import azure from './provider.dynamic.azure';
import bing from './provider.dynamic.bing';
import google from './provider.dynamic.google';
// NOTE external urls must have protocol explicitly specified
// (because inside Cordova package the protocol is "file:")
import googleStatic from './provider.google_static';

const PROVIDERS = {
  azure,
  googleStatic,
  google,
  bing,
};

const MAP_CLASS = 'dx-map';
const MAP_CONTAINER_CLASS = 'dx-map-container';
const MAP_SHIELD_CLASS = 'dx-map-shield';

export interface MapProperties extends Properties {
  onUpdated?: () => {};

  bounds?: {
    southWest?: LocationOption | null;
    northEast?: LocationOption | null;
  };
}

class Map extends Widget<MapProperties> {
  _optionChangeBag?: {
    resolve: (value?: unknown) => void;
    added: MapProperties['markers'] | MapProperties['routes'];
    removed: MapProperties['markers'] | MapProperties['routes'];
  } | null;

  _lastAsyncAction!: Promise<void>;

  _provider!: azure | googleStatic | google | bing;

  _asyncActionSuppressed?: boolean;

  _suppressAsyncAction?: boolean;

  _rendered!: {
    markers?: MapProperties['markers'] | MapProperties['routes'];
    routes?: MapProperties['routes'] | MapProperties['markers'];
  };

  _$container!: dxElementWrapper;

  _getDefaultOptions(): MapProperties {
    return {
      ...super._getDefaultOptions(),
      bounds: {
        northEast: null,
        southWest: null,
      },
      center: {
        lat: 0,
        lng: 0,
      },
      zoom: 1,
      width: 300,
      height: 300,
      type: 'roadmap',
      provider: 'google',
      autoAdjust: true,
      markers: [],
      // @ts-expect-error ts-error
      markerIconSrc: null,
      // @ts-expect-error ts-error
      onMarkerAdded: null,
      // @ts-expect-error ts-error
      onMarkerRemoved: null,
      routes: [],
      // @ts-expect-error ts-error
      onRouteAdded: null,
      // @ts-expect-error ts-error
      onRouteRemoved: null,
      apiKey: {
        bing: '',
        google: '',
        googleStatic: '',
      },
      providerConfig: {
        mapId: '',
        useAdvancedMarkers: true,
      },
      controls: false,
      // @ts-expect-error ts-error
      onReady: null,
      // for internal use only
      // @ts-expect-error ts-error
      onUpdated: null,
      // @ts-expect-error ts-error
      onClick: null,
    };
  }

  _defaultOptionsRules(): DefaultOptionsRule<MapProperties>[] {
    return super._defaultOptionsRules().concat([
      {
        device(): boolean {
          return devices.real().deviceType === 'desktop' && !devices.isSimulator();
        },
        options: {
          focusStateEnabled: true,
        },
      },
    ]);
  }

  ctor(element: Element, options: MapProperties): void {
    super.ctor(element, options);

    if (options) {
      if ('provider' in options && options.provider === 'bing') {
        this._logDeprecatedBingProvider();
      }
    }
  }

  _logDeprecatedBingProvider(): void {
    this._logDeprecatedOptionWarning('provider: bing', {
      since: '24.2',
      message: 'Use other map providers, such as Azure, Google, or GoogleStatic.',
    });
  }

  _setDeprecatedOptions(): void {
    super._setDeprecatedOptions();
    extend(this._deprecatedOptions, {
      'providerConfig.useAdvancedMarkers': { since: '24.2', message: 'Google deprecated the original map markers. Transition to advanced markers for future compatibility.' },
    });
  }

  _renderFocusTarget(): void {}

  _init(): void {
    super._init();

    this.$element()
      .addClass(MAP_CLASS);

    this._lastAsyncAction = Promise.resolve();

    this._checkOption('provider');
    this._checkOption('markers');
    this._checkOption('routes');

    this._initContainer();
    this._grabEvents();

    this._rendered = {};
  }

  _useTemplates(): boolean {
    return false;
  }

  _checkOption(option: 'markers' | 'routes' | 'provider'): void {
    const value = this.option(option);

    if (option === 'markers' && !Array.isArray(value)) {
      throw errors.Error('E1022');
    }
    if (option === 'routes' && !Array.isArray(value)) {
      throw errors.Error('E1023');
    }
  }

  _initContainer(): void {
    this._$container = $('<div>')
      .addClass(MAP_CONTAINER_CLASS);

    this.$element().append(this._$container);
  }

  _grabEvents(): void {
    // @ts-expect-error ts-error
    const eventName = addNamespace(pointerEvents.down, this.NAME);

    eventsEngine.on(this.$element(), eventName, this._cancelEvent.bind(this));
  }

  _cancelEvent(e: DxEvent): void {
    const { disabled } = this.option();
    const cancelByProvider = this._provider?.isEventsCanceled(e) && !disabled;
    if (cancelByProvider) {
      e.stopPropagation();
    }
  }

  _saveRendered(option: 'markers' | 'routes'): void {
    const { [option]: value = [] } = this.option();
    this._rendered[option] = value.slice();
  }

  _render(): void {
    super._render();

    this._renderShield();

    this._saveRendered('markers');
    this._saveRendered('routes');

    const { provider = 'google' } = this.option();
    const Provider = PROVIDERS[provider];

    this._provider = new Provider(this, this._$container);

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this._queueAsyncAction('render', this._rendered.markers, this._rendered.routes);
  }

  _renderShield(): void {
    const { disabled } = this.option();

    if (disabled) {
      const $shield = $('<div>').addClass(MAP_SHIELD_CLASS);
      this.$element().append($shield);

      return;
    }

    this.$element()
      .find(`.${MAP_SHIELD_CLASS}`)
      .remove();
  }

  _clean(): void {
    this._cleanFocusState();
    if (this._provider) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this._provider.clean();
    }
    // @ts-expect-error ts-error
    this._provider = null;
    this._lastAsyncAction = Promise.resolve();
    this.setOptionSilent('bounds', { northEast: null, southWest: null });

    delete this._suppressAsyncAction;
  }

  _optionChanged(args: OptionChanged<MapProperties>): void {
    const { name, value } = args;

    const changeBag = this._optionChangeBag;
    this._optionChangeBag = null;

    switch (name) {
      case 'disabled':
        this._renderShield();
        super._optionChanged(args);
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        this._queueAsyncAction('updateDisabled');
        break;
      case 'width':
      case 'height':
        super._optionChanged(args);
        this._dimensionChanged();
        break;
      case 'provider':
        this._suppressAsyncAction = true;
        this._invalidate();
        if (value === 'bing') {
          this._logDeprecatedBingProvider();
        }
        break;
      case 'apiKey':
        errors.log('W1001');
        break;
      case 'bounds':
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        this._queueAsyncAction('updateBounds');
        break;
      case 'center':
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        this._queueAsyncAction('updateCenter');
        break;
      case 'zoom':
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        this._queueAsyncAction('updateZoom');
        break;
      case 'type':
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        this._queueAsyncAction('updateMapType');
        break;
      case 'controls':
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        this._queueAsyncAction('updateControls', this._rendered.markers, this._rendered.routes);
        break;
      case 'autoAdjust':
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        this._queueAsyncAction('adjustViewport');
        break;
      case 'markers':
      case 'routes': {
        this._checkOption(name);

        const prevValue = this._rendered[name];
        this._saveRendered(name);
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        this._queueAsyncAction(
          `${name === 'markers' ? 'updateMarkers' : 'updateRoutes'}`,
          changeBag ? changeBag.removed : prevValue,
          changeBag ? changeBag.added : this._rendered[name],
        ).then((result) => {
          if (changeBag) {
            changeBag.resolve(result);
          }
        });
        break;
      }
      case 'markerIconSrc':
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        this._queueAsyncAction('updateMarkers', this._rendered.markers, this._rendered.markers);
        break;
      case 'providerConfig':
        this._suppressAsyncAction = true;
        this._invalidate();
        break;
      case 'onReady':
      case 'onUpdated':
      case 'onMarkerAdded':
      case 'onMarkerRemoved':
      case 'onRouteAdded':
      case 'onRouteRemoved':
      case 'onClick':
        break;
      default:
        super._optionChanged(args);
    }
  }

  _visibilityChanged(visible: boolean): void {
    if (visible) {
      this._dimensionChanged();
    }
  }

  _dimensionChanged(): void {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this._queueAsyncAction('updateDimensions');
  }

  _queueAsyncAction(
    name: string,
    markers?: MapProperties['markers'] | MapProperties['routes'],
    routes?: MapProperties['routes'] | MapProperties['markers'],
  ): Promise<void> {
    const markerAndRoutes = [markers, routes].filter(Boolean);
    const isActionSuppressed = this._suppressAsyncAction;

    this._lastAsyncAction = this._lastAsyncAction.then(() => {
      if (!this._provider || isActionSuppressed) {
        /// #DEBUG
        this._asyncActionSuppressed = true;
        /// #ENDDEBUG
        return Promise.resolve();
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return this._provider[name](...markerAndRoutes).then((result) => {
        const arrayResult = wrapToArray(result);

        const mapRefreshed = arrayResult[0];
        if (mapRefreshed && !this._disposed) {
          this._triggerReadyAction();
        }
        /// #DEBUG
        if (!mapRefreshed && name !== 'clean' && !this._disposed) {
          this._triggerUpdateAction();
        }
        /// #ENDDEBUG

        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return arrayResult[1];
      });
    });

    return this._lastAsyncAction;
  }

  _triggerReadyAction(): void {
    this._createActionByOption('onReady')({ originalMap: this._provider.map() });
  }

  _triggerUpdateAction(): void {
    this._createActionByOption('onUpdated')();
  }

  setOptionSilent(name: string, value: unknown): void {
    this._setOptionWithoutOptionChange(name, value);
  }

  addMarker(marker: MapProperties['markers']): Promise<unknown> {
    return this._addFunction('markers', marker);
  }

  removeMarker(marker: MapProperties['markers'] | number): Promise<void> {
    return this._removeFunction('markers', marker);
  }

  addRoute(route: MapProperties['routes']): Promise<unknown> {
    return this._addFunction('routes', route);
  }

  removeRoute(route: MapProperties['routes'] | number): Promise<void> {
    return this._removeFunction('routes', route);
  }

  _addFunction(
    optionName: 'markers',
    addingValue: MapProperties['markers']
  ): Promise<unknown>;
  _addFunction(
    optionName: 'routes',
    addingValue: MapProperties['routes']
  ): Promise<unknown>;
  _addFunction(
    optionName: 'markers' | 'routes',
    addingValue: MapProperties['markers'] | MapProperties['routes'],
  ): Promise<unknown> {
    const { [optionName]: optionValue = [] } = this.option();
    const addingValues = wrapToArray(addingValue);
    optionValue.push(...addingValues);

    return this._partialArrayOptionChange(optionName, optionValue, addingValues, []);
  }

  _removeFunction(
    optionName: 'markers',
    removingValue: MapProperties['markers'] | number,
  ): Promise<void>;
  _removeFunction(
    optionName: 'routes',
    removingValue: MapProperties['routes' ] | number,
  ): Promise<void>;
  _removeFunction(
    optionName: 'markers' | 'routes',
    removingValue: MapProperties['markers'] | MapProperties['routes' ] | number,
  ): Promise<void> {
    const { [optionName]: optionValue = [] } = this.option();
    const removingValues = wrapToArray(removingValue);

    removingValues.forEach((value, removingIndex) => {
      const index = isNumeric(value)
        ? value
        : optionValue.indexOf(value);

      if (index !== -1) {
        const removing = optionValue.splice(index, 1)[0];
        removingValues.splice(removingIndex, 1, removing);
      } else {
        throw errors.log('E1021', titleize(optionName.substring(0, optionName.length - 1)), value);
      }
    });

    return this._partialArrayOptionChange(optionName, optionValue, [], removingValues);
  }

  _partialArrayOptionChange(
    optionName: 'markers' | 'routes',
    optionValue: MapProperties['markers'] | MapProperties['routes'],
    addingValues: MapProperties['markers'] | MapProperties['routes'],
    removingValues: MapProperties['markers'] | MapProperties['routes'],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Promise<void> | Promise<any> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return fromPromise(new Promise((resolve) => {
      this._optionChangeBag = {
        resolve,
        added: addingValues,
        removed: removingValues,
      };
      this.option(optionName, optionValue);
    }).then((result) => {
      const resultArray = Array.isArray(result) ? result : [result];

      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return resultArray.length === 1 ? resultArray[0] : resultArray;
    }), this);
  }
}

registerComponent('dxMap', Map);

export default Map;
