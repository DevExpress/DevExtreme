import Class from '../../core/class';
import { noop, ensureDefined } from '../../core/utils/common';
import { contains } from '../../core/utils/dom';
import devices from '../../core/devices';
import { isMouseEvent } from '../utils/index';
import pointerEvents from '../pointer';
import Emitter from './emitter';
import registerEmitter from './emitter_registrator';

const ACTIVE_EVENT_NAME = 'dxactive';
const INACTIVE_EVENT_NAME = 'dxinactive';

const ACTIVE_TIMEOUT = 30;
const INACTIVE_TIMEOUT = 400;


const FeedbackEvent = Class.inherit({

    ctor: function(timeout, fire) {
        this._timeout = timeout;
        this._fire = fire;
    },

    start: function() {
        const that = this;

        this._schedule(function() {
            that.force();
        });
    },

    _schedule: function(fn) {
        this.stop();
        this._timer = setTimeout(fn, this._timeout);
    },

    stop: function() {
        clearTimeout(this._timer);
    },

    force: function() {
        if(this._fired) {
            return;
        }

        this.stop();
        this._fire();
        this._fired = true;
    },

    fired: function() {
        return this._fired;
    }

});


let activeFeedback;

const FeedbackEmitter = Emitter.inherit({

    ctor: function() {
        this.callBase.apply(this, arguments);

        this._active = new FeedbackEvent(0, noop);
        this._inactive = new FeedbackEvent(0, noop);
    },

    configure: function(data, eventName) {
        switch(eventName) {
            case ACTIVE_EVENT_NAME:
                data.activeTimeout = data.timeout;
                break;
            case INACTIVE_EVENT_NAME:
                data.inactiveTimeout = data.timeout;
                break;
        }

        this.callBase(data);
    },

    start: function(e) {
        if(activeFeedback) {
            const activeChildExists = contains(this.getElement().get(0), activeFeedback.getElement().get(0));
            const childJustActivated = !activeFeedback._active.fired();

            if(activeChildExists && childJustActivated) {
                this._cancel();
                return;
            }

            activeFeedback._inactive.force();
        }
        activeFeedback = this;

        this._initEvents(e);
        this._active.start();
    },

    _initEvents: function(e) {
        const that = this;

        const eventTarget = this._getEmitterTarget(e);

        const mouseEvent = isMouseEvent(e);
        const isSimulator = devices.isSimulator();
        const deferFeedback = isSimulator || !mouseEvent;

        const activeTimeout = ensureDefined(this.activeTimeout, ACTIVE_TIMEOUT);
        const inactiveTimeout = ensureDefined(this.inactiveTimeout, INACTIVE_TIMEOUT);

        this._active = new FeedbackEvent(deferFeedback ? activeTimeout : 0, function() {
            that._fireEvent(ACTIVE_EVENT_NAME, e, { target: eventTarget });
        });
        this._inactive = new FeedbackEvent(deferFeedback ? inactiveTimeout : 0, function() {
            that._fireEvent(INACTIVE_EVENT_NAME, e, { target: eventTarget });
            activeFeedback = null;
        });
    },

    cancel: function(e) {
        this.end(e);
    },

    end: function(e) {
        const skipTimers = e.type !== pointerEvents.up;

        if(skipTimers) {
            this._active.stop();
        } else {
            this._active.force();
        }

        this._inactive.start();

        if(skipTimers) {
            this._inactive.force();
        }
    },

    dispose: function() {
        this._active.stop();
        this._inactive.stop();

        if(activeFeedback === this) {
            activeFeedback = null;
        }

        this.callBase();
    },

    lockInactive: function() {
        this._active.force();
        this._inactive.stop();
        activeFeedback = null;
        this._cancel();

        return this._inactive.force.bind(this._inactive);
    }

});
FeedbackEmitter.lock = function(deferred) {
    const lockInactive = activeFeedback ? activeFeedback.lockInactive() : noop;

    deferred.done(lockInactive);
};


registerEmitter({
    emitter: FeedbackEmitter,
    events: [
        ACTIVE_EVENT_NAME,
        INACTIVE_EVENT_NAME
    ]
});

export const lock = FeedbackEmitter.lock;
export {
    ACTIVE_EVENT_NAME as active,
    INACTIVE_EVENT_NAME as inactive
};
