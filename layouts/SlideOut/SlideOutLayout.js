(function(root, factory) {
    /* global window, define, DevExpress, jQuery */
    if(typeof define === 'function' && define.amd) {
        define(function(require, exports, module) {
            module.exports = factory(
                require("jquery"),
                require("framework/html/presets").layoutSets,
                require("framework/html/layout_controller").DefaultLayoutController,
                require("animation/fx"),
                require("core/devices"),

                require("ui/slide_out"),
                require("ui/toolbar"),
                require("ui/button")
            );
        });
    } else {
        root.DevExpress.layouts = root.DevExpress.layouts || {};
        root.DevExpress.layouts.SlideOutLayout = factory(
            jQuery,
            DevExpress.framework.html.layoutSets,
            DevExpress.framework.html.DefaultLayoutController,
            DevExpress.fx,
            DevExpress.devices
        );
        root.DevExpress.framework.html.SlideOutController = root.DevExpress.layouts.SlideOutLayout.SlideOutController;
    }
}(window, function($, layoutSets, DefaultLayoutController, fx, devices) {

    var exports = {};

    var SlideOutController = DefaultLayoutController.inherit({

        ctor: function(options) {
            options = options || {};
            options.name = options.name || "slideout";
            this.swipeEnabled = options.swipeEnabled === undefined ? true : options.swipeEnabled;
            this.callBase(options);
        },
        init: function(options) {
            this.callBase(options);
            this._navigationManager = options.navigationManager;
            this._navigationCanceledHandler = $.proxy(this._onNavigatingCanceled, this);
        },

        activate: function() {
            var result = this.callBase.apply(this, arguments);

            this._navigationManager.on("navigationCanceled", this._navigationCanceledHandler);

            return result;
        },

        deactivate: function() {
            this._navigationManager.off("navigationCanceled", this._navigationCanceledHandler);

            return this.callBase.apply(this, arguments);
        },

        disable: function() {
            if(this.slideOut.option("menuVisible")) {
                this._toggleNavigation();
            }

            return this.callBase.apply(this, arguments);
        },

        _onNavigatingCanceled: function(args) {
            if(this.slideOut.option("menuVisible") && args.cancelReason !== "redirect") {
                this._toggleNavigation();
            }
        },
        _createNavigationWidget: function() {
            this.$slideOut = $("<div data-bind='dxSlideOut: {  menuItemTemplate: $(\"#slideOutMenuItemTemplate\"), contentTemplate: \" \" }'></div>")
                .dxCommandContainer({ id: 'global-navigation' });

            this._applyTemplate(this.$slideOut, this._layoutModel);

            this.callBase();

            this.slideOut = this.$slideOut.dxSlideOut("instance");
            this.slideOut.option("swipeEnabled", this.swipeEnabled);
            this.$slideOut.find(".dx-slideout-item-container").append(this._$mainLayout);
            return this.$slideOut;
        },

        _renderNavigationImpl: function(navigationCommands) {
            var container = this.$slideOut.dxCommandContainer("instance");
            this._commandManager.renderCommandsToContainers(navigationCommands, [container]);
        },

        element: function() {
            return this.$slideOut;
        },

        _showViewImpl: function(viewInfo, direction, previousViewTemplateId) {
            this._fxOffSaved = fx.off;

            if(this.slideOut.option("menuVisible")) {
                fx.off = true;
            }

            return this.callBase.apply(this, arguments);
        },

        _getReadyForRenderDeferredItems: function(viewInfo) {
            var result = this.callBase(viewInfo);

            fx.off = this._fxOffSaved;
            if(this.slideOut.option("menuVisible")) {
                result = $.when(this._toggleNavigation(), result);
            }

            return result;
        },

        _onViewShown: function(viewInfo) {
            this._refreshVisibility();
        },

        _refreshVisibility: function() {
            // NOTE : T111662 - View rendering only after tap on it
            if(devices.real().platform === "android") {
                this.$slideOut.css("backface-visibility", "hidden");
                this.$slideOut.css("backface-visibility");
                this.$slideOut.css("backface-visibility", "visible");
            }
        },

        _viewHasBackCommands: function(viewInfo) {
            var hasBackCommands = false;

            $.each(viewInfo.commands, function(index, command) {
                if(((command.option("behavior") === "back" || command.option("id") === "back")) && command.option("visible")) {
                    hasBackCommands = true;
                    return false;
                }
            });

            return hasBackCommands;
        },

        _onRenderComplete: function(viewInfo) {
            var that = this;

            if(!that._viewHasBackCommands(viewInfo)) {
                that._initNavigationButton(viewInfo.renderResult.$markup);
            }

            var $content = viewInfo.renderResult.$markup.find(".layout-content"),
                $appBar = viewInfo.renderResult.$markup.find(".layout-toolbar-bottom"),
                appBar = $appBar.dxToolbar("instance");

            if(appBar) {
                that._refreshAppBarVisibility(appBar, $content);
                appBar.on("optionChanged", function(args) {
                    if(args.name === "items") {
                        that._refreshAppBarVisibility(appBar, $content);
                    }
                });
            }
        },

        _refreshAppBarVisibility: function(appBar, $content) {
            var isAppBarNotEmpty = false;

            $.each(appBar.option("items"), function(index, item) {
                if(item.visible) {
                    isAppBarNotEmpty = true;
                    return false;
                }
            });

            $content.toggleClass("has-toolbar-bottom", isAppBarNotEmpty);
            appBar.option("visible", isAppBarNotEmpty);
        },

        _initNavigationButton: function($markup) {
            var that = this,
                $toolbar = $markup.find(".layout-toolbar"),
                toolbar = $toolbar.dxToolbar("instance");

            var initNavButton = function() {
                toolbar.option("items[0].visible", true);// nav button item
                $toolbar.find(".nav-button").dxButton("instance").option("onClick", $.proxy(that._toggleNavigation, that, $markup));
            };

            initNavButton();

            toolbar.on("contentReady", function(args) {
                initNavButton();
            });
        },

        _toggleNavigation: function($markup) {
            return this.slideOut.toggleMenuVisibility();
        }

    });

    layoutSets["slideout"] = layoutSets["slideout"] || [];
    layoutSets["slideout"].push({ platform: "ios", controller: new SlideOutController() });
    layoutSets["slideout"].push({ platform: "android", controller: new SlideOutController() });
    layoutSets["slideout"].push({ platform: "generic", controller: new SlideOutController() });
    layoutSets["slideout"].push({ platform: "win", controller: new SlideOutController() });

    exports.SlideOutController = SlideOutController;

    return exports;

}));
