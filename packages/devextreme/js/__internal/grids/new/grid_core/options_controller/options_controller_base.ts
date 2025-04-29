/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-return */

import { Component } from '@js/core/component';
import { getPathParts } from '@js/core/utils/data';
import type { ChangedOptionInfo } from '@js/events';
import type { ReadonlySignal, Signal } from '@preact/signals-core';
import { computed, effect, signal } from '@preact/signals-core';
import { extend } from '@ts/core/utils/m_extend';
import type { ComponentType } from 'inferno';

import { TemplateWrapper } from '../inferno_wrappers/template_wrapper';
import type { Template } from '../types';
import type {
  ActionProperty,
  PropertyWithDefaults,
  TemplateProperty,
} from './types';
import { getTreeNodeByPath, mergeOptionTrees } from './utils/index';

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
    twoWay: {},
    action: {},
    template: {},
  };

  public static dependencies = [Component];

  protected defaults: TDefaultProps;

  private isControlledMode = false;

  private readonly internalOptions: Signal<TProps>;

  constructor(
    private readonly component: Component<TProps>,
  ) {
    // @ts-expect-error
    this.defaults = component._getDefaultOptions?.() ?? {};

    this.internalOptions = signal(
      extend(true, {}, component.option()),
    );

    this.updateIsControlledMode();

    component.on('optionChanged', this.onOptionChangedHandler.bind(this));
  }

  private updateIsControlledMode(): void {
    const isControlledMode = this.component.option('integrationOptions.isControlledMode');
    this.isControlledMode = (isControlledMode as boolean | undefined) ?? false;
  }

  private onOptionChangedHandler({ fullName }: ChangedOptionInfo): void {
    this.updateIsControlledMode();

    const pathParts = getPathParts(fullName);

    this.internalOptions.value = mergeOptionTrees(
      this.internalOptions.peek(),
      this.component.option(),
      this.defaults,
      pathParts,
    );
  }

  public oneWay<TProp extends string>(
    name: TProp,
  ): ReadonlySignal<PropertyWithDefaults<TProps, TDefaultProps, TProp>> {
    return getOr(this.cache.oneWay, name, () => {
      const pathArray = getPathParts(name);

      return computed(
        () => getTreeNodeByPath(
          this.internalOptions.value,
          pathArray,
        ),
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
          const callbackName = `on${name}Change`;
          const callback = that.component.option(callbackName) as any;
          const isControlled = that.isControlledMode && that.component.option(name) !== undefined;
          if (isControlled) {
            callback?.(value);
          } else {
            that.component.option(name, value);
            callback?.(value);
          }
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
}
