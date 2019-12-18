var swipeEvents = require('../swipe'),
    eventsEngine = require('../../events/core/events_engine'),
    DOMComponent = require('../../core/dom_component'),
    each = require('../../core/utils/iterator').each,
    eventUtils = require('../utils'),
    extend = require('../../core/utils/extend').extend,
    publicComponentUtils = require('../../core/utils/public_component');

var DX_SWIPEABLE = 'dxSwipeable',
    SWIPEABLE_CLASS = 'dx-swipeable',

    ACTION_TO_EVENT_MAP = {
        'onStart': swipeEvents.start,
        'onUpdated': swipeEvents.swipe,
        'onEnd': swipeEvents.end,
        'onCancel': 'dxswipecancel'
    };


var Swipeable = DOMComponent.inherit({

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

        var NAME = this.NAME;

        this._createEventData();

        each(ACTION_TO_EVENT_MAP, (function(actionName, eventName) {
            var action = this._createActionByOption(actionName, { context: this });

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

    }

});

publicComponentUtils.name(Swipeable, DX_SWIPEABLE);

module.exports = Swipeable;
