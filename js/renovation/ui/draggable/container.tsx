import {
  Component,
  ComponentBindings,
  JSXComponent,
  Event,
  Effect,
  RefObject,
  Ref,
  OneWay,
  InternalState,
  Slot,
} from '@devextreme-generator/declarations';
import { EffectReturn } from '../../utils/effect_return';

import {
  start,
  move,
  end,
} from '../../../events/drag';
import eventsEngine from '../../../events/core/events_engine';
import { combineClasses } from '../../utils/combine_classes';

export const viewFunction = ({
  widgetRef,
  restAttributes,
  cssClasses,
  props: {
    children,
  },
}: DraggableContainer): JSX.Element => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <div className={cssClasses} ref={widgetRef} {...restAttributes}>
    {children}
  </div>
);

interface DraggableContainerEvent {
  event: Event;
  data: unknown;
  itemElement: HTMLDivElement;
}

@ComponentBindings()
export class DraggableContainerProps {
  @OneWay() data?: unknown;

  @OneWay() disabled?: boolean;

  @OneWay() className = '';

  @Slot() children?: JSX.Element | (JSX.Element | undefined | false | null)[];

  @Event() onDragStart?: (e: DraggableContainerEvent) => void;

  @Event() onDragMove?: (e: DraggableContainerEvent) => void;

  @Event() onDragEnd?: (e: DraggableContainerEvent) => void;
}

@Component({
  defaultOptionRules: null,
  jQuery: {
    register: true,
  },
  view: viewFunction,
})

export class DraggableContainer extends JSXComponent(DraggableContainerProps) {
  @Ref() widgetRef!: RefObject<HTMLDivElement>;

  @InternalState() isDragging = false;

  get cssClasses(): string {
    const { disabled, className } = this.props;

    const classesMap = {
      [className]: !!className,
      'dx-draggable': true,
      'dx-draggable-dragging': this.isDragging,
      'dx-state-disabled': !!disabled,
    };

    return combineClasses(classesMap);
  }

  @Effect()
  dragEffect(): EffectReturn {
    if (this.props.disabled) {
      return undefined;
    }

    eventsEngine.on(this.widgetRef.current, start, this.dragStartHandler);
    eventsEngine.on(this.widgetRef.current, move, this.dragMoveHandler);
    eventsEngine.on(this.widgetRef.current, end, this.dragEndHandler);

    return (): void => {
      eventsEngine.off(this.widgetRef.current, start, this.dragStartHandler);
      eventsEngine.off(this.widgetRef.current, move, this.dragMoveHandler);
      eventsEngine.off(this.widgetRef.current, end, this.dragEndHandler);
    };
  }

  dragStartHandler(event: Event): void {
    this.isDragging = true;
    const dragStartArgs = this.getEventArgs(event);
    const { onDragStart } = this.props;

    onDragStart?.(dragStartArgs);
  }

  dragMoveHandler(event: Event): void {
    const dragMoveArgs = this.getEventArgs(event);
    const { onDragMove } = this.props;

    onDragMove?.(dragMoveArgs);
  }

  dragEndHandler(event: Event): void {
    this.isDragging = false;
    const dragEndArgs = this.getEventArgs(event);
    const { onDragEnd } = this.props;

    onDragEnd?.(dragEndArgs);
  }

  getEventArgs(e: Event): DraggableContainerEvent {
    return {
      event: e,
      data: this.props.data,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      itemElement: this.widgetRef.current!,
    };
  }
}
