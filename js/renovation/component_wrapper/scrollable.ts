import type { Scrollable } from '../ui/scroll_view/scrollable';
import { DxMouseEvent } from '../ui/scroll_view/types';
import Component from './common/component';
import { Option } from './common/types';
import { Deferred } from '../../core/utils/deferred';

export class ScrollableWrapper extends Component {
  handleMove(event: DxMouseEvent): void {
    (this.viewRef as Scrollable).scrollableRef.handleMove(event);
  }

  update(): unknown {
    (this.viewRef as Scrollable).update();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return new (Deferred as any)().resolve();
  }

  _visibilityChanged(): void {
    super.repaint();
  }

  _container(): JQuery {
    return $((this.viewRef as Scrollable).container());
  }

  $content(): JQuery {
    return $((this.viewRef as Scrollable).content());
  }

  _moveIsAllowed(event: DxMouseEvent): boolean {
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
