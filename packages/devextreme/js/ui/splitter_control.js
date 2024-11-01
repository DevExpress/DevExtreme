import $ from '../core/renderer';
import Widget from './widget/ui.widget';
import domAdapter from '../core/dom_adapter';
import eventsEngine from '../common/core/events/core/events_engine';
import pointerEvents from '../common/core/events/pointer';
import { getWindow } from '../core/utils/window';
import { addNamespace } from '../common/core/events/utils/index';
import Guid from '../core/guid';

const window = getWindow();

const SPLITTER_CLASS = 'dx-splitter-bar';
const SPLITTER_WRAPPER_CLASS = 'dx-splitter-wrapper';
const SPLITTER_INACTIVE_CLASS = 'dx-splitter-inactive';
const SPLITTER_BORDER_CLASS = 'dx-splitter-border';
const SPLITTER_INITIAL_STATE_CLASS = 'dx-splitter-initial';

const STATE_DISABLED_CLASS = 'dx-state-disabled';

const SPLITTER_MODULE_NAMESPACE = 'dxSplitterResizing';

export default class SplitterControl extends Widget {
    _init() {
        super._init();
        const eventGuid = new Guid().toString();
        this.SPLITTER_POINTER_DOWN_EVENT_NAME = addNamespace(pointerEvents.down, SPLITTER_MODULE_NAMESPACE + eventGuid);
        this.SPLITTER_POINTER_MOVE_EVENT_NAME = addNamespace(pointerEvents.move, SPLITTER_MODULE_NAMESPACE + eventGuid);
        this.SPLITTER_POINTER_UP_EVENT_NAME = addNamespace(pointerEvents.up, SPLITTER_MODULE_NAMESPACE + eventGuid);
    }
    _initMarkup() {
        super._initMarkup();

        this._initActions();
        this._$container = this.option('container');
        this._$leftElement = this.option('leftElement');
        this._$rightElement = this.option('rightElement');

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

    _initActions() {
        this._actions = {
            onApplyPanelSize: this._createActionByOption('onApplyPanelSize'),
            onActiveStateChanged: this._createActionByOption('onActiveStateChanged')
        };
    }

    _render() {
        super._render();

        this._detachEventHandlers();
        this._attachEventHandlers();
    }

    _clean() {
        this._detachEventHandlers();
        super._clean();
    }

    _attachEventHandlers() {
        const document = domAdapter.getDocument();
        eventsEngine.on(this._$splitterBorder, this.SPLITTER_POINTER_DOWN_EVENT_NAME, this._onMouseDownHandler.bind(this));
        eventsEngine.on(document, this.SPLITTER_POINTER_MOVE_EVENT_NAME, this._onMouseMoveHandler.bind(this));
        eventsEngine.on(document, this.SPLITTER_POINTER_UP_EVENT_NAME, this._onMouseUpHandler.bind(this));
    }

    _detachEventHandlers() {
        const document = domAdapter.getDocument();
        eventsEngine.off(this._$splitterBorder, this.SPLITTER_POINTER_DOWN_EVENT_NAME);
        eventsEngine.off(document, this.SPLITTER_POINTER_MOVE_EVENT_NAME);
        eventsEngine.off(document, this.SPLITTER_POINTER_UP_EVENT_NAME);
    }

    _dimensionChanged(dimension) {
        if(!dimension || dimension !== 'height') {
            this._containerWidth = this._$container.get(0).clientWidth;
            this._setSplitterPositionLeft({ needUpdatePanels: true, usePercentagePanelsWidth: true });
        }
    }

    _onMouseDownHandler(e) {
        e.preventDefault();
        this._offsetX = e.pageX - this._$splitterBorder.offset().left <= this._getSplitterBorderWidth()
            ? e.pageX - this._$splitterBorder.offset().left
            : 0;
        this._containerWidth = this._$container.get(0).clientWidth;

        this.$element().removeClass(SPLITTER_INITIAL_STATE_CLASS);
        this._toggleActive(true);

        this._setSplitterPositionLeft({ needUpdatePanels: true });
    }

    _onMouseMoveHandler(e) {
        if(!this._isSplitterActive) {
            return;
        }
        this._setSplitterPositionLeft({ splitterPositionLeft: this._getNewSplitterPositionLeft(e), needUpdatePanels: true });
    }

    _onMouseUpHandler() {
        if(!this._isSplitterActive) {
            return;
        }
        this._leftPanelPercentageWidth = null;
        this._toggleActive(false);
        this._setSplitterPositionLeft({ needUpdatePanels: true, usePercentagePanelsWidth: true });
    }

    _getNewSplitterPositionLeft(e) {
        let newSplitterPositionLeft = e.pageX - this._getContainerLeftOffset() - this._offsetX;
        newSplitterPositionLeft = Math.max(0 - this._getSplitterOffset(), newSplitterPositionLeft);
        newSplitterPositionLeft = Math.min(this._containerWidth - this._getSplitterOffset() - this._getSplitterWidth(), newSplitterPositionLeft);
        return newSplitterPositionLeft;
    }

    _getContainerLeftOffset() {
        let offsetLeft = this._$container.offset().left;

        if(window) {
            const style = window.getComputedStyle(this._$container.get(0));
            const paddingLeft = parseFloat(style['paddingLeft']) || 0;
            const borderLeft = parseFloat(style['borderLeftWidth']) || 0;
            offsetLeft += paddingLeft + borderLeft;
        }

        return offsetLeft;
    }

    _getSplitterOffset() {
        return (this._getSplitterBorderWidth() - this._getSplitterWidth()) / 2;
    }

    _getSplitterWidth() {
        return this._$splitter.get(0).clientWidth;
    }

    _getSplitterBorderWidth() {
        return this._$splitterBorder.get(0).clientWidth;
    }

    _getLeftPanelWidth() {
        return this._$leftElement.get(0).clientWidth;
    }

    getSplitterBorderElement() {
        return this._$splitterBorder;
    }

    _toggleActive(isActive) {
        this.$element().toggleClass(SPLITTER_INACTIVE_CLASS, !isActive);
        this._$splitter.toggleClass(SPLITTER_INACTIVE_CLASS, !isActive);
        this._isSplitterActive = isActive;
        this._actions.onActiveStateChanged({ isActive });
    }

    toggleDisabled(isDisabled) {
        this.$element().toggleClass(STATE_DISABLED_CLASS, isDisabled);
        this._$splitter.toggleClass(STATE_DISABLED_CLASS, isDisabled);
    }

    isSplitterMoved() {
        return !this.$element().hasClass(SPLITTER_INITIAL_STATE_CLASS);
    }

    disableSplitterCalculation(value) {
        this._isSplitterCalculationDisabled = value;
    }

    _setSplitterPositionLeft({ splitterPositionLeft = null, needUpdatePanels = false, usePercentagePanelsWidth = false } = {}) {
        splitterPositionLeft = splitterPositionLeft || this._getLeftPanelWidth() - this._getSplitterOffset();
        const leftPanelWidth = splitterPositionLeft + this._getSplitterOffset();
        const rightPanelWidth = this._containerWidth - leftPanelWidth;

        if(!this._isSplitterCalculationDisabled) {
            this.$element().css('left', splitterPositionLeft);
        }

        this._leftPanelPercentageWidth = this._leftPanelPercentageWidth || this._convertToPercentage(leftPanelWidth);
        const rightPanelPercentageWidth = this._convertToPercentage(this._containerWidth - this._convertToPixels(this._leftPanelPercentageWidth));

        if(!needUpdatePanels) {
            return;
        }

        this._actions.onApplyPanelSize({
            leftPanelWidth: usePercentagePanelsWidth ? `${this._leftPanelPercentageWidth}%` : leftPanelWidth,
            rightPanelWidth: usePercentagePanelsWidth ? `${rightPanelPercentageWidth}%` : rightPanelWidth
        });
    }

    _optionChanged(args) {
        switch(args.name) {
            case 'initialLeftPanelWidth':
                this._leftPanelPercentageWidth = this._convertToPercentage(args.value);
                this._dimensionChanged();
                break;
            case 'leftElement':
                this.repaint();
                break;
            case 'onActiveStateChanged':
            case 'onApplyPanelSize':
                this._actions[args.name] = this._createActionByOption(args.name);
                break;
            default:
                super._optionChanged(args);
        }
    }

    _convertToPercentage(pixelWidth) {
        return pixelWidth / this._$container.get(0).clientWidth * 100;
    }

    _convertToPixels(percentageWidth) {
        return percentageWidth / 100 * this._$container.get(0).clientWidth;
    }
}
