/* eslint-disable no-underscore-dangle */
import Component from './component';

export default class HeaderPanel extends Component {
  _setOptionsByReference(): void {
    super._setOptionsByReference();

    this._optionsByReference = {
      ...this._optionsByReference,
      dateHeaderData: true,
    };
  }
}
