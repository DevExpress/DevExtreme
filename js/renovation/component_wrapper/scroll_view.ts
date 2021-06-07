import Component from './common/component';
import { Option } from './common/types';

export class ScrollViewWrapper extends Component {
  _optionChanged(option: Option): void {
    const { name } = option;
    if (name === 'useNative') {
      this._isNodeReplaced = false;
    }
    super._optionChanged(option);
  }
}
