/* eslint-disable no-underscore-dangle */
import Component from '../common/component';

export class GroupPanelWrapper extends Component {
  _setOptionsByReference(): void {
    super._setOptionsByReference();

    this._optionsByReference = {
      ...this._optionsByReference,
      resourceCellTemplate: true,
    };
  }
}
