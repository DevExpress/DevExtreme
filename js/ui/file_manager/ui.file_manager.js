import $ from "../../core/renderer";
import Widget from "../widget/ui.widget";
import registerComponent from "../../core/component_registrator";

var FileManager = Widget.inherit({

    _initTemplates: function() {
    },

    _initMarkup: function() {
        this.callBase();
        $("<span>File Manager</span>").appendTo(this.$element());
    }

});

registerComponent("dxFileManager", FileManager);

module.exports = FileManager;
