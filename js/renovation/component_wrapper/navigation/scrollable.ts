import type { Scrollable } from '../../ui/scroll_view/scrollable';
import { DxMouseEvent } from '../../ui/scroll_view/common/types.d';
import Component from '../common/component';
import { Option } from '../common/types';
import { Deferred } from '../../../core/utils/deferred';
import type { dxElementWrapper } from '../../../core/renderer';

export class ScrollableWrapper extends Component {
  handleMove(event: DxMouseEvent): void {
    (this.viewRef as Scrollable).scrollableRef.handleMove(event);
  }

  update(): unknown {
    (this.viewRef as Scrollable).updateHandler();
    return Deferred().resolve();
  }

  _visibilityChanged(): void {}

  $content(): dxElementWrapper {
    return (this.$element() as unknown as dxElementWrapper).find('.dx-scrollable-content').eq(0);
  }

  _moveIsAllowed(event: DxMouseEvent): boolean {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return (this.viewRef as Scrollable).scrollableRef.moveIsAllowed(event);
  }

  _prepareDirections(value: boolean): void {
    (this.viewRef as Scrollable).scrollableRef.prepareDirections(value);
  }

  _optionChanged(option: Option): void {
    const { name } = option;
    if (name === 'useNative') {
      this._isNodeReplaced = false;
    }
    super._optionChanged(option);
  }
}
