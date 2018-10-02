import { getQuill } from "../quill_importer";
import $ from "../../../core/renderer";
import { extend } from "../../../core/utils/extend";

import Popover from "../../popover";
import List from "../../list";

const SUGGESTION_LIST_CLASS = "dx-suggestion-list";
const BaseModule = getQuill().import("core/module");

class ListPopoverModule extends BaseModule {

    _getDefaultOptions() {
        return {
            dataSource: null
        };
    }

    constructor(quill, options) {
        super(quill, options);

        this.options = extend({}, this._getDefaultOptions(), options);
        this._popover = this.renderPopover();
    }

    renderList($container, options) {
        $container.addClass(SUGGESTION_LIST_CLASS);
        this._list = this.options.editorInstance._createComponent($container, List, options);
    }

    renderPopover() {
        let editorInstance = this.options.editorInstance,
            $container = $("<div>").appendTo(editorInstance.$element()),
            popoverConfig = this._getPopoverConfig();

        return editorInstance._createComponent($container, Popover, popoverConfig);
    }

    _getPopoverConfig() {
        return {
            contentTemplate: ($content) => {
                const listConfig = this._getListConfig(this.options);
                this.renderList($content, listConfig);
            },
            deferRendering: false,
            onShown: () => {
                this._list.focus();
            },
            onHidden: () => {
                this._list.unselectAll();
                this._list.option("focusedElement", null);
            }
        };
    }

    _getListConfig(options) {
        return {
            dataSource: options.dataSource,
            onSelectionChanged: this.selectionChangedHandler.bind(this),
            selectionMode: "single"
        };
    }

    selectionChangedHandler(e) {
        if(this._popover.option("visible")) {
            this._popover.hide();

            this.insertEmbedContent(e);
        }
    }

    insertEmbedContent(selectionChangedEvent) { }

    savePosition(position) {
        this.caretPosition = position;
    }

    getPosition() {
        return this.caretPosition;
    }
}

export default ListPopoverModule;
