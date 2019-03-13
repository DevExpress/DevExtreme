import { compileGetter } from "../../../core/utils/data";
import { isString } from "../../../core/utils/type";
import { extend } from "../../../core/utils/extend";

import PopupModule from "./popup";

const USER_ACTION = "user";

class MentionModule extends PopupModule {
    _getDefaultOptions() {
        let baseConfig = super._getDefaultOptions();

        const getDisplayExpr = function() {
            return this.options.displayExpr;
        }.bind(this);

        return extend(baseConfig, {
            mentionChar: "@",
            itemTemplate: function(itemData) {
                return itemData[getDisplayExpr()];
            },
            valueExpr: "this",
            displayExpr: "this"
        });
    }

    constructor(quill, options) {
        super(quill, options);
        this.quill.on("text-change", this.onTextChange.bind(this));
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
        let baseConfig = super._getListConfig(options);

        return extend(baseConfig, {
            itemTemplate: this.options.itemTemplate
        });
    }

    insertEmbedContent(selectionChangedEvent) {
        const mentionCharLength = this.options.mentionChar.length;
        const caretPosition = this.getPosition();
        const startIndex = Math.max(0, caretPosition - mentionCharLength);
        const selectedItem = selectionChangedEvent.component.option("selectedItem");

        let value = {
            value: this._valueGetter(selectedItem),
            id: this._idGetter(selectedItem),
            mentionChar: this.options.mentionChar
        };

        setTimeout(function() {
            this.quill.deleteText(startIndex, mentionCharLength);
            this.quill.insertEmbed(startIndex, "mention", value);

            this.quill.setSelection(startIndex + 1);
        }.bind(this));
    }

    onTextChange(newDelta, oldDelta, source) {
        if(source === USER_ACTION) {
            this.checkMentionRequest(newDelta.ops[newDelta.ops.length - 1]);
        }
    }

    checkMentionRequest(operation) {
        const insertOperation = operation.insert;
        const caret = this.quill.getSelection();

        if(!insertOperation || !isString(insertOperation) || !caret) {
            return;
        }

        const mentionIndex = insertOperation.indexOf(this.options.mentionChar);

        if(mentionIndex !== -1) {
            this.savePosition(caret.index);
            this._popover.option("position", this._popoverPosition);
            this._popover.show();
        }
    }

    get _popoverPosition() {
        const { index } = this.getPosition();
        const mentionBounds = this.quill.getBounds(index);
        const rootRect = this.quill.root.getBoundingClientRect();

        return {
            of: this.quill.root,
            offset: {
                h: mentionBounds.left,
                v: mentionBounds.bottom - rootRect.height
            },
            my: "top center",
            at: "bottom left",
            collision: {
                y: "flip",
                x: "none"
            }
        };
    }
}

export default MentionModule;
