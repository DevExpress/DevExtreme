import {
  Component, ComponentBindings, JSXComponent, OneWay, Slot, Event, Ref, Effect, Consumer, RefObject,
} from '@devextreme-generator/declarations';
import { subscribeToClickEvent } from '../../../utils/subscribe_to_event';
import { DisposeEffectReturn, EffectReturn } from '../../../utils/effect_return';
import { EventCallback } from '../../common/event_callback';
import { KeyboardActionContext, KeyboardActionContextType } from './keyboard_action_context';

export const viewFunction = ({
  widgetRef,
  props: {
    className, children, label, tabIndex, selected,
  },
}: LightButton): JSX.Element => (
  <div
    ref={widgetRef}
    className={className}
    tabIndex={tabIndex}
    role="button"
    aria-label={label}
    aria-current={selected ? 'page' : undefined}
  >
    {children}
  </div>
);

/* istanbul ignore next: class has only props default */
@ComponentBindings()
export class LightButtonProps {
  @Slot() children?: JSX.Element | string | number;

  @OneWay() className = '';

  @OneWay() label = '';

  @OneWay() tabIndex = 0;

  @OneWay() selected = false;

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
    return subscribeToClickEvent(this.widgetRef.current, this.props.onClick);
  }
}
