import EventsEngine from "../../events/core/events_engine";
import { addNamespace } from "../../events/utils";
import { inArray } from "../../core/utils/array";

const MASK_EVENT_NAMESPACE = "dxMask";
const BLUR_EVENT = "blur beforedeactivate";
const EMPTY_CHAR = " ";

export default class BaseMaskStrategy {
    constructor(editor) {
        this.editor = editor;
        this.DIRECTION = {
            FORWARD: "forward",
            BACKWARD: "backward"
        };
    }

    editorOption() {
        return this.editor.option(...arguments);
    }

    editorInput() {
        return this.editor._input();
    }

    getHandler(handlerName) {
        const handler = this[`_${handlerName}Handler`] || function() {};
        return handler.bind(this);
    }

    attachEvents() {
        var $input = this.editor._input();

        for(let eventName of this.getHandleEventNames()) {
            const subscriptionName = addNamespace(eventName.toLowerCase(), MASK_EVENT_NAMESPACE);
            EventsEngine.on($input, subscriptionName, this.getEventHandler(eventName));
        }

        this._attachChangeEventHandlers();
    }

    getHandleEventNames() {
        return ["focusIn", "focusOut", "keyDown", "input", "paste", "cut", "drop"];
    }

    getEventHandler(eventName) {
        let handler = this[`_${eventName}Handler`];

        // ToDo: remove it
        if(!handler) {
            handler = function() {};
            // console.log(`TODO - refactor, there is no handler for "${eventName}" event`);
        }

        return handler.bind(this);
    }

    detachEvents() {
        EventsEngine.off(this.editorInput(), `.${MASK_EVENT_NAMESPACE}`);
    }

    _attachChangeEventHandlers() {
        if(inArray("change", this.editorOption("valueChangeEvent").split(" ")) === -1) {
            return;
        }

        EventsEngine.on(this.editorInput(), addNamespace(BLUR_EVENT, MASK_EVENT_NAMESPACE), (function(e) {
            // NOTE: input is focused on caret changing in IE(T304159)
            this._suppressCaretChanging(this._changeHandler, [e]);
            this._changeHandler(e);
        }).bind(this.editor));
    }

    _backspaceHandler(e) {
        this._keyPressHandled = true;

        const afterBackspaceHandler = (needAdjustCaret, callBack) => {
            if(needAdjustCaret) {
                this.editor._direction(this.DIRECTION.FORWARD);
                this.editor._adjustCaret();
            }
            const currentCaret = this.editor._caret();
            clearTimeout(this._backspaceHandlerTimeout);
            this._backspaceHandlerTimeout = setTimeout(function() {
                callBack(currentCaret);
            });
        };

        this.editor._maskKeyHandler(e, () => {
            if(this.editor._hasSelection()) {
                afterBackspaceHandler(true, (currentCaret) => {
                    this.editor._displayMask(currentCaret);
                    this.editor._maskRulesChain.reset();
                });
                return;
            }

            if(this.editor._tryMoveCaretBackward()) {
                afterBackspaceHandler(false, (currentCaret) => {
                    this.editor._caret(currentCaret);
                });
                return;
            }

            this.editor._handleKey(EMPTY_CHAR, this.DIRECTION.BACKWARD);
            afterBackspaceHandler(true, (currentCaret) => {
                this.editor._displayMask(currentCaret);
                this.editor._maskRulesChain.reset();
            });
        });
    }

    _delHandler(e) {
        this._keyPressHandled = true;
        this.editor._maskKeyHandler(e, function() {
            !this._hasSelection() && this._handleKey(EMPTY_CHAR);
            return true;
        });
    }

    clean() { }
}
