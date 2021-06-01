/* eslint-disable no-underscore-dangle */
import Component from './common/component';
import { Option } from './common/types';

// eslint-disable-next-line react/prefer-stateless-function
export class ScrollViewWrapper extends Component {
  _optionChanged(option: Option): void {
    const { name } = option;
    if (name === 'useNative') {
      this._isNodeReplaced = false;
    }
    super._optionChanged(option);
  }
}
