/* global DevExpress */

require("./core");

/// BUNDLER_PARTS
require("../../integration/knockout");

module.exports = DevExpress.framework = {};

DevExpress.framework.dxCommand = require("../../framework/command");
DevExpress.framework.Router = require("../../framework/router");
DevExpress.framework.StateManager = require("../../framework/state_manager");

DevExpress.framework.ViewCache = require("../../framework/view_cache");
DevExpress.framework.NullViewCache = require("../../framework/view_cache").NullViewCache;
DevExpress.framework.ConditionalViewCacheDecorator = require("../../framework/view_cache").ConditionalViewCacheDecorator;
DevExpress.framework.CapacityViewCacheDecorator = require("../../framework/view_cache").CapacityViewCacheDecorator;
DevExpress.framework.HistoryDependentViewCacheDecorator = require("../../framework/view_cache").HistoryDependentViewCacheDecorator;

DevExpress.framework.dxCommandContainer = require("../../framework/html/command_container");

DevExpress.framework.dxView = require("../../framework/html/view_engine_components").dxView;
DevExpress.framework.dxLayout = require("../../framework/html/view_engine_components").dxLayout;
DevExpress.framework.dxViewPlaceholder = require("../../framework/html/view_engine_components").dxViewPlaceholder;
DevExpress.framework.dxContentPlaceholder = require("../../framework/html/view_engine_components").dxContentPlaceholder;
DevExpress.framework.dxTransition = require("../../framework/html/view_engine_components").dxTransition;
DevExpress.framework.dxContent = require("../../framework/html/view_engine_components").dxContent;

DevExpress.framework.html = {};
DevExpress.framework.html.HtmlApplication = require("../../framework/html/html_application");
/// BUNDLER_PARTS_END

DevExpress.framework.Route = require("../../framework/router").Route;
DevExpress.framework.MemoryKeyValueStorage = require("../../framework/state_manager").MemoryKeyValueStorage;

// For tests
DevExpress.framework.NavigationDevices = require("../../framework/navigation_devices");
DevExpress.framework.NavigationManager = require("../../framework/navigation_manager");

DevExpress.framework.createActionExecutors = require("../../framework/action_executors").createActionExecutors;

DevExpress.framework.Application = require("../../framework/application").Application;

var browserAdapters = require("../../framework/browser_adapters");
DevExpress.framework.DefaultBrowserAdapter = browserAdapters.DefaultBrowserAdapter;
DevExpress.framework.OldBrowserAdapter = browserAdapters.OldBrowserAdapter;
DevExpress.framework.BuggyAndroidBrowserAdapter = browserAdapters.BuggyAndroidBrowserAdapter;
DevExpress.framework.HistorylessBrowserAdapter = browserAdapters.HistorylessBrowserAdapter;
DevExpress.framework.BuggyCordovaWP81BrowserAdapter = browserAdapters.BuggyCordovaWP81BrowserAdapter;

DevExpress.framework.CommandMapping = require("../../framework/command_mapping");

DevExpress.framework.HistoryBasedNavigationDevice = require("../../framework/navigation_devices").HistoryBasedNavigationDevice;
DevExpress.framework.StackBasedNavigationDevice = require("../../framework/navigation_devices").StackBasedNavigationDevice;

DevExpress.framework.HistoryBasedNavigationManager = require("../../framework/navigation_manager").HistoryBasedNavigationManager;
DevExpress.framework.StackBasedNavigationManager = require("../../framework/navigation_manager").StackBasedNavigationManager;
DevExpress.framework.NavigationStack = require("../../framework/navigation_manager").NavigationStack;

DevExpress.framework.utils = require("../../framework/utils").utils;
DevExpress.framework.templateProvider = require("../../framework/utils").templateProvider;


DevExpress.framework.html.CommandManager = require("../../framework/html/command_manager");

DevExpress.framework.html.HtmlApplication = require("../../framework/html/html_application");

DevExpress.framework.html.layoutSets = require("../../framework/html/presets").layoutSets;
DevExpress.framework.html.animationSets = require("../../framework/html/presets").animationSets;

// TODO: discuss publishing this
DevExpress.framework.html.DefaultLayoutController = require("../../framework/html/layout_controller").DefaultLayoutController;
DevExpress.framework.html.layoutSets = require("../../framework/html/layout_controller").layoutSets;

DevExpress.framework.html.MarkupComponent = require("../../framework/html/markup_component").MarkupComponent;

DevExpress.framework.html.ViewEngine = require("../../framework/html/view_engine").ViewEngine;
DevExpress.framework.html.ViewEngineComponents = require("../../framework/html/view_engine_components");

var widgetCommandAdaptersModule = require("../../framework/html/widget_command_adapters");
DevExpress.framework.html.commandToDXWidgetAdapters = {
    dxToolbar: widgetCommandAdaptersModule.dxToolbar,
    dxList: widgetCommandAdaptersModule.dxList,
    dxNavBar: widgetCommandAdaptersModule.dxNavBar,
    dxPivot: widgetCommandAdaptersModule.dxPivot,
    dxSlideOut: widgetCommandAdaptersModule.dxSlideOut
};
