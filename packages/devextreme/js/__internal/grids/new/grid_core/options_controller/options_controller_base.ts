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
import type { ComponentType } from 'inferno';

import { TemplateWrapper } from '../inferno_wrappers/template_wrapper';
import type { Action, Template } from '../types';

type OwnProperty<T, TPropName extends string> =
  TPropName extends keyof Required<T>
    ? Required<T>[TPropName]
    : unknown;

type PropertyTypeBase<T, TProp extends string> =
  TProp extends `${infer TOwnProp}.${infer TNestedProps}`
    ? PropertyTypeBase<OwnProperty<T, TOwnProp>, TNestedProps>
    : OwnProperty<T, TProp>;

type PropertyType<TProps, TProp extends string> =
  unknown extends PropertyTypeBase<TProps, TProp>
    ? unknown
    : PropertyTypeBase<TProps, TProp> | undefined;

type PropertyWithDefaults<TProps, TDefaults, TProp extends string> =
  unknown extends PropertyType<TDefaults, TProp>
    ? PropertyType<TProps, TProp>
    : NonNullable<PropertyType<TProps, TProp>> | PropertyTypeBase<TDefaults, TProp>;

type TemplateProperty<TProps, TProp extends string> =
  NonNullable<PropertyType<TProps, TProp>> extends Template<infer TTemplateProps>
    ? ComponentType<TTemplateProps> | undefined
    : unknown;

type ActionProperty<TProps, TProp extends string> =
  NonNullable<PropertyType<TProps, TProp>> extends Action<infer TActionArgs>
    ? (args: TActionArgs) => void
    : unknown;

function cloneObjectValue<T extends Record<string, unknown> | unknown[]>(
  value: T,
): T {
  // @ts-expect-error
  return Array.isArray(value) ? [...value] : { ...value };
}

function updateImmutable<T extends Record<string, unknown> | unknown[]>(
  value: T,
  newValue: T,
  pathParts: string[],
): T {
  const [pathPart, ...restPathParts] = pathParts;
  const ret = cloneObjectValue(value);

  ret[pathPart] = restPathParts.length
    ? updateImmutable(value[pathPart], newValue[pathPart], restPathParts)
    : newValue[pathPart];

  return ret;
}

function getValue<T>(obj: unknown, path: string): T {
  let v: any = obj;
  for (const pathPart of getPathParts(path)) {
    v = v?.[pathPart];
  }

  return v;
}

export class OptionsController<TProps, TDefaultProps extends TProps = TProps> {
  private isControlledMode = false;

  private readonly props: SubsGetsUpd<TProps>;

  protected defaults: TDefaultProps;

  public static dependencies = [Component];

  constructor(
    private readonly component: Component<TProps>,
  ) {
    this.props = state(component.option());
    // @ts-expect-error
    this.defaults = component._getDefaultOptions?.() ?? {};
    this.updateIsControlledMode();

    component.on('optionChanged', (e: ChangedOptionInfo) => {
      this.updateIsControlledMode();

      const pathParts = getPathParts(e.fullName);
      // @ts-expect-error
      this.props.updateFunc((oldValue) => updateImmutable(
        // @ts-expect-error
        oldValue,
        component.option(),
        pathParts,
      ));
    });
  }

  private updateIsControlledMode(): void {
    const isControlledMode = this.component.option('integrationOptions.isControlledMode');
    this.isControlledMode = (isControlledMode as boolean | undefined) ?? false;
  }

  public oneWay<TProp extends string>(
    name: TProp,
  ): SubsGets<PropertyWithDefaults<TProps, TDefaultProps, TProp>> {
    const obs = computed(
      (props) => {
        const value = getValue(props, name);
        /*
          NOTE: it is better not to use '??' operator,
          because result will be different if value is 'null'.
          Some code works differently if undefined is passed instead of null,
          for example dataSource's getter-setter `.filter()`
        */
        return value !== undefined ? value : getValue(this.defaults, name);
      },
      [this.props],
    );

    return obs as any;
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

  public template<TProp extends string>(
    name: TProp,
  ): SubsGets<TemplateProperty<TProps, TProp>> {
    return computed(
      // @ts-expect-error
      (template) => template && TemplateWrapper(this.component._getTemplate(template)) as any,
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
