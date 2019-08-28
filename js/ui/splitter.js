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
            .addClass(SPLITTER_WRAPPER_CLASS);
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
        const leftElementWidth = this._$leftElement[0].style.width;
        const rightElementWidth = this._$rightElement[0].style.width;
        if(this._isPercentValue(leftElementWidth) && this._isPercentValue(rightElementWidth)) {
            return;
        }

        const leftPanelWidth = this._$leftElement.width() / this._$container.width() * 100;
        const rightPanelWidth = 100 - leftPanelWidth;
        this._onApplyPanelSize({
            leftPanelWidth: leftPanelWidth + "%",
            rightPanelWidth: rightPanelWidth + "%"
        });
    }

    _onMouseDownHandler(e) {
        e.preventDefault();
        this._offsetX = e.offsetX <= this._$splitterBorder.width() ? e.offsetX : 0;
        this._isSplitterActive = true;
        this._cursorLastPos = e.clientX;
        this._containerWidth = this._$container.width();
        this._leftPanelMinWidth = this._getLeftPanelMinWidth();
        this._leftPanelMaxWidth = this._getLeftPanelMaxWidth();
        this._$splitter.removeClass(SPLITTER_TRANSPARENT_CLASS);
    }

    _onMouseMoveHandler(e) {
        if(!this._isSplitterActive) {
            return;
        }
        const leftPanelWidth = this._computeLeftPanelWidth(e);
        const rightPanelWidth = 100 - leftPanelWidth;
        this._onApplyPanelSize({
            leftPanelWidth: leftPanelWidth + "%",
            rightPanelWidth: rightPanelWidth + "%"
        });
    }

    _onMouseUpHandler() {
        if(this._isSplitterActive) {
            this._$splitter.addClass(SPLITTER_TRANSPARENT_CLASS);
            this._isSplitterActive = false;
        }
    }

    _computeLeftPanelWidth(e) {
        this._cursorLastPos = e.pageX - this._$container.offset().left - this._offsetX;
        this._cursorLastPos = Math.max(this._$splitterBorder.width(), this._cursorLastPos);
        this._cursorLastPos = Math.min(this._containerWidth - this._$splitterBorder.width(), this._cursorLastPos);
        if(this._leftPanelMinWidth) {
            this._cursorLastPos = Math.max(this._cursorLastPos, this._leftPanelMinWidth);
        }
        if(this._leftPanelMaxWidth) {
            this._cursorLastPos = Math.min(this._cursorLastPos, this._leftPanelMaxWidth);
        }
        return this._cursorLastPos / this._containerWidth * 100;
    }

    _getLeftPanelMinWidth() {
        return this._getElementMinMaxWidthRecursiveCore(this._$leftElement[0], "minWidth");
    }

    _getLeftPanelMaxWidth() {
        return this._getElementMinMaxWidthRecursiveCore(this._$leftElement[0], "maxWidth");
    }

    _getElementMinMaxWidthRecursiveCore(element, minMaxAttr) {
        let elementMaxWidth = 0;
        if(this._isDomElement(element)) {
            elementMaxWidth = getWindow().getComputedStyle(element)[minMaxAttr];
        }
        let width = !this._isPercentValue(elementMaxWidth) ? parseFloat(elementMaxWidth) : 0;
        if(isNaN(width)) {
            width = 0;
        }
        for(let i = 0; i < element.childNodes.length; i++) {
            width = Math.max(width, this._getElementMinMaxWidthRecursiveCore(element.childNodes[i], minMaxAttr));
        }
        return width;
    }

    _isDomElement(element) {
        return element && element.nodeType && element.nodeType === 1;
    }

    _isPercentValue(value) {
        return isString(value) && value.slice(-1) === "%";
    }

    toggleState(isActive) {
        if(isActive) {
            this.$element().removeClass("dx-state-disabled");
            this._$splitter.removeClass("dx-state-disabled");
        } else {
            this.$element().addClass("dx-state-disabled");
            this._$splitter.addClass("dx-state-disabled");
        }
    }
}
