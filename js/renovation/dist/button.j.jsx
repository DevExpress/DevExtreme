import registerComponent from '../../core/component_registrator';
import ValidationEngine from '../../ui/validation_engine';
import Component from '../preact-wrapper/component';
import ButtonComponent from '../button.p';
import { getInnerActionName } from '../preact-wrapper/utils';
import { extend } from '../../core/utils/extend';

const actions = {
    onClick: { excludeValidators: ['readOnly'] },
    onContentReady: { excludeValidators: ['disabled', 'readOnly'] },
};

export default class Button extends Component {
    get _viewComponent() {
        return ButtonComponent;
    }

    getProps(props) {
        const { onKeyPress: defaultKeyPress } = props;

        props.render = this._createTemplateComponent(props, props.template, true);

        Object.keys(actions).forEach((name) => {
            props[name] = this.option(getInnerActionName(name));
        });

        props.validationGroup = ValidationEngine.getGroupConfig(this._findGroup());

        props.onKeyPress = (event, options) => {
            const { originalEvent, keyName, which } = options;
            const keys = this._supportedKeys();
            const func = keys[keyName] || keys[which];

            // NOTE: registered handler has more priority
            if(func !== undefined) {
                const handler = func.bind(this);
                const result = handler(originalEvent, options);

                if(result) {
                    return result;
                } else {
                    event.cancel = true;
                    return event;
                }
            }

            // NOTE: make possible pass onKeyPress property
            return defaultKeyPress?.(event, options);
        };

        return props;
    }

    focus() {
        this.viewRef.current.focus();
    }

    registerKeyHandler(key, handler) {
        const currentKeys = this._supportedKeys();

        this._supportedKeys = () => extend(currentKeys, { [key]: handler });
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

        Object.keys(actions).forEach((name) => {
            this._addAction(name, actions[name]);
        });

        this._supportedKeys = () => {
            return {};
        };
    }

    _optionChanged(option) {
        const { name, value } = option;
        if(actions[name]) {
            this._addAction(name, actions[name]);
        }

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
