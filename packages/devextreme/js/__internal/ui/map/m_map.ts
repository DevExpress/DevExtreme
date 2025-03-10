import eventsEngine from '@js/common/core/events/core/events_engine';
import pointerEvents from '@js/common/core/events/pointer';
import { addNamespace } from '@js/common/core/events/utils/index';
import registerComponent from '@js/core/component_registrator';
import devices from '@js/core/devices';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { wrapToArray } from '@js/core/utils/array';
// @ts-expect-error
import { fromPromise } from '@js/core/utils/deferred';
import { extend } from '@js/core/utils/extend';
import { titleize } from '@js/core/utils/inflector';
import { each } from '@js/core/utils/iterator';
import { isNumeric } from '@js/core/utils/type';
import type { Properties } from '@js/ui/map';
import errors from '@js/ui/widget/ui.errors';
import type { OptionChanged } from '@ts/core/widget/types';
import Widget from '@ts/core/widget/widget';

import azure from './m_provider.dynamic.azure';
import bing from './m_provider.dynamic.bing';
import google from './m_provider.dynamic.google';
// NOTE external urls must have protocol explicitly specified (because inside Cordova package the protocol is "file:")
import googleStatic from './m_provider.google_static';

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

  bounds?: Record<string, unknown>;
}

class Map extends Widget<MapProperties> {
  _optionChangeBag?: Record<string, unknown> | null;

  _lastAsyncAction!: Promise<void>;

  _provider!: azure | googleStatic | google | bing;

  _asyncActionSuppressed?: boolean;

  _suppressAsyncAction?: boolean;

  _rendered!: Record<string, unknown>;

  _$container?: dxElementWrapper;

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

  _defaultOptionsRules() {
    return super._defaultOptionsRules().concat([
      {
        device() {
          return devices.real().deviceType === 'desktop' && !devices.isSimulator();
        },
        options: {
          focusStateEnabled: true,
        },
      },
    ]);
  }

  ctor(element, options) {
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

  _checkOption(option): void {
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

  _cancelEvent(e): void {
    const cancelByProvider = this._provider?.isEventsCanceled(e) && !this.option('disabled');
    if (cancelByProvider) {
      e.stopPropagation();
    }
  }

  _saveRendered(option): void {
    const value = this.option(option);
    // @ts-expect-error ts-error
    this._rendered[option] = value.slice();
  }

  _render(): void {
    super._render();

    this._renderShield();

    this._saveRendered('markers');
    this._saveRendered('routes');

    const { provider } = this.option();

    // @ts-expect-error ts-error
    this._provider = new PROVIDERS[provider](this, this._$container);
    this._queueAsyncAction('render', this._rendered.markers, this._rendered.routes);
  }

  _renderShield(): void {
    let $shield;

    if (this.option('disabled')) {
      $shield = $('<div>').addClass(MAP_SHIELD_CLASS);
      this.$element().append($shield);
    } else {
      $shield = this.$element().find(`.${MAP_SHIELD_CLASS}`);
      $shield.remove();
    }
  }

  _clean(): void {
    this._cleanFocusState();
    if (this._provider) {
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
        this._queueAsyncAction('updateBounds');
        break;
      case 'center':
        this._queueAsyncAction('updateCenter');
        break;
      case 'zoom':
        this._queueAsyncAction('updateZoom');
        break;
      case 'type':
        this._queueAsyncAction('updateMapType');
        break;
      case 'controls':
        this._queueAsyncAction('updateControls', this._rendered.markers, this._rendered.routes);
        break;
      case 'autoAdjust':
        this._queueAsyncAction('adjustViewport');
        break;
      case 'markers':
      case 'routes': {
        this._checkOption(name);

        const prevValue = this._rendered[name];
        this._saveRendered(name);
        this._queueAsyncAction(
          `update${titleize(name)}`,
          changeBag ? changeBag.removed : prevValue,
          changeBag ? changeBag.added : this._rendered[name],
        ).then((result) => {
          if (changeBag) {
            // @ts-expect-error ts-error
            changeBag.resolve(result);
          }
        });
        break;
      }
      case 'markerIconSrc':
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
        // @ts-expect-error ts-error
        super._optionChanged.apply(this, arguments);
    }
  }

  _visibilityChanged(visible: boolean): void {
    if (visible) {
      this._dimensionChanged();
    }
  }

  _dimensionChanged(): void {
    this._queueAsyncAction('updateDimensions');
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _queueAsyncAction(name, markers?, routers?) {
    const options = [].slice.call(arguments).slice(1);
    const isActionSuppressed = this._suppressAsyncAction;

    this._lastAsyncAction = this._lastAsyncAction.then(() => {
      if (!this._provider || isActionSuppressed) {
        /// #DEBUG
        this._asyncActionSuppressed = true;
        /// #ENDDEBUG
        return Promise.resolve();
      }

      return this._provider[name].apply(this._provider, options).then((result) => {
        result = wrapToArray(result);

        const mapRefreshed = result[0];
        if (mapRefreshed && !this._disposed) {
          this._triggerReadyAction();
        }
        /// #DEBUG
        if (!mapRefreshed && name !== 'clean' && !this._disposed) {
          this._triggerUpdateAction();
        }
        /// #ENDDEBUG

        return result[1];
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

  setOptionSilent(name, value): void {
    this._setOptionWithoutOptionChange(name, value);
  }

  addMarker(marker) {
    return this._addFunction('markers', marker);
  }

  removeMarker(marker) {
    return this._removeFunction('markers', marker);
  }

  addRoute(route) {
    return this._addFunction('routes', route);
  }

  removeRoute(route) {
    return this._removeFunction('routes', route);
  }

  _addFunction(optionName, addingValue) {
    const optionValue = this.option(optionName);
    const addingValues = wrapToArray(addingValue);
    // @ts-expect-error ts-error
    optionValue.push.apply(optionValue, addingValues);

    return this._partialArrayOptionChange(optionName, optionValue, addingValues, []);
  }

  _removeFunction(optionName, removingValue) {
    const optionValue = this.option(optionName);
    const removingValues = wrapToArray(removingValue);

    each(removingValues, (removingIndex, removingValue) => {
      const index = isNumeric(removingValue)
        ? removingValue
      // @ts-expect-error ts-error
        : optionValue?.indexOf(removingValue);

      if (index !== -1) {
        // @ts-expect-error ts-error
        const removing = optionValue.splice(index, 1)[0];
        removingValues.splice(removingIndex, 1, removing);
      } else {
        throw errors.log('E1021', titleize(optionName.substring(0, optionName.length - 1)), removingValue);
      }
    });

    return this._partialArrayOptionChange(optionName, optionValue, [], removingValues);
  }

  _partialArrayOptionChange(optionName, optionValue, addingValues, removingValues) {
    return fromPromise(new Promise((resolve) => {
      this._optionChangeBag = {
        resolve,
        added: addingValues,
        removed: removingValues,
      };
      this.option(optionName, optionValue);
      // @ts-expect-error
    }).then((result) => (result && result.length === 1 ? result[0] : result)), this);
  }
}

registerComponent('dxMap', Map);

export default Map;
