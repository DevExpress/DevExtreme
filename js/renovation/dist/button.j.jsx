import registerComponent from '../../core/component_registrator';
import ValidationEngine from '../../ui/validation_engine';
import Component from '../preact-wrapper/component';
import ButtonComponent from '../button.p';

export default class Button extends Component {
    get _viewComponent() {
        return ButtonComponent;
    }

    getProps(props) {
        props.render = this._createTemplateComponent(props, props.template, true);
        props.onKeyDown = this._wrapKeyDownHandler(props.onKeyDown);

        props.validationGroup = ValidationEngine.getGroupConfig(this._findGroup());

        return props;
    }

    focus() {
        this.viewRef.current.focus();
    }

    _findGroup() {
        const $element = this.$element();
        const model = this._modelByElement($element);
        const { validationGroup } = this.option();

        return validationGroup || ValidationEngine.findGroup($element, model);
    }

    _initWidget() {
        this._createViewRef();

        if(this.option('useSubmitBehavior')) {
            this.option('onSubmit', this._getSubmitAction());
        }
    }

    _getActionsMap() {
        return {
            onClick: { excludeValidators: ['readOnly'] },
            onContentReady: { excludeValidators: ['disabled', 'readOnly'] },
        };
    }

    _optionChanged(option) {
        const { name, value } = option;

        this._changeAction(option);

        switch(name) {
            case 'useSubmitBehavior':
                value === true && this.option('onSubmit', this._getSubmitAction());
                break;
            case 'onOptionChanged':
                super._optionChanged(option);
                break;
        }

        super._optionChanged();
    }

    _getSubmitAction() {
        let needValidate = true;
        let validationStatus = 'valid';

        return this._createAction(({ event, submitInput }) => {
            if(needValidate) {
                const validationGroup = this._validationGroupConfig;

                if(validationGroup) {
                    const { status, complete } = validationGroup.validate();

                    validationStatus = status;

                    if(status === 'pending') {
                        needValidate = false;
                        this.option('disabled', true);

                        complete.then(({ status }) => {
                            needValidate = true;
                            this.option('disabled', false);

                            validationStatus = status;
                            validationStatus === 'valid' && submitInput.click();
                        });
                    }
                }
            }

            validationStatus !== 'valid' && event.preventDefault();
            event.stopPropagation();
        });
    }

    get _validationGroupConfig() {
        return ValidationEngine.getGroupConfig(this._findGroup());
    }
}

registerComponent('Button', Button);
