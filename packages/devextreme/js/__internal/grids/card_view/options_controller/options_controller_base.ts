// @ts-nocheck
import { Component } from '@js/core/component';
import { getPathParts } from '@js/core/utils/data';
import type { ChangedOptionInfo } from '@js/events';
import type { Observable, Subscribable, Updatable } from '@ts/core/reactive';
import { computed, state } from '@ts/core/reactive';

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

export class OptionsController<TProps> {
  private readonly isControlledMode = false;

  private readonly props: Observable<TProps>;

  static dependencies = [Component];

  constructor(
    private readonly component: Component<TProps>,
  ) {
    this.props = state(component.option());
    component.on('optionChanged', (e: ChangedOptionInfo) => {
      const pathParts = getPathParts(e.fullName);
      this.props.update((oldValue) => updateImmutable(
        // @ts-expect-error
        oldValue,
        component.option(),
        pathParts,
      ));
    });
  }

  oneWay<TProp extends keyof TProps>(name: TProp): Subscribable<TProps[TProp]> {
    const obs = computed((props) => {
      let v: any = props;
      // @ts-expect-error
      for (const pathPart of getPathParts(name)) {
        v = v?.[pathPart];
      }
      return v;
    }, [this.props]);

    return obs;
  }

  twoWay<TProp extends keyof TProps>(name: TProp): Subscribable<TProps[TProp]> & Updatable<TProps[TProp]> {
    const obs = state<TProps[TProp]>(this.component.option(name));
    this.oneWay(name).subscribe(obs.update.bind(obs));
    return {
      subscribe: obs.subscribe.bind(obs),
      update: (value: TProps[TProp]): void => {
        const callbackName = `on${name}Change`;
        const callback = this.component.option(callbackName);
        const isControlled = this.isControlledMode && this.component.option(name) !== undefined;
        if (isControlled) {
          callback?.(value);
        } else {
          this.component.option(name, value);
          callback?.(value);
        }
      },
    };
  }
}
