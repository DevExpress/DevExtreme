/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable spellcheck/spell-checker */
import { Component } from '@js/core/component';
import { getPathParts } from '@js/core/utils/data';
import type { ChangedOptionInfo } from '@js/events';
import type {
  Gettable, Observable, Subscribable, Updatable,
} from '@ts/core/reactive/index';
import { computed, state } from '@ts/core/reactive/index';

import { TemplateWrapper } from '../inferno_wrappers/template_wrapper';

type SubsGets<T> = Subscribable<T> & Gettable<T>;
type SubsUpts<T> = Subscribable<T> & Updatable<T>;

type OwnProperty<T, TPropName extends string> =
  TPropName extends keyof Required<T>
    ? Required<T>[TPropName]
    : unknown;

type PropertyTypeBase<T, TProp extends string> =
  TProp extends `${infer TOwnProp}.${infer TNestedProps}`
    ? PropertyTypeBase<OwnProperty<T, TOwnProp>, TNestedProps>
    : OwnProperty<T, TProp>;

export type PropertyType<TProps, TProp extends string> =
  unknown extends PropertyTypeBase<TProps, TProp>
    ? unknown
    : PropertyTypeBase<TProps, TProp> | undefined;

export type PropertyWithDefaults<TProps, TDefaults, TProp extends string> =
  unknown extends PropertyType<TDefaults, TProp>
    ? PropertyType<TProps, TProp>
    : NonNullable<PropertyType<TProps, TProp>> | PropertyTypeBase<TDefaults, TProp>;

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
  private readonly isControlledMode = false;

  private readonly props: Observable<TProps>;

  private readonly defaults: TDefaultProps;

  public static dependencies = [Component];

  constructor(
    private readonly component: Component<TProps>,
  ) {
    // @ts-expect-error
    this.props = state(component.option());
    // @ts-expect-error
    this.defaults = component._getDefaultOptions();
    component.on('optionChanged', (e: ChangedOptionInfo) => {
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

  public template<TProp extends string>(
    name: TProp,
  ): SubsGets<any> {
    return computed(
      // @ts-expect-error
      (template) => template && TemplateWrapper(this.component._getTemplate(template)),
      [this.oneWay(name)],
    );
  }

  public oneWay<TProp extends string>(
    name: TProp,
  ): SubsGets<PropertyWithDefaults<TProps, TDefaultProps, TProp>> {
    const obs = computed(
      (props) => getValue(props, name) ?? getValue(this.defaults, name),
      [this.props],
    );

    return obs as any;
  }

  public twoWay<TProp extends string>(
    name: TProp,
  // eslint-disable-next-line max-len
  ): SubsUpts<PropertyWithDefaults<TProps, TDefaultProps, TProp>> & Gettable<PropertyWithDefaults<TProps, TDefaultProps, TProp>> {
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
}
