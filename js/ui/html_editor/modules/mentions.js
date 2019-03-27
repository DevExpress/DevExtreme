import $ from "../../../core/renderer";
import { compileGetter } from "../../../core/utils/data";
import { isString } from "../../../core/utils/type";
import { extend } from "../../../core/utils/extend";

import PopupModule from "./popup";
import { getPublicElement } from "../../../core/utils/dom";

const USER_ACTION = "user";
const DEFAULT_MARKER = "@";

const KEY_CODES = {
    ARROW_UP: 38,
    ARROW_DOWN: 40,
    ARROW_LEFT: 37,
    ARROW_RIGHT: 39,
    ENTER: 13,
    ESCAPE: 27,
    SPACE: 32
};

const DISABLED_STATE_CLASS = "dx-state-disabled";

class MentionModule extends PopupModule {
    _getDefaultOptions() {
        const baseConfig = super._getDefaultOptions();

        return extend(baseConfig, {
            itemTemplate: (itemData) => {
                return this._valueGetter(itemData);
            },
            valueExpr: "this",
            displayExpr: "this",
            searchExpr: null,
            searchTimeout: 500,
            minSearchLength: 0
        });
    }

    constructor(quill, options) {
        super(quill, options);

        this._mentions = {};

        options.mentions.forEach((item) => {
            if(!item.marker) {
                item.marker = DEFAULT_MARKER;
            }

            this._mentions[item.marker] = extend({}, this._getDefaultOptions(), item);
        });

        this._attachKeyboardHandlers();

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
        this.quill.keyboard.bindings[13].unshift(this.quill.keyboard.bindings[13].pop());

        this.quill.keyboard.addBinding({
            key: KEY_CODES.ESCAPE
        }, this._escapeKeyHandler.bind(this));

        this.quill.keyboard.addBinding({
            key: KEY_CODES.SPACE
        }, this._selectItemHandler.bind(this));

        this.quill.keyboard.addBinding({
            key: KEY_CODES.ARROW_LEFT
        }, this._ignoreKeyHandler.bind(this));

        this.quill.keyboard.addBinding({
            key: KEY_CODES.ARROW_RIGHT
        }, this._ignoreKeyHandler.bind(this));

        this.quill.keyboard.addBinding({
            key: KEY_CODES.ARROW_LEFT,
            shiftKey: true
        }, this._ignoreKeyHandler.bind(this));

        this.quill.keyboard.addBinding({
            key: KEY_CODES.ARROW_RIGHT,
            shiftKey: true
        }, this._ignoreKeyHandler.bind(this));
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
        if(value > end) return start;
        if(value < start) return end;
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

    compileGetters(options) {
        this._valueGetter = compileGetter(options.displayExpr);
        this._idGetter = compileGetter(options.valueExpr);
    }

    _getListConfig(options) {
        const baseConfig = super._getListConfig(options);

        return extend(baseConfig, {
            itemTemplate: this.options.itemTemplate
        });
    }

    insertEmbedContent() {
        const markerLength = this._activeMentionConfig.marker.length;
        const caretPosition = this.getPosition();
        const startIndex = Math.max(0, caretPosition - markerLength);
        const selectedItem = this._list.option("selectedItem");

        const value = {
            value: this._valueGetter(selectedItem),
            id: this._idGetter(selectedItem),
            marker: this._activeMentionConfig.marker
        };

        setTimeout(function() {
            this.quill.deleteText(startIndex, markerLength, "silent");
            this.quill.insertEmbed(startIndex, "mention", value);
            this.quill.setSelection(startIndex + 1);
        }.bind(this));
    }

    onTextChange(newDelta, oldDelta, source) {
        if(source === USER_ACTION) {
            // if(!this._activeMentionConfig) {
            const lastOperation = newDelta.ops[newDelta.ops.length - 1];
            if(!this._isMentionActive) {
                this.checkMentionRequest(lastOperation);
            } else {
                const operation = lastOperation;
                const isInsertOperation = "insert" in operation;

                if(isInsertOperation) {
                    this._searchValue += operation.insert;
                } else {
                    if(!this._searchValue.length) {
                        this._popup.hide();
                        return;
                    } else {
                        this._searchValue = this._searchValue.slice(0, -1);
                    }
                }
                this._filterList(this._searchValue);
            }
        }
    }

    checkMentionRequest(operation) {
        const insertOperation = operation.insert;
        const caret = this.quill.getSelection();

        if(!insertOperation || !isString(insertOperation) || !caret) {
            return;
        }

        this._activeMentionConfig = this._mentions[insertOperation];

        if(this._activeMentionConfig) {
            this._updateList(this._activeMentionConfig);
            this.savePosition(caret.index);
            this._popup.option("position", this._popupPosition);
            this._searchValue = "";
            this._popup.show();
        }
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

        this._list.option("searchValue", null);
    }

    _search(searchValue) {
        this._list.option("searchValue", searchValue);
    }

    get _popupPosition() {
        const position = this.getPosition();
        const mentionBounds = this.quill.getBounds(position ? position - 1 : position);

        return {
            of: this.quill.root,
            offset: {
                h: mentionBounds.left,
                v: mentionBounds.bottom
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
            onShown: () => {
                const $firstItem = this._activeListItems.first();
                this._list.option("focusedElement", getPublicElement($firstItem));
                this._list.scrollToItem($firstItem);
                this._isMentionActive = true;
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
}

export default MentionModule;
