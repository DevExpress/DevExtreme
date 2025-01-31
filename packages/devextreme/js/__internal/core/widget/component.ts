import Action from '@js/core/action';
import Class from '@js/core/class';
import type {
  Component as PublicComponent,
  ComponentOptions,
} from '@js/core/component';
import Config from '@js/core/config';
import type { OptionChangedEventInfo } from '@js/core/dom_component';
import errors from '@js/core/errors';
import { EventsStrategy } from '@js/core/events_strategy';
import { Options } from '@js/core/options/index';
import type { DefaultOptionsRule } from '@js/core/options/utils';
import { convertRulesToOptions } from '@js/core/options/utils';
import { PostponedOperations } from '@js/core/postponed_operations';
import type { dxElementWrapper } from '@js/core/renderer';
import Callbacks from '@js/core/utils/callbacks';
import { noop } from '@js/core/utils/common';
import { getPathParts } from '@js/core/utils/data';
import { extend } from '@js/core/utils/extend';
import { name as publicComponentName } from '@js/core/utils/public_component';
import { isDefined, isFunction, isPlainObject } from '@js/core/utils/type';
import type { EventInfo, InitializedEventInfo } from '@js/events';

import type { OptionChanged } from './types';

// eslint-disable-next-line max-len
// eslint-disable-next-line @typescript-eslint/restrict-plus-operands, @typescript-eslint/no-unsafe-return, max-len
const getEventName = (actionName): string => actionName.charAt(2).toLowerCase() + actionName.substr(3);

const isInnerOption = (optionName): boolean => optionName.indexOf('_', 0) === 0;

export interface ActionConfig {
  beforeExecute?: (e: Record<string, unknown>) => void;
  afterExecute?: (e: Record<string, unknown>) => void;
  excludeValidators?: ('disabled' | 'readOnly')[];
  element?: Element;
  validatingTargetName?: string;
  category?: 'rendering';
}

export interface Properties<TComponent> extends ComponentOptions<
EventInfo<TComponent>,
InitializedEventInfo<TComponent>,
OptionChangedEventInfo<TComponent>
> {
  onInitializing?: ((e: Record<string, unknown>) => void) | undefined;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  defaultOptionsRules?: DefaultOptionsRule<any>[];
}

// eslint-disable-next-line max-len
export class Component<
  TComponent extends Component<TComponent, TProperties>,
  TProperties extends Properties<TComponent>,
  // @ts-expect-error dxClass inheritance issue
  // eslint-disable-next-line @typescript-eslint/ban-types
> extends (Class.inherit({}) as new() => {}) implements PublicComponent<TProperties> {
  _deprecatedOptions!: Partial<TProperties>;

  _options!: Options;

  _optionsByReference!: Partial<TProperties>;

  NAME?: string;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _eventsStrategy: any;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _optionChangedCallbacks: any;

  _updateLockCount!: number;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _disposingCallbacks: any;

  postponedOperations!: PostponedOperations;

  _initialized!: boolean;

  _optionChangedAction?: (event?: Record<string, unknown>) => void;

  _disposingAction?: (event?: Record<string, unknown>) => void;

  _disposed?: boolean;

  _initializing?: boolean;

  _cancelOptionChange?: string | boolean;

  _setDeprecatedOptions(): void {
    this._deprecatedOptions = {};
  }

  _getDeprecatedOptions(): Partial<TProperties> {
    return this._deprecatedOptions;
  }

  _getDefaultOptions(): TProperties {
    return {
      onInitialized: null,
      onOptionChanged: null,
      onDisposing: null,

      defaultOptionsRules: null,
    } as unknown as TProperties;
  }

  _defaultOptionsRules(): DefaultOptionsRule<TProperties>[] {
    return [];
  }

  _setOptionsByDevice(rules: DefaultOptionsRule<TProperties>[] | undefined): void {
    this._options.applyRules(rules);
  }

  _convertRulesToOptions(rules: DefaultOptionsRule<TProperties>[]): TProperties {
    return convertRulesToOptions(rules);
  }

  _isInitialOptionValue(name: string): boolean {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this._options.isInitial(name);
  }

  _setOptionsByReference(): void {
    this._optionsByReference = {};
  }

  _getOptionsByReference(): Partial<TProperties> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this._optionsByReference;
  }

  // eslint-disable-next-line max-len
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-unused-vars
  ctor(options: any = {}, extra?: unknown): void {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { _optionChangedCallbacks, _disposingCallbacks } = options;

    this.NAME = publicComponentName(this.constructor);

    this._eventsStrategy = EventsStrategy.create(this, options.eventsStrategy);

    this._updateLockCount = 0;

    this._optionChangedCallbacks = _optionChangedCallbacks || Callbacks();
    this._disposingCallbacks = _disposingCallbacks || Callbacks();
    this.postponedOperations = new PostponedOperations();
    this._createOptions(options);
  }

  _createOptions(options: TProperties): void {
    this.beginUpdate();

    try {
      this._setOptionsByReference();
      this._setDeprecatedOptions();
      this._options = new Options(
        this._getDefaultOptions(),
        this._getDefaultOptions(),
        this._getOptionsByReference(),
        this._getDeprecatedOptions(),
      );

      this._options.onChanging(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        (name, previousValue, value) => this._initialized
          && this._optionChanging(name, previousValue, value),
      );
      this._options.onDeprecated(
        (option, info) => this._logDeprecatedOptionWarning(option, info),
      );
      this._options.onChanged(
        (name, value, previousValue) => this._notifyOptionChanged(name, value, previousValue),
      );
      this._options.onStartChange(() => this.beginUpdate());
      this._options.onEndChange(() => this.endUpdate());
      this._options.addRules(this._defaultOptionsRules());
      this._options.validateOptions((o) => this._validateOptions(o));

      // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
      if (options && options.onInitializing) {
        // @ts-expect-error
        options.onInitializing.apply(this, [options]);
      }

      this._setOptionsByDevice(options.defaultOptionsRules);
      this._initOptions(options);
    } finally {
      this.endUpdate();
    }
  }

  _initOptions(options: TProperties): void {
    this.option(options);
  }

  _init(): void {
    this._createOptionChangedAction();

    this.on('disposing', (args) => {
      this._disposingCallbacks.fireWith(this, [args]);
    });
  }

  _logDeprecatedOptionWarning(
    option: string,
    info: { since: string; message: string; alias: string },
  ): void {
    const message = info.message || `Use the '${info.alias}' option instead`;
    errors.log('W0001', this.NAME, option, info.since, message);
  }

  _logDeprecatedComponentWarning(since: 'string', alias: 'string'): void {
    errors.log('W0000', this.NAME, since, `Use the '${alias}' widget instead`);
  }

  _createOptionChangedAction(): void {
    this._optionChangedAction = this._createActionByOption('onOptionChanged', { excludeValidators: ['disabled', 'readOnly'] });
  }

  _createDisposingAction(): void {
    this._disposingAction = this._createActionByOption('onDisposing', { excludeValidators: ['disabled', 'readOnly'] });
  }

  _optionChanged(args: OptionChanged<TProperties> | Record<string, unknown>): void {
    const { name } = args;

    switch (name) {
      case 'onDisposing':
      case 'onInitialized':
        break;
      case 'onOptionChanged':
        this._createOptionChangedAction();
        break;
      case 'defaultOptionsRules':
        break;
      default:
        break;
    }
  }

  _dispose(): void {
    this._optionChangedCallbacks.empty();
    this._createDisposingAction();
    this._disposingAction?.();
    this._eventsStrategy.dispose();
    this._options.dispose();
    this._disposed = true;
  }

  _lockUpdate(): void {
    // eslint-disable-next-line no-plusplus
    this._updateLockCount++;
  }

  _unlockUpdate(): void {
    this._updateLockCount = Math.max(this._updateLockCount - 1, 0);
  }

  // TODO: remake as getter after ES6 refactor
  _isUpdateAllowed(): boolean {
    return this._updateLockCount === 0;
  }

  // TODO: remake as getter after ES6 refactor
  _isInitializingRequired(): boolean {
    return !this._initializing && !this._initialized;
  }

  isInitialized(): boolean {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this._initialized;
  }

  _commitUpdate(): void {
    this.postponedOperations.callPostponedOperations();
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    this._isInitializingRequired() && this._initializeComponent();
  }

  _initializeComponent(): void {
    this._initializing = true;

    try {
      this._init();
    } finally {
      this._initializing = false;
      this._lockUpdate();
      this._createActionByOption('onInitialized', { excludeValidators: ['disabled', 'readOnly'] })();
      this._unlockUpdate();
      this._initialized = true;
    }
  }

  instance(): this {
    return this;
  }

  beginUpdate(): void {
    this._lockUpdate();
  }

  endUpdate(): void {
    this._unlockUpdate();
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    this._isUpdateAllowed() && this._commitUpdate();
  }

  // eslint-disable-next-line max-len
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
  _optionChanging(...args: any[]) {

  }

  _notifyOptionChanged(option: string, value: unknown, previousValue: unknown): void {
    if (this._initialized) {
      const optionNames = [option].concat(this._options.getAliasesByName(option));
      // eslint-disable-next-line @typescript-eslint/prefer-for-of, no-plusplus
      for (let i = 0; i < optionNames.length; i++) {
        const name = optionNames[i];
        const args = {
          name: getPathParts(name)[0],
          fullName: name,
          value,
          previousValue,
        };

        if (!isInnerOption(name)) {
          this._optionChangedCallbacks.fireWith(this, [extend(this._defaultActionArgs(), args)]);
          this._optionChangedAction?.(extend({}, args));
        }

        if (!this._disposed && this._cancelOptionChange !== name) {
          this._optionChanged(args);
        }
      }
    }
  }

  initialOption(name: string): TProperties {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this._options.initial(name);
  }

  _defaultActionConfig(): { context: TComponent; component: TComponent } {
    return {
      context: this as unknown as TComponent,
      component: this as unknown as TComponent,
    };
  }

  _defaultActionArgs(): { component: TComponent; element?: dxElementWrapper; model?: unknown } {
    return {
      component: this as unknown as TComponent,
    };
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  _createAction(actionSource, config?: ActionConfig): (e) => void {
    // eslint-disable-next-line @typescript-eslint/init-declarations
    let action;

    return (e) => {
      if (!isDefined(e)) {
        // eslint-disable-next-line no-param-reassign
        e = {};
      }

      if (!isPlainObject(e)) {
        // eslint-disable-next-line no-param-reassign
        e = { actionValue: e };
      }
      action = action || new Action(actionSource, extend({}, config, this._defaultActionConfig()));

      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return action.execute.call(action, extend(e, this._defaultActionArgs()));
    };
  }

  _createActionByOption(
    optionName: string,
    config?: ActionConfig,
  ): (event?: Record<string, unknown>) => void {
    // eslint-disable-next-line @typescript-eslint/init-declarations
    let action;
    // eslint-disable-next-line @typescript-eslint/init-declarations
    let eventName;
    // eslint-disable-next-line @typescript-eslint/init-declarations
    let actionFunc;

    // eslint-disable-next-line no-param-reassign
    config = extend({}, config);

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    const result = (...args) => {
      if (!eventName) {
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing, no-param-reassign
        config = config || {};

        if (typeof optionName !== 'string') {
          throw errors.Error('E0008');
        }

        if (optionName.startsWith('on')) {
          eventName = getEventName(optionName);
        }
        /// #DEBUG
        if (!optionName.startsWith('on')) {
          throw Error(`The '${optionName}' option name should start with 'on' prefix`);
        }
        /// #ENDDEBUG

        actionFunc = this.option(optionName);
      }

      if (!action && !actionFunc && !config?.beforeExecute
        && !config?.afterExecute && !this._eventsStrategy.hasEvent(eventName)) {
        return;
      }

      if (!action) {
        // @ts-expect-error
        const { beforeExecute } = config;
        // @ts-expect-error
        config.beforeExecute = (...props): void => {
          // eslint-disable-next-line max-len
          // eslint-disable-next-line @typescript-eslint/prefer-optional-chain, @typescript-eslint/no-unused-expressions
          beforeExecute && beforeExecute.apply(this, props);
          this._eventsStrategy.fireEvent(eventName, props[0].args);
        };
        action = this._createAction(actionFunc, config);
      }

      // @ts-expect-error
      if (Config().wrapActionsBeforeExecute) {
        const beforeActionExecute = this.option('beforeActionExecute') || noop;
        // @ts-expect-error
        const wrappedAction = beforeActionExecute(this, action, config) || action;
        // eslint-disable-next-line consistent-return, @typescript-eslint/no-unsafe-return
        return wrappedAction.apply(this, args);
      }

      // eslint-disable-next-line consistent-return, @typescript-eslint/no-unsafe-return
      return action.apply(this, args);
    };

    // @ts-expect-error
    if (Config().wrapActionsBeforeExecute) {
      return result;
    }
    const onActionCreated = this.option('onActionCreated') || noop;

    // @ts-expect-error
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return onActionCreated(this, result, config) || result;
  }

  // eslint-disable-next-line max-len
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/ban-types
  on(eventName: string | { [key: string]: Function }, eventHandler?): this {
    this._eventsStrategy.on(eventName, eventHandler);
    return this;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  off(eventName: string, eventHandler?): this {
    this._eventsStrategy.off(eventName, eventHandler);
    return this;
  }

  hasActionSubscription(actionName: string): boolean {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return !!this._options.silent(actionName)
            || this._eventsStrategy.hasEvent(getEventName(actionName));
  }

  isOptionDeprecated(name: string): boolean {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this._options.isDeprecated(name);
  }

  _setOptionWithoutOptionChange(name: string, value: unknown): void {
    this._cancelOptionChange = name;
    this.option(name, value);
    this._cancelOptionChange = false;
  }

  // eslint-disable-next-line max-len
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
  _getOptionValue(name: string, context: any): any {
    const value = this.option(name);

    if (isFunction(value)) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return value.bind(context)();
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return value;
  }

  // @ts-expect-error
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  option(...args): TProperties {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this._options.option(...args as [never, never]);
  }

  resetOption(name: string): void {
    this.beginUpdate();
    this._options.reset(name);
    this.endUpdate();
  }

  _validateOptions(options: TProperties): TProperties {
    return options;
  }
}
