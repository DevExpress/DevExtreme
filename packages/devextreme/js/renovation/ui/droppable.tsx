import {
  Component,
  ComponentBindings,
  JSXComponent,
  Event,
  Effect,
  RefObject,
  Ref,
  OneWay,
  Slot,
} from '@devextreme-generator/declarations';
import { EffectReturn } from '../utils/effect_return';
import { EventCallback } from './common/event_callback';

import {
  enter,
  leave,
  drop,
} from '../../events/drag';
import eventsEngine from '../../events/core/events_engine';
import { combineClasses } from '../utils/combine_classes';

export const viewFunction = ({
  widgetRef,
  restAttributes,
  cssClasses,
  props: {
    children,
  },
}: Droppable): JSX.Element => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <div className={cssClasses} ref={widgetRef} {...restAttributes}>
    {children}
  </div>
);

interface DroppableEvent {
  event: Event;
  itemElement: HTMLDivElement;
}

@ComponentBindings()
export class DroppableProps {
  @OneWay() disabled = false;

  @OneWay() className = '';

  @Slot() children?: JSX.Element;

  @Event() onDragEnter?: EventCallback<DroppableEvent>;

  @Event() onDragLeave?: EventCallback<DroppableEvent>;

  @Event() onDrop?: EventCallback<DroppableEvent>;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})

export class Droppable extends JSXComponent(DroppableProps) {
  @Ref() widgetRef!: RefObject<HTMLDivElement>;

  get cssClasses(): string {
    const { disabled, className } = this.props;

    const classesMap = {
      [className]: !!className,
      'dx-droppable': true,
      'dx-state-disabled': !!disabled,
    };

    return combineClasses(classesMap);
  }

  @Effect()
  dropEventsEffect(): EffectReturn {
    if (this.props.disabled) {
      return undefined;
    }

    eventsEngine.on(this.widgetRef.current, enter, this.dragEnterHandler);
    eventsEngine.on(this.widgetRef.current, leave, this.dragLeaveHandler);
    eventsEngine.on(this.widgetRef.current, drop, this.dropHandler);

    return (): void => {
      eventsEngine.off(this.widgetRef.current, enter, this.dragEnterHandler);
      eventsEngine.off(this.widgetRef.current, leave, this.dragLeaveHandler);
      eventsEngine.off(this.widgetRef.current, drop, this.dropHandler);
    };
  }

  dragEnterHandler(event: Event): void {
    const dragEnterArgs = this.getEventArgs(event);
    const { onDragEnter } = this.props;

    onDragEnter?.(dragEnterArgs);
  }

  dragLeaveHandler(event: Event): void {
    const dragLeaveArgs = this.getEventArgs(event);
    const { onDragLeave } = this.props;

    onDragLeave?.(dragLeaveArgs);
  }

  dropHandler(event: Event): void {
    const dropArgs = this.getEventArgs(event);
    const { onDrop } = this.props;

    onDrop?.(dropArgs);
  }

  getEventArgs(e: Event): DroppableEvent {
    return {
      event: e,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      itemElement: this.widgetRef.current!,
    };
  }
}
