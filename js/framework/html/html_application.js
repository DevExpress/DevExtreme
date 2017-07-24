"use strict";

var $ = require("jquery"),
    commonUtils = require("../../core/utils/common"),
    Component = require("../../core/component"),
    extendUtils = require("../../core/utils/extend"),
    each = require("../../core/utils/iterator").each,
    errors = require("../errors"),
    Application = require("../application").Application,
    ConditionalViewCacheDecorator = require("../view_cache").ConditionalViewCacheDecorator,
    html = require("./presets"),
    CommandManager = require("./command_manager"),
    ViewEngine = require("./view_engine").ViewEngine,
    messageLocalization = require("../../localization/message"),
    viewPort = require("../../core/utils/view_port").value,
    initMobileViewportModule = require("../../mobile/init_mobile_viewport/init_mobile_viewport"),
    devices = require("../../core/devices"),
    feedbackEvents = require("../../events/core/emitter.feedback"),
    TransitionExecutorModule = require("../../animation/transition_executor/transition_executor"),
    animationPresetsModule = require("../../animation/presets/presets"),
    when = require("../../integration/jquery/deferred").when;

require("./layout_controller");
require("../../ui/themes");

var VIEW_PORT_CLASSNAME = "dx-viewport",
    LAYOUT_CHANGE_ANIMATION_NAME = "layout-change";

/**
* @name HtmlApplication
* @publicName HtmlApplication
* @type object
* @inherits EventsMixin
* @module framework/html/html_application
* @export default
*/
var HtmlApplication = Application.inherit({

    /**
    * @name HtmlApplicationoptions_namespace
    * @publicName namespace
    * @type object
    */
    /**
    * @name HtmlApplicationOptions_router
    * @publicName router
    * @type object
    */
    /**
    * @name HtmlApplicationOptions_stateManager
    * @publicName stateManager
    * @type object
    */
    /**
    * @name HtmlApplicationOptions_stateStorage
    * @publicName stateStorage
    * @type object
    */
    /**
    * @name HtmlApplicationoptions_navigation
    * @publicName navigation
    * @type array
    */
    /**
    * @name HtmlApplicationoptions_mode
    * @publicName mode
    * @type string
    * @default "mobileApp"
    * @acceptValues 'mobileApp'|'webSite'
    */
    /**
    * @name HtmlApplicationoptions_layoutSet
    * @publicName layoutSet
    * @type string|array
    * @default undefined
    */
    /**
    * @name HtmlApplicationoptions_animationSet
    * @publicName animationSet
    * @type object
    * @default undefined
    */
    /**
    * @name HtmlApplicationoptions_disableViewCache
    * @publicName disableViewCache
    * @type boolean
    */
    /**
    * @name HtmlApplicationoptions_useViewTitleAsBackText
    * @publicName useViewTitleAsBackText
    * @type boolean
    * @default false
    */
    /**
    * @name HtmlApplicationoptions_viewPort
    * @publicName viewPort
    * @type object
    * @type_object_field1 allowZoom:Boolean
    * @type_object_field2 allowPan:Boolean
    * @type_object_field3 allowSelection:Boolean
    */
    /**
    * @name HtmlApplicationoptions_navigateToRootViewMode
    * @publicName navigateToRootViewMode
    * @type string
    * @default "resetHistory"
    * @acceptValues 'keepHistory'|'resetHistory'
    */
    /**
    * @name HtmlApplicationoptions_commandMapping
    * @publicName commandMapping
    * @type object
    * @default DevExpress.framework.CommandMapping.defaultMapping
    */
    /**
    * @name HtmlApplicationoptions_viewCache
    * @publicName viewCache
    * @type object
    */
    /**
    * @name HtmlApplicationoptions_viewCacheSize
    * @publicName viewCacheSize
    * @type Number
    * @default 5
    */
    /**
    * @name HtmlApplicationoptions_templatesVersion
    * @publicName templatesVersion
    * @type String
    * @default undefined
    */
    ctor: function(options) {
        options = options || {};

        this.callBase(options);

        this._$root = $(options.rootNode || document.body);

        this._initViewport(options.viewPort);

        if(this._applicationMode === "mobileApp") {
            initMobileViewportModule.initMobileViewport(options.viewPort);
        }

        this.device = options.device || devices.current();

        this.commandManager = options.commandManager ||
            new CommandManager({
                commandMapping: this.commandMapping
            });

        this._initTemplateContext();

        this.viewEngine = options.viewEngine || new ViewEngine({
            $root: this._$root,
            device: this.device,
            templateCacheStorage: options.templateCacheStorage || window.localStorage,
            templatesVersion: options.templatesVersion,
            templateContext: this._templateContext
        });
        this.components.push(this.viewEngine);
        this._initMarkupFilters(this.viewEngine);

        this._layoutSet = options.layoutSet || html.layoutSets["default"];
        this._animationSet = options.animationSet || html.animationSets["default"];
        this._availableLayoutControllers = [];
        this._activeLayoutControllersStack = [];

        this.transitionExecutor = new TransitionExecutorModule.TransitionExecutor();
        this._initAnimations(this._animationSet);
    },

    _initAnimations: function(animationSet) {
        if(!animationSet) {
            return;
        }

        each(animationSet, function(name, configs) {
            each(configs, function(index, config) {
                animationPresetsModule.presets.registerPreset(name, config);
            });
        });

        animationPresetsModule.presets.applyChanges();
    },

    _localizeMarkup: function($markup) {
        messageLocalization.localizeNode($markup);
    },

    _notifyIfBadMarkup: function($markup) {
        $markup.each(function() {
            var html = $(this).html();
            if(/href="#/.test(html)) {
                errors.log("W3005", html);
            }
        });
    },

    _initMarkupFilters: function(viewEngine) {
        var filters = [];

        filters.push(this._localizeMarkup);
        ///#DEBUG
        if(this._applicationMode === "mobileApp") {
            filters.push(this._notifyIfBadMarkup);
        }
        ///#ENDDEBUG

        if(viewEngine.markupLoaded) {
            viewEngine.markupLoaded.add(function(args) {
                each(filters, function(_, filter) {
                    filter(args.markup);
                });
            });
        }
    },

    _createViewCache: function(options) {
        var result = this.callBase(options);

        if(!options.viewCache) {
            result = new ConditionalViewCacheDecorator({
                filter: function(key, viewInfo) {
                    return !viewInfo.viewTemplateInfo.disableCache;
                },
                viewCache: result
            });
        }

        return result;
    },


    /**
    * @name HtmlApplicationmethods_createNavigation
    * @publicName createNavigation(navigationConfig)
    * @param1 navigationConfig:Array
    */
    /**
    * @name HtmlApplicationmethods_navigate
    * @publicName navigate(uri, options)
    * @param1 uri:string|object
    * @param2 options:object
    * @param2_field1 root:Boolean
    * @param2_field2 target:string
    * @param2_field3 direction:string
    * @param2_field5 modal:Boolean
     */
    /**
    * @name HtmlApplicationmethods_canBack
    * @publicName canBack()
    * @return boolean
    */
    /**
    * @name HtmlApplicationmethods_back
    * @publicName back()
    */
    /**
    * @name HtmlApplicationmethods_saveState
    * @publicName saveState()
    */
    /**
    * @name HtmlApplicationmethods_restoreState
    * @publicName restoreState()
    */
    /**
    * @name HtmlApplicationmethods_clearState
    * @publicName clearState()
    */
    /**
    * @name HtmlApplicationevents_initialized
    * @publicName initialized
    * @type EVENT
    */
    /**
    * @name HtmlApplicationevents_navigatingBack
    * @publicName navigatingBack
    * @type EVENT
    * @type_function_param1 e:object
    * @type_function_param1_field1 cancel:Boolean
    * @type_function_param1_field2 isHardwareButton:Boolean
    */
    /**
    * @name HtmlApplicationevents_navigating
    * @publicName navigating
    * @type EVENT
    * @type_function_param1 e:object
    * @type_function_param1_field1 currentUri:string
    * @type_function_param1_field2 uri:string
    * @type_function_param1_field3 cancel:Boolean
    * @type_function_param1_field4 options:object
    */
    /**
    * @name HtmlApplicationevents_beforeViewSetup
    * @publicName beforeViewSetup
    * @type EVENT
    * @type_function_param1 e:object
    * @type_function_param1_field1 viewInfo:object
    */
    /**
    * @name HtmlApplicationevents_afterViewSetup
    * @publicName afterViewSetup
    * @type EVENT
    * @type_function_param1 e:object
    * @type_function_param1_field1 viewInfo:object
    */
    /**
    * @name HtmlApplicationevents_viewRendered
    * @publicName viewRendered
    * @type EVENT
    * @type_function_param1 e:object
    * @type_function_param1_field1 viewInfo:object
    */
    /**
    * @name HtmlApplicationevents_viewShowing
    * @publicName viewShowing
    * @type EVENT
    * @type_function_param1 e:object
    * @type_function_param1_field1 viewInfo:object
    * @type_function_param1_field2 direction:string
    */
    /**
    * @name HtmlApplicationevents_viewShown
    * @publicName viewShown
    * @type EVENT
    * @type_function_param1 e:object
    * @type_function_param1_field1 viewInfo:object
    * @type_function_param1_field2 direction:string
    */
    /**
    * @name HtmlApplicationevents_viewHidden
    * @publicName viewHidden
    * @type EVENT
    * @type_function_param1 e:object
    * @type_function_param1_field1 viewInfo:object
    */
    /**
    * @name HtmlApplicationevents_viewDisposing
    * @publicName viewDisposing
    * @type EVENT
    * @type_function_param1 e:object
    * @type_function_param1_field1 viewInfo:object
    */
    /**
    * @name HtmlApplicationevents_viewDisposed
    * @publicName viewDisposed
    * @type EVENT
    * @type_function_param1 e:object
    * @type_function_param1_field1 viewInfo:object
    */
    /**
    * @name HtmlApplicationevents_resolveLayoutController
    * @publicName resolveLayoutController
    * @type EVENT
    * @type_function_param1 e:object
    * @type_function_param1_field1 viewInfo:object
    * @type_function_param1_field2 layoutController:object
    * @type_function_param1_field3 availableLayoutControllers:array
    */
    /**
    * @name HtmlApplicationevents_resolveViewCacheKey
    * @publicName resolveViewCacheKey
    * @type EVENT
    * @type_function_param1 e:object
    * @type_function_param1_field1 key:string
    * @type_function_param1_field2 navigationItem:object
    * @type_function_param1_field3 routeData:object
    */
    /**
     * @name HtmlApplicationfields_viewCache
     * @publicName viewCache
     * @type object
     */
    /**
     * @name HtmlApplicationFields_router
     * @publicName router
     * @type object
     */
    /**
     * @name HtmlApplicationfields_navigation
     * @publicName navigation
     * @type array
     */
    /**
     * @name HtmlApplicationFields_stateManager
     * @publicName stateManager
     * @type object
     */

    _initViewport: function() {
        this._$viewPort = this._getViewPort();
        viewPort(this._$viewPort);
    },

    _getViewPort: function() {
        var $viewPort = $("." + VIEW_PORT_CLASSNAME);
        if(!$viewPort.length) {
            $viewPort = $("<div>")
                .addClass(VIEW_PORT_CLASSNAME)
                .appendTo(this._$root);
        }
        return $viewPort;
    },

    _initTemplateContext: function() {
        this._templateContext = new Component({
            orientation: devices.orientation()
        });

        devices.on("orientationChanged", (function(args) {
            this._templateContext.option("orientation", args.orientation);
        }).bind(this));
    },

    _showViewImpl: function(viewInfo, direction) {
        var that = this,
            deferred = $.Deferred(),
            result = deferred.promise(),
            layoutController = viewInfo.layoutController;

        that._obtainViewLink(viewInfo);

        layoutController.showView(viewInfo, direction).done(function() {
            that._activateLayoutController(layoutController, that._getTargetNode(viewInfo), direction).done(function() {
                deferred.resolve();
            });
        });

        feedbackEvents.lock(result);//prevents UI feedback from blinking during transition

        return result;
    },

    _resolveLayoutController: function(viewInfo) {
        var args = {
            viewInfo: viewInfo,
            layoutController: null,
            availableLayoutControllers: this._availableLayoutControllers
        };

        this._processEvent("resolveLayoutController", args, viewInfo.model);

        ///#DEBUG
        this._checkLayoutControllerIsInitialized(args.layoutController);
        ///#ENDDEBUG

        return args.layoutController || this._resolveLayoutControllerImpl(viewInfo);
    },

    _checkLayoutControllerIsInitialized: function(layoutController) {
        if(layoutController) {
            var isControllerInited = false;
            each(this._layoutSet, function(_, controllerInfo) {
                if(controllerInfo.controller === layoutController) {
                    isControllerInited = true;
                    return false;
                }
            });

            if(!isControllerInited) {
                throw errors.Error("E3024");
            }
        }
    },

    _ensureOneLayoutControllerFound: function(target, matches) {
        var toJSONInterceptor = function(key, value) {
            if(key === "controller") {
                return "[controller]: { name:" + value.name + " }";
            }
            return value;
        };

        if(!matches.length) {
            errors.log("W3003", JSON.stringify(target, null, 4), JSON.stringify(this._availableLayoutControllers, toJSONInterceptor, 4));
            throw errors.Error("E3011");
        }
        if(matches.length > 1) {
            errors.log("W3004", JSON.stringify(target, null, 4), JSON.stringify(matches, toJSONInterceptor, 4));
            throw errors.Error("E3012");
        }
    },

    _resolveLayoutControllerImpl: function(viewInfo) {
        var templateInfo = viewInfo.viewTemplateInfo || {},
            navigateOptions = viewInfo.navigateOptions || {},
            target = extendUtils.extend({
                root: !viewInfo.canBack,
                customResolveRequired: false,
                pane: templateInfo.pane,
                modal: navigateOptions.modal !== undefined ? navigateOptions.modal : templateInfo.modal || false
            }, devices.current());

        var matches = commonUtils.findBestMatches(target, this._availableLayoutControllers);
        this._ensureOneLayoutControllerFound(target, matches);
        return matches[0].controller;
    },

    _onNavigatingBack: function(args) {
        this.callBase.apply(this, arguments);
        if(!args.cancel && !this.canBack() && this._activeLayoutControllersStack.length > 1) {
            var previousActiveLayoutController = this._activeLayoutControllersStack[this._activeLayoutControllersStack.length - 2],
                previousViewInfo = previousActiveLayoutController.activeViewInfo();

            args.cancel = true;

            this._activateLayoutController(previousActiveLayoutController, undefined, "backward");
            this.navigationManager.currentItem(previousViewInfo.key);
        }
    },

    _activeLayoutController: function() {
        return this._activeLayoutControllersStack.length ? this._activeLayoutControllersStack[this._activeLayoutControllersStack.length - 1] : undefined;
    },

    _getTargetNode: function(viewInfo) {
        var jQueryEvent = (viewInfo.navigateOptions || {}).jQueryEvent;
        return jQueryEvent ? $(jQueryEvent.target) : undefined;
    },

    _activateLayoutController: function(layoutController, targetNode, direction) {
        var that = this,
            previousLayoutController = that._activeLayoutController();

        if(previousLayoutController === layoutController) {
            return $.Deferred().resolve().promise();
        }

        var d = $.Deferred();
        layoutController
            .ensureActive(targetNode)
            .done(function(result) {
                that._deactivatePreviousLayoutControllers(layoutController, direction, result).done(function() {
                    that._activeLayoutControllersStack.push(layoutController);
                    d.resolve();
                });
            });
        return d.promise();
    },

    _deactivatePreviousLayoutControllers: function(layoutController, direction) {
        var that = this,
            tasks = [],
            controllerToDeactivate = that._activeLayoutControllersStack.pop();

        if(!controllerToDeactivate) {
            return $.Deferred().resolve().promise();
        }

        if(layoutController.isOverlay) {
            that._activeLayoutControllersStack.push(controllerToDeactivate);
            tasks.push(controllerToDeactivate.disable());
        } else {
            var transitionDeferred = $.Deferred(),
                skipAnimation = false;

            //NOTE: It's needed to prevent creating a closure. Can't be declared in a loop because of JSHint check.
            var getControllerDeactivator = function(controllerToDeactivate, d) {
                return function() {
                    controllerToDeactivate.deactivate().done(function() {
                        d.resolve();
                    });
                };
            };

            while(controllerToDeactivate && controllerToDeactivate !== layoutController) {
                var d = $.Deferred();

                if(controllerToDeactivate.isOverlay) {
                    skipAnimation = true;
                } else {
                    that.transitionExecutor.leave(controllerToDeactivate.element(), LAYOUT_CHANGE_ANIMATION_NAME, { direction: direction });
                }

                transitionDeferred.promise().done(getControllerDeactivator(controllerToDeactivate, d));

                tasks.push(d.promise());

                controllerToDeactivate = that._activeLayoutControllersStack.pop();
            }

            if(skipAnimation) {
                transitionDeferred.resolve();
            } else {
                that.transitionExecutor.enter(layoutController.element(), LAYOUT_CHANGE_ANIMATION_NAME, { direction: direction });
                that.transitionExecutor.start().done(function() {
                    transitionDeferred.resolve();
                });
            }
        }

        return when.apply($, tasks);
    },

    init: function() {
        var that = this,
            result = this.callBase();

        result.done(function() {
            that._initLayoutControllers();
            that.renderNavigation();
        });
        return result;
    },

    _disposeView: function(viewInfo) {
        if(viewInfo.layoutController.disposeView) {
            viewInfo.layoutController.disposeView(viewInfo);
        }
        this.callBase(viewInfo);
    },

    viewPort: function() {
        return this._$viewPort;
    },

    _createViewInfo: function() {
        var viewInfo = this.callBase.apply(this, arguments),
            templateInfo = this.getViewTemplateInfo(viewInfo.viewName);

        if(!templateInfo) {
            throw errors.Error("E3013", "dxView", viewInfo.viewName);
        }
        viewInfo.viewTemplateInfo = templateInfo;
        viewInfo.layoutController = this._resolveLayoutController(viewInfo);
        return viewInfo;
    },

    _createViewModel: function(viewInfo) {
        this.callBase(viewInfo);
        extendUtils.extendFromObject(viewInfo.model, viewInfo.viewTemplateInfo);
    },

    _initLayoutControllers: function() {
        var that = this;

        each(that._layoutSet, function(index, controllerInfo) {
            var controller = controllerInfo.controller,
                target = devices.current();

            if(commonUtils.findBestMatches(target, [controllerInfo]).length) {
                that._availableLayoutControllers.push(controllerInfo);
                if(controller.init) {
                    controller.init({
                        app: that,
                        $viewPort: that._$viewPort,
                        navigationManager: that.navigationManager,
                        viewEngine: that.viewEngine,
                        templateContext: that._templateContext, // TODO: add layoutContext
                        commandManager: that.commandManager
                    });
                }
                if(controller.on) {
                    controller.on("viewReleased", function(viewInfo) {
                        that._onViewReleased(viewInfo);
                    });
                    controller.on("viewHidden", function(viewInfo) {
                        that._onViewHidden(viewInfo);
                    });
                    controller.on("viewRendered", function(viewInfo) {
                        that._processEvent("viewRendered", { viewInfo: viewInfo }, viewInfo.model);
                    });
                    controller.on("viewShowing", function(viewInfo, direction) {
                        that._processEvent("viewShowing", { viewInfo: viewInfo, direction: direction, params: viewInfo.routeData }, viewInfo.model);
                    });
                    controller.on("viewShown", function(viewInfo, direction) {
                        that._processEvent("viewShown", { viewInfo: viewInfo, direction: direction, params: viewInfo.routeData }, viewInfo.model);
                    });
                }
            }
        });
    },

    _onViewReleased: function(viewInfo) {
        this._releaseViewLink(viewInfo);
    },

    /**
    * @name HtmlApplicationmethods_renderNavigation
    * @publicName renderNavigation()
    */
    renderNavigation: function() {
        var that = this;

        each(that._availableLayoutControllers, function(index, controllerInfo) {
            var controller = controllerInfo.controller;
            if(controller.renderNavigation) {
                controller.renderNavigation(that.navigation);
            }
        });
    },

    /**
    * @name HtmlApplicationmethods_getViewTemplate
    * @publicName getViewTemplate(viewName)
    * @param1 viewName:string
    * @return jQuery
    */
    getViewTemplate: function(viewName) {
        return this.viewEngine.getViewTemplate(viewName);
    },

    /**
    * @name HtmlApplicationmethods_getViewTemplateInfo
    * @publicName getViewTemplateInfo(viewName)
    * @param1 viewName:string
    * @return object
    */
    getViewTemplateInfo: function(viewName) {
        var viewComponent = this.viewEngine.getViewTemplateInfo(viewName);

        return viewComponent && viewComponent.option();
    },

    /**
    * @name HtmlApplicationmethods_loadTemplates
    * @publicName loadTemplates(source)
    * @param1 source:string|jQuery object
    * @return Promise
    */
    loadTemplates: function(source) {
        return this.viewEngine.loadTemplates(source);
    },

    /**
    * @name HtmlApplicationmethods_templateContext
    * @publicName templateContext()
    * @return Object
    */
    templateContext: function() {
        return this._templateContext;
    }
});

module.exports = HtmlApplication;
