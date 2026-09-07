import registerEvent from '@js/common/core/events/core/event_registrator';
import eventsEngine from '@js/common/core/events/core/events_engine';
import holdEvent from '@js/common/core/events/hold';
import { addNamespace, fireEvent, isMouseEvent } from '@js/common/core/events/utils/index';
import $ from '@js/core/renderer';
import devices from '@ts/core/m_devices';
import supportUtils from '@ts/core/utils/m_support';
import type { EmitterEvent } from '@ts/events/core/emitter';

const CONTEXTMENU_NAMESPACE = 'dxContexMenu';

const CONTEXTMENU_NAMESPACED_EVENT_NAME = addNamespace('contextmenu', CONTEXTMENU_NAMESPACE);
const HOLD_NAMESPACED_EVENT_NAME = addNamespace(holdEvent.name, CONTEXTMENU_NAMESPACE);

const CONTEXTMENU_EVENT_NAME = 'dxcontextmenu';

class ContextMenu {
  setup(element: Element): void {
    const $element = $(element);

    eventsEngine.on(
      $element,
      CONTEXTMENU_NAMESPACED_EVENT_NAME,
      this._contextMenuHandler.bind(this),
    );

    if (supportUtils.touch || devices.isSimulator()) {
      eventsEngine.on($element, HOLD_NAMESPACED_EVENT_NAME, this._holdHandler.bind(this));
    }
  }

  _holdHandler(e: EmitterEvent): void {
    if (isMouseEvent(e) && !devices.isSimulator()) {
      return;
    }

    this._fireContextMenu(e);
  }

  _contextMenuHandler(e: EmitterEvent): void {
    this._fireContextMenu(e);
  }

  _fireContextMenu(e: EmitterEvent): EmitterEvent {
    const event: EmitterEvent = fireEvent({
      type: CONTEXTMENU_EVENT_NAME,
      originalEvent: e,
    });

    return event;
  }

  teardown(element: Element): void {
    eventsEngine.off(element, `.${CONTEXTMENU_NAMESPACE}`);
  }
}

registerEvent(CONTEXTMENU_EVENT_NAME, new ContextMenu());

export const name = CONTEXTMENU_EVENT_NAME;
