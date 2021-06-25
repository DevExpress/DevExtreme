import Component from '../common/component';
// import { Deferred } from '../../../core/utils/deferred';
import { Option } from '../common/types';
// import type { ScrollView } from '../../ui/scroll_view/scroll_view';

export class ScrollViewWrapper extends Component {
  // update(): unknown {
  //   (this._viewRef as ScrollView).update();

  //   // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //   return new (Deferred as any)().resolve();
  // }

  _optionChanged(option: Option): void {
    const { name } = option;
    if (name === 'useNative') {
      this._isNodeReplaced = false;
    }
    super._optionChanged(option);
  }
}
