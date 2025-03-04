import { Component, findDOMfromVNode } from 'inferno';
import { InfernoEffect } from './effect';
import { InfernoEffectHost } from './effect_host';

const areObjectsEqual = (firstObject: any, secondObject: any) => {
  const bothAreObjects = firstObject instanceof Object && secondObject instanceof Object;
  if (!bothAreObjects) {
    return firstObject === secondObject;
  }

  const firstObjectKeys = Object.keys(firstObject);
  const secondObjectKeys = Object.keys(secondObject);
  if (firstObjectKeys.length !== secondObjectKeys.length) {
    return false;
  }

  const hasDifferentElement = firstObjectKeys.some(
    (key) => firstObject[key] !== secondObject[key],
  );
  return !hasDifferentElement;
};

export class BaseInfernoComponent<
  P = Record<string, unknown>,
  S = Record<string, unknown>,
> extends Component<P, S> {
  _pendingContext: any = this.context;

  componentWillReceiveProps(_: any, context: any): void {
    this._pendingContext = context ?? {};
  }

  shouldComponentUpdate(nextProps: P, nextState: S): boolean {
    return (
      !areObjectsEqual(this.props, nextProps)
      || !areObjectsEqual(this.state, nextState)
      || !areObjectsEqual(this.context, this._pendingContext)
    );
  }
}

export class InfernoComponent<
  P = Record<string, unknown>,
  S = Record<string, unknown>,
> extends BaseInfernoComponent<P, S> {
  _effects: InfernoEffect[] = [];

  createEffects(): InfernoEffect[] {
    return [];
  }

  updateEffects(): void {}

  componentWillMount(): void {
    InfernoEffectHost.lock();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  componentWillUpdate(_nextProps?: P, _nextState?: S, _context?: any): void {
    InfernoEffectHost.lock();
  }

  componentDidMount(): void {
    InfernoEffectHost.callbacks.push(
      () => { this._effects = this.createEffects(); },
    );
    InfernoEffectHost.callEffects();
  }

  componentDidUpdate(): void {
    InfernoEffectHost.callbacks.push(() => this.updateEffects());
    InfernoEffectHost.callEffects();
  }

  destroyEffects(): void {
    this._effects.forEach((e) => e.dispose());
  }

  componentWillUnmount(): void {
    this.destroyEffects();
  }
}

interface VDomCustomClassesData {
  previous: string[];
  removed: string[];
  added: string[];
}

type ElementWithCustomClassesData = Element & {
  dxClasses: VDomCustomClassesData;
};
export class InfernoWrapperComponent<
  P = Record<string, unknown>,
  S = Record<string, unknown>,
> extends InfernoComponent<P, S> {
  vDomElement: ElementWithCustomClassesData | null = null;

  vDomUpdateClasses(): void {
    const el = this.vDomElement as ElementWithCustomClassesData;
    const currentClasses = el.className.length
      ? el.className.split(' ')
      : [];
    const addedClasses = currentClasses.filter(
      (className) => el.dxClasses.previous.indexOf(className) < 0,
    );
    const removedClasses = el.dxClasses.previous.filter(
      (className: string): boolean => currentClasses.indexOf(className) < 0,
    );

    addedClasses.forEach((value: string): void => {
      const indexInRemoved = el.dxClasses.removed.indexOf(value);
      if (indexInRemoved > -1) {
        el.dxClasses.removed.splice(indexInRemoved, 1);
      } else if (!el.dxClasses.added.includes(value)) {
        el.dxClasses.added.push(value);
      }
    });

    removedClasses.forEach((value: string): void => {
      const indexInAdded = el.dxClasses.added.indexOf(value);
      if (indexInAdded > -1) {
        el.dxClasses.added.splice(indexInAdded, 1);
      } else if (!el.dxClasses.removed.includes(value)) {
        el.dxClasses.removed.push(value);
      }
    });
  }

  componentDidMount(): void {
    const el = findDOMfromVNode(this.$LI, true) as ElementWithCustomClassesData;
    this.vDomElement = el;
    super.componentDidMount();
    el.dxClasses = el.dxClasses || {
      removed: [], added: [], previous: [],
    };
    el.dxClasses.previous = el?.className.length
      ? el.className.split(' ')
      : [];
  }

  componentDidUpdate(): void {
    super.componentDidUpdate();

    const el = this.vDomElement;

    if (el !== null) {
      el.dxClasses.added.forEach((className: string): void => el.classList.add(className));
      el.dxClasses.removed.forEach((className: string): void => el.classList.remove(className));
      el.dxClasses.previous = el.className.length
        ? el.className.split(' ')
        : [];
    }
  }

  shouldComponentUpdate(nextProps: P, nextState: S): boolean {
    const shouldUpdate = super.shouldComponentUpdate(nextProps, nextState);
    if (shouldUpdate) {
      this.vDomUpdateClasses();
    }
    return shouldUpdate;
  }
}
