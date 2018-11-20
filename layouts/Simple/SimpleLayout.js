(function(root, factory) {
    /* global window, define, DevExpress, jQuery */
    if(typeof define === 'function' && define.amd) {
        define(function(require, exports, module) {
            module.exports = factory(
                require("jquery"),
                require("core/class"),
                require("framework/html/presets").layoutSets,
                require("framework/html/layout_controller").DefaultLayoutController,
                require("core/devices"),
                require("core/errors").log,

                require("ui/toolbar")
            );
        });
    } else {
        root.DevExpress.layouts = root.DevExpress.layouts || {};
        root.DevExpress.layouts.SimpleLayout = factory(
            jQuery,
            DevExpress.Class,
            DevExpress.framework.html.layoutSets,
            DevExpress.framework.html.DefaultLayoutController,
            DevExpress.devices,
            DevExpress.errors.log
        );
        root.DevExpress.framework.html.SimpleLayoutController = root.DevExpress.layouts.SimpleLayout.SimpleLayoutController;
        root.DevExpress.framework.html.Win8SimpleLayoutController = root.DevExpress.layouts.SimpleLayout.Win8SimpleLayoutController;
    }
}(window, function($, Class, layoutSets, DefaultLayoutController, devices, log) {

    var exports = {};

    var SimpleLayoutController = DefaultLayoutController.inherit({
        ctor: function(options) {
            options = options || {};
            options.name = options.name || "simple";
            this.callBase(options);

            var device = devices.current();

            if(device.win && device.phone || options.Win8SimpleLayoutControllerForced) {
                this.impl = new Win8SimpleLayoutImpl($.proxy(this._getViewFrame, this));
            } else {
                this.impl = new SimpleLayoutImpl();
            }
        },

        _onRenderComplete: function(viewInfo) {
            this.impl.onRenderComplete(viewInfo);
            this.callBase.apply(this, arguments);
        },

        disposeView: function(viewInfo) {
            this.impl.disposeView(viewInfo);
            this.callBase.apply(this, arguments);
        },

        _changeView: function(viewInfo) {
            var that = this,
                result = this.callBase.apply(this, arguments);

            result.done(function() {
                that.impl.changeView(viewInfo);
            });

            return result;
        }
    });

    var SimpleLayoutImpl = Class.inherit({
        ctor: $.noop,
        onRenderComplete: $.noop,
        disposeView: $.noop,
        changeView: $.noop
    });

    var HAS_TOOLBAR_BOTTOM_CLASS = "has-toolbar-bottom",
        LAYOUT_TOOLBAR_BOTTOM_SELECTOR = ".layout-toolbar-bottom";

    var Win8SimpleLayoutImpl = SimpleLayoutImpl.inherit({
        ctor: function(viewFrameGetter) {
            this._getViewFrame = viewFrameGetter;
            this.callBase.apply(this, arguments);
            this._toolbarOptionChangedHandler = $.proxy(this._onToolbarOptionChanged, this);
        },

        _onToolbarOptionChanged: function(args) {
            if(args.name === "items") {
                var appBar = args.component;

                if(appBar) {
                    this._refreshAppBarVisibility(appBar);
                }
                this._refreshHasToolbarClass();
            }
        },

        _getAppBar: function($markup) {
            var $appBar = $markup.find(LAYOUT_TOOLBAR_BOTTOM_SELECTOR);

            if($appBar.length !== 1) {
                return;
            }

            return $appBar.dxToolbar("instance");
        },

        _getCurrentAppBar: function() {
            return this._getAppBar(this._getViewFrame().find(".dx-active-view "));
        },

        onRenderComplete: function(viewInfo) {
            var appBar = this._getAppBar(viewInfo.renderResult.$markup);

            if(appBar) {
                this._refreshAppBarVisibility(appBar);
                appBar.on("optionChanged", this._toolbarOptionChangedHandler);
            }
        },

        disposeView: function(viewInfo) {
            var appBar = this._getAppBar(viewInfo.renderResult.$markup);

            if(appBar) {
                appBar.off("optionChanged", this._toolbarOptionChangedHandler);
            }
        },

        changeView: function(viewInfo) {
            this._refreshHasToolbarClass();
        },

        _refreshAppBarVisibility: function(appBar) {
            var isAppBarNotEmpty = false;

            $.each(appBar.option("items"), function(index, item) {
                if(item.visible) {
                    isAppBarNotEmpty = true;
                    return false;
                }
            });
            appBar.option("visible", isAppBarNotEmpty);
        },

        _refreshHasToolbarClass: function() {
            var appBar = this._getCurrentAppBar(),
                hasToolbar = appBar ? appBar.option("visible") : false;

            this._getViewFrame().toggleClass(HAS_TOOLBAR_BOTTOM_CLASS, hasToolbar);
        }

    });

    var Win8SimpleLayoutController = SimpleLayoutController.inherit({
        ctor: function(options) {
            options = options || {};
            options.Win8SimpleLayoutControllerForced = true;
            // deprecated since 15.2
            ///#DEBUG
            log("W0000", "Layouts", "Win8SimpleLayoutController", "15.1", "Use the SimpleLayoutController instead");
            ///#ENDDEBUG
            this.callBase.apply(this, arguments);
        }
    });

    layoutSets["navbar"] = layoutSets["navbar"] || [];
    layoutSets["navbar"].push({ platform: "win", root: false, phone: true, controller: new SimpleLayoutController() });
    layoutSets["navbar"].push({ platform: "android", root: false, controller: new SimpleLayoutController() });

    layoutSets["simple"] = layoutSets["simple"] || [];
    layoutSets["simple"].push({ controller: new SimpleLayoutController() });
    layoutSets["simple"].push({ platform: "win", phone: true, controller: new SimpleLayoutController() });

    layoutSets["split"] = layoutSets["split"] || [];
    layoutSets["split"].push({ platform: "win", requireCustomResolve: true, controller: new SimpleLayoutController() });
    layoutSets["split"].push({ platform: "win", root: false, phone: true, controller: new SimpleLayoutController() });

    exports.SimpleLayoutController = SimpleLayoutController;
    exports.Win8SimpleLayoutController = Win8SimpleLayoutController;

    return exports;

}));
