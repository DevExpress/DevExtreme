const $ = require('../core/renderer');
const eventsEngine = require('../events/core/events_engine');
const support = require('../core/utils/support');
const devices = require('../core/devices');
const Class = require('../core/class');
const registerEvent = require('./core/event_registrator');
const eventUtils = require('./utils');
const holdEvent = require('./hold');

const CONTEXTMENU_NAMESPACE = 'dxContexMenu';

const CONTEXTMENU_NAMESPACED_EVENT_NAME = eventUtils.addNamespace('contextmenu', CONTEXTMENU_NAMESPACE);
const HOLD_NAMESPACED_EVENT_NAME = eventUtils.addNamespace(holdEvent.name, CONTEXTMENU_NAMESPACE);

const CONTEXTMENU_EVENT_NAME = 'dxcontextmenu';


const ContextMenu = Class.inherit({

    setup: function(element) {
        const $element = $(element);

        eventsEngine.on($element, CONTEXTMENU_NAMESPACED_EVENT_NAME, this._contextMenuHandler.bind(this));

        if(support.touch || devices.isSimulator()) {
            eventsEngine.on($element, HOLD_NAMESPACED_EVENT_NAME, this._holdHandler.bind(this));
        }
    },

    _holdHandler: function(e) {
        if(eventUtils.isMouseEvent(e) && !devices.isSimulator()) {
            return;
        }

        this._fireContextMenu(e);
    },

    _contextMenuHandler: function(e) {
        if(touch || devices.isSimulator()) {
            e.preventDefault();
        }
        this._fireContextMenu(e);
    },

    _fireContextMenu: function(e) {
        return eventUtils.fireEvent({
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


exports.name = CONTEXTMENU_EVENT_NAME;
