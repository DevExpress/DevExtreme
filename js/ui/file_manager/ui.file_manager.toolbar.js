import $ from "../../core/renderer";

import Widget from "../widget/ui.widget";
import Button from "../button";

var FileManagerToolbar = Widget.inherit({
    _initMarkup: function() {
        var createButton = this._createComponent($("<div>"), Button, {
            text: 'Create',
        });
        var renameButton = this._createComponent($("<div>"), Button, {
            text: 'Rename',
        });
        var moveButton = this._createComponent($("<div>"), Button, {
            text: 'Move',
        });
        var deleteButton = this._createComponent($("<div>"), Button, {
            text: 'Delete',
        });

        this.$element()
            .append(
                createButton.$element(),
                renameButton.$element(),
                moveButton.$element(),
                deleteButton.$element()
            );
    },
});

module.exports = FileManagerToolbar;
