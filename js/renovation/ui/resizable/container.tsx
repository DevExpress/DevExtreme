import {
  Component,
  ComponentBindings,
  JSXComponent,
  OneWay,
  Ref,
  Effect,
  ForwardRef,
  Slot,
  RefObject,
  InternalState,
  Mutable,
} from '@devextreme-generator/declarations';
import type {
  Handle, Corner, DragStartEvent, DragEvent,
} from './common/types';
import { ResizableHandle } from './handle';
import { combineClasses } from '../../utils/combine_classes';
import { triggerResizeEvent } from '../../../events/visibility_change';
import { EffectReturn } from '../../utils/effect_return';

const getCssClasses = (
  disabled: boolean,
  rtlEnabled: boolean,
  isResizing: boolean,
): string => combineClasses({
  'dx-resizable': true,
  'dx-state-disabled': disabled,
  'dx-rtl': rtlEnabled,
  'dx-resizable-resizing': isResizing,
});

export const viewFunction = (viewModel: ResizableContainer): JSX.Element => {
  const {
    handles, styles, props, cssClasses, restAttributes, mainContainerRef,
    onHandleResizeStart, onHandleResize, onHandleResizeEnd,
  } = viewModel;

  // eslint-disable-next-line react/prop-types
  const { children, disabled } = props;

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <div className={cssClasses} ref={mainContainerRef} style={styles} {...restAttributes}>
      { children }
      { handles.map((handleType) => (
        <ResizableHandle
          key={handleType}
          onResizeStart={(event): void => onHandleResizeStart(event, handleType)}
          onResize={(event): void => onHandleResize(event, handleType)}
          onResizeEnd={(event): void => onHandleResizeEnd(event, handleType)}
          disabled={disabled}
          direction={handleType}
        />
      ))}
    </div>
  );
};

@ComponentBindings()
export class ResizableContainerProps {
  @ForwardRef() mainRef?: RefObject<HTMLDivElement>;

  @OneWay() handles: Handle[] | Handle = [];

  @OneWay() onResizeStart?: (e: { event: Event; handle: Handle | Corner }) => void;

  @OneWay() onResize?: (e: {
    event: DragEvent;
    handle: Handle | Corner;
    delta: {
      x: number;
      y: number;
    };
  }) => void;

  @OneWay() onResizeEnd?: (e: { event: Event; handle: Handle | Corner }) => void;

  @Slot() children: JSX.Element | (JSX.Element | undefined | false | null)[] = [];

  @OneWay() rtlEnabled = false;

  @OneWay() disabled = false;

  @OneWay() width?: number;

  @OneWay() height?: number;
}

@Component({
  defaultOptionRules: [],
  view: viewFunction,
})

export class ResizableContainer extends JSXComponent(ResizableContainerProps) {
  @InternalState() isResizing = false;

  @Mutable() startX = Number.NaN;

  @Mutable() startY = Number.NaN;

  @Ref() mainContainerRef!: RefObject<HTMLDivElement>;

  @Effect({ run: 'once' })
  forwardRefInitEffect(): EffectReturn {
    if (this.props.mainRef) {
      this.props.mainRef.current = this.mainContainerRef.current;
    }

    return undefined;
  }

  public onHandleResizeStart(event: DragStartEvent, handle: Handle | Corner): void {
    this.isResizing = true;
    this.startX = event.clientX;
    this.startY = event.clientY;
    this.props.onResizeStart?.({ event, handle });
    // eslint-disable-next-line no-param-reassign
    event.targetElements = [];
    return undefined;
  }

  public onHandleResize(event: DragEvent, handle: Handle | Corner): void {
    const { onResize } = this.props;

    onResize?.({
      event,
      handle,
      delta: {
        x: event.clientX - this.startX,
        y: event.clientY - this.startY,
      },
    });
    triggerResizeEvent(this.mainContainerRef.current);
    return undefined;
  }

  public onHandleResizeEnd(event: Event, handle: Handle | Corner): void {
    this.isResizing = false;
    this.startX = Number.NaN;
    this.startY = Number.NaN;
    this.props.onResizeEnd?.({ event, handle });
    return undefined;
  }

  get cssClasses(): string {
    const { disabled, rtlEnabled } = this.props;
    return getCssClasses(!!disabled, !!rtlEnabled, this.isResizing);
  }

  get styles(): Record<string, string | number | undefined> {
    const { width, height } = this.props;
    const style = this.restAttributes.style as Record<string, string | number> || {};
    return { ...style, height, width };
  }

  get handles(): (Handle | Corner)[] {
    let { handles } = this.props;

    if (typeof handles === 'string') { handles = [handles]; }

    const result: (Handle | Corner)[] = handles.map((handle) => handle);

    if (result.includes('bottom')) {
      result.includes('right') && result.push('corner-bottom-right');
      result.includes('left') && result.push('corner-bottom-left');
    }

    if (result.includes('top')) {
      result.includes('right') && result.push('corner-top-right');
      result.includes('left') && result.push('corner-top-left');
    }

    return result;
  }
}
