import {
  Component,
  ComponentBindings,
  Effect,
  JSXComponent,
  OneWay,
  Ref,
  RefObject,
} from '@devextreme-generator/declarations';
import { EffectReturn } from '../../utils/effect_return';
import { start as dragEventStart, move as dragEventMove, end as dragEventEnd } from '../../../events/drag';
import { addNamespace } from '../../../events/utils/index';
import eventsEngine from '../../../events/core/events_engine';
import type {
  Handle, Corner, DragStartEvent, DragEvent,
} from './common/types.d';

const namespace = 'dxResizable';
const dragStartEvent = addNamespace(dragEventStart, namespace);
const dragEvent = addNamespace(dragEventMove, namespace);
const dragEndEvent = addNamespace(dragEventEnd, namespace);

export const viewFunction = (viewModel: ResizableHandle): JSX.Element => {
  const { props, mainRef } = viewModel;
  // eslint-disable-next-line react/prop-types
  const { direction } = props;

  return (
    <div className={`dx-resizable-handle dx-resizable-handle-${direction}`} ref={mainRef} />
  );
};

@ComponentBindings()
export class ResizableHandleProps {
  @OneWay() direction: (Handle | Corner) = 'top';

  @OneWay() disabled = false;

  @OneWay() onResizeStart?: (e: DragStartEvent) => void;

  @OneWay() onResize?: (e: DragEvent) => void;

  @OneWay() onResizeEnd?: (e: Event) => void;
}

@Component({
  defaultOptionRules: [],
  view: viewFunction,
})

export class ResizableHandle extends JSXComponent(ResizableHandleProps) {
  @Ref() mainRef!: RefObject<HTMLElement>;

  @Effect()
  dragEventsEffect(): EffectReturn {
    const {
      disabled, onResize, onResizeStart, onResizeEnd,
    } = this.props;

    if (!disabled) {
      const handleEl = this.mainRef.current;
      const opts = { direction: 'both', immediate: true };

      eventsEngine.on(handleEl, {
        [dragStartEvent]: (event) => {
          eventsEngine.on(handleEl, {
            [dragEvent]: onResize,
            [dragEndEvent]: onResizeEnd,
          }, opts);
          onResizeStart?.(event);
        },
      }, opts);

      return (): void => eventsEngine.off(handleEl, undefined, undefined);
    }

    return undefined;
  }
}
