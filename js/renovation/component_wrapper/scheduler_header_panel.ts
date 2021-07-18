import Component from './common/component';

export default class HeaderPanel extends Component {
  _setOptionsByReference(): void {
    super._setOptionsByReference();

    this._optionsByReference = {
      ...this._optionsByReference,
      dateHeaderData: true,
    };
  }
}
