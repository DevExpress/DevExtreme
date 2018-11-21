(function(root, factory) {
    /* global window, define, DevExpress */
    if(typeof define === 'function' && define.amd) {
        define(function(require, exports, module) {
            module.exports = factory(
                require("framework/html/presets").layoutSets,
                require("framework/html/layout_controller").DefaultLayoutController,

                require("ui/toolbar")
            );
        });
    } else {
        root.DevExpress.layouts = root.DevExpress.layouts || {};
        root.DevExpress.layouts.NavbarLayout = factory(
            DevExpress.framework.html.layoutSets,
            DevExpress.framework.html.DefaultLayoutController
        );
        root.DevExpress.framework.html.NavBarController = root.DevExpress.layouts.NavbarLayout.NavBarController;
    }
}(window, function(layoutSets, DefaultLayoutController) {

    var exports = {},
        HAS_NAVBAR_CLASS = "has-navbar",
        HAS_TOOLBAR_CLASS = "has-toolbar",

        LAYOUT_FOOTER_SELECTOR = ".layout-footer",
        ACTIVE_TOOLBAR_SELECTOR = ".dx-active-view .dx-toolbar";

    var NavBarController = DefaultLayoutController.inherit({

        ctor: function(options) {
            options = options || {};
            options.name = options.name || "navbar";
            this.callBase(options);
        },

        _createNavigationWidget: function(navigationCommands) {
            this.callBase(navigationCommands);
            this.$navbar = this._$mainLayout.find(".navbar-container");
            return this.$navbar;
        },

        _renderNavigationImpl: function(navigationCommands) {
            this.callBase(navigationCommands);
            if(navigationCommands.length) {
                this._$mainLayout.addClass(HAS_NAVBAR_CLASS);
            }
        },

        _showViewImpl: function(viewInfo) {
            var that = this;

            return that.callBase.apply(that, arguments).done(function() {
                var $toolbar = that._$mainLayout.find(LAYOUT_FOOTER_SELECTOR).find(ACTIVE_TOOLBAR_SELECTOR),
                    isToolbarEmpty = !$toolbar.length || !$toolbar.dxToolbar("instance").option("visible");

                that._$mainLayout.toggleClass(HAS_TOOLBAR_CLASS, !isToolbarEmpty);
            });
        }
    });

    layoutSets["navbar"] = layoutSets["navbar"] || [];
    layoutSets["navbar"].push({ platform: "ios", controller: new NavBarController() });
    layoutSets["navbar"].push({ platform: "android", controller: new NavBarController() });
    layoutSets["navbar"].push({ platform: "generic", controller: new NavBarController() });
    layoutSets["navbar"].push({ platform: "win", controller: new NavBarController() });

    layoutSets["split"] = layoutSets["split"] || [];
    layoutSets["split"].push({ platform: "win", phone: false, root: true, pane: "master", controller: new NavBarController() });
    layoutSets["split"].push({ platform: "win", phone: true, controller: new NavBarController() });

    exports.NavBarController = NavBarController;

    return exports;

}));
