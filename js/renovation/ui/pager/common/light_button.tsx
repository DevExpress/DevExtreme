import {
  Component, ComponentBindings, JSXComponent, OneWay, Slot, Event, Ref, Effect, Consumer, RefObject,
} from 'devextreme-generator/component_declaration/common';
import { subscribeToClickEvent } from '../../../utils/subscribe_to_event';
import { DisposeEffectReturn, EffectReturn } from '../../../utils/effect_return.d';
import { EventCallback } from '../../common/event_callback.d';
import { KeyboardActionContext, KeyboardActionContextType } from './keyboard_action_context';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const viewFunction = ({
  widgetRef,
  props: {
    className, children, label,
  },
}: LightButton) => (
  <div
    ref={widgetRef}
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

  @Event() onClick!: EventCallback;
}

@Component({ defaultOptionRules: null, view: viewFunction })
export class LightButton extends JSXComponent<LightButtonProps, 'onClick'>() {
  @Ref() widgetRef!: RefObject<HTMLDivElement>;

  @Consumer(KeyboardActionContext)
  keyboardContext!: KeyboardActionContextType;

  @Effect() keyboardEffect(): DisposeEffectReturn {
    return this.keyboardContext.registerKeyboardAction(
      this.widgetRef.current!, this.props.onClick,
    );
  }

  @Effect() subscribeToClick(): EffectReturn {
    return subscribeToClickEvent(this.widgetRef.current!, this.props.onClick);
  }
}
