/* eslint-disable no-underscore-dangle */
import Component from '../common/component';

export default class TimePanel extends Component {
  _setOptionsByReference(): void {
    super._setOptionsByReference();

    this._optionsByReference = {
      ...this._optionsByReference,
      timeCellTemplate: true,
    };
  }
}
