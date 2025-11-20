import eventsEngine from '@js/common/core/events/core/events_engine';
import pointerEvents from '@js/common/core/events/pointer';
import { addNamespace } from '@js/common/core/events/utils/index';
import domAdapter from '@js/core/dom_adapter';
import Guid from '@js/core/guid';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { getWindow } from '@js/core/utils/window';
import type { OptionChanged } from '@ts/core/widget/types';
import type { WidgetProperties } from '@ts/core/widget/widget';
import Widget from '@ts/core/widget/widget';

type Dimension = 'height' | 'width';

const window = getWindow();

const SPLITTER_CLASS = 'dx-splitter-bar';
const SPLITTER_WRAPPER_CLASS = 'dx-splitter-wrapper';
const SPLITTER_INACTIVE_CLASS = 'dx-splitter-inactive';
const SPLITTER_BORDER_CLASS = 'dx-splitter-border';
const SPLITTER_INITIAL_STATE_CLASS = 'dx-splitter-initial';

const STATE_DISABLED_CLASS = 'dx-state-disabled';

const SPLITTER_MODULE_NAMESPACE = 'dxSplitterResizing';

export interface ApplyPanelSizeEvent {
  leftPanelWidth: string | number;
  rightPanelWidth: string | number;
}

export interface ActiveStateChangedEvent {
  isActive: boolean;
}

interface SplitterControlActions {
  onApplyPanelSize?: (e: ApplyPanelSizeEvent) => void;
  onActiveStateChanged?: (e: ActiveStateChangedEvent) => void;
}

interface SplitterControlOptions extends WidgetProperties {
  initialLeftPanelWidth?: number;
  container: dxElementWrapper;
  leftElement: dxElementWrapper;
  rightElement: dxElementWrapper;
  onApplyPanelSize?: (e: ApplyPanelSizeEvent) => void;
  onActiveStateChanged?: (e: ActiveStateChangedEvent) => void;
}

export default class SplitterControl extends Widget<SplitterControlOptions> {
  SPLITTER_POINTER_DOWN_EVENT_NAME?: string;

  SPLITTER_POINTER_MOVE_EVENT_NAME?: string;

  SPLITTER_POINTER_UP_EVENT_NAME?: string;

  _$container!: dxElementWrapper;

  _$leftElement!: dxElementWrapper;

  _$rightElement!: dxElementWrapper;

  _$splitterBorder!: dxElementWrapper;

  _$splitter!: dxElementWrapper;

  _actions!: SplitterControlActions;

  _containerWidth!: number;

  _offsetX!: number;

  _isSplitterActive!: boolean;

  _leftPanelPercentageWidth?: number | null;

  _isSplitterCalculationDisabled?: boolean;

  _init(): void {
    super._init();
    const eventGuid = new Guid().toString();
    this.SPLITTER_POINTER_DOWN_EVENT_NAME = addNamespace(
      pointerEvents.down,
      SPLITTER_MODULE_NAMESPACE + eventGuid,
    );
    this.SPLITTER_POINTER_MOVE_EVENT_NAME = addNamespace(
      pointerEvents.move,
      SPLITTER_MODULE_NAMESPACE + eventGuid,
    );
    this.SPLITTER_POINTER_UP_EVENT_NAME = addNamespace(
      pointerEvents.up,
      SPLITTER_MODULE_NAMESPACE + eventGuid,
    );
  }

  _initMarkup(): void {
    super._initMarkup();

    this._initActions();

    const { container, leftElement, rightElement } = this.option();

    this._$container = container;
    this._$leftElement = leftElement;
    this._$rightElement = rightElement;

    this.$element()
      .addClass(SPLITTER_WRAPPER_CLASS)
      .addClass(SPLITTER_INITIAL_STATE_CLASS);
    this._$splitterBorder = $('<div>')
      .addClass(SPLITTER_BORDER_CLASS)
      .appendTo(this.$element());
    this._$splitter = $('<div>')
      .addClass(SPLITTER_CLASS)
      .addClass(SPLITTER_INACTIVE_CLASS)
      .appendTo(this._$splitterBorder);
  }

  _initActions(): void {
    this._actions = {
      onApplyPanelSize: this._createActionByOption('onApplyPanelSize'),
      onActiveStateChanged: this._createActionByOption('onActiveStateChanged'),
    };
  }

  _render(): void {
    super._render();

    this._detachEventHandlers();
    this._attachEventHandlers();
  }

  _clean(): void {
    this._detachEventHandlers();
    super._clean();
  }

  _attachEventHandlers(): void {
    const document = domAdapter.getDocument();
    eventsEngine.on(
      this._$splitterBorder,
      this.SPLITTER_POINTER_DOWN_EVENT_NAME,
      this._onMouseDownHandler.bind(this),
    );
    eventsEngine.on(
      document,
      this.SPLITTER_POINTER_MOVE_EVENT_NAME,
      this._onMouseMoveHandler.bind(this),
    );
    eventsEngine.on(
      document,
      this.SPLITTER_POINTER_UP_EVENT_NAME,
      this._onMouseUpHandler.bind(this),
    );
  }

  _detachEventHandlers(): void {
    const document = domAdapter.getDocument();
    eventsEngine.off(this._$splitterBorder, this.SPLITTER_POINTER_DOWN_EVENT_NAME);
    eventsEngine.off(document, this.SPLITTER_POINTER_MOVE_EVENT_NAME);
    eventsEngine.off(document, this.SPLITTER_POINTER_UP_EVENT_NAME);
  }

  _dimensionChanged(dimension?: Dimension): void {
    if (!dimension || dimension !== 'height') {
      this._containerWidth = this._$container.get(0).clientWidth;
      this._setSplitterPositionLeft({ needUpdatePanels: true, usePercentagePanelsWidth: true });
    }
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  _onMouseDownHandler(e): void {
    e.preventDefault();
    // @ts-expect-error ts-error
    // eslint-disable-next-line no-unsafe-optional-chaining
    this._offsetX = e.pageX - this._$splitterBorder.offset()?.left <= this._getSplitterBorderWidth()
      // @ts-expect-error ts-error
      // eslint-disable-next-line no-unsafe-optional-chaining
      ? e.pageX - this._$splitterBorder.offset()?.left
      : 0;
    this._containerWidth = this._$container.get(0).clientWidth;

    this.$element().removeClass(SPLITTER_INITIAL_STATE_CLASS);
    this._toggleActive(true);

    this._setSplitterPositionLeft({ needUpdatePanels: true });
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  _onMouseMoveHandler(e): void {
    if (!this._isSplitterActive) {
      return;
    }
    this._setSplitterPositionLeft({
      splitterPositionLeft: this._getNewSplitterPositionLeft(e),
      needUpdatePanels: true,
    });
  }

  _onMouseUpHandler(): void {
    if (!this._isSplitterActive) {
      return;
    }
    this._leftPanelPercentageWidth = null;
    this._toggleActive(false);
    this._setSplitterPositionLeft({ needUpdatePanels: true, usePercentagePanelsWidth: true });
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  _getNewSplitterPositionLeft(e): number {
    let newSplitterPositionLeft = e.pageX - this._getContainerLeftOffset() - this._offsetX;
    newSplitterPositionLeft = Math.max(0 - this._getSplitterOffset(), newSplitterPositionLeft);
    newSplitterPositionLeft = Math.min(
      this._containerWidth - this._getSplitterOffset() - this._getSplitterWidth(),
      newSplitterPositionLeft,
    );
    return newSplitterPositionLeft;
  }

  _getContainerLeftOffset(): number {
    let offsetLeft = this._$container.offset()?.left as number;

    if (window) {
      const style = window.getComputedStyle(this._$container.get(0));
      const paddingLeft = parseFloat(style.paddingLeft) || 0;
      const borderLeft = parseFloat(style.borderLeftWidth) || 0;
      offsetLeft += paddingLeft + borderLeft;
    }

    return offsetLeft;
  }

  _getSplitterOffset(): number {
    return (this._getSplitterBorderWidth() - this._getSplitterWidth()) / 2;
  }

  _getSplitterWidth(): number {
    return this._$splitter.get(0).clientWidth;
  }

  _getSplitterBorderWidth(): number {
    return this._$splitterBorder.get(0).clientWidth;
  }

  _getLeftPanelWidth(): number {
    return this._$leftElement.get(0).clientWidth;
  }

  getSplitterBorderElement(): dxElementWrapper {
    return this._$splitterBorder;
  }

  _toggleActive(isActive: boolean): void {
    this.$element().toggleClass(SPLITTER_INACTIVE_CLASS, !isActive);
    this._$splitter.toggleClass(SPLITTER_INACTIVE_CLASS, !isActive);
    this._isSplitterActive = isActive;
    this._actions.onActiveStateChanged?.({ isActive });
  }

  toggleDisabled(isDisabled: boolean): void {
    this.$element().toggleClass(STATE_DISABLED_CLASS, isDisabled);
    this._$splitter.toggleClass(STATE_DISABLED_CLASS, isDisabled);
  }

  isSplitterMoved(): boolean {
    return !this.$element().hasClass(SPLITTER_INITIAL_STATE_CLASS);
  }

  disableSplitterCalculation(value: boolean): void {
    this._isSplitterCalculationDisabled = value;
  }

  _setSplitterPositionLeft({
    splitterPositionLeft = null,
    needUpdatePanels = false,
    usePercentagePanelsWidth = false,
  }: {
    splitterPositionLeft?: number | string | null;
    needUpdatePanels?: boolean;
    usePercentagePanelsWidth?: boolean;
  } = {}): void {
    // eslint-disable-next-line no-param-reassign
    splitterPositionLeft = splitterPositionLeft
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      || this._getLeftPanelWidth() - this._getSplitterOffset();
    // @ts-expect-error ts-error
    const leftPanelWidth = splitterPositionLeft + this._getSplitterOffset();
    const rightPanelWidth = this._containerWidth - leftPanelWidth;

    if (!this._isSplitterCalculationDisabled) {
      this.$element().css('left', splitterPositionLeft);
    }

    this._leftPanelPercentageWidth = this._leftPanelPercentageWidth
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      || this._convertToPercentage(leftPanelWidth);
    const rightPanelPercentageWidth = this._convertToPercentage(
      this._containerWidth - this._convertToPixels(this._leftPanelPercentageWidth),
    );

    if (!needUpdatePanels) {
      return;
    }

    this._actions.onApplyPanelSize?.({
      leftPanelWidth: usePercentagePanelsWidth ? `${this._leftPanelPercentageWidth}%` : leftPanelWidth,
      rightPanelWidth: usePercentagePanelsWidth ? `${rightPanelPercentageWidth}%` : rightPanelWidth,
    });
  }

  _optionChanged(args: OptionChanged<SplitterControlOptions>): void {
    const { name, value } = args;

    switch (name) {
      case 'initialLeftPanelWidth':
        this._leftPanelPercentageWidth = this._convertToPercentage(value as number);
        this._dimensionChanged();
        break;
      case 'leftElement':
        this.repaint();
        break;
      case 'onActiveStateChanged':
      case 'onApplyPanelSize':
        this._actions[name] = this._createActionByOption(name);
        break;
      default:
        super._optionChanged(args);
    }
  }

  _convertToPercentage(pixelWidth: number): number {
    // eslint-disable-next-line @stylistic/no-mixed-operators
    return pixelWidth / this._$container.get(0).clientWidth * 100;
  }

  _convertToPixels(percentageWidth: number): number {
    // eslint-disable-next-line @stylistic/no-mixed-operators
    return percentageWidth / 100 * this._$container.get(0).clientWidth;
  }
}
