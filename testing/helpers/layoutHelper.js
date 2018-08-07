(function(root, factory) {
    /* global jQuery */
    if(typeof define === 'function' && define.amd) {
        define(function(require, exports, module) {
            module.exports = factory(
                require("jquery"),
                require("framework/html/view_engine").ViewEngine,
                require("framework/application").Application,
                require("framework/html/command_manager"),
                require("./frameworkMocks.js")
            );
        });
    } else {
        DevExpress.testHelpers = DevExpress.testHelpers || {};

        jQuery.extend(DevExpress.testHelpers, factory(
            jQuery,
            DevExpress.framework.html.ViewEngine,
            DevExpress.framework.Application,
            DevExpress.framework.html.CommandManager,
            DevExpress.mocks.framework
        ));
    }
}(this, function($, ViewEngine, Application, CommandManager, frameworkMocks) {

    var exports = {};

    exports.createLayoutController = function(options, createControllerInstance) {
        options = options || {};

        var $viewPort = $("#viewPort"),
            navigationManager = new frameworkMocks.MockStackBasedNavigationManager();

        var viewEngine = options.viewEngine || new ViewEngine($.extend({
            $root: options.$root || $("#templates-root"),
            device: options.device
        }, options.viewEngineOptions));

        var deferred = $.Deferred();

        viewEngine.init().done(function() {
            var layoutController = createControllerInstance($.extend({}, options.ctorOptions || {})),
                app = { router: new frameworkMocks.MockRouter({ __parseResult: [], __formatResult: [] }) },
                initOptions = options.initOptions || { app: app },
                navigation = Application.prototype._createNavigationCommands(initOptions.navigation || {}),
                commandMapping = Application.prototype._createCommandMapping(initOptions.commandMapping || {}, navigation),
                commandManager = new CommandManager({ commandMapping: commandMapping });

            layoutController.init($.extend({
                $viewPort: $viewPort,
                viewEngine: viewEngine,
                navigationManager: navigationManager,
                commandManager: commandManager,
                navigation: navigation
            }, initOptions || {}));

            Application.prototype._mapNavigationCommands(navigation, commandMapping),
            layoutController.renderNavigation(navigation);

            if(!options.activateManually) {
                layoutController.activate().done(function() {
                    deferred.resolve(layoutController);
                });
            } else {
                deferred.resolve(layoutController);
            }

            return layoutController;
        });

        return deferred;
    };

    exports.prepareNavigation = function(navigationConfig, commandMapping) {
        var navigationCommands = Application.prototype._createNavigationCommands(navigationConfig);
        Application.prototype._mapNavigationCommands(navigationCommands, commandMapping);
        return navigationCommands;
    };

    return exports;
}));
