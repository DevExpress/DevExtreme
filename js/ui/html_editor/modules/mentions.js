import { compileGetter } from "../../../core/utils/data";
import { isString } from "../../../core/utils/type";
import { extend } from "../../../core/utils/extend";

import PopupModule from "./popup";

const USER_ACTION = "user";
const DEFAULT_MARKER = "@";

class MentionModule extends PopupModule {
    _getDefaultOptions() {
        const baseConfig = super._getDefaultOptions();

        return extend(baseConfig, {
            itemTemplate: (itemData) => {
                return this._valueGetter(itemData);
            },
            valueExpr: "this",
            displayExpr: "this"
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

    insertEmbedContent() {
        const markerLength = this._activeMarker.marker.length;
        const caretPosition = this.getPosition();
        const startIndex = Math.max(0, caretPosition - markerLength);
        const selectedItem = this._list.option("selectedItem");

        const value = {
            value: this._valueGetter(selectedItem),
            id: this._idGetter(selectedItem),
            marker: this._activeMarker.marker
        };

        setTimeout(function() {
            this.quill.deleteText(startIndex, markerLength, "silent");
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

        this._activeMarker = this._mentions[insertOperation];

        if(this._activeMarker) {
            this._updateList(this._activeMarker);
            this.savePosition(caret.index);
            this._popup.option("position", this._popupPosition);
            this._popup.show();
        }
    }

    _updateList({ dataSource, displayExpr, valueExpr, itemTemplate }) {
        this.compileGetters({ displayExpr, valueExpr });
        this._list.option({
            dataSource,
            displayExpr,
            itemTemplate,
        });
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
}

export default MentionModule;
