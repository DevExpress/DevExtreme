import eventsEngine from '@js/common/core/events/core/events_engine';
import type { SwipeEndEvent, SwipeStartEvent, SwipeUpdateEvent } from '@js/common/core/events/swipe';
import {
  end as swipeEventEnd,
  start as swipeEventStart,
  swipe as swipeEventSwipe,
} from '@js/common/core/events/swipe';
import { addNamespace } from '@js/common/core/events/utils/index';
import { each } from '@js/core/utils/iterator';
import { name } from '@js/core/utils/public_component';
import type { NativeEventInfo } from '@js/events';
import type { DOMComponentProperties } from '@ts/core/widget/dom_component';
import DOMComponent from '@ts/core/widget/dom_component';
import type { OptionChanged } from '@ts/core/widget/types';

const DX_SWIPEABLE = 'dxSwipeable';
const SWIPEABLE_CLASS = 'dx-swipeable';

const ACTION_TO_EVENT_MAP = {
  onStart: swipeEventStart,
  onUpdated: swipeEventSwipe,
  onEnd: swipeEventEnd,
  onCancel: 'dxswipecancel',
};

const IMMEDIATE_TIMEOUT = 180;

export interface SwipeableProperties extends DOMComponentProperties<Swipeable> {
  elastic?: boolean;
  immediate?: boolean;
  immediateTimeout?: number;
  direction?: string;
  itemSizeFunc?: (() => number) | null;
  onStart?: ((e: Required<NativeEventInfo<Swipeable, SwipeStartEvent>>) => void) | null;
  onUpdated?: ((e: Required<NativeEventInfo<Swipeable, SwipeUpdateEvent>>) => void) | null;
  onEnd?: ((e: Required<NativeEventInfo<Swipeable, SwipeEndEvent>>) => void) | null;
  onCancel?: ((e: NativeEventInfo<Swipeable>) => void) | null;
}

class Swipeable extends DOMComponent<Swipeable, SwipeableProperties> {
  _eventData?: Record<string, unknown>;

  _getDefaultOptions(): SwipeableProperties {
    return {
      ...super._getDefaultOptions(),
      elastic: true,
      immediate: false,
      immediateTimeout: IMMEDIATE_TIMEOUT,
      direction: 'horizontal',
      itemSizeFunc: null,
      onStart: null,
      onUpdated: null,
      onEnd: null,
      onCancel: null,
    };
  }

  _render(): void {
    super._render();

    this.$element().addClass(SWIPEABLE_CLASS);
    this._attachEventHandlers();
  }

  _attachEventHandlers(): void {
    this._detachEventHandlers();

    if (this.option('disabled')) {
      return;
    }

    const { NAME } = this;

    this._createEventData();

    each(ACTION_TO_EVENT_MAP, (
      actionName: keyof SwipeableProperties,
      eventName: SwipeableProperties[keyof SwipeableProperties],
    ) => {
      // @ts-expect-error ts-error
      const action = this._createActionByOption(actionName, { context: this });
      // @ts-expect-error ts-error
      const event = addNamespace(eventName, NAME);
      eventsEngine.on(
        this.$element(),
        event,
        this._eventData,
        (e) => action({ event: e }),
      );
    });
  }

  _createEventData(): void {
    this._eventData = {
      elastic: this.option('elastic'),
      itemSizeFunc: this.option('itemSizeFunc'),
      direction: this.option('direction'),
      immediate: this.option('immediate'),
      immediateTimeout: this.option('immediateTimeout'),
    };
  }

  _detachEventHandlers(): void {
    eventsEngine.off(this.$element(), `.${DX_SWIPEABLE}`);
  }

  _optionChanged(args: OptionChanged<SwipeableProperties>): void {
    switch (args.name) {
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
        super._optionChanged(args);
    }
  }

  // eslint-disable-next-line class-methods-use-this
  _useTemplates(): boolean {
    return false;
  }
}

name(Swipeable, DX_SWIPEABLE);

export default Swipeable;
