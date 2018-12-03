(function(root, factory) {
    /* global window, define, DevExpress, jQuery */
    if(typeof define === 'function' && define.amd) {
        define(function(require, exports, module) {
            module.exports = factory(
                require("jquery"),
                require("framework/html/presets").layoutSets,
                require("framework/html/layout_controller").DefaultLayoutController,
                require("../Simple/SimpleLayout.js").SimpleLayoutController,

                require("ui/popup")
            );
        });
    } else {
        root.DevExpress.layouts = root.DevExpress.layouts || {};
        root.DevExpress.layouts.PopupLayout = factory(
            jQuery,
            DevExpress.framework.html.layoutSets,
            DevExpress.framework.html.DefaultLayoutController,
            DevExpress.layouts.SimpleLayout.SimpleLayoutController
        );
        root.DevExpress.framework.html.OverlayLayoutControllerBase = root.DevExpress.layouts.PopupLayout.OverlayLayoutControllerBase;
        root.DevExpress.framework.html.PopupLayoutController = root.DevExpress.layouts.PopupLayout.PopupLayoutController;
    }
}(window, function($, layoutSets, DefaultLayoutController, SimpleLayoutController) {

    var exports = {},
        abstract = DefaultLayoutController.abstract;

    var OverlayLayoutControllerBase = DefaultLayoutController.inherit({
        ctor: function(options) {
            options = options || {};
            this.callBase(options);
            if(!options.childController) {
                //#DEBUG
                this._ensureChildController(SimpleLayoutController, "SimpleLayout");
                //#ENDDEBUG
                this.childController = new SimpleLayoutController();
            } else {
                this.childController = options.childController;
            }
            this.contentContainerSelector = options.contentContainerSelector;
        },

        _initChildController: function(options) {
            var that = this,
                $targetViewPort = that._$mainLayout.find(this.contentContainerSelector);

            that.childController.init($.extend({}, options, { $viewPort: $targetViewPort }));

            $.each(["viewRendered", "viewShowing", "viewReleased", "viewHidden"], function(_, callbacksPropertyName) {
                that.childController.on(callbacksPropertyName, function(args) {
                    that.fireEvent(callbacksPropertyName, [args]);
                });
            });
        },

        _ensureChildController: function(controller, layoutName) {
            if(!controller) {
                throw new Error(layoutName + "Controller is not found but it is required by the '" + this.name + "' layout for specified platform and device. Make sure the " + layoutName + ".* files are referenced in your main *.html file or specify other platform and device.");
            }
        },

        _base: function() {
            return DefaultLayoutController.prototype;
        },

        _showContainerWidget: abstract,

        _hideContainerWidget: abstract,

        init: function(options) {
            options = options || {};
            this.callBase(options);
            this._initChildController(options);
        },

        activate: function($target) {
            var that = this,
                result;

            that.childController.activate();
            that._base().activate.call(that, $target);
            result = that._showContainerWidget($target);

            return result;
        },

        deactivate: function() {
            var that = this,
                result;

            result = that._hideContainerWidget();

            result.done(function() {
                that._base().deactivate.call(that);
                that.childController.deactivate();
            });

            return result;
        },

        showView: function(viewInfo, direction) {
            return this.childController.showView(viewInfo, direction);
        }
    });

    var PopupLayoutController = OverlayLayoutControllerBase.inherit({
        ctor: function(options) {
            options = options || {};
            options.name = options.name || "popup";
            options.contentContainerSelector = options.contentContainerSelector || ".child-controller-content";
            this.isOverlay = true;
            this._targetContainer = options.targetContainer;
            this.callBase(options);
        },

        init: function(options) {
            this.callBase(options);
            this._popup = this._$mainLayout.find(".popup-container").dxPopup("instance");
            if(this._targetContainer) {
                this._popup.option("container", this._targetContainer);
            }
        },

        _showContainerWidget: function() {
            return this._popup.show();
        },

        _hideContainerWidget: function() {
            return this._popup.hide();
        }
    });

    $.each(["navbar", "simple", "slideout", "pivot", "split"], function(index, name) {
        layoutSets[name] = layoutSets[name] || [];
        $.each(layoutSets[name], function(index, layoutInfo) {
            layoutInfo.modal = false;
        });
        layoutSets[name].push({ modal: true, controller: new PopupLayoutController() });
    });

    exports.OverlayLayoutControllerBase = OverlayLayoutControllerBase;
    exports.PopupLayoutController = PopupLayoutController;

    return exports;

}));
