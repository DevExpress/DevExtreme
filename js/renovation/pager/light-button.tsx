// tslint:disable-next-line: max-line-length
import {
  Component, ComponentBindings, JSXComponent, OneWay, Slot, Event, Ref, Effect,
} from 'devextreme-generator/component_declaration/common';
import clickEvent from '../../events/click';
import * as eventsEngine from '../../events/core/events_engine';
import noop from '../utils/noop';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const viewFunction = ({
  widgetRef,
  props: {
    key, className, children, label,
  },
}: LightButton) => (
  <div
    key={key}
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref={widgetRef as any}
    className={className}
    tabIndex={0}
    role="button"
    label={label}
  >
    {children}
  </div>
);

@ComponentBindings()
export class LightButtonProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Slot() children?: any;

  @OneWay() className?: string = '';

  key?: string;

  label?: string = '';

  @Event() onClick?: () => void;
}
type EventEngineType = {
  on: (element, eventName, handler) => void;
  off: (element, eventName, handler) => void;
};

function dxClickEffect(element, handler): (() => void) {
  if (handler) {
    (eventsEngine as EventEngineType).on(element, clickEvent.name, handler);
    return (): void => (eventsEngine as EventEngineType).off(element, clickEvent.name, handler);
  }
  return noop;
}
// tslint:disable-next-line: max-classes-per-file
@Component({
  defaultOptionRules: null,
  view: viewFunction,
})

export default class LightButton extends JSXComponent<LightButtonProps> {
  @Ref() widgetRef!: HTMLDivElement;

  @Effect() clickEffect(): (() => void) {
    return dxClickEffect(this.widgetRef, this.props.onClick);
  }
}
