import {
  Component, ComponentBindings, JSXComponent, OneWay, Slot, Event, Ref, Effect,
} from 'devextreme-generator/component_declaration/common';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { h } from 'preact';
import clickEvent from '../../events/click';
import { registerKeyboardAction } from '../../ui/shared/accessibility';
import eventsEngine from '../../events/core/events_engine';
import noop from '../utils/noop';
import { PAGER_CLASS } from './consts';

type dxClickEffectFn = (HTMLDivElement, Function) => (() => void);

type closestFn = (HTMLDivElement, string) => HTMLElement | null;

export const dxClickEffect: dxClickEffectFn = (element, handler) => {
  if (handler) {
    eventsEngine.on(element, clickEvent.name, handler);
    return (): void => eventsEngine.off(element, clickEvent.name, handler);
  }
  return noop;
};
const isMatchSelector = (el, selector): boolean => el.matches(selector);

// const isMatchSelector = Element.prototype.matches
//   ? (el, selector): boolean => el.matches(selector)
//   : (el, selector): boolean => el.msMatchesSelector(selector);
export const closest: closestFn = (child, className) => {
  let el = child;
  const selector = `.${className}`;
  while (el !== null && el.nodeType === 1) {
    if (isMatchSelector(el, selector)) return el;
    el = el.parentElement;
  }
  return null;
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const viewFunction = ({
  widgetRef,
  props: {
    className, children, label,
  },
}: LightButton) => (
  <div
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref={widgetRef as any}
    className={className}
    tabIndex={0}
    role="button"
    aria-label={label}
  >
    {children}
  </div>
);

@ComponentBindings()
export class LightButtonProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Slot() children?: any;

  @OneWay() className?: string = '';

  @OneWay() label?: string = '';

  @Event() onClick?: () => void;
}

function createActionByOption(): () => void {
  return (): void => { };
}
// tslint:disable-next-line: max-classes-per-file
@Component({ defaultOptionRules: null, view: viewFunction })
export default class LightButton extends JSXComponent(LightButtonProps) {
  @Ref() widgetRef!: HTMLDivElement;

  @Effect() keyboardEffect(): (() => void) {
    const fakePagerInstance = {
      option: (): boolean => false,
      element: (): HTMLElement | null => closest(this.widgetRef, PAGER_CLASS),
      _createActionByOption: createActionByOption,
    };
    return registerKeyboardAction('pager', fakePagerInstance, this.widgetRef, undefined, this.props.onClick);
  }

  @Effect() clickEffect(): (() => void) {
    return dxClickEffect(this.widgetRef, this.props.onClick);
  }
}
