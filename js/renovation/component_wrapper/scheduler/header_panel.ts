/* eslint-disable no-underscore-dangle */
import Component from '../common/component';

export class HeaderPanel extends Component {
  _setOptionsByReference(): void {
    super._setOptionsByReference();

    this._optionsByReference = {
      ...this._optionsByReference,
      dateHeaderData: true,
      resourceCellTemplate: true,
      dateCellTemplate: true,
      timeCellTemplate: true,
    };
  }
}
