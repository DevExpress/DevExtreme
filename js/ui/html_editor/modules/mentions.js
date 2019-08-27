import $ from "../../../core/renderer";
import { compileGetter } from "../../../core/utils/data";
import { isString } from "../../../core/utils/type";
import { extend } from "../../../core/utils/extend";
import { getPublicElement } from "../../../core/utils/dom";
import { Event as dxEvent } from "../../../events";

import PopupModule from "./popup";
import Mention from "../formats/mention";

const USER_ACTION = "user";
const SILENT_ACTION = "silent";
const DEFAULT_MARKER = "@";

const KEY_CODES = {
    ARROW_UP: 38,
    ARROW_DOWN: 40,
    ARROW_LEFT: 37,
    ARROW_RIGHT: 39,
    ENTER: 13,
    ESCAPE: 27,
    SPACE: 32,
    PAGE_UP: 33,
    PAGE_DOWN: 34,
    END: 35,
    HOME: 36
};

const NAVIGATION_KEYS = [
    KEY_CODES.ARROW_LEFT,
    KEY_CODES.ARROW_RIGHT,
    KEY_CODES.PAGE_UP,
    KEY_CODES.PAGE_DOWN,
    KEY_CODES.END,
    KEY_CODES.HOME
];

const ALLOWED_PREFIX_CHARS = [" ", "\n"];

const DISABLED_STATE_CLASS = "dx-state-disabled";

class MentionModule extends PopupModule {
    _getDefaultOptions() {
        const baseConfig = super._getDefaultOptions();

        return extend(baseConfig, {
            itemTemplate: "item",
            valueExpr: "this",
            displayExpr: "this",
            template: null,
            searchExpr: null,
            searchTimeout: 500,
            minSearchLength: 0
        });
    }

    constructor(quill, options) {
        super(quill, options);
        this._mentions = {};
        this.editorInstance = options.editorInstance;

        options.mentions.forEach((item) => {
            let { marker, template } = item;
            if(!marker) {
                item.marker = marker = DEFAULT_MARKER;
            }

            if(template) {
                const preparedTemplate = this.editorInstance._getTemplate(template);
                preparedTemplate && Mention.addTemplate(marker, preparedTemplate);
            }

            this._mentions[marker] = extend({}, this._getDefaultOptions(), item);
        });

        this._attachKeyboardHandlers();
        this.editorInstance.addCleanCallback(this.clean.bind(this));
        this.quill.on("text-change", this.onTextChange.bind(this));
    }

    _attachKeyboardHandlers() {
        this.quill.keyboard.addBinding({
            key: KEY_CODES.ARROW_UP
        }, this._arrowUpKeyHandler.bind(this));

        this.quill.keyboard.addBinding({
            key: KEY_CODES.ARROW_DOWN
        }, this._arrowDownKeyHandler.bind(this));

        this.quill.keyboard.addBinding({
            key: KEY_CODES.ENTER
        }, this._selectItemHandler.bind(this));

        const enterBindings = this.quill.keyboard.bindings[KEY_CODES.ENTER];
        enterBindings.unshift(enterBindings.pop());

        this.quill.keyboard.addBinding({
            key: KEY_CODES.ESCAPE
        }, this._escapeKeyHandler.bind(this));

        this.quill.keyboard.addBinding({
            key: KEY_CODES.SPACE
        }, this._selectItemHandler.bind(this));

        this.quill.keyboard.addBinding({
            key: KEY_CODES.ARROW_LEFT,
            shiftKey: true
        }, this._ignoreKeyHandler.bind(this));

        this.quill.keyboard.addBinding({
            key: KEY_CODES.ARROW_RIGHT,
            shiftKey: true
        }, this._ignoreKeyHandler.bind(this));

        NAVIGATION_KEYS.forEach((key) => {
            this.quill.keyboard.addBinding({
                key
            }, this._ignoreKeyHandler.bind(this));
        });
    }

    _arrowUpKeyHandler() {
        if(this._isMentionActive) {
            const $focusedItem = $(this._list.option("focusedElement"));
            let $prevItem = $focusedItem.prev();

            $prevItem = $prevItem.length ? $prevItem : this._activeListItems.last();
            this._list.option("focusedElement", getPublicElement($prevItem));
            this._list.scrollToItem($prevItem);
        }
        return !this._isMentionActive;
    }

    _arrowDownKeyHandler() {
        if(this._isMentionActive) {
            const $focusedItem = $(this._list.option("focusedElement"));
            let $nextItem = $focusedItem.next();

            $nextItem = $nextItem.length ? $nextItem : this._activeListItems.first();
            this._list.option("focusedElement", getPublicElement($nextItem));
            this._list.scrollToItem($nextItem);
        }
        return !this._isMentionActive;
    }

    _ignoreKeyHandler() {
        return !this._isMentionActive;
    }

    _fitIntoRange(value, start, end) {
        if(value > end) {
            return start;
        }

        if(value < start) {
            return end;
        }

        return value;
    }

    _selectItemHandler() {
        if(this._isMentionActive) {
            this._list.selectItem(this._list.option("focusedElement"));
        }
        return !this._isMentionActive;
    }

    _escapeKeyHandler() {
        if(this._isMentionActive) {
            this._popup.hide();
        }

        return !this._isMentionActive;
    }

    renderList($container, options) {
        this.compileGetters(this.options);
        super.renderList($container, options);
    }

    compileGetters({ displayExpr, valueExpr }) {
        this._valueGetter = compileGetter(displayExpr);
        this._idGetter = compileGetter(valueExpr);
    }

    _getListConfig(options) {
        const baseConfig = super._getListConfig(options);

        return extend(baseConfig, {
            itemTemplate: this.options.itemTemplate,
            onContentReady: () => {
                if(this._hasSearch) {
                    this._popup.repaint();
                    this._focusFirstElement();
                    this._hasSearch = false;
                }
            }
        });
    }

    insertEmbedContent() {
        const markerLength = this._activeMentionConfig.marker.length;
        const textLength = markerLength + this._searchValue.length;
        const caretPosition = this.getPosition();
        const startIndex = Math.max(0, caretPosition - markerLength);
        const selectedItem = this._list.option("selectedItem");

        const value = {
            value: this._valueGetter(selectedItem),
            id: this._idGetter(selectedItem),
            marker: this._activeMentionConfig.marker
        };

        setTimeout(function() {
            this.quill.deleteText(startIndex, textLength, SILENT_ACTION);
            this.quill.insertEmbed(startIndex, "mention", value);
            this.quill.insertText(startIndex + 1, ' ', SILENT_ACTION);
            this.quill.setSelection(startIndex + 2);
        }.bind(this));
    }

    _getLastInsertOperation(ops) {
        const lastOperation = ops[ops.length - 1];
        const isLastOperationInsert = 'insert' in lastOperation;

        if(isLastOperationInsert) {
            return lastOperation;
        }

        const isLastOperationDelete = 'delete' in lastOperation;

        if(isLastOperationDelete && ops.length >= 2) {
            const penultOperation = ops[ops.length - 2];
            const isPenultOperationInsert = 'insert' in penultOperation;
            const isSelectionReplacing = isLastOperationDelete && isPenultOperationInsert;

            if(isSelectionReplacing) {
                return penultOperation;
            }
        }

        return null;
    }

    onTextChange(newDelta, oldDelta, source) {
        if(source === USER_ACTION) {
            const lastOperation = newDelta.ops[newDelta.ops.length - 1];

            if(this._isMentionActive) {
                this._processSearchValue(lastOperation) && this._filterList(this._searchValue);
            } else {
                const { ops } = newDelta;
                const lastInsertOperation = this._getLastInsertOperation(ops);

                if(lastInsertOperation) {
                    this.checkMentionRequest(lastInsertOperation, ops);
                }
            }
        }
    }

    _processSearchValue(operation) {
        const isInsertOperation = "insert" in operation;

        if(isInsertOperation) {
            this._searchValue += operation.insert;
        } else {
            if(!this._searchValue.length) {
                this._popup.hide();
                return false;
            } else {
                this._searchValue = this._searchValue.slice(0, -1);
            }
        }

        return true;
    }

    checkMentionRequest({ insert }, ops) {
        const caret = this.quill.getSelection();

        if(!insert || !isString(insert) || !caret || this._isMarkerPartOfText(ops[0].retain)) {
            return;
        }

        this._activeMentionConfig = this._mentions[insert];

        if(this._activeMentionConfig) {
            this._updateList(this._activeMentionConfig);
            this.savePosition(caret.index);
            this._popup.option("position", this._popupPosition);
            this._searchValue = "";
            this._popup.show();
        }
    }

    _isMarkerPartOfText(retain) {
        if(!retain || ALLOWED_PREFIX_CHARS.indexOf(this._getCharByIndex(retain - 1)) !== -1) {
            return false;
        }

        return true;
    }

    _getCharByIndex(index) {
        return this.quill.getContents(index, 1).ops[0].insert;
    }

    _updateList({ dataSource, displayExpr, valueExpr, itemTemplate, searchExpr }) {
        this.compileGetters({ displayExpr, valueExpr });
        this._list.unselectAll();
        this._list.option({
            dataSource,
            displayExpr,
            itemTemplate,
            searchExpr
        });
    }

    _filterList(searchValue) {
        if(!this._isMinSearchLengthExceeded(searchValue)) {
            this._resetFilter();
            return;
        }

        var searchTimeout = this._activeMentionConfig.searchTimeout;

        if(searchTimeout) {
            clearTimeout(this._searchTimer);
            this._searchTimer = setTimeout(() => {
                this._search(searchValue);
            }, searchTimeout);
        } else {
            this._search(searchValue);
        }
    }

    _isMinSearchLengthExceeded(searchValue) {
        return searchValue.length >= this._activeMentionConfig.minSearchLength;
    }

    _resetFilter() {
        clearTimeout(this._searchTimer);
        this._search(null);
    }

    _search(searchValue) {
        this._hasSearch = true;
        this._list.option("searchValue", searchValue);
    }

    _focusFirstElement() {
        if(!this._list) {
            return;
        }

        const $firstItem = this._activeListItems.first();
        this._list.option("focusedElement", getPublicElement($firstItem));
        this._list.scrollToItem($firstItem);
    }

    get _popupPosition() {
        const position = this.getPosition();
        const { left: mentionLeft, top: mentionTop, height: mentionHeight } = this.quill.getBounds(position ? position - 1 : position);
        const { left: leftOffset, top: topOffset } = $(this.quill.root).offset();
        const positionEvent = dxEvent("positionEvent", {
            pageX: leftOffset + mentionLeft,
            pageY: topOffset + mentionTop
        });

        return {
            of: positionEvent,
            offset: {
                v: mentionHeight
            },
            my: "top left",
            at: "top left",
            collision: {
                y: "flip",
                x: "flipfit"
            }
        };
    }

    _getPopupConfig() {
        return extend(super._getPopupConfig(), {
            closeOnTargetScroll: false,
            onShown: () => {
                this._isMentionActive = true;
                this._hasSearch = false;
                this._focusFirstElement();
            },
            onHidden: () => {
                this._list.unselectAll();
                this._list.option("focusedElement", null);
                this._isMentionActive = false;
                this._search(null);
            },
            focusStateEnabled: false
        });
    }

    get _activeListItems() {
        return this._list.itemElements().filter(`:not(.${DISABLED_STATE_CLASS})`);
    }

    clean() {
        Object.keys(this._mentions).forEach((marker) => {
            if(this._mentions[marker].template) {
                Mention.removeTemplate(marker);
            }
        });
    }
}

export default MentionModule;
