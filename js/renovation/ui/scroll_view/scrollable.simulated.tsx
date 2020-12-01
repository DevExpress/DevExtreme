import {
  Component,
  JSXComponent,
  Ref,
  Effect,
} from 'devextreme-generator/component_declaration/common';

import { EffectReturn } from '../../utils/effect_return.d';
import { ScrollablePropsType } from './common/scrollable_props';
import {
  dxScrollStart,
  dxScroll,
  dxScrollEnd,
  dxScrollStop,
  dxScrollCancel,
  mouseEnter,
  mouseLeave,
} from '../../../events/short';

export const viewFunction = ({
  wrapperRef,
  props: {
    children,
  },
}: ScrollableSimulated): JSX.Element => (
  <div className="dx-scrollable-wrapper" ref={wrapperRef as any}>
    { children }
  </div>
);

@Component({
  jQuery: { register: true },
  view: viewFunction,
})
export class ScrollableSimulated extends JSXComponent<ScrollablePropsType>() {
  @Ref() wrapperRef!: HTMLDivElement;

  @Effect()
  startEffect(): EffectReturn {
    const namespace = 'dxScrollable';

    dxScrollStart.on(this.wrapperRef,
      (e: Event) => {
        this.handleStart(e);
      }, { namespace });

    return (): void => dxScrollStart.off(this.wrapperRef, { namespace });
  }

  @Effect()
  scrollEffect(): EffectReturn {
    const namespace = 'dxScrollable';

    dxScroll.on(this.wrapperRef,
      (e: Event) => {
        this.handleScroll(e);
      }, { namespace });

    return (): void => dxScroll.off(this.wrapperRef, { namespace });
  }

  @Effect()
  endEffect(): EffectReturn {
    const namespace = 'dxScrollable';

    dxScrollEnd.on(this.wrapperRef,
      (e: Event) => {
        this.handleEnd(e);
      }, { namespace });

    return (): void => dxScrollEnd.off(this.wrapperRef, { namespace });
  }

  @Effect()
  stopEffect(): EffectReturn {
    const namespace = 'dxScrollable';

    dxScrollStop.on(this.wrapperRef,
      (e: Event) => {
        this.handleStop(e);
      }, { namespace });

    return (): void => dxScrollStop.off(this.wrapperRef, { namespace });
  }

  @Effect()
  cancelEffect(): EffectReturn {
    const namespace = 'dxScrollable';

    dxScrollCancel.on(this.wrapperRef,
      (e: Event) => {
        this.handleCancel(e);
      }, { namespace });

    return (): void => dxScrollCancel.off(this.wrapperRef, { namespace });
  }

  @Effect()
  mouseEnterEffect(): EffectReturn {
    const namespace = 'dxSimulatedScrollableCursor';

    mouseEnter.on(this.wrapperRef,
      (e: Event) => {
        this.handleMouseEnter(e);
      }, { namespace });

    return (): void => mouseEnter.off(this.wrapperRef, { namespace });
  }

  @Effect()
  mouseLeaveEffect(): EffectReturn {
    const namespace = 'dxSimulatedScrollableCursor';

    mouseLeave.on(this.wrapperRef,
      (e: Event) => {
        this.handleMouseLeave(e);
      }, { namespace });

    return (): void => mouseLeave.off(this.wrapperRef, { namespace });
  }

  private handleMouseEnter(e: Event): void {
    console.log('handleMouseEnter', e, this);
  }

  private handleMouseLeave(e: Event): void {
    console.log('handleMouseLeave', e, this);
  }

  private handleStart(e: Event): void { // param - e: Event
    console.log('handleStart', e, this);
  }

  private handleScroll(e: Event): void {
    console.log('handleScroll', e, this);
  }

  private handleEnd(e: Event): void {
    console.log('handleEnd', e, this);
  }

  private handleStop(e: Event): void {
    console.log('handleStop', e, this);
  }

  private handleCancel(e: Event): void {
    console.log('handleCancel', e, this);
  }
}
