var $ = require('../../core/renderer'),
    eventsEngine = require('../../events/core/events_engine'),
    devices = require('../../core/devices'),
    extend = require('../../core/utils/extend').extend,
    inkRipple = require('../widget/utils.ink_ripple'),
    registerComponent = require('../../core/component_registrator'),
    Editor = require('../editor/editor'),
    eventUtils = require('../../events/utils'),
    clickEvent = require('../../events/click');

var RADIO_BUTTON_CLASS = 'dx-radiobutton',
    RADIO_BUTTON_ICON_CLASS = 'dx-radiobutton-icon',
    RADIO_BUTTON_ICON_DOT_CLASS = 'dx-radiobutton-icon-dot',
    RADIO_BUTTON_CHECKED_CLASS = 'dx-radiobutton-checked',
    RADIO_BUTTON_ICON_CHECKED_CLASS = 'dx-radiobutton-icon-checked';

/**
* @name dxRadioButton
* @inherits CollectionWidget
* @hidden
*/
var RadioButton = Editor.inherit({

    _supportedKeys: function() {
        var click = function(e) {
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
            value: false,
            useInkRipple: false
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
        this.option('useInkRipple') && this._renderInkRipple();
        this._renderCheckedState(this.option('value'));
        this._renderClick();
        this.setAria('role', 'radio');
    },

    _renderInkRipple: function() {
        this._inkRipple = inkRipple.render({
            waveSizeCoefficient: 3.3,
            useHoldAnimation: false,
            wavesNumber: 2,
            isCentered: true
        });
    },

    _renderInkWave: function(element, dxEvent, doRender, waveIndex) {
        if(!this._inkRipple) {
            return;
        }

        var config = {
            element: element,
            event: dxEvent,
            wave: waveIndex
        };

        if(doRender) {
            this._inkRipple.showWave(config);
        } else {
            this._inkRipple.hideWave(config);
        }
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
        var eventName = eventUtils.addNamespace(clickEvent.name, this.NAME);

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
            case 'useInkRipple':
                this._invalidate();
                break;
            case 'value':
                this._renderCheckedState(args.value);
                this.callBase(args);
                break;
            default:
                this.callBase(args);
        }
    },

    _clean: function() {
        delete this._inkRipple;
        this.callBase();
    }
});

registerComponent('dxRadioButton', RadioButton);

module.exports = RadioButton;
