import DropDownEditor from './drop_down_editor/ui.drop_down_editor';
import DataExpressionMixin from './editor/ui.data_expression';
import { ensureDefined, noop, grep } from '../core/utils/common';
import { isObject } from '../core/utils/type';
import { map } from '../core/utils/iterator';
import selectors from './widget/selectors';
import { when, Deferred } from '../core/utils/deferred';
import $ from '../core/renderer';
import eventsEngine from '../events/core/events_engine';
import { extend } from '../core/utils/extend';
import { getElementMaxHeightByWindow } from '../ui/overlay/utils';
import registerComponent from '../core/component_registrator';
import { normalizeKeyName } from '../events/utils';
import { keyboard } from '../events/short';
import devices from '../core/devices';
import { getActiveElement } from '../core/dom_adapter';
import { getPublicElement } from '../core/utils/dom';

const DROP_DOWN_BOX_CLASS = 'dx-dropdownbox';
const ANONYMOUS_TEMPLATE_NAME = 'content';

const realDevice = devices.real();

const DropDownBox = DropDownEditor.inherit({
    _supportedKeys: function() {
        return extend({}, this.callBase(), {
            tab: function(e) {
                if(!this.option('opened')) {
                    return;
                }

                const $tabbableElements = this._getTabbableElements();
                const $focusableElement = e.shiftKey ? $tabbableElements.last() : $tabbableElements.first();

                $focusableElement && eventsEngine.trigger($focusableElement, 'focus');
                e.preventDefault();
            }
        });
    },

    _getTabbableElements: function() {
        return this._getElements().filter(selectors.tabbable);
    },

    _getElements: function() {
        return $(this.content()).find('*');
    },

    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            /**
             * @name dxDropDownBoxOptions.attr
             * @hidden
             */

            acceptCustomValue: false,

            contentTemplate: ANONYMOUS_TEMPLATE_NAME,


            /**
            * @name dxDropDownBoxOptions.onContentReady
            * @hidden true
            * @action
            */

            /**
             * @name dxDropDownBoxOptions.spellcheck
             * @type boolean
             * @default false
             * @hidden
             */

            /**
             * @name dxDropDownBoxOptions.applyValueMode
             * @type string
             * @default "instantly"
             * @acceptValues 'useButtons'|'instantly'
             * @hidden
             */

            /**
             * @name dxDropDownBoxOptions.itemTemplate
             * @type template
             * @default "item"
             * @hidden
             */

            openOnFieldClick: true,


            displayValueFormatter: function(value) {
                return Array.isArray(value) ? value.join(', ') : value;
            },
            useHiddenSubmitElement: true
        });
    },

    _getAnonymousTemplateName: function() {
        return ANONYMOUS_TEMPLATE_NAME;
    },

    _initTemplates: function() {
        this.callBase();
    },

    _initMarkup: function() {
        this._initDataExpressions();
        this.$element().addClass(DROP_DOWN_BOX_CLASS);

        this.callBase();
    },

    _setSubmitValue: function() {
        const value = this.option('value');
        const submitValue = this._shouldUseDisplayValue(value) ? this._displayGetter(value) : value;

        this._getSubmitElement().val(submitValue);
    },

    _shouldUseDisplayValue: function(value) {
        return this.option('valueExpr') === 'this' && isObject(value);
    },

    _renderInputValue: function() {
        const callBase = this.callBase.bind(this);
        const values = [];

        if(!this._dataSource) {
            callBase(values);
            return new Deferred().resolve();
        }

        const currentValue = this._getCurrentValue();
        let keys = ensureDefined(currentValue, []);

        keys = Array.isArray(keys) ? keys : [keys];

        const itemLoadDeferreds = map(keys, (function(key) {
            return this._loadItem(key).always((function(item) {
                const displayValue = this._displayGetter(item);
                values.push(ensureDefined(displayValue, key));
            }).bind(this));
        }).bind(this));

        return when
            .apply(this, itemLoadDeferreds)
            .always((function() {
                this.option('displayValue', values);
                callBase(values.length && values);
            }).bind(this))
            .fail(callBase);
    },

    _loadItem: function(value) {
        const deferred = new Deferred();
        const that = this;

        const selectedItem = grep(this.option('items') || [], (function(item) {
            return this._isValueEquals(this._valueGetter(item), value);
        }).bind(this))[0];

        if(selectedItem !== undefined) {
            deferred.resolve(selectedItem);
        } else {
            this._loadValue(value)
                .done(function(item) {
                    deferred.resolve(item);
                })
                .fail(function(args) {
                    if(that.option('acceptCustomValue')) {
                        deferred.resolve(value);
                    } else {
                        deferred.reject();
                    }
                });
        }

        return deferred.promise();
    },

    _updatePopupWidth: function() {
        this._setPopupOption('width', this.$element().outerWidth());
    },

    _popupElementTabHandler: function(e) {
        if(normalizeKeyName(e) !== 'tab') return;

        const $firstTabbable = this._getTabbableElements().first().get(0);
        const $lastTabbable = this._getTabbableElements().last().get(0);
        const $target = e.originalEvent.target;
        const moveBackward = !!($target === $firstTabbable && e.shift);
        const moveForward = !!($target === $lastTabbable && !e.shift);

        if(moveBackward || moveForward) {
            this.close();
            eventsEngine.trigger(this._input(), 'focus');

            if(moveBackward) {
                e.originalEvent.preventDefault();
            }
        }
    },

    _renderPopup: function(e) {
        this.callBase();

        if(this.option('focusStateEnabled')) {
            keyboard.on(this.content(), null, e => this._popupElementTabHandler(e));
        }
    },

    _renderPopupContent: function() {
        if(this.option('contentTemplate') === ANONYMOUS_TEMPLATE_NAME) {
            return;
        }

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
            container: getPublicElement($popupContent),
            model: templateData
        });
    },

    _canShowVirtualKeyboard: function() {
        return realDevice.mac; // T845484
    },

    _isNestedElementActive: function() {
        const activeElement = getActiveElement();
        return activeElement && this._popup.$content().get(0).contains(activeElement);
    },

    _shouldCloseOnTargetScroll: function() {
        return realDevice.deviceType === 'desktop' && this._canShowVirtualKeyboard() && this._isNestedElementActive();
    },

    _popupHiddenHandler: function() {
        this.callBase();
        this._popupPosition = undefined;
    },

    _popupPositionedHandler: function(e) {
        this.callBase(e);
        this._popupPosition = e.position;
    },

    _popupConfig: function() {
        const { focusStateEnabled } = this.option();
        const horizontalAlignment = this.option('rtlEnabled') ? 'right' : 'left';

        return extend(this.callBase(), {
            width: function() {
                return this.$element().outerWidth();
            }.bind(this),
            height: 'auto',
            tabIndex: -1,
            dragEnabled: false,
            focusStateEnabled,
            contentTemplate: ANONYMOUS_TEMPLATE_NAME,
            closeOnTargetScroll: this._shouldCloseOnTargetScroll.bind(this),
            position: {
                of: this.$element(),
                collision: 'flipfit',
                my: 'top ' + horizontalAlignment,
                at: 'bottom ' + horizontalAlignment,
                offset: {
                    y: -1
                }
            },
            onKeyboardHandled: opts => this.option('focusStateEnabled') && this._popupElementTabHandler(opts),
            maxHeight: function() {
                const popupLocation = this._popupPosition?.v.location;

                return getElementMaxHeightByWindow(this.$element(), popupLocation);
            }.bind(this)
        });
    },

    _popupShownHandler: function() {
        this.callBase();
        const $firstElement = this._getTabbableElements().first();
        eventsEngine.trigger($firstElement, 'focus');
    },

    _setCollectionWidgetOption: noop,

    _optionChanged: function(args) {
        this._dataExpressionOptionChanged(args);
        switch(args.name) {
            case 'width':
                this.callBase(args);
                this._popup && this._popup.repaint();
                break;
            case 'dataSource':
                this._renderInputValue();
                break;
            case 'displayValue':
                this.option('text', args.value);
                break;
            case 'displayExpr':
                this._renderValue();
                break;
            case 'contentTemplate':
                this._invalidate();
                break;
            default:
                this.callBase(args);
        }
    }
}).include(DataExpressionMixin);

registerComponent('dxDropDownBox', DropDownBox);

module.exports = DropDownBox;

///#DEBUG
module.exports.realDevice = realDevice;
///#ENDDEBUG
