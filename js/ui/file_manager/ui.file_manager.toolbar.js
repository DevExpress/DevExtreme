import $ from "../../core/renderer";

import Widget from "../widget/ui.widget";
import Button from "../button";
import { extend } from "../../core/utils/extend";
import typeUtils from "../../core/utils/type";

class FileManagerToolbar extends Widget {

    _initMarkup() {
        const createButton = this._createButton("Create", "create");
        const renameButton = this._createButton("Rename", "rename");
        const moveButton = this._createButton("Move", "move");
        const copyButton = this._createButton("Copy", "copy");
        const deleteButton = this._createButton("Delete", "delete");
        const downloadButton = this._createButton("Download", "download");
        const uploadButton = this._createButton("Upload file...", "upload");
        const thumbnailsButton = this._createButton("Thumbnails", "thumbnails");
        const detailsButton = this._createButton("Details", "details");

        this.$element()
            .append(
                createButton.$element(),
                renameButton.$element(),
                moveButton.$element(),
                copyButton.$element(),
                deleteButton.$element(),
                downloadButton.$element(),
                uploadButton.$element(),
                thumbnailsButton.$element(),
                detailsButton.$element()
            );
    }

    _getDefaultOptions() {
        return extend(super._getDefaultOptions(), {
            onItemClick: null
        });
    }

    _createButton(text, name) {
        return this._createComponent($("<div>"), Button, {
            text: text,
            onClick: e => this._onButtonClick(name)
        });
    }

    _onButtonClick(buttonName) {
        const handler = this.option("onItemClick");
        if(buttonName && typeUtils.isFunction(handler)) {
            handler(buttonName);
        }
    }

}

module.exports = FileManagerToolbar;
