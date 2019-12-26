const $ = require('../../core/renderer');
const AsyncTemplateMixin = require('../shared/async_template_mixin');
const eventsEngine = require('../../events/core/events_engine');
const Guid = require('../../core/guid');
const registerComponent = require('../../core/component_registrator');
const commonUtils = require('../../core/utils/common');
const domUtils = require('../../core/utils/dom');
const focused = require('../widget/selectors').focused;
const each = require('../../core/utils/iterator').each;
const isDefined = require('../../core/utils/type').isDefined;
const extend = require('../../core/utils/extend').extend;
const getPublicElement = require('../../core/utils/dom').getPublicElement;
const errors = require('../widget/ui.errors');
const positionUtils = require('../../animation/position');
const getDefaultAlignment = require('../../core/utils/position').getDefaultAlignment;
const DropDownButton = require('./ui.drop_down_button').default;
const Widget = require('../widget/ui.widget');
const messageLocalization = require('../../localization/message');
const eventUtils = require('../../events/utils');
const TextBox = require('../text_box');
const clickEvent = require('../../events/click');
const devices = require('../../core/devices');
const FunctionTemplate = require('../../core/templates/function_template').FunctionTemplate;
const Popup = require('../popup');

const DROP_DOWN_EDITOR_CLASS = 'dx-dropdowneditor';
const DROP_DOWN_EDITOR_INPUT_WRAPPER = 'dx-dropdowneditor-input-wrapper';
const DROP_DOWN_EDITOR_BUTTON_ICON = 'dx-dropdowneditor-icon';
const DROP_DOWN_EDITOR_OVERLAY = 'dx-dropdowneditor-overlay';
const DROP_DOWN_EDITOR_OVERLAY_FLIPPED = 'dx-dropdowneditor-overlay-flipped';
const DROP_DOWN_EDITOR_ACTIVE = 'dx-dropdowneditor-active';
const DROP_DOWN_EDITOR_FIELD_CLICKABLE = 'dx-dropdowneditor-field-clickable';
const DROP_DOWN_EDITOR_FIELD_TEMPLATE_WRAPPER = 'dx-dropdowneditor-field-template-wrapper';

const isIOs = devices.current().platform === 'ios';

/**
* @name dxDropDownEditor
* @inherits dxTextBox
* @module ui/drop_down_editor/ui.drop_down_editor
* @export default
* @hidden
*/
const DropDownEditor = TextBox.inherit({

    _supportedKeys: function() {
        const homeEndHandler = function(e) {
            if(this.option('opened')) {
                e.preventDefault();
                return true;
            }
            return false;
        };

        return extend({}, this.callBase(), {
            tab: function(e) {
                if(!this.option('opened')) {
                    return;
                }

                if(this.option('applyValueMode') === 'instantly') {
                    this.close();
                    return;
                }

                const $focusableElement = e.shiftKey
                    ? this._getLastPopupElement()
                    : this._getFirstPopupElement();

                $focusableElement && eventsEngine.trigger($focusableElement, 'focus');
                e.preventDefault();
            },
            escape: function(e) {
                if(this.option('opened')) {
                    e.preventDefault();
                }
                this.close();

                return true;
            },
            upArrow: function(e) {
                e.preventDefault();
                e.stopPropagation();
                if(e.altKey) {
                    this.close();
                    return false;
                }
                return true;
            },
            downArrow: function(e) {
                e.preventDefault();
                e.stopPropagation();
                if(e.altKey) {
                    this._validatedOpening();
                    return false;
                }
                return true;
            },
            enter: function(e) {
                if(this.option('opened')) {
                    e.preventDefault();
                    this._valueChangeEventHandler(e);
                }
                return true;
            },
            home: homeEndHandler,
            end: homeEndHandler
        });
    },

    _getDefaultButtons: function() {
        return this.callBase().concat([{ name: 'dropDown', Ctor: DropDownButton }]);
    },

    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            /**
            * @name dxDropDownEditorOptions.value
            * @type any
            * @default null
            */
            value: null,

            /**
            * @name dxDropDownEditorOptions.onOpened
            * @extends Action
            * @action
            */
            onOpened: null,

            /**
            * @name dxDropDownEditorOptions.onClosed
            * @extends Action
            * @action
            */
            onClosed: null,

            /**
            * @name dxDropDownEditorOptions.opened
            * @type boolean
            * @default false
            * @fires dxDropDownEditorOptions.onOpened
            * @fires dxDropDownEditorOptions.onClosed
            */
            opened: false,

            /**
            * @name dxDropDownEditorOptions.acceptCustomValue
            * @type boolean
            * @default true
            */
            acceptCustomValue: true,

            /**
            * @name dxDropDownEditorOptions.applyValueMode
            * @type Enums.EditorApplyValueMode
            * @default "instantly"
            */
            applyValueMode: 'instantly',

            /**
            * @name dxDropDownEditorOptions.deferRendering
            * @type boolean
            * @default true
            */
            deferRendering: true,

            /**
            * @name dxDropDownEditorOptions.activeStateEnabled
            * @type boolean
            * @default true
            */
            activeStateEnabled: true,

            /**
             * @name dxDropDownEditorOptions.dropDownButtonTemplate
             * @type template|function
             * @default "dropDownButton"
             * @type_function_param1 buttonData:object
             * @type_function_param1_field1 text:string
             * @type_function_param1_field2 icon:string
             * @type_function_param2 contentElement:dxElement
             * @type_function_return string|Node|jQuery
             */
            dropDownButtonTemplate: 'dropDownButton',

            fieldTemplate: null,
            contentTemplate: null,

            /**
             * @name dxDropDownEditorOptions.openOnFieldClick
             * @type boolean
             * @default false
             */
            openOnFieldClick: false,

            /**
             * @name dxDropDownEditorOptions.showDropDownButton
             * @type boolean
             * @default true
             */
            showDropDownButton: true,

            /**
            * @name dxDropDownEditorOptions.buttons
            * @type Array<Enums.DropDownEditorButtonName,dxTextEditorButton>
            * @default undefined
            */
            buttons: void 0,

            dropDownOptions: {},
            popupPosition: this._getDefaultPopupPosition(),
            onPopupInitialized: null,
            applyButtonText: messageLocalization.format('OK'),
            cancelButtonText: messageLocalization.format('Cancel'),
            buttonsLocation: 'default',
            showPopupTitle: false,
            useHiddenSubmitElement: false

            /**
            * @name dxDropDownEditorOptions.mask
            * @hidden
            */

            /**
            * @name dxDropDownEditorOptions.maskChar
            * @hidden
            */

            /**
            * @name dxDropDownEditorOptions.maskRules
            * @hidden
            */

            /**
            * @name dxDropDownEditorOptions.maskInvalidMessage
            * @hidden
            */

            /**
            * @name dxDropDownEditorOptions.useMaskedValue
            * @hidden
            */

            /**
            * @name dxDropDownEditorOptions.mode
            * @hidden
            */

            /**
             * @name dxDropDownEditorOptions.showMaskMode
             * @hidden
             */
        });
    },

    _getDefaultPopupPosition: function() {
        const position = getDefaultAlignment();

        return {
            offset: { h: 0, v: -1 },
            my: position + ' top',
            at: position + ' bottom',
            collision: 'flip flip'
        };
    },

    _defaultOptionsRules: function() {
        return this.callBase().concat([
            {
                device: function(device) {
                    const isGeneric = device.platform === 'generic';
                    return isGeneric;
                },
                options: {
                    popupPosition: { offset: { v: 0 } }
                }
            }
        ]);
    },

    _inputWrapper: function() {
        return this.$element().find('.' + DROP_DOWN_EDITOR_INPUT_WRAPPER);
    },

    _init: function() {
        this.callBase();
        this._initVisibilityActions();
        this._initPopupInitializedAction();
        this._options.cache('dropDownOptions', this.option('dropDownOptions'));
    },

    _initVisibilityActions: function() {
        this._openAction = this._createActionByOption('onOpened', {
            excludeValidators: ['disabled', 'readOnly']
        });

        this._closeAction = this._createActionByOption('onClosed', {
            excludeValidators: ['disabled', 'readOnly']
        });
    },

    _initPopupInitializedAction: function() {
        this._popupInitializedAction = this._createActionByOption('onPopupInitialized', {
            excludeValidators: ['disabled', 'readOnly']
        });
    },

    _initMarkup: function() {
        this._renderSubmitElement();

        this.callBase();

        this.$element()
            .addClass(DROP_DOWN_EDITOR_CLASS);

        this.setAria('role', 'combobox');
    },

    _render: function() {
        this.callBase();

        this._renderOpenHandler();
        this._attachFocusOutHandler();
        this._renderOpenedState();
    },

    _renderContentImpl: function() {
        if(!this.option('deferRendering')) {
            this._createPopup();
        }
    },

    _renderInput: function() {
        this.callBase();

        this.$element().wrapInner($('<div>').addClass(DROP_DOWN_EDITOR_INPUT_WRAPPER));
        this._$container = this.$element().children().eq(0);

        this._setDefaultAria();
    },

    _setDefaultAria: function() {
        this.setAria({
            'haspopup': 'true',
            'autocomplete': 'list'
        });
    },

    _readOnlyPropValue: function() {
        return !this.option('acceptCustomValue') || this.callBase();
    },

    _cleanFocusState: function() {
        this.callBase();

        if(this.option('fieldTemplate')) {
            this._detachFocusEvents();
        }
    },

    _getFieldTemplate: function() {
        return this.option('fieldTemplate') && this._getTemplateByOption('fieldTemplate');
    },

    _renderMask: function() {
        if(this.option('fieldTemplate')) {
            return;
        }

        this.callBase();
    },

    _renderField: function() {
        const fieldTemplate = this._getFieldTemplate();

        fieldTemplate && this._renderTemplatedField(fieldTemplate, this._fieldRenderData());
    },

    _renderPlaceholder: function() {
        const hasFieldTemplate = !!this._getFieldTemplate();

        if(!hasFieldTemplate) {
            this.callBase();
        }
    },

    _renderValue: function() {
        if(this.option('useHiddenSubmitElement')) {
            this._setSubmitValue();
        }

        const promise = this.callBase();

        promise.always(this._renderField.bind(this));
    },

    _renderTemplatedField: function(fieldTemplate, data) {
        const isFocused = focused(this._input());
        const $container = this._$container;

        this._detachKeyboardEvents();

        // NOTE: to prevent buttons disposition
        const beforeButtonsContainerParent = this._$beforeButtonsContainer && this._$beforeButtonsContainer[0].parentNode;
        const afterButtonsContainerParent = this._$afterButtonsContainer && this._$afterButtonsContainer[0].parentNode;
        beforeButtonsContainerParent && beforeButtonsContainerParent.removeChild(this._$beforeButtonsContainer[0]);
        afterButtonsContainerParent && afterButtonsContainerParent.removeChild(this._$afterButtonsContainer[0]);

        this._detachFocusEvents();
        $container.empty();

        const $templateWrapper = $('<div>').addClass(DROP_DOWN_EDITOR_FIELD_TEMPLATE_WRAPPER).appendTo($container);

        fieldTemplate.render({
            model: data,
            container: domUtils.getPublicElement($templateWrapper),
            onRendered: () => {
                const $input = this._input();

                if(!$input.length) {
                    throw errors.Error('E1010');
                }

                this._refreshEvents();
                this._refreshValueChangeEvent();
                this._renderFocusState();
                isFocused && eventsEngine.trigger($input, 'focus');
            }
        });

        $container.prepend(this._$beforeButtonsContainer);
        $container.append(this._$afterButtonsContainer);
    },

    _fieldRenderData: function() {
        return this.option('value');
    },

    _initTemplates: function() {
        this._templateManager.addDefaultTemplates({
            dropDownButton: new FunctionTemplate(function(options) {
                const $icon = $('<div>').addClass(DROP_DOWN_EDITOR_BUTTON_ICON);
                $(options.container).append($icon);
            })
        });
        this.callBase();
    },

    _renderOpenHandler: function() {
        const that = this;
        const $inputWrapper = that._inputWrapper();
        const eventName = eventUtils.addNamespace(clickEvent.name, that.NAME);
        const openOnFieldClick = that.option('openOnFieldClick');

        eventsEngine.off($inputWrapper, eventName);
        eventsEngine.on($inputWrapper, eventName, that._getInputClickHandler(openOnFieldClick));
        that.$element().toggleClass(DROP_DOWN_EDITOR_FIELD_CLICKABLE, openOnFieldClick);

        if(openOnFieldClick) {
            that._openOnFieldClickAction = that._createAction(that._openHandler.bind(that));
        }
    },

    _attachFocusOutHandler: function() {
        if(isIOs) {
            this._detachFocusOutEvents();
            eventsEngine.on(this._inputWrapper(), eventUtils.addNamespace('focusout', this.NAME), function(event) {
                const newTarget = event.relatedTarget;
                const popupWrapper = this.content ? $(this.content()).closest('.' + DROP_DOWN_EDITOR_OVERLAY) : this._$popup;
                if(newTarget && this.option('opened')) {
                    const isNewTargetOutside = $(newTarget).closest('.' + DROP_DOWN_EDITOR_OVERLAY, popupWrapper).length === 0;
                    if(isNewTargetOutside) {
                        this.close();
                    }
                }
            }.bind(this));
        }
    },

    _detachFocusOutEvents: function() {
        isIOs && eventsEngine.off(this._inputWrapper(), eventUtils.addNamespace('focusout', this.NAME));
    },

    _getInputClickHandler: function(openOnFieldClick) {
        const that = this;

        return openOnFieldClick ?
            function(e) { that._executeOpenAction(e); } :
            function(e) { that._focusInput(); };
    },

    _openHandler: function() {
        this._toggleOpenState();
    },

    _executeOpenAction: function(e) {
        this._openOnFieldClickAction({ event: e });
    },

    _keyboardEventBindingTarget: function() {
        return this._input();
    },

    _focusInput: function() {
        if(this.option('disabled')) {
            return false;
        }

        if(this.option('focusStateEnabled') && !focused(this._input())) {
            eventsEngine.trigger(this._input(), 'focus');
        }

        return true;
    },

    _toggleOpenState: function(isVisible) {
        if(!this._focusInput()) {
            return;
        }

        if(!this.option('readOnly')) {
            isVisible = arguments.length ? isVisible : !this.option('opened');
            this.option('opened', isVisible);
        }
    },

    _renderOpenedState: function() {
        const opened = this.option('opened');
        if(opened) {
            this._createPopup();
        }

        this.$element().toggleClass(DROP_DOWN_EDITOR_ACTIVE, opened);
        this._setPopupOption('visible', opened);

        this.setAria({
            'expanded': opened
        });

        this.setAria('owns', ((opened || undefined) && this._popupContentId), this.$element());
    },

    _createPopup: function() {
        if(this._$popup) {
            return;
        }

        this._$popup = $('<div>').addClass(DROP_DOWN_EDITOR_OVERLAY)
            .addClass(this.option('customOverlayCssClass'))
            .appendTo(this.$element());

        this._renderPopup();
        this._renderPopupContent();
    },

    _renderPopup: function() {
        this._popup = this._createComponent(this._$popup, Popup, extend(this._popupConfig(), this._options.cache('dropDownOptions')));

        this._popup.on({
            'showing': this._popupShowingHandler.bind(this),
            'shown': this._popupShownHandler.bind(this),
            'hiding': this._popupHidingHandler.bind(this),
            'hidden': this._popupHiddenHandler.bind(this)
        });

        this._popup.option('onContentReady', this._contentReadyHandler.bind(this));
        this._contentReadyHandler();

        this._setPopupContentId(this._popup.$content());

        this._bindInnerWidgetOptions(this._popup, 'dropDownOptions');
    },

    _setPopupContentId($popupContent) {
        this._popupContentId = 'dx-' + new Guid();
        this.setAria('id', this._popupContentId, $popupContent);
    },

    _contentReadyHandler: commonUtils.noop,

    _popupConfig: function() {

        return {
            onInitialized: this._popupInitializedHandler(),
            position: extend(this.option('popupPosition'), {
                of: this.$element()
            }),
            showTitle: this.option('showPopupTitle'),
            width: 'auto',
            height: 'auto',
            shading: false,
            closeOnTargetScroll: true,
            closeOnOutsideClick: this._closeOutsideDropDownHandler.bind(this),
            animation: {
                show: { type: 'fade', duration: 0, from: 0, to: 1 },
                hide: { type: 'fade', duration: 400, from: 1, to: 0 }
            },
            deferRendering: false,
            focusStateEnabled: false,
            showCloseButton: false,
            toolbarItems: this._getPopupToolbarItems(),
            onPositioned: this._popupPositionedHandler.bind(this),
            fullScreen: false
        };
    },

    _popupInitializedHandler: function() {
        if(!this.option('onPopupInitialized')) {
            return;
        }

        return (function(e) {
            this._popupInitializedAction({ popup: e.component });
        }).bind(this);
    },

    _popupPositionedHandler: function(e) {
        e.position && this._popup.overlayContent().toggleClass(DROP_DOWN_EDITOR_OVERLAY_FLIPPED, e.position.v.flip);
    },

    _popupShowingHandler: commonUtils.noop,

    _popupHidingHandler: function() {
        this.option('opened', false);
    },

    _popupShownHandler: function() {
        this._openAction();

        if(this._$validationMessage) {
            this._$validationMessage.dxOverlay('option', 'position', this._getValidationMessagePosition());
        }
    },

    _popupHiddenHandler: function() {
        this._closeAction();
        if(this._$validationMessage) {
            this._$validationMessage.dxOverlay('option', 'position', this._getValidationMessagePosition());
        }
    },

    _getValidationMessagePosition: function() {
        let positionRequest = 'below';

        if(this._popup && this._popup.option('visible')) {
            const myTop = positionUtils.setup(this.$element()).top;
            const popupTop = positionUtils.setup(this._popup.$content()).top;

            positionRequest = (myTop + this.option('popupPosition').offset.v) > popupTop ? 'below' : 'above';
        }

        return this.callBase(positionRequest);
    },

    _renderPopupContent: function() {
        const contentTemplate = this._getTemplateByOption('contentTemplate');

        if(!(contentTemplate && this.option('contentTemplate'))) {
            return;
        }

        const $popupContent = this._popup.$content();
        const templateData = {
            value: this._fieldRenderData(),
            component: this
        };

        $popupContent.empty();

        contentTemplate.render({
            container: domUtils.getPublicElement($popupContent),
            model: templateData
        });
    },

    _closeOutsideDropDownHandler: function({ target }) {
        const $target = $(target);
        const dropDownButton = this.getButton('dropDown');
        const $dropDownButton = dropDownButton && dropDownButton.$element();
        const isInputClicked = !!$target.closest(this.$element()).length;
        const isDropDownButtonClicked = !!$target.closest($dropDownButton).length;
        const isOutsideClick = !isInputClicked && !isDropDownButtonClicked;

        return isOutsideClick;
    },

    _clean: function() {
        delete this._openOnFieldClickAction;

        if(this._$popup) {
            this._$popup.remove();
            delete this._$popup;
            delete this._popup;
        }
        this.callBase();
    },

    _setPopupOption: function(optionName, value) {
        this._setWidgetOption('_popup', arguments);
    },

    _validatedOpening: function() {
        if(!this.option('readOnly')) {
            this._toggleOpenState(true);
        }
    },

    _getPopupToolbarItems: function() {
        return this.option('applyValueMode') === 'useButtons'
            ? this._popupToolbarItemsConfig()
            : [];
    },

    _getFirstPopupElement: function() {
        return this._popup._wrapper().find('.dx-popup-done.dx-button');
    },

    _getLastPopupElement: function() {
        return this._popup._wrapper().find('.dx-popup-cancel.dx-button');
    },

    _popupElementTabHandler: function(e) {
        const $element = $(e.currentTarget);

        if((e.shiftKey && $element.is(this._getFirstPopupElement()))
            || (!e.shiftKey && $element.is(this._getLastPopupElement()))) {

            eventsEngine.trigger(this._input(), 'focus');
            e.preventDefault();
        }
    },

    _popupElementEscHandler: function() {
        eventsEngine.trigger(this._input(), 'focus');
        this.close();
    },

    _popupButtonInitializedHandler: function(e) {
        e.component.registerKeyHandler('tab', this._popupElementTabHandler.bind(this));
        e.component.registerKeyHandler('escape', this._popupElementEscHandler.bind(this));
    },

    _popupToolbarItemsConfig: function() {
        const buttonsConfig = [
            {
                shortcut: 'done',
                options: {
                    onClick: this._applyButtonHandler.bind(this),
                    text: this.option('applyButtonText'),
                    onInitialized: this._popupButtonInitializedHandler.bind(this)
                }
            },
            {
                shortcut: 'cancel',
                options: {
                    onClick: this._cancelButtonHandler.bind(this),
                    text: this.option('cancelButtonText'),
                    onInitialized: this._popupButtonInitializedHandler.bind(this)
                }
            }
        ];

        return this._applyButtonsLocation(buttonsConfig);
    },

    _applyButtonsLocation: function(buttonsConfig) {
        const buttonsLocation = this.option('buttonsLocation');
        const resultConfig = buttonsConfig;

        if(buttonsLocation !== 'default') {
            const position = commonUtils.splitPair(buttonsLocation);

            each(resultConfig, function(_, element) {
                extend(element, {
                    toolbar: position[0],
                    location: position[1]
                });
            });
        }

        return resultConfig;
    },

    _applyButtonHandler: function() {
        this.close();
        this.option('focusStateEnabled') && this.focus();
    },

    _cancelButtonHandler: function() {
        this.close();
        this.option('focusStateEnabled') && this.focus();
    },

    _updatePopupWidth: commonUtils.noop,

    _popupOptionChanged: function(args) {
        const options = Widget.getOptionsFromContainer(args);

        this._setPopupOption(options);

        if(Object.keys(options).indexOf('width') !== -1 && options['width'] === undefined) {
            this._updatePopupWidth();
        }
    },

    _renderSubmitElement: function() {
        if(this.option('useHiddenSubmitElement')) {
            this._$submitElement = $('<input>')
                .attr('type', 'hidden')
                .appendTo(this.$element());
        }
    },

    _setSubmitValue: function() {
        this._getSubmitElement().val(this.option('value'));
    },

    _getSubmitElement: function() {
        if(this.option('useHiddenSubmitElement')) {
            return this._$submitElement;
        } else {
            return this.callBase();
        }
    },

    _dispose: function() {
        this._detachFocusOutEvents();
        this.callBase();
    },

    _optionChanged: function(args) {
        switch(args.name) {
            case 'opened':
                this._renderOpenedState();
                break;
            case 'onOpened':
            case 'onClosed':
                this._initVisibilityActions();
                break;
            case 'onPopupInitialized':
                this._initPopupInitializedAction();
                break;
            case 'fieldTemplate':
                if(isDefined(args.value)) {
                    this._renderField();
                } else {
                    this._invalidate();
                }
                break;
            case 'contentTemplate':
            case 'acceptCustomValue':
            case 'openOnFieldClick':
                this._invalidate();
                break;
            case 'dropDownButtonTemplate':
            case 'showDropDownButton':
                this._updateButtons(['dropDown']);
                break;
            case 'dropDownOptions':
                this._popupOptionChanged(args);
                this._options.cache('dropDownOptions', args.value);
                break;
            case 'popupPosition':
            case 'deferRendering':
                break;
            case 'applyValueMode':
            case 'applyButtonText':
            case 'cancelButtonText':
            case 'buttonsLocation':
                this._setPopupOption('toolbarItems', this._getPopupToolbarItems());
                break;
            case 'showPopupTitle':
                this._setPopupOption('showTitle', args.value);
                break;
            case 'useHiddenSubmitElement':
                if(this._$submitElement) {
                    this._$submitElement.remove();
                    this._$submitElement = undefined;
                }

                this._renderSubmitElement();
                break;
            default:
                this.callBase(args);
        }
    },

    /**
    * @name dxDropDownEditorMethods.open
    * @publicName open()
    */
    open: function() {
        this.option('opened', true);
    },

    /**
    * @name dxDropDownEditorMethods.close
    * @publicName close()
    */
    close: function() {
        this.option('opened', false);
    },

    /**
    * @name dxDropDownEditorMethods.field
    * @publicName field()
    * @return dxElement
    */
    field: function() {
        return getPublicElement(this._input());
    },

    /**
    * @name dxDropDownEditorMethods.content
    * @publicName content()
    * @return dxElement
    */
    content: function() {
        return this._popup ? this._popup.content() : null;
    }
}).include(AsyncTemplateMixin);

registerComponent('dxDropDownEditor', DropDownEditor);

module.exports = DropDownEditor;
