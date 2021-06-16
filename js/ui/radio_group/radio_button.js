import $ from '../../core/renderer';
import eventsEngine from '../../events/core/events_engine';
import devices from '../../core/devices';
import { extend } from '../../core/utils/extend';
import registerComponent from '../../core/component_registrator';
import Editor from '../editor/editor';
import { addNamespace } from '../../events/utils/index';
import { name as clickEventName } from '../../events/click';

const RADIO_BUTTON_CLASS = 'dx-radiobutton';
const RADIO_BUTTON_ICON_CLASS = 'dx-radiobutton-icon';
const RADIO_BUTTON_ICON_DOT_CLASS = 'dx-radiobutton-icon-dot';
const RADIO_BUTTON_CHECKED_CLASS = 'dx-radiobutton-checked';
const RADIO_BUTTON_ICON_CHECKED_CLASS = 'dx-radiobutton-icon-checked';

/**
* @name dxRadioButton
* @inherits CollectionWidget
* @hidden
*/
const RadioButton = Editor.inherit({

    _supportedKeys: function() {
        const click = function(e) {
            e.preventDefault();
            this._clickAction({ event: e });
        };
        return extend(this.callBase(), {
            space: click
        });
    },

    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            hoverStateEnabled: true,
            activeStateEnabled: true,
            value: false
        });
    },

    _canValueBeChangedByClick: function() {
        return true;
    },

    _defaultOptionsRules: function() {
        return this.callBase().concat([
            {
                device: function() {
                    return devices.real().deviceType === 'desktop' && !devices.isSimulator();
                },
                options: {
                    focusStateEnabled: true
                }
            }
        ]);
    },

    _init: function() {
        this.callBase();

        this.$element().addClass(RADIO_BUTTON_CLASS);
    },

    _initMarkup: function() {
        this.callBase();

        this._renderIcon();
        this._renderCheckedState(this.option('value'));
        this._renderClick();
        this.setAria('role', 'radio');
    },

    _updateFocusState: function(e, value) {
        this.callBase.apply(this, arguments);
        this._renderInkWave(this._$icon, e, value, 0);
    },

    _toggleActiveState: function($element, value, e) {
        this.callBase.apply(this, arguments);
        this._renderInkWave(this._$icon, e, value, 1);
    },

    _renderIcon: function() {
        this._$icon = $('<div>').addClass(RADIO_BUTTON_ICON_CLASS);

        $('<div>').addClass(RADIO_BUTTON_ICON_DOT_CLASS).appendTo(this._$icon);
        this.$element().append(this._$icon);
    },

    _renderCheckedState: function(checked) {
        this.$element()
            .toggleClass(RADIO_BUTTON_CHECKED_CLASS, checked)
            .find('.' + RADIO_BUTTON_ICON_CLASS)
            .toggleClass(RADIO_BUTTON_ICON_CHECKED_CLASS, checked);
        this.setAria('checked', checked);
    },

    _renderClick: function() {
        const eventName = addNamespace(clickEventName, this.NAME);

        this._clickAction = this._createAction((function(args) {
            this._clickHandler(args.event);
        }).bind(this));


        eventsEngine.off(this.$element(), eventName);
        eventsEngine.on(this.$element(), eventName, (function(e) {
            this._clickAction({ event: e });
        }).bind(this));
    },

    _clickHandler: function(e) {
        this._saveValueChangeEvent(e);
        this.option('value', true);
    },

    _optionChanged: function(args) {
        switch(args.name) {
            case 'value':
                this._renderCheckedState(args.value);
                this.callBase(args);
                break;
            default:
                this.callBase(args);
        }
    }
});

registerComponent('dxRadioButton', RadioButton);

export default RadioButton;
