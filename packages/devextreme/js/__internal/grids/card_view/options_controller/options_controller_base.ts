import { Observable, Subscribable, Updatable, computed, state } from "@js/__internal/core/reactive";
import { getPathParts } from "@js/core/utils/data";
import { ChangedOptionInfo } from "@js/events";
import { Component } from "@js/core/component";

function cloneObjectValue<T extends Record<string, unknown> | unknown[]>(
  value: T,
): T {
  // @ts-expect-error
  return Array.isArray(value) ? [...value] : { ...value };
}

function updateImmutable<T extends Record<string, unknown> | unknown[]>(value: T, newValue: T, pathParts: string[]): T {
  const [pathPart, ...restPathParts] = pathParts;
  const ret = cloneObjectValue(value);

  ret[pathPart] = restPathParts.length
    ? updateImmutable(value[pathPart], newValue[pathPart], restPathParts)
    : newValue[pathPart];

  return ret;
}

export class OptionsController<TProps extends Record<string, unknown>> {
  private props: Observable<TProps>;

  static dependencies = [Component] as any;

  constructor(
    private component: Component<TProps>
  ) {
    this.props = state(component.option());
    component.on('optionChanged', (e: ChangedOptionInfo) => {
      const pathParts = getPathParts(e.fullName);
      this.props.update((oldValue) => updateImmutable(
        oldValue,
        component.option(),
        pathParts
      ));
    })
  }

  oneWay<TProp extends string>(name: TProp): Subscribable<TProps[TProp]> {
    const obs = computed((props) => {
      let v: any = props;
      for (const pathPart of getPathParts(name)) {
        v = v[pathPart];
      }
      return v;
    }, [this.props]);
    
    return obs;
  }

  twoWay<TProp extends string>(name: TProp): Subscribable<TProps[TProp]> & Updatable<TProps[TProp]> {
    throw 'not implemented';
  }
}