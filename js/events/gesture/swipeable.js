import {
    start as swipeEventStart,
    swipe as swipeEventSwipe,
    end as swipeEventEnd
} from '../swipe';
import eventsEngine from '../../events/core/events_engine';
import DOMComponent from '../../core/dom_component';
import { each } from '../../core/utils/iterator';
import { addNamespace } from '../utils/index';
import { extend } from '../../core/utils/extend';
import { name } from '../../core/utils/public_component';

const DX_SWIPEABLE = 'dxSwipeable';
const SWIPEABLE_CLASS = 'dx-swipeable';

const ACTION_TO_EVENT_MAP = {
    'onStart': swipeEventStart,
    'onUpdated': swipeEventSwipe,
    'onEnd': swipeEventEnd,
    'onCancel': 'dxswipecancel'
};

const IMMEDIATE_TIMEOUT = 180;

const Swipeable = DOMComponent.inherit({

    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            elastic: true,
            immediate: false,
            immediateTimeout: IMMEDIATE_TIMEOUT,
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

            eventName = addNamespace(eventName, NAME);

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
            immediate: this.option('immediate'),
            immediateTimeout: this.option('immediateTimeout'),
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

name(Swipeable, DX_SWIPEABLE);

export default Swipeable;
