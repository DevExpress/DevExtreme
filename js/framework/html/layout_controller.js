require("../../integration/jquery");

var $ = require("jquery"),
    domAdapter = require("../../core/dom_adapter"),
    eventsEngine = require("../../events/core/events_engine"),
    Class = require("../../core/class"),
    commonUtils = require("../../core/utils/common"),
    iteratorUtils = require("../../core/utils/iterator"),
    frameworkUtils = require("../utils"),
    layoutSets = require("./presets").layoutSets,
    EventsMixin = require("../../core/events_mixin"),
    errors = require("../errors"),
    domUtils = require("../../core/utils/dom"),
    when = require("../../core/utils/deferred").when,
    HIDDEN_BAG_ID = "__hidden-bag",
    TRANSITION_SELECTOR = ".dx-transition",
    CONTENT_SELECTOR = ".dx-content",
    DEFAULT_COMMAND_RENDER_STAGE = "onViewShown",
    CONTENT_RENDERED_EVENT_NAME = "dxcontentrendered.layoutController",
    PENDING_RENDERING_SELECTOR = ".dx-pending-rendering",
    PENDING_RENDERING_MANUAL_SELECTOR = ".dx-pending-rendering-manual",
    TransitionExecutorModule = require("../../animation/transition_executor/transition_executor");

require("./command_container");
require("./view_engine_components");

var transitionSelector = function(transitionName) {
    return ".dx-transition-" + transitionName;
};

var DefaultLayoutController = Class.inherit({
    ctor: function(options) {
        options = options || {};
        this.name = options.name || "";
        this._layoutModel = options.layoutModel || {};
        this._defaultPaneName = options.defaultPaneName || "content";
        this._transitionDuration = options.transitionDuration === undefined ? 400 : options.transitionDuration;
        this._showViewFired = false;
    },

    init: function(options) {
        options = options || {};
        this._visibleViews = {};
        this._$viewPort = options.$viewPort || $("body");
        this._commandManager = options.commandManager;
        this._viewEngine = options.viewEngine;
        this.transitionExecutor = new TransitionExecutorModule.TransitionExecutor();
        this._prepareTemplates();
        this._$viewPort.append(this.element());
        this._hideElements(this.element());

        if(options.templateContext) {
            this._templateContext = options.templateContext;
            this._proxiedTemplateContextChangedHandler = this._templateContextChangedHandler.bind(this);
        }
    },

    ensureActive: function(targetNode) {
        if(this._disabledState) {
            return this.enable();
        } else {
            return this.activate(targetNode);
        }
    },

    activate: function() {
        this._showViewFired = false;

        var $rootElement = this.element();
        this._showElements($rootElement);
        this._attachRefreshViewRequiredHandler();
        return $.Deferred().resolve().promise();
    },

    deactivate: function() {
        this._disabledState = false;
        this._showViewFired = false;
        this._releaseVisibleViews();
        this._hideElements(this.element());
        this._detachRefreshViewRequiredHandler();
        return $.Deferred().resolve().promise();
    },

    enable: function() {
        this._disabledState = false;

        if(!this._showViewFired) {
            this._notifyShowing();
        }

        this._showViewFired = false;

        return $.Deferred().resolve().promise();
    },

    disable: function() {
        this._disabledState = true;
        this._showViewFired = false;
        this._notifyHidden();
    },

    activeViewInfo: function() {
        return this._visibleViews[this._defaultPaneName];
    },

    _fireViewEvents: function(eventName, views) {
        var that = this;

        views = views || this._visibleViews;
        iteratorUtils.each(views, function(index, viewInfo) {
            that.fireEvent(eventName, [viewInfo]);
        });
    },

    _notifyShowing: function(views) {
        this._fireViewEvents("viewShowing", views);
    },

    _notifyShown: function(views) {
        this._fireViewEvents("viewShown", views);
    },

    _notifyHidden: function(views) {
        this._fireViewEvents("viewHidden", views);
    },

    _applyTemplate: function($elements, model) {
        $elements.each(function(i, element) {
            frameworkUtils.templateProvider.applyTemplate(element, model);
        });
    },

    _releaseVisibleViews: function() {
        var that = this;

        iteratorUtils.each(this._visibleViews, function(index, viewInfo) {
            that._hideView(viewInfo);
            that._releaseView(viewInfo);
        });
        this._visibleViews = {};
    },

    _templateContextChangedHandler: function() {
        var that = this,
            viewsToShow = [];

        iteratorUtils.each(that._visibleViews, function(index, viewInfo) {
            if(viewInfo.currentViewTemplateId !== that._getViewTemplateId(viewInfo)) {
                viewsToShow.push(viewInfo);
            }
        });

        when.apply($, iteratorUtils.map(viewsToShow, function(viewInfo) {
            return that.showView(viewInfo);
        })).done(function() {
            that._notifyShown(viewsToShow);
        });
    },

    _attachRefreshViewRequiredHandler: function() {
        if(this._templateContext) {
            this._templateContext.on("optionChanged", this._proxiedTemplateContextChangedHandler);
        }
    },

    _detachRefreshViewRequiredHandler: function() {
        if(this._templateContextChanged) {
            this._templateContext.off("optionChanged", this._proxiedTemplateContextChangedHandler);
        }
    },

    _getPreviousViewInfo: function(viewInfo) {
        return this._visibleViews[this._getViewPaneName(viewInfo.viewTemplateInfo)];
    },

    _prepareTemplates: function() {
        var that = this;

        var $layoutTemplate = that._viewEngine.getLayoutTemplate(this._getLayoutTemplateName());
        that._$layoutTemplate = $layoutTemplate;
        that._$mainLayout = that._createEmptyLayout();
        that._showElements(that._$mainLayout);
        that._applyTemplate(that._$mainLayout, that._layoutModel);
        that._$navigationWidget = that._createNavigationWidget();
    },

    renderNavigation: function(navigationCommands) {
        this._clearNavigationWidget();
        this._renderNavigationImpl(navigationCommands);
    },

    _renderNavigationImpl: function(navigationCommands) {
        this._renderCommands(this._$mainLayout, navigationCommands);
    },

    _createNavigationWidget: function() {
        var containers = this._findCommandContainers(this._$mainLayout),
            result;

        iteratorUtils.each(containers, function(k, container) {
            if(container.option("id") === "global-navigation") {
                result = container.element();
                return false;
            }
        });

        return result;
    },

    _clearNavigationWidget: function() {
        if(this._$navigationWidget) {
            this._commandManager.clearContainer(this._$navigationWidget.dxCommandContainer("instance"));
        }
    },

    element: function() {
        return this._$mainLayout;
    },

    _getViewFrame: function(viewInfo) {
        return this._$mainLayout;
    },

    _getLayoutTemplateName: function() {
        return this.name;
    },

    _applyModelToTransitionElements: function($markup, model) {
        var that = this;

        this._getTransitionElements($markup).each(function(i, item) {
            that._applyTemplate($(item).children(), model);
        });
    },

    _createViewLayoutTemplate: function() {
        var that = this;

        var $viewLayoutTemplate = that._$layoutTemplate.clone();
        this._hideElements($viewLayoutTemplate);

        return $viewLayoutTemplate;
    },

    _createEmptyLayout: function() {
        var that = this;

        var $result = that._$layoutTemplate.clone();
        this._hideElements($result);
        this._getTransitionElements($result).empty();
        $result.children(CONTENT_SELECTOR).remove();

        return $result;
    },

    _getTransitionElements: function($markup) {
        var $items = $markup.find(TRANSITION_SELECTOR).add($markup.filter(TRANSITION_SELECTOR)),
            result = [];

        for(var i = 0; i < $items.length; i++) {
            var $item = $items.eq(i);
            if($item.parents(TRANSITION_SELECTOR).length === 0) {
                result.push($item.get(0));
            }
        }
        return $(result);
    },

    showView: function(viewInfo, direction) {
        direction = direction || "forward";

        var that = this,
            previousViewInfo = that._getPreviousViewInfo(viewInfo),
            previousViewTemplateId = previousViewInfo === viewInfo ? previousViewInfo.currentViewTemplateId : undefined,
            result;

        this._showViewFired = true;

        this._updateCurrentViewTemplateId(viewInfo);

        if(previousViewTemplateId && previousViewTemplateId === viewInfo.currentViewTemplateId && viewInfo === previousViewInfo) {
            that.fireEvent("viewShowing", [viewInfo, direction]);
            result = $.Deferred().resolve().promise();
        } else {
            that._ensureViewRendered(viewInfo);
            that.fireEvent("viewShowing", [viewInfo, direction]);
            result = this._showViewImpl(viewInfo, direction, previousViewTemplateId/* TODO Try to invent a better solution */).done(function() {
                that._onViewShown(viewInfo);
            });
        }

        return result;
    },

    disposeView: function(viewInfo) {
        this._clearRenderResult(viewInfo);
    },

    _clearRenderResult: function(viewInfo) {
        if(viewInfo.renderResult) {
            viewInfo.renderResult.$markup.remove();
            viewInfo.renderResult.$viewItems.remove();
            delete viewInfo.renderResult;
        }
    },

    _renderViewImpl: function($viewTemplate, viewInfo) {
        var that = this,
            allowedChildrenSelector = ".dx-command,.dx-content,script",
            $layout = this._createViewLayoutTemplate(),
            $viewItems,
            isSimplifiedMarkup = true,
            outOfContentItems = $();

        if($viewTemplate.children(allowedChildrenSelector).length === 0) {
            this._viewEngine._wrapViewDefaultContent($viewTemplate);
        }

        $viewItems = $viewTemplate.children();

        this._applyModelToTransitionElements($layout, viewInfo.model);
        this._viewEngine.applyLayout($viewTemplate, $layout);


        $viewItems.each(function(i, item) {
            var $item = $(item);

            that._applyTemplate($item, viewInfo.model);

            if($item.is(allowedChildrenSelector)) {
                isSimplifiedMarkup = false;
            } else {
                outOfContentItems = outOfContentItems.add($item);
            }
        });

        if(outOfContentItems.length && !isSimplifiedMarkup) {
            throw errors.Error("E3014", outOfContentItems[0].outerHTML);
        }

        viewInfo.renderResult = viewInfo.renderResult || {};
        viewInfo.renderResult.$viewItems = $viewItems;
        viewInfo.renderResult.$markup = $layout;
    },

    _renderCommands: function($markup, commands) {
        var commandContainers = this._findCommandContainers($markup);
        return this._commandManager.renderCommandsToContainers(commands, commandContainers);
    },

    _prepareViewCommands: function(viewInfo) {
        var $viewItems = viewInfo.renderResult.$viewItems,
            viewCommands = this._commandManager.findCommands($viewItems),
            commandsToRenderMap = {};

        viewInfo.commands = frameworkUtils.utils.mergeCommands(viewInfo.commands || [], viewCommands);
        viewInfo.commandsToRenderMap = commandsToRenderMap;

        iteratorUtils.each(viewInfo.commands, function(index, command) {
            var renderStage = command.option("renderStage") || DEFAULT_COMMAND_RENDER_STAGE,
                targetArray = commandsToRenderMap[renderStage] = commandsToRenderMap[renderStage] || [];

            targetArray.push(command);
        });
    },

    _applyViewCommands: function(viewInfo, renderStage) {
        renderStage = renderStage || DEFAULT_COMMAND_RENDER_STAGE;

        var commandsToRender = viewInfo.commandsToRenderMap[renderStage],
            $markup = viewInfo.renderResult.$markup,
            result;

        if(commandsToRender) {
            result = this._renderCommands($markup, commandsToRender);
            delete viewInfo.commandsToRenderMap[renderStage];
        } else {
            result = $.Deferred().resolve().promise();
        }

        return result;
    },

    _findCommandContainers: function($markup) {
        // TODO remove this (do that on start in viewEngine)
        return domUtils.createComponents($markup, ["dxCommandContainer"]);
    },

    _getViewTemplateId: function(viewInfo) {
        var viewTemplateInstance = viewInfo.$viewTemplate
            ? viewInfo.$viewTemplate.dxView("instance")
            : this._viewEngine.getViewTemplateInfo(viewInfo.viewName);

        return viewTemplateInstance.getId();
    },

    _updateCurrentViewTemplateId: function(viewInfo) {
        viewInfo.currentViewTemplateId = this._getViewTemplateId(viewInfo);
    },

    _ensureViewRendered: function(viewInfo) {
        var $cachedMarkup = viewInfo.renderResult && viewInfo.renderResult.markupCache[viewInfo.currentViewTemplateId];

        if($cachedMarkup) {
            viewInfo.renderResult.$markup = $cachedMarkup;
        } else {
            this._renderView(viewInfo);
            viewInfo.renderResult.markupCache = viewInfo.renderResult.markupCache || {};
            viewInfo.renderResult.markupCache[viewInfo.currentViewTemplateId] = viewInfo.renderResult.$markup;
        }
    },

    _renderView: function(viewInfo) {
        var $viewTemplate = viewInfo.$viewTemplate || this._viewEngine.getViewTemplate(viewInfo.viewName);

        this._renderViewImpl($viewTemplate, viewInfo);
        this._prepareViewCommands(viewInfo);
        this._applyViewCommands(viewInfo, "onViewRendering");

        this._appendViewToLayout(viewInfo);
        $viewTemplate.remove();
        this._onRenderComplete(viewInfo);
        this.fireEvent("viewRendered", [viewInfo]);
    },

    _prepareTransition: function($element, targetPlaceholderName) {
        if($element.children(".dx-content").length === 0) {
            $element.wrapInner("<div>");
            $element.children().dxContent({
                targetPlaceholder: targetPlaceholderName
            });
        }
    },

    _appendViewToLayout: function(viewInfo) {
        var that = this,
            $viewFrame = that._getViewFrame(viewInfo),
            $markup = viewInfo.renderResult.$markup,
            $transitionContentElements = $(),
            animationItems = [];

        iteratorUtils.each($markup.find(".dx-content-placeholder"), function(index, el) {
            that._prepareTransition($(el), $(el).attr("data-dx-content-placeholder-name"));
        });

        iteratorUtils.each(that._getTransitionElements($viewFrame), function(index, transitionElement) {
            var $transition = $(transitionElement),
                $viewElement = $markup.find(transitionSelector($transition.attr("data-dx-transition-name"))).children(),
                animationItem = {
                    $element: $viewElement,
                    animation: $transition.attr("data-dx-transition-type")
                };

            animationItems.push(animationItem);
            $transition.append($viewElement);
            that._showViewElements($viewElement);
            domUtils.triggerShownEvent($viewElement);
            $transitionContentElements = $transitionContentElements.add($viewElement);
        });


        that._$mainLayout.append(viewInfo.renderResult.$viewItems.filter(".dx-command"));
        $markup.remove();
        viewInfo.renderResult.$markup = $transitionContentElements;
        viewInfo.renderResult.animationItems = animationItems;
    },

    _onRenderComplete: function(viewInfo) {
    },

    _onViewShown: function(viewInfo) {
        eventsEngine.trigger(domAdapter.getDocument(), "dx.viewchanged");
    },

    _enter: function(animationItems, animationModifier) {
        var transitionExecutor = this.transitionExecutor;

        iteratorUtils.each(animationItems, function(index, item) {
            transitionExecutor.enter(item.$element, item.animation, animationModifier);
        });
    },

    _leave: function(animationItems, animationModifier) {
        var transitionExecutor = this.transitionExecutor;

        iteratorUtils.each(animationItems, function(index, item) {
            transitionExecutor.leave(item.$element, item.animation, animationModifier);
        });
    },

    _doTransition: function(oldViewInfo, newViewInfo, animationModifier) {
        if(oldViewInfo) {
            this._leave(oldViewInfo.renderResult.animationItems, animationModifier);
        }
        this._enter(newViewInfo.renderResult.animationItems, animationModifier);
        this._showView(newViewInfo);
        return this.transitionExecutor.start();
    },

    _showViewImpl: function(viewInfo, direction, previousViewTemplateId) {
        var that = this,
            previousViewInfo = this._getPreviousViewInfo(viewInfo),
            animationModifier = { direction: direction };

        if(previousViewInfo === viewInfo) {
            previousViewInfo = undefined;
        }

        if(!previousViewInfo) {
            animationModifier.duration = 0;
            animationModifier.delay = 0;
        }

        var d = $.Deferred();
        that._doTransition(previousViewInfo, viewInfo, animationModifier).done(function() {
            that._changeView(viewInfo, previousViewTemplateId).done(function(result) {
                d.resolve(result);
            });
        });
        return d.promise();
    },

    _releaseView: function(viewInfo) {
        this.fireEvent("viewReleased", [viewInfo]);
    },

    _getReadyForRenderDeferredItems: function(viewInfo) {
        return $.Deferred().resolve().promise();
    },

    _changeView: function(viewInfo, previousViewTemplateId) {
        var that = this;

        if(previousViewTemplateId) {
            that._hideView(viewInfo, previousViewTemplateId);
        } else {
            var previousViewInfo = that._getPreviousViewInfo(viewInfo);
            if(previousViewInfo && previousViewInfo !== viewInfo) {
                that._hideView(previousViewInfo);
                that._releaseView(previousViewInfo);
            }

            this._visibleViews[this._getViewPaneName(viewInfo.viewTemplateInfo)] = viewInfo;
        }

        this._subscribeToDeferredItems(viewInfo);

        var d = $.Deferred();
        this._getReadyForRenderDeferredItems(viewInfo).done(function() {
            that._applyViewCommands(viewInfo).done(function() {
                that._renderDeferredItems(viewInfo.renderResult.$markup).done(function() {
                    d.resolve();
                });
            });
        });
        return d.promise();
    },

    _subscribeToDeferredItems: function(viewInfo) {
        var that = this,
            $markup = viewInfo.renderResult.$markup;

        $markup
            .find(PENDING_RENDERING_SELECTOR)
            .add($markup.filter(PENDING_RENDERING_SELECTOR))
            .each(function() {
                var eventData = {
                    viewInfo: viewInfo,
                    context: that
                };

                $(this).on(CONTENT_RENDERED_EVENT_NAME, eventData, that._onDeferredContentRendered);
            });
    },

    _onDeferredContentRendered: function(event) {
        var $element = $(event.target),
            viewInfo = event.data.viewInfo,
            that = event.data.context;

        $element.off(CONTENT_RENDERED_EVENT_NAME, that._onDeferredContentRendered);
        that._renderCommands($element, viewInfo.commands);
    },

    _renderDeferredItems: function($items) {
        var that = this,
            result = $.Deferred();

        var $pendingItem = $items
            .find(PENDING_RENDERING_MANUAL_SELECTOR)
            .add($items.filter(PENDING_RENDERING_MANUAL_SELECTOR))
            .first();

        if($pendingItem.length) {
            var render = $pendingItem.data("dx-render-delegate");

            commonUtils.executeAsync(function() {
                render()
                    .done(function() {
                        that._renderDeferredItems($items).done(function() {
                            result.resolve();
                        });
                    });
            });
        } else {
            result.resolve();
        }

        return result.promise();
    },

    _getViewPaneName: function(viewTemplateInfo) {
        return this._defaultPaneName;
    },

    _hideElements: function($elements) {
        // we can't use $.hide/show because of B250423, T173009
        $elements.addClass("dx-fast-hidden");
    },

    _showElements: function($elements) {
        $elements.removeClass("dx-fast-hidden");
    },

    _hideViewElements: function($elements) {
        this._patchIds($elements);
        this._disableInputs($elements);
        $elements.removeClass("dx-active-view").addClass("dx-inactive-view");
    },

    _hideView: function(viewInfo, templateId) {
        if(viewInfo.renderResult) {
            var $markupToHide = templateId === undefined ? viewInfo.renderResult.$markup : viewInfo.renderResult.markupCache[templateId];
            this._hideViewElements($markupToHide);
            this.fireEvent("viewHidden", [viewInfo]);
        }
    },

    _showViewElements: function($elements) {
        this._unPatchIds($elements);
        this._enableInputs($elements);
        $elements.removeClass("dx-inactive-view").addClass("dx-active-view");
        this._skipAnimation($elements);
    },

    _showView: function(viewInfo) {
        if(viewInfo.renderResult) {
            this._showViewElements(viewInfo.renderResult.$markup);
        }
    },

    _skipAnimation: function($elements) {
        $elements.addClass("dx-skip-animation");
        for(var i = 0; i < $elements.length; i++) {
            $elements.eq(i).css("transform");// force css class to apply immediately
        }
        $elements.removeClass("dx-skip-animation");
    },

    _patchIds: function($markup) {
        this._processIds($markup, function(id) {
            var result = id;
            if(id.indexOf(HIDDEN_BAG_ID) === -1) {
                result = HIDDEN_BAG_ID + "-" + id;
            }
            return result;
        });
    },

    _unPatchIds: function($markup) {
        this._processIds($markup, function(id) {
            var result = id;
            if(id.indexOf(HIDDEN_BAG_ID) === 0) {
                result = id.substr(HIDDEN_BAG_ID.length + 1);
            }
            return result;
        });
    },

    _processIds: function($markup, process) {
        var elementsWithIds = $markup.find("[id]");
        iteratorUtils.each(elementsWithIds, function(index, element) {
            var $el = $(element),
                id = $el.attr("id");
            $el.attr("id", process(id));
        });
    },

    _enableInputs: function($markup) {
        var $inputs = this._getInputs($markup).filter("[data-disabled='true']");
        iteratorUtils.each($inputs, function(index, input) {
            $(input).removeAttr("disabled")
                .removeAttr("data-disabled");
        });
    },

    _disableInputs: function($markup) {
        var $inputs = this._getInputs($markup);
        $inputs = $inputs.filter(":not([disabled])").add($inputs.filter("[disabled=true]"));
        iteratorUtils.each($inputs, function(index, input) {
            $(input).attr({
                "disabled": true,
                "data-disabled": true
            });
        });
    },

    _getInputs: function($markup) {
        return $markup.find("input, button, select, textarea");
    }

}).include(EventsMixin);

layoutSets["default"] = layoutSets["default"] || [];
layoutSets["default"].push({ controller: new DefaultLayoutController() });

exports.DefaultLayoutController = DefaultLayoutController;
exports.layoutSets = layoutSets;
