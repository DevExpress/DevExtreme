import { lock } from '@js/common/core/events/core/emitter.feedback';
import eventsEngine from '@js/common/core/events/core/events_engine';
import holdEvent from '@js/common/core/events/hold';
import pointerEvents from '@js/common/core/events/pointer';
import { addNamespace } from '@js/common/core/events/utils/index';
import domAdapter from '@js/core/dom_adapter';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import type { DeferredObj } from '@js/core/utils/deferred';
import { Deferred } from '@js/core/utils/deferred';
import type { OptionChanged } from '@ts/core/widget/types';
import type { WidgetProperties } from '@ts/core/widget/widget';
import Widget from '@ts/core/widget/widget';

const SPIN_CLASS = 'dx-numberbox-spin';
const SPIN_BUTTON_CLASS = 'dx-numberbox-spin-button';

const SPIN_HOLD_DELAY = 100;

const NUMBER_BOX = 'dxNumberBox';
const POINTERUP_EVENT_NAME = addNamespace(pointerEvents.up, NUMBER_BOX);
const POINTERCANCEL_EVENT_NAME = addNamespace(pointerEvents.cancel, NUMBER_BOX);

export interface SpinButtonProperties extends WidgetProperties {
  direction?: string;

  onChange?: () => void;
}

class SpinButton extends Widget<SpinButtonProperties> {
  _feedBackDeferred?: DeferredObj<unknown>;

  _spinIcon?: dxElementWrapper;

  _holdTimer?: ReturnType<typeof setTimeout>;

  _spinChangeHandler!: (event?: Record<string, unknown>) => void;

  _getDefaultOptions(): SpinButtonProperties {
    return {
      ...super._getDefaultOptions(),
      direction: 'up',
      // @ts-expect-error ts-error
      onChange: null,
      activeStateEnabled: true,
      hoverStateEnabled: true,
    };
  }

  _initMarkup(): void {
    super._initMarkup();

    const { direction: spinDirection } = this.option();

    const direction = `${SPIN_CLASS}-${spinDirection}`;

    this.$element()
      .addClass(SPIN_BUTTON_CLASS)
      .addClass(direction);

    this._spinIcon = $('<div>').addClass(`${direction}-icon`).appendTo(this.$element());
  }

  _render(): void {
    super._render();
    // @ts-expect-error ts-error
    const eventName = addNamespace(pointerEvents.down, this.NAME);
    const $element = this.$element();

    eventsEngine.off($element, eventName);
    eventsEngine.on($element, eventName, this._spinDownHandler.bind(this));

    this._spinChangeHandler = this._createActionByOption('onChange');
  }

  _spinDownHandler(e): void {
    e.preventDefault();

    this._clearTimer();

    eventsEngine.on(this.$element(), holdEvent.name, () => {
      this._feedBackDeferred = Deferred();
      lock(this._feedBackDeferred);
      this._spinChangeHandler({ event: e });
      this._holdTimer = setInterval(this._spinChangeHandler, SPIN_HOLD_DELAY, { event: e });
    });

    const document = domAdapter.getDocument();
    eventsEngine.on(document, POINTERUP_EVENT_NAME, this._clearTimer.bind(this));
    eventsEngine.on(document, POINTERCANCEL_EVENT_NAME, this._clearTimer.bind(this));

    this._spinChangeHandler({ event: e });
  }

  _dispose(): void {
    this._clearTimer();
    super._dispose();
  }

  _clearTimer(): void {
    eventsEngine.off(this.$element(), holdEvent.name);

    const document = domAdapter.getDocument();
    eventsEngine.off(document, POINTERUP_EVENT_NAME);
    eventsEngine.off(document, POINTERCANCEL_EVENT_NAME);

    if (this._feedBackDeferred) {
      this._feedBackDeferred.resolve();
    }
    if (this._holdTimer) {
      clearInterval(this._holdTimer);
    }
  }

  _optionChanged(args: OptionChanged<SpinButtonProperties>): void {
    switch (args.name) {
      case 'onChange':
      case 'direction':
        this._invalidate();
        break;
      default:
        super._optionChanged(args);
    }
  }
}

export default SpinButton;
