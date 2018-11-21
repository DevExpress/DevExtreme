(function(root, factory) {
    /* global window, define, DevExpress, jQuery */
    if(typeof define === 'function' && define.amd) {
        define(function(require, exports, module) {
            module.exports = factory(
                require("jquery"),
                require("framework/html/presets").layoutSets,
                require("framework/html/layout_controller").DefaultLayoutController,

                require("ui/pivot"),
                require("ui/toolbar")
            );
        });
    } else {
        root.DevExpress.layouts = root.DevExpress.layouts || {};
        root.DevExpress.layouts.PivotLayout = factory(
            jQuery,
            DevExpress.framework.html.layoutSets,
            DevExpress.framework.html.DefaultLayoutController
        );
        root.DevExpress.framework.html.PivotLayoutController = root.DevExpress.layouts.PivotLayout.PivotLayoutController;
    }
}(window, function($, layoutSets, DefaultLayoutController) {

    var exports = {},
        HAS_TOOLBAR_BOTTOM_CLASS = "has-toolbar-bottom",
        TOOLBAR_BOTTOM_SELECTOR = ".layout-toolbar-bottom",
        ACTIVE_PIVOT_ITEM_SELECTOR = ".dx-pivot-item:not(.dx-pivot-item-hidden)";

    var PivotLayoutController = DefaultLayoutController.inherit({

        ctor: function(options) {
            options = options || {};
            options.name = options.name || "pivot";
            this._viewsInLayout = {};
            this.callBase(options);
        },

        init: function(options) {
            this.callBase(options);
        },

        _createNavigationWidget: function() {
            var that = this;

            this.$root = $("<div/>")
                .addClass("pivot-layout");

            this.$pivot = $("<div/>")
                .appendTo(this.$root)
                .dxPivot({
                    itemTemplate: function(itemData, itemIndex, itemElement) {
                        var emptyLayout = that._createEmptyLayout();
                        that._showElements(emptyLayout);
                        emptyLayout.find(".layout-footer").remove();
                        emptyLayout.appendTo(itemElement);
                    }
                })
                .dxCommandContainer({ id: 'global-navigation' });

            this.$pivot.dxPivot("instance").on("optionChanged", function(args) {
                if(args.name === "items") {
                    // Layouts design is not supposed to be able to remove a rendered view from a layout and insert it again.
                    // Since the dxPivot widget doesn't support changing its items dynamically,
                    // the items are recreated and view render cache should be cleared
                    that._clearPivotViewsRenderCache();
                }
            });

            var $tmpLayoutForFooter = that._createEmptyLayout();
            this._showElements($tmpLayoutForFooter);
            this.$footer = $tmpLayoutForFooter.find(".layout-footer").insertAfter(this.$pivot);

            return this.$pivot;
        },

        _clearPivotViewsRenderCache: function() {
            var that = this;

            $.each(this._viewsInLayout, function(key, viewInfo) {
                that._clearRenderResult(viewInfo);
            });
        },

        _renderNavigationImpl: function(navigationCommands) {
            var container = this.$pivot.dxCommandContainer("instance");
            this._commandManager.renderCommandsToContainers(navigationCommands, [container]);
        },

        element: function() {
            return this.$root;
        },

        _getViewFrame: function(viewInfo) {
            var $result = this.$pivot.find(ACTIVE_PIVOT_ITEM_SELECTOR);
            $result = $result.add(this.$footer);
            return $result;
        },

        _showViewImpl: function(viewInfo, direction, previousViewTemplateId) {
            this._showViewElements(viewInfo.renderResult.$markup);
            this._changeView(viewInfo, previousViewTemplateId);
            this._changeAppBar();
            this._viewsInLayout[viewInfo.key] = viewInfo;
            return $.Deferred().resolve().promise();
        },

        _changeAppBar: function() {
            var $appBar = this.$footer.find(".dx-active-view " + TOOLBAR_BOTTOM_SELECTOR),
                appBar = $appBar.dxToolbar("instance");

            if(appBar) {
                this._refreshAppBarVisibility(appBar, this.$root);
            }
        },

        _refreshAppBarVisibility: function(appBar, $container) {
            var isAppBarNotEmpty = false;

            $.each(appBar.option("items"), function(index, item) {
                if(item.visible) {
                    isAppBarNotEmpty = true;
                    return false;
                }
            });

            $container.toggleClass(HAS_TOOLBAR_BOTTOM_CLASS, isAppBarNotEmpty);
            appBar.option("visible", isAppBarNotEmpty);
        },

        _hideView: function(viewInfo) {
            this.callBase.apply(this, arguments);
            this._changeAppBar();
        }
    });

    layoutSets["navbar"] = layoutSets["navbar"] || [];
    layoutSets["navbar"].push({ platform: "win", version: [8], phone: true, root: true, controller: new PivotLayoutController() });

    exports.PivotLayoutController = PivotLayoutController;

    return exports;

}));
