import {
  Component, ComponentBindings, JSXComponent, OneWay, Slot, Event, Ref, Effect,
} from 'devextreme-generator/component_declaration/common';

import { name } from '../../events/click';
import { registerKeyboardAction } from '../../ui/shared/accessibility';
import eventsEngine from '../../events/core/events_engine';
import { PAGER_CLASS } from './consts';
import { closestClass } from './utils/closest_class';

type dxClickEffectFn = (HTMLDivElement, Function) => (() => void) | undefined;

export const dxClickEffect: dxClickEffectFn = (element, handler) => {
  if (handler) {
    eventsEngine.on(element, name, handler);
    return (): void => eventsEngine.off(element, name, handler);
  }
  return undefined;
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
export class LightButton extends JSXComponent(LightButtonProps) {
  @Ref() widgetRef!: HTMLDivElement;

  @Effect() keyboardEffect(): (() => void) {
    const fakePagerInstance = {
      option: (): boolean => false,
      element: (): HTMLElement | null => closestClass(this.widgetRef, PAGER_CLASS),
      _createActionByOption: createActionByOption,
    };
    return registerKeyboardAction('pager', fakePagerInstance, this.widgetRef, undefined, this.props.onClick);
  }

  @Effect() clickEffect(): (() => void) | undefined {
    return dxClickEffect(this.widgetRef, this.props.onClick);
  }
}
