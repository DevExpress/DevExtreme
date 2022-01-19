import Component from '../common/component';
import { Deferred } from '../../../core/utils/deferred';
import { Option } from '../common/types';
import type { ScrollView } from '../../ui/scroll_view/scroll_view';

export class ScrollViewWrapper extends Component {
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

  _optionChanged(option: Option): void {
    const { name } = option;
    if (name === 'useNative') {
      this._isNodeReplaced = false;
    }
    super._optionChanged(option);
  }
}
