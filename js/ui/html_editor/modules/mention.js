import { compileGetter } from "../../../core/utils/data";
import { isString } from "../../../core/utils/type";
import { extend } from "../../../core/utils/extend";

import PopupModule from "./popup";

const USER_ACTION = "user";

class MentionModule extends PopupModule {
    _getDefaultOptions() {
        const baseConfig = super._getDefaultOptions();

        return extend(baseConfig, {
            marker: "@",
            itemTemplate: (itemData) => {
                return this._valueGetter(itemData);
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
        const baseConfig = super._getListConfig(options);

        return extend(baseConfig, {
            itemTemplate: this.options.itemTemplate
        });
    }

    insertEmbedContent(selectionChangedEvent) {
        const markerLength = this.options.marker.length;
        const caretPosition = this.getPosition();
        const startIndex = Math.max(0, caretPosition - markerLength);
        const selectedItem = selectionChangedEvent.component.option("selectedItem");

        const value = {
            value: this._valueGetter(selectedItem),
            id: this._idGetter(selectedItem),
            marker: this.options.marker
        };

        setTimeout(function() {
            this.quill.deleteText(startIndex, markerLength);
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

        const mentionIndex = insertOperation.indexOf(this.options.marker);

        if(mentionIndex !== -1) {
            this.savePosition(caret.index);
            this._popup.option("position", this._popupPosition);
            this._popup.show();
        }
    }

    get _popupPosition() {
        const mentionBounds = this.quill.getBounds(this.getPosition() - 1);
        const rootRect = this.quill.root.getBoundingClientRect();

        return {
            of: this.quill.root,
            offset: {
                h: mentionBounds.left,
                v: mentionBounds.bottom - rootRect.height
            },
            my: "top left",
            at: "bottom left",
            collision: {
                y: "flip",
                x: "flipfit"
            }
        };
    }
}

export default MentionModule;
