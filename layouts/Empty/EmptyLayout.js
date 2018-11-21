(function(root, factory) {
    /* global window, define, DevExpress, jQuery */
    if(typeof define === 'function' && define.amd) {
        define(function(require, exports, module) {
            module.exports = factory(
                require("jquery"),
                require("framework/html/presets").layoutSets,
                require("framework/html/layout_controller").DefaultLayoutController
            );
        });
    } else {
        root.DevExpress.layouts = root.DevExpress.layouts || {};
        root.DevExpress.layouts.EmptyLayout = factory(
            jQuery,
            DevExpress.framework.html.layoutSets,
            DevExpress.framework.html.DefaultLayoutController
        );
        root.DevExpress.framework.html.EmptyLayoutController = root.DevExpress.layouts.EmptyLayout.EmptyLayoutController;
    }
}(window, function($, layoutSets, DefaultLayoutController) {

    var exports = {};

    var EmptyLayoutController = DefaultLayoutController.inherit({
        ctor: function(options) {
            options = options || {};
            options.name = options.name || "empty";
            this.callBase(options);
        }
    });

    layoutSets["empty"] = layoutSets["empty"] || [];
    layoutSets["empty"].push({ controller: new EmptyLayoutController() });

    exports.EmptyLayoutController = EmptyLayoutController;

    return exports;

}));
