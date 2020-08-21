import {
  Component, ComponentBindings, JSXComponent, OneWay, Slot, Event, Ref, Effect,
} from 'devextreme-generator/component_declaration/common';
import { registerKeyboardAction } from '../../../../ui/shared/accessibility';
import { PAGER_CLASS } from './consts';
import { closestClass } from '../utils/closest_class';
import { subscribeToClickEvent } from '../../../utils/subscribe_to_event';
import { DisposeEffectReturn } from '../../../utils/effect_return.d';
import { EventCallback } from '../../common/event_callback.d';

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

/* istanbul ignore next: class has only props default */
@ComponentBindings()
export class LightButtonProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Slot() children?: any;

  @OneWay() className = '';

  @OneWay() label = '';
  /* istanbul ignore next: EventCallback cannot be tested */

  @Event() onClick?: EventCallback;
}

function createActionByOption(): () => void {
  return (): void => { };
}
@Component({ defaultOptionRules: null, view: viewFunction })
export class LightButton extends JSXComponent<LightButtonProps>() {
  @Ref() widgetRef!: HTMLDivElement;

  @Effect() keyboardEffect(): DisposeEffectReturn {
    const fakePagerInstance = {
      option: (): boolean => false,
      element: (): HTMLElement | null => closestClass(this.widgetRef, PAGER_CLASS),
      _createActionByOption: createActionByOption,
    };
    return registerKeyboardAction('pager', fakePagerInstance, this.widgetRef, undefined, this.props.onClick);
  }

  @Effect() subscribeToClick(): DisposeEffectReturn {
    return subscribeToClickEvent(this.widgetRef, this.props.onClick);
  }
}
