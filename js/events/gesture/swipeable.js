const swipeEvents = require('../swipe');
const eventsEngine = require('../../events/core/events_engine');
const DOMComponent = require('../../core/dom_component');
const each = require('../../core/utils/iterator').each;
const eventUtils = require('../utils');
const extend = require('../../core/utils/extend').extend;
const publicComponentUtils = require('../../core/utils/public_component');

const DX_SWIPEABLE = 'dxSwipeable';
const SWIPEABLE_CLASS = 'dx-swipeable';

const ACTION_TO_EVENT_MAP = {
    'onStart': swipeEvents.start,
    'onUpdated': swipeEvents.swipe,
    'onEnd': swipeEvents.end,
    'onCancel': 'dxswipecancel'
};


const Swipeable = DOMComponent.inherit({

    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            elastic: true,
            immediate: false,
            direction: 'horizontal',
            itemSizeFunc: null,
            onStart: null,
            onUpdated: null,
            onEnd: null,
            onCancel: null
        });
    },

    _render: function() {
        this.callBase();

        this.$element().addClass(SWIPEABLE_CLASS);
        this._attachEventHandlers();
    },

    _attachEventHandlers: function() {
        this._detachEventHandlers();

        if(this.option('disabled')) {
            return;
        }

        const NAME = this.NAME;

        this._createEventData();

        each(ACTION_TO_EVENT_MAP, (function(actionName, eventName) {
            const action = this._createActionByOption(actionName, { context: this });

            eventName = eventUtils.addNamespace(eventName, NAME);

            eventsEngine.on(this.$element(), eventName, this._eventData, function(e) {
                return action({ event: e });
            });
        }).bind(this));
    },

    _createEventData: function() {
        this._eventData = {
            elastic: this.option('elastic'),
            itemSizeFunc: this.option('itemSizeFunc'),
            direction: this.option('direction'),
            immediate: this.option('immediate')
        };
    },

    _detachEventHandlers: function() {
        eventsEngine.off(this.$element(), '.' + DX_SWIPEABLE);
    },

    _optionChanged: function(args) {
        switch(args.name) {
            case 'disabled':
            case 'onStart':
            case 'onUpdated':
            case 'onEnd':
            case 'onCancel':
            case 'elastic':
            case 'immediate':
            case 'itemSizeFunc':
            case 'direction':
                this._detachEventHandlers();
                this._attachEventHandlers();
                break;
            case 'rtlEnabled':
                break;
            default:
                this.callBase(args);
        }

    },

    _useTemplates: function() {
        return false;
    },
});

publicComponentUtils.name(Swipeable, DX_SWIPEABLE);

module.exports = Swipeable;
