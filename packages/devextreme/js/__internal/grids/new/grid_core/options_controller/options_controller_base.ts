/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable spellcheck/spell-checker */
import { Component } from '@js/core/component';
import { getPathParts } from '@js/core/utils/data';
import type { ChangedOptionInfo } from '@js/events';
import type {
  SubsGets, SubsGetsUpd,
} from '@ts/core/reactive/index';
import { computed, state } from '@ts/core/reactive/index';
import { extend } from '@ts/core/utils/m_extend';
import type { ComponentType } from 'inferno';

import { TemplateWrapper } from '../inferno_wrappers/template_wrapper';
import type { Template } from '../types';
import { getTreeNodeByPath, mergeOptionTrees } from './tree_utils';
import type {
  ActionProperty,
  PropertyWithDefaults,
  TemplateProperty,
} from './types';

export class OptionsController<
  TProps extends Record<string, any>,
  TDefaultProps extends TProps = TProps,
> {
  public static dependencies = [Component];

  protected defaults: TDefaultProps;

  private isControlledMode = false;

  private readonly internalOptions: SubsGetsUpd<TProps>;

  constructor(
    private readonly component: Component<TProps>,
  ) {
    // @ts-expect-error
    this.defaults = component._getDefaultOptions?.() ?? {};

    this.internalOptions = state(
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

    this.internalOptions.updateFunc((prevInternalOptions) => mergeOptionTrees(
      prevInternalOptions,
      this.component.option(),
      this.defaults,
      pathParts,
    ));
  }

  public oneWay<TProp extends string>(
    name: TProp,
  ): SubsGets<PropertyWithDefaults<TProps, TDefaultProps, TProp>> {
    const pathArray = getPathParts(name);

    return computed(
      (props) => getTreeNodeByPath(props, pathArray),
      [this.internalOptions],
    ) as SubsGets<PropertyWithDefaults<TProps, TDefaultProps, TProp>>;
  }

  public twoWay<TProp extends string>(
    name: TProp,
  ): SubsGetsUpd<PropertyWithDefaults<TProps, TDefaultProps, TProp>> {
    const obs = state(this.component.option(name));
    this.oneWay(name).subscribe(obs.update.bind(obs) as any);
    return {
      subscribe: obs.subscribe.bind(obs) as any,
      update: (value): void => {
        const callbackName = `on${name}Change`;
        const callback = this.component.option(callbackName) as any;
        const isControlled = this.isControlledMode && this.component.option(name) !== undefined;
        if (isControlled) {
          callback?.(value);
        } else {
          // @ts-expect-error
          this.component.option(name, value);
          callback?.(value);
        }
      },
      // @ts-expect-error
      unreactive_get: obs.unreactive_get.bind(obs),
    };
  }

  public normalizeTemplate<T>(template: Template<T>): ComponentType<T> {
    // @ts-expect-error
    return TemplateWrapper(this.component._getTemplate(template)) as any;
  }

  public template<TProp extends string>(
    name: TProp,
  ): SubsGets<TemplateProperty<TProps, TProp>> {
    return computed(
      // @ts-expect-error
      (template) => template && this.normalizeTemplate(template) as any,
      [this.oneWay(name)],
    );
  }

  public action<TProp extends string>(
    name: TProp,
  ): SubsGets<ActionProperty<TProps, TProp>> {
    return computed(
      // @ts-expect-error
      () => this.component._createActionByOption(name) as any,
      [this.oneWay(name)],
    );
  }
}
