/* eslint-disable no-underscore-dangle */
import Component from './component';

export default class Widget extends Component {
  _optionChanged(option): void {
    const { name } = option || {};

    switch (name) {
      case 'accessKey':
      case 'tabIndex':
      case 'activeStateEnabled':
      case 'focusStateEnabled':
      case 'hoverStateEnabled':
      case 'hint':
      case 'visible':
        break;
      default:
        super._optionChanged(option);
    }

    this._invalidate();
  }
}
