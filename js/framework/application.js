require("../integration/jquery");

var $ = require("jquery"),
    Class = require("../core/class"),
    window = require("../core/utils/window").getWindow(),
    abstract = Class.abstract,
    Action = require("../core/action"),
    commonUtils = require("../core/utils/common"),
    typeUtils = require("../core/utils/type"),
    iteratorUtils = require("../core/utils/iterator"),
    extend = require("../core/utils/extend").extend,
    mergeCommands = require("./utils").utils.mergeCommands,
    createActionExecutors = require("./action_executors").createActionExecutors,
    Router = require("./router"),
    NavigationManager = require("./navigation_manager"),
    StateManager = require("./state_manager"),
    dxCommand = require("./command"),
    messageLocalization = require("../localization/message"),
    CommandMapping = require("./command_mapping"),
    ViewCache = require("./view_cache"),
    EventsMixin = require("../core/events_mixin"),
    sessionStorage = require("../core/utils/storage").sessionStorage,
    dataUtils = require("../data/utils"),
    errors = require("./errors"),
    when = require("../core/utils/deferred").when,
    BACK_COMMAND_TITLE,
    INIT_IN_PROGRESS = "InProgress",
    INIT_COMPLETE = "Inited";

var Application = Class.inherit({
    ctor: function(options) {
        options = options || {};
        this._options = options;
        this.namespace = options.namespace || window;
        this._applicationMode = options.mode ? options.mode : "mobileApp";
        this.components = [];

        BACK_COMMAND_TITLE = messageLocalization.localizeString("@Back");

        this.router = options.router || new Router();

        var navigationManagers = {
            mobileApp: NavigationManager.StackBasedNavigationManager,
            webSite: NavigationManager.HistoryBasedNavigationManager
        };

        this.navigationManager = options.navigationManager ||
            new navigationManagers[this._applicationMode]({
                keepPositionInStack: options.navigateToRootViewMode === "keepHistory"
            });
        this.navigationManager.on("navigating", this._onNavigating.bind(this));
        this.navigationManager.on("navigatingBack", this._onNavigatingBack.bind(this));
        this.navigationManager.on("navigated", this._onNavigated.bind(this));
        this.navigationManager.on("navigationCanceled", this._onNavigationCanceled.bind(this));

        this.stateManager = options.stateManager || new StateManager({ storage: options.stateStorage || sessionStorage() });
        this.stateManager.addStateSource(this.navigationManager);


        this.viewCache = this._createViewCache(options);

        this.commandMapping = this._createCommandMapping(options.commandMapping);

        this.createNavigation(options.navigation);

        this._isNavigating = false;
        this._viewLinksHash = {};
        this._removedViewInfos = [];

        Action.registerExecutor(createActionExecutors(this));

        this.components.push(this.router);
        this.components.push(this.navigationManager);
    },
    _createViewCache: function(options) {
        var result;

        if(options.viewCache) {
            result = options.viewCache;
        } else if(options.disableViewCache) {
            result = new ViewCache.NullViewCache();
        } else {
            result = new ViewCache.CapacityViewCacheDecorator({
                size: options.viewCacheSize,
                viewCache: new ViewCache()
            });
        }

        result.on("viewRemoved", (function(e) {
            this._releaseViewLink(e.viewInfo);
        }).bind(this));

        return result;
    },

    _createCommandMapping: function(commandMapping) {
        var result = commandMapping;
        if(!(commandMapping instanceof CommandMapping)) {
            result = new CommandMapping();
            result
                .load(CommandMapping.defaultMapping || {})
                .load(commandMapping || {});
        }
        return result;
    },

    createNavigation: function(navigationConfig) {
        this.navigation = this._createNavigationCommands(navigationConfig);
        this._mapNavigationCommands(this.navigation, this.commandMapping);
    },

    _createNavigationCommands: function(commandConfig) {
        if(!commandConfig) {
            return [];
        }

        var generatedIdCount = 0;

        return iteratorUtils.map(commandConfig, function(item) {
            var command;
            if(item instanceof dxCommand) {
                command = item;
            } else {
                command = new dxCommand(extend({ root: true }, item));
            }
            if(!command.option("id")) {
                command.option("id", "navigation_" + generatedIdCount++);
            }
            return command;
        });
    },

    _mapNavigationCommands: function(navigationCommands, commandMapping) {
        var navigationCommandIds = iteratorUtils.map(navigationCommands, function(command) {
            return command.option("id");
        });
        commandMapping.mapCommands("global-navigation", navigationCommandIds);
    },

    _callComponentMethod: function(methodName, args) {
        var tasks = [];

        iteratorUtils.each(this.components, function(index, component) {
            if(component[methodName] && typeUtils.isFunction(component[methodName])) {
                var result = component[methodName](args);
                if(result && result.done) {
                    tasks.push(result);
                }
            }
        });

        return when.apply($, tasks);
    },

    init: function() {
        var that = this;

        that._initState = INIT_IN_PROGRESS;
        return that._callComponentMethod("init").done(function() {
            that._initState = INIT_COMPLETE;
            that._processEvent("initialized");
        }).fail(function(error) {
            throw error || errors.Error("E3022");
        });
    },

    _onNavigatingBack: function(args) {
        this._processEvent("navigatingBack", args);
    },

    _onNavigating: function(args) {
        var that = this;

        if(that._isNavigating) {
            that._pendingNavigationArgs = args;
            args.cancel = true;
            return;
        } else {
            that._isNavigating = true;
            delete that._pendingNavigationArgs;
        }

        var routeData = this.router.parse(args.uri);
        if(!routeData) {
            throw errors.Error("E3001", args.uri);
        }
        var uri = this.router.format(routeData);
        if(args.uri !== uri && uri) {
            args.cancel = true;
            args.cancelReason = "redirect";
            commonUtils.executeAsync(function() {
                that.navigate(uri, args.options);
            });

        } else {
            that._processEvent("navigating", args);
        }
    },

    _onNavigated: function(args) {
        var that = this,
            direction = args.options.direction,
            resultDeferred,
            viewInfo = that._acquireViewInfo(args.item, args.options);


        if(!viewInfo.model) {
            this._processEvent("beforeViewSetup", {
                viewInfo: viewInfo
            });
            that._createViewModel(viewInfo);
            that._createViewCommands(viewInfo);
            this._processEvent("afterViewSetup", {
                viewInfo: viewInfo
            });
        }

        that._highlightCurrentNavigationCommand(viewInfo);
        resultDeferred = that._showView(viewInfo, direction)
            .always(function() {
                that._isNavigating = false;
                var pendingArgs = that._pendingNavigationArgs;
                if(pendingArgs) {
                    commonUtils.executeAsync(function() {
                        that.navigate(pendingArgs.uri, pendingArgs.options);
                    });
                }
            });

        return resultDeferred;
    },
    _isViewReadyToShow: function(viewInfo) {
        return !!viewInfo.model;
    },

    _onNavigationCanceled: function(args) {

        var that = this;
        if(!that._pendingNavigationArgs || that._pendingNavigationArgs.uri !== args.uri) {
            var currentItem = that.navigationManager.currentItem();

            if(currentItem) {
                commonUtils.executeAsync(function() {
                    var viewInfo = that._acquireViewInfo(currentItem, args.options);
                    that._highlightCurrentNavigationCommand(viewInfo, true);
                });
            }
            that._isNavigating = false;
        }
    },

    _disposeRemovedViews: function() {
        var that = this;

        iteratorUtils.each(that._viewLinksHash, function(key, link) {
            if(!link.linkCount) {
                that._disposeRemovedView(link.viewInfo);
                delete that._viewLinksHash[key];
            }
        });

        this._removedViewInfos.forEach(function(viewInfo) {
            that._disposeRemovedView(viewInfo);
        });
        this._removedViewInfos = [];
    },

    _disposeRemovedView: function(viewInfo) {
        var args = { viewInfo: viewInfo };
        this._processEvent("viewDisposing", args, viewInfo.model);
        this._disposeView(viewInfo);
        this._processEvent("viewDisposed", args, viewInfo.model);
    },

    _onViewHidden: function(viewInfo) {
        var args = { viewInfo: viewInfo };
        this._processEvent("viewHidden", args, args.viewInfo.model);
    },

    _disposeView: function(viewInfo) {
        var commands = viewInfo.commands || [];

        iteratorUtils.each(commands, function(index, command) {
            command._dispose();
        });
    },

    _acquireViewInfo: function(navigationItem, navigateOptions) {
        var routeData = this.router.parse(navigationItem.uri),
            viewInfoKey = this._getViewInfoKey(navigationItem, routeData),
            viewInfo = this.viewCache.getView(viewInfoKey);

        if(!viewInfo) {
            viewInfo = this._createViewInfo(navigationItem, navigateOptions);
            this._obtainViewLink(viewInfo);
            this.viewCache.setView(viewInfoKey, viewInfo);
        } else {
            this._updateViewInfo(viewInfo, navigationItem, navigateOptions);
        }

        return viewInfo;
    },

    _getViewInfoKey: function(navigationItem, routeData) {
        var args = {
            key: navigationItem.key,
            navigationItem: navigationItem,
            routeData: routeData
        };

        this._processEvent("resolveViewCacheKey", args);

        return args.key;
    },

    _processEvent: function(eventName, args, model) {
        this._callComponentMethod(eventName, args);
        this.fireEvent(eventName, args && [args]);
        var modelMethod = (model || {})[eventName];
        if(modelMethod) {
            modelMethod.call(model, args);
        }
    },

    _updateViewInfo: function(viewInfo, navigationItem, navigateOptions) {
        var uri = navigationItem.uri,
            routeData = this.router.parse(uri);

        viewInfo.viewName = routeData.view;
        viewInfo.routeData = routeData;
        viewInfo.uri = uri;
        viewInfo.navigateOptions = navigateOptions;
        viewInfo.canBack = this.canBack(navigateOptions.stack);
        viewInfo.previousViewInfo = this._getPreviousViewInfo(navigateOptions);
    },

    _createViewInfo: function(navigationItem, navigateOptions) {
        var uri = navigationItem.uri,
            routeData = this.router.parse(uri),
            viewInfo = {
                key: this._getViewInfoKey(navigationItem, routeData)
            };

        this._updateViewInfo(viewInfo, navigationItem, navigateOptions);

        return viewInfo;
    },

    _createViewModel: function(viewInfo) {
        viewInfo.model = viewInfo.model || this._callViewCodeBehind(viewInfo);
    },

    _createViewCommands: function(viewInfo) {
        viewInfo.commands = viewInfo.model.commands || [];

        if(viewInfo.canBack && this._applicationMode !== "webSite") {
            this._appendBackCommand(viewInfo);
        }
    },

    _callViewCodeBehind: function(viewInfo) {
        var setupFunc = commonUtils.noop,
            routeData = viewInfo.routeData;

        if(routeData.view in this.namespace) {
            setupFunc = this.namespace[routeData.view];
        }
        return setupFunc.call(this.namespace, routeData, viewInfo) || {};
    },

    _appendBackCommand: function(viewInfo) {
        var commands = viewInfo.commands,
            that = this,
            backTitle = BACK_COMMAND_TITLE;

        if(that._options.useViewTitleAsBackText) {
            backTitle = ((viewInfo.previousViewInfo || {}).model || {}).title || backTitle;
        }

        var toMergeTo = [
            new dxCommand({
                id: "back",
                title: backTitle,
                behavior: "back",
                onExecute: function() {
                    that.back({ stack: viewInfo.navigateOptions.stack });
                },
                icon: "arrowleft",
                type: "back",
                renderStage: that._options.useViewTitleAsBackText ? "onViewRendering" : "onViewShown"
            })
        ];

        var result = mergeCommands(toMergeTo, commands);
        commands.length = 0;
        commands.push.apply(commands, result);
    },

    _showView: function(viewInfo, direction) {
        var that = this;

        var eventArgs = {
            viewInfo: viewInfo,
            direction: direction,
            params: viewInfo.routeData
        };

        dataUtils.processRequestResultLock.obtain();
        return that._showViewImpl(eventArgs.viewInfo, eventArgs.direction).done(function() {
            commonUtils.executeAsync(function() {
                dataUtils.processRequestResultLock.release();
                that._processEvent("viewShown", eventArgs, viewInfo.model);
                that._disposeRemovedViews();
            });
        });
    },

    _highlightCurrentNavigationCommand: function(viewInfo, forceUpdate) {
        var that = this,
            selectedCommand,
            currentNavigationItemId = viewInfo.model && viewInfo.model.currentNavigationItemId;

        if(currentNavigationItemId !== undefined) {
            iteratorUtils.each(this.navigation, function(index, command) {
                if(command.option("id") === currentNavigationItemId) {
                    selectedCommand = command;
                    return false;
                }
            });
        }

        if(!selectedCommand) {
            iteratorUtils.each(this.navigation, function(index, command) {
                var commandUri = command.option("onExecute");
                if(typeUtils.isString(commandUri)) {
                    commandUri = commandUri.replace(/^#+/, "");
                    if(commandUri === that.navigationManager.rootUri()) {
                        selectedCommand = command;
                        return false;
                    }
                }
            });
        }

        iteratorUtils.each(this.navigation, function(index, command) {
            if(forceUpdate && command === selectedCommand && command.option("highlighted")) {
                command.fireEvent("optionChanged", [{ name: "highlighted", value: true, previousValue: true }]); // Q587642
            }
            command.option("highlighted", command === selectedCommand);
        });
    },

    _showViewImpl: abstract,

    _obtainViewLink: function(viewInfo) {
        var key = viewInfo.key,
            viewLink = this._viewLinksHash[key];

        if(!viewLink) {
            this._viewLinksHash[key] = {
                viewInfo: viewInfo,
                linkCount: 1
            };
        } else {
            if(viewLink.viewInfo !== viewInfo) {
                this._removedViewInfos.push(viewLink.viewInfo);
                viewLink.viewInfo = viewInfo;
            }
            this._viewLinksHash[key].linkCount++;
        }
    },

    _releaseViewLink: function(viewInfo) {
        if(this._viewLinksHash[viewInfo.key] === undefined) {
            errors.log("W3001", viewInfo.key);
        }
        if(this._viewLinksHash[viewInfo.key].linkCount === 0) {
            errors.log("W3002", viewInfo.key);
        }
        this._viewLinksHash[viewInfo.key].linkCount--;
    },

    navigate: function(uri, options) {
        var that = this;

        if(typeUtils.isPlainObject(uri)) {
            uri = that.router.format(uri);
            if(uri === false) {
                throw errors.Error("E3002");
            }
        }

        if(!that._initState) {
            that.init().done(function() {
                that.restoreState();
                that.navigate(uri, options);
            });
        } else if(that._initState === INIT_COMPLETE) {
            if(!that._isNavigating || uri) {
                that.navigationManager.navigate(uri, options);
            }
        } else {
            throw errors.Error("E3003");
        }
    },

    canBack: function(stackKey) {
        return this.navigationManager.canBack(stackKey);
    },

    _getPreviousViewInfo: function(navigateOptions) {
        var previousNavigationItem = this.navigationManager.previousItem(navigateOptions.stack),
            result;

        if(previousNavigationItem) {
            var routeData = this.router.parse(previousNavigationItem.uri);
            result = this.viewCache.getView(this._getViewInfoKey(previousNavigationItem, routeData));
        }

        return result;
    },

    back: function(options) {
        this.navigationManager.back(options);
    },

    saveState: function() {
        this.stateManager.saveState();
    },

    restoreState: function() {
        this.stateManager.restoreState();
    },

    clearState: function() {
        this.stateManager.clearState();
    }

    /*        handleError: function() {
                // TODO: This is workaround for bug in jQuery.Callbacks (#?????? - need to be registered)
                this.navigationManager.navigated.empty();
                this.navigationManager.navigated = Callbacks();
                this.navigationManager.on("navigated", this._onNavigated.bind(this));
            }*/
}).include(EventsMixin);

exports.Application = Application;
