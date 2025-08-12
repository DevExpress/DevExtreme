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
import Callbacks from '@js/core/utils/callbacks';
import { noop } from '@js/core/utils/common';
import { getPathParts } from '@js/core/utils/data';
import { extend } from '@js/core/utils/extend';
import { name as publicComponentName } from '@js/core/utils/public_component';
import {
  isDefined, isFunction, isPlainObject, isString,
} from '@js/core/utils/type';
import type { DxEvent, EventInfo, InitializedEventInfo } from '@js/events';
import type { OptionChanged } from '@ts/core/widget/types';

const getEventName = (
  actionName: string,
): string => actionName.charAt(2).toLowerCase() + actionName.substr(3);

const isInnerOption = (
  optionName: string,
): boolean => optionName.indexOf('_', 0) === 0;

export interface ActionConfig {
  beforeExecute?: (e: Record<string, unknown>) => void;
  afterExecute?: (e: Record<string, unknown>) => void;
  excludeValidators?: ('disabled' | 'readOnly')[];
  element?: Element;
  validatingTargetName?: string;
  category?: 'rendering';
}

export interface DefaultActionConfig<TComponent> {
  component: TComponent;
  context?: TComponent;
}

export interface DefaultActionArgs<TComponent> {
  component: TComponent;
  element?: Element;
  event?: DxEvent;
  model?: unknown;
}

export interface ComponentProperties<TComponent> extends ComponentOptions<
  EventInfo<TComponent>,
  InitializedEventInfo<TComponent>,
  OptionChangedEventInfo<TComponent>
> {
  onInitializing?: ((e: [ComponentProperties<TComponent>]) => void) | undefined;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  defaultOptionsRules?: DefaultOptionsRule<any>[];

  beforeActionExecute?: (
    component: TComponent,
    action: (e) => void,
    config: ActionConfig,
  ) => (args) => void;

  onActionCreated?: (
    component: TComponent,
    action: (e) => void,
    config: ActionConfig
  ) => () => unknown;
}

export class Component<
  TComponent extends Component<TComponent, TProperties>,
  TProperties extends ComponentProperties<TComponent> = ComponentProperties<TComponent>,
  // @ts-expect-error dxClass inheritance issue
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
    return this._options.isInitial(name);
  }

  _setOptionsByReference(): void {
    this._optionsByReference = {};
  }

  _getOptionsByReference(): Partial<TProperties> {
    return this._optionsByReference;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
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
      this._options.validateOptions((opts: TProperties) => this._validateOptions(opts));

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
    info: { since: string; message?: string; alias?: string },
  ): void {
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    const message = info.message || `Use the '${info.alias}' option instead`;
    errors.log('W0001', this.NAME, option, info.since, message);
  }

  _logDeprecatedComponentWarning(since: 'string', alias: 'string'): void {
    errors.log('W0000', this.NAME, since, `Use the '${alias}' widget instead`);
  }

  _createOptionChangedAction(): void {
    this._optionChangedAction = this._createActionByOption('onOptionChanged', {
      excludeValidators: ['disabled', 'readOnly'],
    });
  }

  _createDisposingAction(): void {
    this._disposingAction = this._createActionByOption('onDisposing', {
      excludeValidators: ['disabled', 'readOnly'],
    });
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
    this._updateLockCount += 1;
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  _optionChanging(...args: any[]): void {

  }

  _notifyOptionChanged(option: string, value: unknown, previousValue: unknown): void {
    if (this._initialized) {
      const optionNames = [option].concat(this._options.getAliasesByName(option));
      // eslint-disable-next-line @typescript-eslint/prefer-for-of
      for (let i = 0; i < optionNames.length; i += 1) {
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

  _defaultActionConfig(): DefaultActionConfig<TComponent> {
    return {
      context: this as unknown as TComponent,
      component: this as unknown as TComponent,
    };
  }

  _defaultActionArgs(): DefaultActionArgs<TComponent> {
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
    optionName: keyof TProperties,
    config?: ActionConfig,
  ): (event?: unknown) => void {
    // eslint-disable-next-line @typescript-eslint/init-declarations
    let action;
    // eslint-disable-next-line @typescript-eslint/init-declarations
    let eventName;
    // eslint-disable-next-line @typescript-eslint/init-declarations
    let actionFunc;

    let actionConfig = { ...config ?? {} } ;

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    const result = (...args) => {
      if (!eventName) {
        actionConfig = actionConfig || {};

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

      if (!action
        && !actionFunc
        && !actionConfig?.beforeExecute
        && !actionConfig?.afterExecute
        && !this._eventsStrategy.hasEvent(eventName)
      ) {
        return;
      }

      if (!action) {
        const { beforeExecute } = actionConfig;

        actionConfig.beforeExecute = (...props): void => {
          beforeExecute?.apply(this, props);
          this._eventsStrategy.fireEvent(eventName, props[0].args);
        };
        action = this._createAction(actionFunc, actionConfig);
      }

      // @ts-expect-error
      if (Config().wrapActionsBeforeExecute) {
        const { beforeActionExecute = noop } = this.option();
        const wrappedAction = beforeActionExecute(
          this as unknown as TComponent,
          action,
          actionConfig,
        ) || action;
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
    const { onActionCreated = noop } = this.option();

    return onActionCreated(
      this as unknown as TComponent,
      result,
      actionConfig,
    ) || result;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  on(eventName: string | { [key: string]: Function }, eventHandler?): this {
    this._eventsStrategy.on(eventName, eventHandler);
    return this;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  off(eventName: string, eventHandler?): this {
    this._eventsStrategy.off(eventName, eventHandler);
    return this;
  }

  hasActionSubscription(actionName: keyof TProperties): boolean {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return !!this._options.silent(actionName)
      || (isString(actionName) && this._eventsStrategy.hasEvent(getEventName(actionName)));
  }

  isOptionDeprecated(name: string): boolean {
    return this._options.isDeprecated(name);
  }

  _setOptionWithoutOptionChange(name: string, value: unknown): void {
    this._cancelOptionChange = name;
    this.option(name, value);
    this._cancelOptionChange = false;
  }

  // eslint-disable-next-line @stylistic/max-len
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
  _getOptionValue(name: keyof TProperties, context?: any): any {
    const value = this.option(name);

    if (isFunction(value)) {
      return value.bind(context)();
    }

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
