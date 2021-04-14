import $ from '../core/renderer';
import eventsEngine from '../events/core/events_engine';
import { touch } from '../core/utils/support';
import devices from '../core/devices';
import Class from '../core/class';
import registerEvent from './core/event_registrator';
import { addNamespace, fireEvent, isMouseEvent } from './utils/index';
import holdEvent from './hold';

const CONTEXTMENU_NAMESPACE = 'dxContexMenu';

const CONTEXTMENU_NAMESPACED_EVENT_NAME = addNamespace('contextmenu', CONTEXTMENU_NAMESPACE);
const HOLD_NAMESPACED_EVENT_NAME = addNamespace(holdEvent.name, CONTEXTMENU_NAMESPACE);

const CONTEXTMENU_EVENT_NAME = 'dxcontextmenu';


const ContextMenu = Class.inherit({

    setup: function(element) {
        const $element = $(element);

        eventsEngine.on($element, CONTEXTMENU_NAMESPACED_EVENT_NAME, this._contextMenuHandler.bind(this));

        if(touch || devices.isSimulator()) {
            eventsEngine.on($element, HOLD_NAMESPACED_EVENT_NAME, this._holdHandler.bind(this));
            eventsEngine.on($element, CONTEXTMENU_NAMESPACED_EVENT_NAME, (e) => {
                e.preventDefault();
            });
        }
    },

    _holdHandler: function(e) {
        if(isMouseEvent(e) && !devices.isSimulator()) {
            return;
        }

        this._fireContextMenu(e);
    },

    _contextMenuHandler: function(e) {
        this._fireContextMenu(e);
    },

    _fireContextMenu: function(e) {
        return fireEvent({
            type: CONTEXTMENU_EVENT_NAME,
            originalEvent: e
        });
    },

    teardown: function(element) {
        eventsEngine.off(element, '.' + CONTEXTMENU_NAMESPACE);
    }

});

/**
  * @name UI Events.dxcontextmenu
  * @type eventType
  * @type_function_param1 event:event
  * @module events/contextmenu
*/

registerEvent(CONTEXTMENU_EVENT_NAME, new ContextMenu());

export const name = CONTEXTMENU_EVENT_NAME;
