import $ from "../../core/renderer";

import Widget from "../widget/ui.widget";
import Button from "../button";
import { extend } from "../../core/utils/extend";
import typeUtils from "../../core/utils/type";

var FileManagerToolbar = Widget.inherit({
    _initMarkup: function() {
        var createButton = this._createButton("Create", "create");
        var renameButton = this._createButton("Rename", "rename");
        var moveButton = this._createButton("Move", "move");
        var copyButton = this._createButton("Copy", "copy");
        var deleteButton = this._createButton("Delete", "delete");
        var uploadButton = this._createButton("Upload", "upload");
        var downloadButton = this._createButton("Download", "download");

        this.$element()
            .append(
                createButton.$element(),
                renameButton.$element(),
                moveButton.$element(),
                copyButton.$element(),
                deleteButton.$element(),
                downloadButton.$element(),
                uploadButton.$element()
            );
    },

    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            onItemClick: null
        });
    },

    _createButton: function(text, name) {
        return this._createComponent($("<div>"), Button, {
            text: text,
            onClick: function(e) {
                this._onButtonClick(name);
            }.bind(this)
        });
    },

    _onButtonClick: function(buttonName) {
        var handler = this.option("onItemClick");
        if(buttonName && typeUtils.isFunction(handler)) {
            handler(buttonName);
        }
    }

});

module.exports = FileManagerToolbar;
