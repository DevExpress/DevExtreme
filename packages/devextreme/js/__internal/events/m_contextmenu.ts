import Class from '@js/core/class';
import devices from '@js/core/devices';
import $ from '@js/core/renderer';
import { touch } from '@js/core/utils/support';
import registerEvent from '@js/events/core/event_registrator';
import eventsEngine from '@js/events/core/events_engine';
import holdEvent from '@js/events/hold';
import { addNamespace, fireEvent, isMouseEvent } from '@js/events/utils/index';

const CONTEXTMENU_NAMESPACE = 'dxContexMenu';

const CONTEXTMENU_NAMESPACED_EVENT_NAME = addNamespace('contextmenu', CONTEXTMENU_NAMESPACE);
const HOLD_NAMESPACED_EVENT_NAME = addNamespace(holdEvent.name, CONTEXTMENU_NAMESPACE);

const CONTEXTMENU_EVENT_NAME = 'dxcontextmenu';

const ContextMenu = Class.inherit({

  setup(element) {
    const $element = $(element);

    eventsEngine.on($element, CONTEXTMENU_NAMESPACED_EVENT_NAME, this._contextMenuHandler.bind(this));

    if (touch || devices.isSimulator()) {
      eventsEngine.on($element, HOLD_NAMESPACED_EVENT_NAME, this._holdHandler.bind(this));
    }
  },

  _holdHandler(e) {
    if (isMouseEvent(e) && !devices.isSimulator()) {
      return;
    }

    this._fireContextMenu(e);
  },

  _contextMenuHandler(e) {
    this._fireContextMenu(e);
  },

  _fireContextMenu(e) {
    return fireEvent({
      type: CONTEXTMENU_EVENT_NAME,
      originalEvent: e,
    });
  },

  teardown(element) {
    eventsEngine.off(element, `.${CONTEXTMENU_NAMESPACE}`);
  },

});

registerEvent(CONTEXTMENU_EVENT_NAME, new ContextMenu());

export const name = CONTEXTMENU_EVENT_NAME;
