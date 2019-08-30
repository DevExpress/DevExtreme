import $ from "../core/renderer";
import Widget from "./widget/ui.widget";
import domAdapter from "../core/dom_adapter";
import eventsEngine from "../events/core/events_engine";
import pointerEvents from "../events/pointer";
import { addNamespace } from "../events/utils";
import { getWindow } from "../core/utils/window";
import { isString } from "../core/utils/type";

const SPLITTER_CLASS = "dx-splitter";
const SPLITTER_WRAPPER_CLASS = `${SPLITTER_CLASS}-wrapper`;
const SPLITTER_TRANSPARENT_CLASS = `${SPLITTER_CLASS}-transparent`;
const SPLITTER_BORDER_CLASS = `${SPLITTER_CLASS}-border`;
const SPLITTER_INITIAL_STATE_CLASS = `${SPLITTER_CLASS}-initial`;

const STATE_DISABLED_CLASS = "dx-state-disabled";

const SPLITTER_MODULE_NAMESPACE = "dxSplitterResizing";
const SPLITTER_POINTER_DOWN_EVENT_NAME = addNamespace(pointerEvents.down, SPLITTER_MODULE_NAMESPACE);
const SPLITTER_POINTER_MOVE_EVENT_NAME = addNamespace(pointerEvents.move, SPLITTER_MODULE_NAMESPACE);
const SPLITTER_POINTER_UP_EVENT_NAME = addNamespace(pointerEvents.up, SPLITTER_MODULE_NAMESPACE);
const SPLITTER_WINDOW_RESIZE_EVENT_NAME = addNamespace("resize", SPLITTER_MODULE_NAMESPACE);

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
            .addClass(SPLITTER_TRANSPARENT_CLASS)
            .appendTo(this._$splitterBorder);
    }

    _render() {
        this._detachEventHandlers();
        this._attachEventHandlers();
    }

    _clean() {
        this._detachEventHandlers();
        super._clean();
    }

    _attachEventHandlers() {
        const document = domAdapter.getDocument();
        eventsEngine.on(this._$splitter, SPLITTER_POINTER_DOWN_EVENT_NAME, this._onMouseDownHandler.bind(this));
        eventsEngine.on(document, SPLITTER_POINTER_MOVE_EVENT_NAME, this._onMouseMoveHandler.bind(this));
        eventsEngine.on(document, SPLITTER_POINTER_UP_EVENT_NAME, this._onMouseUpHandler.bind(this));
        eventsEngine.on(getWindow(), SPLITTER_WINDOW_RESIZE_EVENT_NAME, this._windowResizeHandler.bind(this));
    }

    _detachEventHandlers() {
        const document = domAdapter.getDocument();
        eventsEngine.off(this._$splitter, SPLITTER_POINTER_DOWN_EVENT_NAME);
        eventsEngine.off(document, SPLITTER_POINTER_MOVE_EVENT_NAME);
        eventsEngine.off(document, SPLITTER_POINTER_UP_EVENT_NAME);
        eventsEngine.off(getWindow(), SPLITTER_WINDOW_RESIZE_EVENT_NAME);
    }

    _windowResizeHandler(e) {
        let leftPanelWidth = parseFloat(this._lastLeftPanelWidth);
        const rightPanelWidth = 100 - leftPanelWidth;
        this._onApplyPanelSize({
            leftPanelWidth: leftPanelWidth + "%",
            rightPanelWidth: rightPanelWidth + "%"
        });
        this.setSplitterPositionLeft(this._$leftElement.width());
    }

    _onMouseDownHandler(e) {
        e.preventDefault();
        this.$element().removeClass(SPLITTER_INITIAL_STATE_CLASS);
        this._offsetX = e.offsetX <= this._$splitterBorder.width() ? e.offsetX : 0;
        this._isSplitterActive = true;
        this._containerWidth = this._$container.width();
        this._$splitter.removeClass(SPLITTER_TRANSPARENT_CLASS);
        this.setSplitterPositionLeft(this._getNewSplitterPositionLeft(e));
    }

    _onMouseMoveHandler(e) {
        if(!this._isSplitterActive) {
            return;
        }
        const splitterPositionLeft = this._getNewSplitterPositionLeft(e);
        const leftPanelWidth = splitterPositionLeft / this._containerWidth * 100;
        const rightPanelWidth = 100 - leftPanelWidth;
        this.setSplitterPositionLeft(splitterPositionLeft);
        this._onApplyPanelSize({
            leftPanelWidth: leftPanelWidth + "%",
            rightPanelWidth: rightPanelWidth + "%"
        });
    }

    _onMouseUpHandler() {
        if(this._isSplitterActive) {
            this._$splitter.addClass(SPLITTER_TRANSPARENT_CLASS);
            this._isSplitterActive = false;
            this._lastLeftPanelWidth = $(this._$leftElement).prop("style")["width"];
        }
    }

    _getNewSplitterPositionLeft(e) {
        let newSplitterPositionLeft = e.pageX - this._$container.offset().left - this._offsetX;
        newSplitterPositionLeft = Math.max(0, newSplitterPositionLeft);
        newSplitterPositionLeft = Math.min(this._containerWidth - this._$splitterBorder.width(), newSplitterPositionLeft);
        return newSplitterPositionLeft;
    }

    _isDomElement(element) {
        return element && element.nodeType && element.nodeType === 1;
    }

    _isPercentValue(value) {
        return isString(value) && value.slice(-1) === "%";
    }

    toggleState(isActive) {
        const classAction = isActive ? "removeClass" : "addClass";
        this.$element()[classAction](STATE_DISABLED_CLASS);
        this._$splitter[classAction](STATE_DISABLED_CLASS);
    }

    isSplitterMoved() {
        return !this.$element().hasClass(SPLITTER_INITIAL_STATE_CLASS);
    }

    setSplitterPositionLeft(splitterPositionLeft) {
        this.$element().css("left", splitterPositionLeft);
    }

    _optionChanged(args) {
        switch(args.name) {
            case "initialLeftPanelWidth":
                this._lastLeftPanelWidth = args.value / this._$container.width() * 100 + "%";
                break;
            case "leftElement":
                this._$leftElement = args.value;
                this._lastLeftPanelWidth = this._$leftElement.width() / this._$container.width() * 100 + "%";
                break;
            default:
                super._optionChanged(args);
        }
    }
}
