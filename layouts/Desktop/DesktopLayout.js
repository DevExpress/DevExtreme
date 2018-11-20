
(function(root, factory) {
    /* global window, define, DevExpress */
    if(typeof define === 'function' && define.amd) {
        define(function(require, exports, module) {
            module.exports = factory(
                require("framework/html/presets").layoutSets,
                require("framework/html/layout_controller").DefaultLayoutController
            );
        });
    } else {
        factory(
            DevExpress.framework.html.layoutSets,
            DevExpress.framework.html.DefaultLayoutController
        );
    }
}(window, function(layoutSets, DefaultLayoutController) {

    var exports = {};

    layoutSets["desktop"] = layoutSets["desktop"] || [];
    layoutSets["desktop"].push({
        platform: "generic",
        controller: new DefaultLayoutController({ name: "desktop" })
    });

    return exports;

}));
