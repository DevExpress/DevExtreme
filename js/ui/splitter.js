import $ from "../core/renderer";
import Widget from "./widget/ui.widget";
import domAdapter from "../core/dom_adapter";
import eventsEngine from "../events/core/events_engine";
import pointerEvents from "../events/pointer";
import { addNamespace } from "../events/utils";
import { isString } from "../core/utils/type";

const SPLITTER_CLASS = "dx-splitter";
const SPLITTER_WRAPPER_CLASS = `${SPLITTER_CLASS}-wrapper`;
const SPLITTER_INACTIVE_CLASS = `${SPLITTER_CLASS}-inactive`;
const SPLITTER_BORDER_CLASS = `${SPLITTER_CLASS}-border`;
const SPLITTER_INITIAL_STATE_CLASS = `${SPLITTER_CLASS}-initial`;

const STATE_DISABLED_CLASS = "dx-state-disabled";

const SPLITTER_MODULE_NAMESPACE = "dxSplitterResizing";
const SPLITTER_POINTER_DOWN_EVENT_NAME = addNamespace(pointerEvents.down, SPLITTER_MODULE_NAMESPACE);
const SPLITTER_POINTER_MOVE_EVENT_NAME = addNamespace(pointerEvents.move, SPLITTER_MODULE_NAMESPACE);
const SPLITTER_POINTER_UP_EVENT_NAME = addNamespace(pointerEvents.up, SPLITTER_MODULE_NAMESPACE);

export default class SplitterControl extends Widget {
    _initMarkup() {
        this._$container = this.option("container");
        this._$leftElement = this.option("leftElement");
        this._$rightElement = this.option("rightElement");
        this._onApplyPanelSize = this._createActionByOption("onApplyPanelSize");

        this.$element()
            .addClass(SPLITTER_WRAPPER_CLASS)
            .addClass(SPLITTER_INITIAL_STATE_CLASS);
        this._$splitterBorder = $("<div>")
            .addClass(SPLITTER_BORDER_CLASS)
            .appendTo(this.$element());
        this._$splitter = $("<div>")
            .addClass(SPLITTER_CLASS)
            .addClass(SPLITTER_INACTIVE_CLASS)
            .appendTo(this._$splitterBorder);
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
        eventsEngine.on(this._$splitterBorder, SPLITTER_POINTER_DOWN_EVENT_NAME, this._onMouseDownHandler.bind(this));
        eventsEngine.on(document, SPLITTER_POINTER_MOVE_EVENT_NAME, this._onMouseMoveHandler.bind(this));
        eventsEngine.on(document, SPLITTER_POINTER_UP_EVENT_NAME, this._onMouseUpHandler.bind(this));
    }

    _detachEventHandlers() {
        const document = domAdapter.getDocument();
        eventsEngine.off(this._$splitterBorder, SPLITTER_POINTER_DOWN_EVENT_NAME);
        eventsEngine.off(document, SPLITTER_POINTER_MOVE_EVENT_NAME);
        eventsEngine.off(document, SPLITTER_POINTER_UP_EVENT_NAME);
    }

    _dimensionChanged() {
        if(this._leftPanelPercentageWidth === undefined) {
            let leftElementWidth = this._$leftElement.get(0).clientWidth + this.getSplitterOffset();
            this._leftPanelPercentageWidth = this._convertLeftPanelWidthToPercentage(leftElementWidth);
        }

        const rightPanelWidth = 100 - this._leftPanelPercentageWidth;
        this._onApplyPanelSize({
            leftPanelWidth: this._leftPanelPercentageWidth + "%",
            rightPanelWidth: rightPanelWidth + "%"
        });
        this.setSplitterPositionLeft(this._$leftElement.get(0).clientWidth - this.getSplitterOffset());
    }

    _onMouseDownHandler(e) {
        e.preventDefault();
        this._offsetX = e.pageX - this._$splitterBorder.offset().left <= this._getSplitterBorderWidth()
            ? e.pageX - this._$splitterBorder.offset().left
            : 0;
        this._isSplitterActive = true;
        this._containerWidth = this._$container.get(0).clientWidth;

        this.$element().removeClass(SPLITTER_INITIAL_STATE_CLASS);
        this._$splitter.removeClass(SPLITTER_INACTIVE_CLASS);

        this.setSplitterPositionLeft(null, true);
    }

    _onMouseMoveHandler(e) {
        if(!this._isSplitterActive) {
            return;
        }
        this.setSplitterPositionLeft(this._getNewSplitterPositionLeft(e), true);
    }

    _onMouseUpHandler() {
        if(this._isSplitterActive) {
            this._$splitter.addClass(SPLITTER_INACTIVE_CLASS);
            this._isSplitterActive = false;
        }
    }

    _getNewSplitterPositionLeft(e) {
        let newSplitterPositionLeft = e.pageX - this._$container.offset().left - this._offsetX;
        newSplitterPositionLeft = Math.max(0 - this.getSplitterOffset(), newSplitterPositionLeft);
        newSplitterPositionLeft = Math.min(this._containerWidth - this.getSplitterOffset() - this._getSplitterWidth(), newSplitterPositionLeft);
        return newSplitterPositionLeft;
    }

    _isDomElement(element) {
        return element && element.nodeType && element.nodeType === 1;
    }

    _isPercentValue(value) {
        return isString(value) && value.slice(-1) === "%";
    }

    getSplitterOffset() {
        return (this._getSplitterBorderWidth() - this._getSplitterWidth()) / 2;
    }

    _getSplitterWidth() {
        return this._$splitter.get(0).clientWidth;
    }

    _getSplitterBorderWidth() {
        return this._$splitterBorder.get(0).clientWidth;
    }

    toggleState(isActive) {
        const classAction = isActive ? "removeClass" : "addClass";
        this.$element()[classAction](STATE_DISABLED_CLASS);
        this._$splitter[classAction](STATE_DISABLED_CLASS);
    }

    isSplitterMoved() {
        return !this.$element().hasClass(SPLITTER_INITIAL_STATE_CLASS);
    }

    setSplitterPositionLeft(splitterPositionLeft, needUpdatePanels) {
        splitterPositionLeft = splitterPositionLeft || this._$leftElement.get(0).clientWidth - this.getSplitterOffset();
        this.$element().css("left", splitterPositionLeft);
        if(!needUpdatePanels) {
            return;
        }
        const leftPanelWidth = splitterPositionLeft + this.getSplitterOffset();
        const rightPanelWidth = this._containerWidth - leftPanelWidth;
        this._onApplyPanelSize({
            leftPanelWidth: leftPanelWidth,
            rightPanelWidth: rightPanelWidth
        });
        this._leftPanelPercentageWidth = this._convertLeftPanelWidthToPercentage(leftPanelWidth);
    }

    _optionChanged(args) {
        switch(args.name) {
            case "initialLeftPanelWidth":
                this._leftPanelPercentageWidth = this._convertLeftPanelWidthToPercentage(args.value);
                this._dimensionChanged();
                break;
            case "leftElement":
                this.repaint();
                break;
            default:
                super._optionChanged(args);
        }
    }

    _convertLeftPanelWidthToPercentage(leftPanelWidth) {
        return leftPanelWidth / this._$container.get(0).clientWidth * 100;
    }
}
