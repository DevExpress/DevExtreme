import Component from './common/component';
import { Option } from './common/types';

export class ScrollableWrapper extends Component {
  _optionChanged(option: Option): void {
    const { name } = option;
    if (name === 'useNative') {
      this._isNodeReplaced = false;
    }
    super._optionChanged(option);
  }
}
