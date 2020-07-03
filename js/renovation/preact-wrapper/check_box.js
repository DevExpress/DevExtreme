import Component from './component';

export default class CheckBox extends Component {
    _init() {
        super._init();
        this._valueChangeAction = this._createActionByOption('onValueChanged', {
            excludeValidators: ['disabled', 'readOnly']
        });
    }

    _optionChanged(option) {
        const { name, value } = option || {};
        if(name && this._getActionConfigs()[name]) {
            this._addAction(name);
        }

        switch(name) {
            case 'value':
                this._valueChangeAction?.({
                    element: this.$element(),
                    previousValue: !value,
                    value: value,
                });
                break;
            default:
                super._optionChanged(option);
        }

        this._invalidate();
    }
}
