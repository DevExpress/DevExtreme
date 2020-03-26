const $ = require('../../core/renderer');
const extend = require('../../core/utils/extend').extend;
const Widget = require('../widget/ui.widget');
const Button = require('../button');

const CALENDAR_NAVIGATOR_CLASS = 'dx-calendar-navigator';
const CALENDAR_NAVIGATOR_PREVIOUS_MONTH_CLASS = 'dx-calendar-navigator-previous-month';
const CALENDAR_NAVIGATOR_NEXT_MONTH_CLASS = 'dx-calendar-navigator-next-month';
const CALENDAR_NAVIGATOR_PREVIOUS_VIEW_CLASS = 'dx-calendar-navigator-previous-view';
const CALENDAR_NAVIGATOR_NEXT_VIEW_CLASS = 'dx-calendar-navigator-next-view';
const CALENDAR_NAVIGATOR_DISABLED_LINK_CLASS = 'dx-calendar-disabled-navigator-link';
const CALENDAR_NAVIGATOR_CAPTION_BUTTON_CLASS = 'dx-calendar-caption-button';

const Navigator = Widget.inherit({

    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            onClick: null,
            onCaptionClick: null,
            text: ''
        });
    },

    _init: function() {
        this.callBase();

        this._initActions();
    },

    _initActions: function() {
        this._clickAction = this._createActionByOption('onClick');
        this._captionClickAction = this._createActionByOption('onCaptionClick');
    },

    _initMarkup: function() {
        this.callBase();

        this.$element().addClass(CALENDAR_NAVIGATOR_CLASS);

        this._renderButtons();

        this._renderCaption();
    },

    _renderButtons: function() {
        const that = this;
        const direction = this.option('rtlEnabled') ? -1 : 1;

        this._prevButton = this._createComponent($('<a>'),
            Button, {
                focusStateEnabled: false,
                icon: 'chevronleft',
                onClick: function(e) { that._clickAction({ direction: -direction, event: e }); },
                integrationOptions: {}
            });

        const $prevButton = this._prevButton.$element()
            .addClass(CALENDAR_NAVIGATOR_PREVIOUS_VIEW_CLASS)
            .addClass(CALENDAR_NAVIGATOR_PREVIOUS_MONTH_CLASS);

        this._nextButton = this._createComponent($('<a>'),
            Button, {
                focusStateEnabled: false,
                icon: 'chevronright',
                onClick: function(e) { that._clickAction({ direction: direction, event: e }); },
                integrationOptions: {}
            });

        const $nextButton = this._nextButton.$element()
            .addClass(CALENDAR_NAVIGATOR_NEXT_VIEW_CLASS)
            .addClass(CALENDAR_NAVIGATOR_NEXT_MONTH_CLASS);

        this._caption = this._createComponent($('<a>').addClass(CALENDAR_NAVIGATOR_CAPTION_BUTTON_CLASS),
            Button, {
                focusStateEnabled: false,
                onClick: function(e) { that._captionClickAction({ event: e }); },
                integrationOptions: {}
            });

        const $caption = this._caption.$element();

        this.$element().append($prevButton, $caption, $nextButton);
    },

    _renderCaption: function() {
        this._caption.option('text', this.option('text'));
    },

    toggleButton: function(buttonPrefix, value) {
        const buttonName = '_' + buttonPrefix + 'Button';
        const button = this[buttonName];

        if(button) {
            button.option('disabled', value);
            button.$element().toggleClass(CALENDAR_NAVIGATOR_DISABLED_LINK_CLASS, value);
        }
    },

    _optionChanged: function(args) {
        switch(args.name) {
            case 'text':
                this._renderCaption();
                break;
            default:
                this.callBase(args);
        }
    }
});

module.exports = Navigator;
