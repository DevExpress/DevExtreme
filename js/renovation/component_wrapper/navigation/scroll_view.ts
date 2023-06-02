import Component, { ComponentWrapperProps } from '../common/component';
import { Deferred } from '../../../core/utils/deferred';
import { Option } from '../common/types';
import type { ScrollView } from '../../ui/scroll_view/scroll_view';
import type { UserDefinedElement } from '../../../core/element';
import { DxMouseEvent } from '../../ui/scroll_view/common/types';

export class ScrollViewWrapper extends Component {
  constructor(element: UserDefinedElement, options: ComponentWrapperProps) {
    super(element, options);

    this.updateAdditionalOptions();
  }

  update(): unknown {
    (this.viewRef as ScrollView)?.updateHandler();
    return Deferred().resolve();
  }

  // https://github.com/DevExpress/devextreme-renovation/issues/859
  release(preventScrollBottom: boolean): unknown {
    (this.viewRef as ScrollView).release(preventScrollBottom);
    return Deferred().resolve();
  }

  _dimensionChanged(): void {
    (this.viewRef as ScrollView)?.updateHandler();
  }

  isRenovated(): boolean {
    return !!Component.IS_RENOVATED_WIDGET;
  }

  updateAdditionalOptions(): void {
    // eslint-disable-next-line
   this.option('pullDownEnabled', (this as any).hasActionSubscription('onPullDown'));
    // eslint-disable-next-line
   this.option('reachBottomEnabled', (this as any).hasActionSubscription('onReachBottom'));
  }

  // eslint-disable-next-line
  on(...args: [eventName: string | { [key: string]: unknown }, eventHandler?: unknown]): any {
    // eslint-disable-next-line
    const callBase = super.on.apply(this, args as [events: { [key: string]: any }]);

    this.updateAdditionalOptions();

    return callBase;
  }

  _optionChanged(option: Option): void {
    const { name } = option;
    if (name === 'useNative') {
      this._isNodeReplaced = false;
    }

    super._optionChanged(option);

    if (name === 'onPullDown' || name === 'onReachBottom') {
      this.updateAdditionalOptions();
    }
  }

  _moveIsAllowed(event: DxMouseEvent): boolean {
    // eslint-disable-next-line
    return (this.viewRef as ScrollView).scrollableRef.current!.scrollableRef.moveIsAllowed(event);
  }
}
