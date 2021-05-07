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
import type { DragStartEvent, DragMoveEvent, DragEndEvent } from '../../../ui/draggable';

import {
  start,
  move,
  end,
} from '../../../events/drag';
import eventsEngine from '../../../events/core/events_engine';
import { combineClasses } from '../../utils/combine_classes';

const getCssClasses = (model: DraggableContainerProps, isDragging: boolean): string => {
  const { rtlEnabled, disabled, className } = model;

  const classesMap = {
    [String(className)]: !!className,
    'dx-draggable': true,
    'dx-draggable-dragging': isDragging,
    'dx-state-disabled': !!disabled,
    'dx-rtl': !!rtlEnabled,
  };

  return combineClasses(classesMap);
};

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

@ComponentBindings()
export class DraggableContainerProps {
  @OneWay() data?: any;

  @OneWay() rtlEnabled?: boolean;

  @OneWay() disabled?: boolean;

  @OneWay() className?: string = '';

  @Slot() children?: JSX.Element | (JSX.Element | undefined | false | null)[];

  @Event() onDragStart?: (e: DragStartEvent) => void;

  @Event() onDragMove?: (e: DragMoveEvent) => void;

  @Event() onDragEnd?: (e: DragEndEvent) => void;
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
    return getCssClasses(this.props, this.isDragging);
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
    const dragStartArgs = this.getEventArgs(event) as unknown as DragStartEvent;
    const { onDragStart } = this.props;

    onDragStart?.(dragStartArgs);
  }

  dragMoveHandler(event: Event): void {
    const dragMoveArgs = this.getEventArgs(event) as unknown as DragMoveEvent;
    const { onDragMove } = this.props;

    onDragMove?.(dragMoveArgs);
  }

  dragEndHandler(event: Event): void {
    this.isDragging = false;
    const dragEndArgs = this.getEventArgs(event) as unknown as DragEndEvent;
    const { onDragEnd } = this.props;

    onDragEnd?.(dragEndArgs);
  }

  getEventArgs(e: Event): Record<string, unknown> {
    return {
      event: e,
      data: this.props.data,
      itemElement: this.widgetRef.current,
    };
  }
}
