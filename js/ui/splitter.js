import $ from "../core/renderer";
import Widget from "./widget/ui.widget";
import domAdapter from "../core/dom_adapter";
import eventsEngine from "../events/core/events_engine";
import pointerEvents from "../events/pointer";
import { addNamespace } from "../events/utils";

const SPLITTER_CLASS = "dx-splitter";
const SPLITTER_WRAPPER_CLASS = `${SPLITTER_CLASS}-wrapper`;
const SPLITTER_TRANSPARENT_CLASS = `${SPLITTER_CLASS}-transparent`;
const SPLITTER_BORDER_CLASS = `${SPLITTER_CLASS}-border`;

const SPLITTER_MODULE_NAMESPACE = "dxSplitterResizing";
const SPLITTER_POINTER_DOWN_EVENT_NAME = addNamespace(pointerEvents.down, SPLITTER_MODULE_NAMESPACE);
const SPLITTER_POINTER_MOVE_EVENT_NAME = addNamespace(pointerEvents.move, SPLITTER_MODULE_NAMESPACE);
const SPLITTER_POINTER_UP_EVENT_NAME = addNamespace(pointerEvents.up, SPLITTER_MODULE_NAMESPACE);

export default class SplitterControl extends Widget {
    _initMarkup() {
        this._container = this.option("container");
        this._leftElement = this.option("leftElement");
        this._rightElement = this.option("rightElement");
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
    }

    _detachEventHandlers() {
        const document = domAdapter.getDocument();
        eventsEngine.off(this._$splitter, SPLITTER_POINTER_DOWN_EVENT_NAME);
        eventsEngine.off(document, SPLITTER_POINTER_MOVE_EVENT_NAME);
        eventsEngine.off(document, SPLITTER_POINTER_UP_EVENT_NAME);
    }

    _onMouseDownHandler(e) {
        e.preventDefault();
        this._isSplitterActive = true;
        this._cursorLastPos = e.clientX;
        this._$splitter.removeClass(SPLITTER_TRANSPARENT_CLASS);
    }

    _onMouseMoveHandler(e) {
        if(!this._isSplitterActive) {
            return;
        }
        this._onApplyPanelSize(this._computeLeftPanelWidth(e));
    }

    _onMouseUpHandler() {
        if(this._isSplitterActive) {
            this._$splitter.addClass(SPLITTER_TRANSPARENT_CLASS);
            this._isSplitterActive = false;
        }
    }

    computeRightPanelWidth(leftPanelWidth) {
        return this._container.width() - leftPanelWidth - this._$splitterBorder.width();
    }

    _computeLeftPanelWidth(e) {
        this._cursorLastPos = e.pageX - this._container.offset().left;
        this._cursorLastPos = Math.max(100, this._cursorLastPos);
        this._cursorLastPos = Math.min(this._container.width(), this._cursorLastPos);
        return this._cursorLastPos;
    }

}
