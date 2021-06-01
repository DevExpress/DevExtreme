/* eslint-disable no-underscore-dangle */
import Component from './common/component';
import { Option } from './common/types';

// eslint-disable-next-line react/prefer-stateless-function
export class ScrollableWrapper extends Component {
  // eslint-disable-next-line class-methods-use-this
  // https://trello.com/c/UCUiKGfd/2724-renovation-renovated-components-ignores-children-when-usetemplates-returns-false
  // _useTemplates(): boolean {
  //   return false;
  // }

  _optionChanged(option: Option): void {
    const { name } = option;
    if (name === 'useNative') {
      this._isNodeReplaced = false;
    }
    super._optionChanged(option);
  }
}
