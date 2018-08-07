(function(root, factory) {
    /* global jQuery */
    if(typeof define === 'function' && define.amd) {
        define(function(require, exports, module) {
            module.exports = factory(
                require("jquery"),
                require("core/class"),
                require("core/events_mixin"),
                require("framework/html/html_application"),
                require("./frameworkMocks.js"),

                require("framework/html/view_engine_components")
            );
        });
    } else {
        DevExpress.mocks.framework.html = {};

        jQuery.extend(DevExpress.mocks.framework.html, factory(
            jQuery,
            DevExpress.Class,
            DevExpress.EventsMixin,
            DevExpress.framework.html.HtmlApplication,
            DevExpress.mocks.framework,

            DevExpress.framework.html.ViewEngineComponents
        ));
    }
}(this, function($, Class, EventsMixin, HtmlApplication, frameworkMocks) {

    var exports = {};

    exports.MockCommandManager = Class.inherit({
        ctor: function(options) {
            options = options || {};
            this.__createCommandsResult = options.__createCommandsResult || [];
            this.__createCommandsLog = [];
        },
        findCommands: function($markup, model) {
            this.__createCommandsLog.push($markup);
            return this.__createCommandsResult;
        },
        layoutCommands: function($markup, model) {
            this.__layoutCommandsLog = [];
            this.__layoutCommandsLog.push({
                $markup: $markup,
                model: model
            });
        }
    });

    exports.MockViewEngine = Class.inherit({
        ctor: function(options) {
            options = options || {};
            // this.__renderBlankViewLog = [];
            // this.__renderCompleteViewLog = [];
            // this.__renderBlankResult = {};
            // this.__renderCompleteResult = {};
            // this.commandManager = new exports.MockCommandManager();
            this.__findViewComponentOptions = options.__findViewComponentOptions || [];
        },
        getViewTemplateInfo: function(viewName) {
            var component = $("<div/>").dxView().dxView("instance");

            component.option(this.__findViewComponentOptions[viewName]);

            return component;
        }
        // renderBlankView: function(viewInfo, $renderTarget) {
        //    this.__renderBlankViewLog.push({
        //        viewInfo: viewInfo,
        //        $renderTarget: $renderTarget
        //    });
        //    viewInfo.renderResult = this.__renderBlankResult;
        // },
        // renderCompleteView: function(viewInfo, $renderTarget) {
        //    this.__renderCompleteViewLog.push({
        //        viewInfo: viewInfo,
        //        $renderTarget: $renderTarget
        //    });
        //    var result = this.__renderCompleteResult || viewInfo.renderResult;
        //    result.rendered = true;
        //    viewInfo.renderResult = result;
        // }
    });

    exports.MockLayoutController = Class.inherit({
        ctor: function() {
            this.__initLog = [];
            this.__activateLog = [];
            this.__deactivateLog = [];
            this.__showViewLog = [];
        },
        init: function(options) {
            this.__initLog.push(options);
        },
        ensureActive: function() {
            this.__activateLog.push(arguments);
            return $.Deferred().resolve().promise();
        },
        activate: function() {
            this.__activateLog.push(arguments);
            return $.Deferred().resolve().promise();
        },
        deactivate: function() {
            this.__deactivateLog.push(arguments);
            return $.Deferred().resolve().promise();
        },
        showView: function(viewInfo, direction) {
            this.__showViewLog.push({
                viewInfo: viewInfo,
                direction: direction
            });
            this.fireEvent("viewRendered", [viewInfo]);
            this.fireEvent("viewShowing", [viewInfo]);
            return $.Deferred().resolve().promise();
        },
        renderNavigation: function(navigationCommands) {

        },
        element: function() {
            return $("<div/>");
        }
    }).include(EventsMixin);


    exports.MockHtmlApplication = HtmlApplication.inherit({
        ctor: function(options) {
            this.__showViewLog = [];
            options = options || {};
            options.layoutSet = options.layoutSet || [{ controller: new exports.MockLayoutController() }];
            this.callBase($.extend(false, {
                navigationManager: new frameworkMocks.MockStackBasedNavigationManager(),
                router: new frameworkMocks.MockRouter({
                    __parseResult: options.__routeParseResult
                }),
                viewPort: { disabled: true },
                viewEngine: new exports.MockViewEngine()
            }, options));
        },

        _showRenderedView: function(viewInfo) {
            this.__showViewLog.push(viewInfo);
            return new $.Deferred().resolve().promise();
        }
    });

    // exports.MockKnockoutJSTemplateEngine = DX.framework.html.KnockoutJSTemplateEngine.inherit({
    //    ctor: function (options) {
    //        options = options || {};
    //        this.callBase($.extend(false, {
    //            navigationManager: new frameworkMocks.MockStackBasedNavigationManager()
    //        }, options));
    //    }
    // });

    return exports;

}));
