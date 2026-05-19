/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-return */

import { Component } from '@js/core/component';
import { getPathParts } from '@js/core/utils/data';
import type { ChangedOptionInfo } from '@js/events';
import type { ReadonlySignal, Signal } from '@ts/core/state_manager/index';
import { computed, effect, signal } from '@ts/core/state_manager/index';
import { extend } from '@ts/core/utils/m_extend';
import type { ComponentType } from 'inferno';

import { TemplateWrapper } from '../inferno_wrappers/template_wrapper';
import type { Template } from '../types';
import { getTreeNodeByPath, mergeOptionTrees } from '../utils/tree/index';
import type {
  ActionProperty, InternalOptionsState, OptionWithChanges,
  PropertyWithDefaults,
  TemplateProperty,
} from './types';

function getOr<T>(cache: Record<string, T>, key: string, orElse: () => T): T {
  if (cache[key]) {
    return cache[key];
  }

  const value = orElse();

  cache[key] = value;
  return value;
}

export class OptionsController<
  TProps extends Record<string, any>,
  TDefaultProps extends TProps = TProps,
> {
  private readonly cache = {
    oneWay: {},
    oneWayWithChanges: {},
    twoWay: {},
    action: {},
    template: {},
  };

  public static dependencies = [Component];

  protected defaults: TDefaultProps;

  private isControlledMode = false;

  private _skipProcessingColumnsChange: string | false = false;

  private readonly internalOptions: Signal<InternalOptionsState<TProps>>;

  // @ts-expect-error Component type doesn't have fields from widget.ts
  public initialized: ReadonlySignal<boolean> = this.component.initialized;

  constructor(
    private readonly component: Component<TProps>,
  ) {
    // @ts-expect-error
    this.defaults = component._getDefaultOptions?.() ?? {};

    this.internalOptions = signal({
      options: extend(true, {}, component.option()),
      changes: null,
    });

    this.updateIsControlledMode();

    component.on('optionChanged', this.onOptionChangedHandler.bind(this));
  }

  private updateIsControlledMode(): void {
    const isControlledMode = this.component.option('integrationOptions.isControlledMode');
    this.isControlledMode = (isControlledMode as boolean | undefined) ?? false;
  }

  private onOptionChangedHandler(optionChanges: ChangedOptionInfo): void {
    const { fullName } = optionChanges;

    if (this._skipProcessingColumnsChange === fullName) {
      return;
    }

    this.updateIsControlledMode();
    this.updateInternalOptionsState(fullName, optionChanges);
  }

  private updateInternalOptionsState(
    optionFullName: string,
    changes: ChangedOptionInfo | null = null,
  ): void {
    const pathParts = getPathParts(optionFullName);

    this.internalOptions.value = {
      options: mergeOptionTrees(
        this.internalOptions.peek().options,
        this.component.option(),
        this.defaults,
        pathParts,
      ),
      changes,
    };
  }

  public oneWay<TProp extends string>(
    name: TProp,
  ): ReadonlySignal<PropertyWithDefaults<TProps, TDefaultProps, TProp>> {
    return getOr(this.cache.oneWay, name, () => {
      const pathArray = getPathParts(name);

      return computed(
        () => getTreeNodeByPath(
          this.internalOptions.value.options,
          pathArray,
        ),
      );
    });
  }

  public oneWayWithChanges<TProp extends string>(
    name: TProp,
  ): ReadonlySignal<OptionWithChanges<PropertyWithDefaults<TProps, TDefaultProps, TProp>>> {
    return getOr(this.cache.oneWayWithChanges, name, () => {
      const pathArray = getPathParts(name);

      return computed(
        () => {
          const { options, changes } = this.internalOptions.value;

          return {
            value: getTreeNodeByPath(options, pathArray),
            changes,
          };
        },
      );
    });
  }

  public twoWay<TProp extends string>(
    name: TProp,
  ): Signal<PropertyWithDefaults<TProps, TDefaultProps, TProp>> {
    return getOr(this.cache.twoWay, name, () => {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const that = this;
      const obs = signal(this.component.option(name));
      effect(() => {
        obs.value = this.oneWay(name).value as any;
      });
      return {
        get value(): any {
          return obs.value;
        },
        set value(value: any) {
          const isInitialized = that.initialized.peek();
          const callbackName = `on${name}Change`;
          const callback = that.component.option(callbackName) as any;
          const isControlled = that.isControlledMode && that.component.option(name) !== undefined;

          if (isControlled) {
            callback?.(value);
            return;
          }

          that.component.option(name, value);

          // 🚨🚨🚨 Hotfix for filterSync
          // Unit widget is initialized, the optionChange callback doesn't fire
          // So, in this case we sync our internal options state with option manager manually
          // TODO filterSync: refactor filter and get rid of set values to twoWay bindings
          //   before the widget/optionManager is initialized
          if (!isInitialized) {
            that.updateInternalOptionsState(name);
          }

          callback?.(value);
        },
        peek(): any {
          return obs.peek();
        },
        subscribe(...params: any): any {
        // @ts-expect-error
          return obs.subscribe(...params);
        },
        toJSON(...params: any[]): any {
        // @ts-expect-error
          return obs.toJSON(...params);
        },
        valueOf(...params: any[]): any {
        // @ts-expect-error
          return obs.valueOf(...params);
        },
        brand: obs.brand,
      };
    });
  }

  public normalizeTemplate<T>(template: Template<T>): ComponentType<T> {
    // @ts-expect-error
    return TemplateWrapper(this.component._getTemplate(template)) as any;
  }

  public template<TProp extends string>(
    name: TProp,
  ): ReadonlySignal<TemplateProperty<TProps, TProp>> {
    return getOr(this.cache.template, name, () => {
      const templateOption = this.oneWay(name);
      return computed(
        // @ts-expect-error
        () => templateOption.value && this.normalizeTemplate(templateOption.value) as any,
      );
    });
  }

  public action<TProp extends string>(
    name: TProp,
  ): ReadonlySignal<ActionProperty<TProps, TProp>> {
    return getOr(this.cache.action, name, () => {
      const actionOption = this.oneWay(name);
      return computed(
        () => {
          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
          actionOption.value;
          // @ts-expect-error
          return this.component._createActionByOption(name) as any;
        },
      );
    });
  }

  public notifyColumnOptionChanged(
    fullOptionPath: string,
    newValue: unknown,
    prevValue: unknown,
  ): void {
    this._skipProcessingColumnsChange = fullOptionPath;
    // @ts-expect-error
    this.component._notifyOptionChanged(fullOptionPath, newValue, prevValue);
    this._skipProcessingColumnsChange = false;
  }
}
