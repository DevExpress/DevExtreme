"use strict";

var $ = require("../core/renderer"),
    window = require("../core/utils/window").getWindow(),
    translator = require("../animation/translator"),
    camelize = require("../core/utils/inflector").camelize,
    noop = require("../core/utils/common").noop,
    getPublicElement = require("../core/utils/dom").getPublicElement,
    each = require("../core/utils/iterator").each,
    isDefined = require("../core/utils/type").isDefined,
    inArray = require("../core/utils/array").inArray,
    extend = require("../core/utils/extend").extend,
    messageLocalization = require("../localization/message"),
    devices = require("../core/devices"),
    registerComponent = require("../core/component_registrator"),
    Button = require("./button"),
    themes = require("./themes"),
    Overlay = require("./overlay"),
    EmptyTemplate = require("./widget/empty_template"),
    domUtils = require("../core/utils/dom"),
    windowUtils = require("../core/utils/window");

require("./toolbar/ui.toolbar.base");

var POPUP_CLASS = "dx-popup",
    POPUP_WRAPPER_CLASS = "dx-popup-wrapper",
    POPUP_FULL_SCREEN_CLASS = "dx-popup-fullscreen",
    POPUP_FULL_SCREEN_WIDTH_CLASS = "dx-popup-fullscreen-width",
    POPUP_NORMAL_CLASS = "dx-popup-normal",
    POPUP_CONTENT_CLASS = "dx-popup-content",

    POPUP_DRAGGABLE_CLASS = "dx-popup-draggable",

    POPUP_TITLE_CLASS = "dx-popup-title",
    POPUP_TITLE_CLOSEBUTTON_CLASS = "dx-closebutton",

    POPUP_BOTTOM_CLASS = "dx-popup-bottom",

    POPUP_TOOLBAR_COMPACT_CLASS = "dx-popup-toolbar-compact",

    TEMPLATE_WRAPPER_CLASS = "dx-template-wrapper",

    ALLOWED_TOOLBAR_ITEM_ALIASES = ["cancel", "clear", "done"],

    BUTTON_DEFAULT_TYPE = "default",
    BUTTON_NORMAL_TYPE = "normal",
    BUTTON_FLAT_CLASS = "dx-button-flat";

var getButtonPlace = function(name) {

    var device = devices.current(),
        platform = device.platform,
        toolbar = "bottom",
        location = "before";

    if(platform === "ios") {
        switch(name) {
            case "cancel":
                toolbar = "top";
                break;
            case "clear":
                toolbar = "top";
                location = "after";
                break;
            case "done":
                location = "after";
                break;
        }
    } else if(platform === "win") {
        location = "after";
    } else if(platform === "android" && device.version && parseInt(device.version[0]) > 4) {
        switch(name) {
            case "cancel":
                location = "after";
                break;
            case "done":
                location = "after";
                break;
        }
    } else if(platform === "android") {
        location = "center";
    }

    return {
        toolbar: toolbar,
        location: location
    };
};

/**
 * @name dxPopup
 * @inherits dxOverlay
 * @module ui/popup
 * @export default
 */
var Popup = Overlay.inherit({

    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            /**
            * @name dxPopupOptions.fullScreen
            * @type boolean
            * @default false
            */
            fullScreen: false,

            /**
            * @name dxPopupOptions.title
            * @type string
            * @default ""
            */
            title: "",

            /**
            * @name dxPopupOptions.showTitle
            * @type boolean
            * @default true
            */
            showTitle: true,

            /**
             * @name dxPopupOptions.container
             * @type string|Node|jQuery
             * @default undefined
             */

            /**
            * @name dxPopupOptions.titleTemplate
            * @type template|function
            * @default "title"
            * @type_function_param1 titleElement:dxElement
            * @type_function_return string|Node|jQuery
            */
            titleTemplate: "title",

            /**
            * @name dxPopupOptions.onTitleRendered
            * @extends Action
            * @type function(e)
            * @type_function_param1 e:object
            * @type_function_param1_field4 titleElement:dxElement
            * @action
            */
            onTitleRendered: null,

            /**
            * @name dxPopupOptions.dragEnabled
            * @type boolean
            * @default false
            */
            dragEnabled: false,

            /**
            * @name dxPopupOptions.position
            * @type Enums.PositionAlignment|positionConfig|function
            * @inheritdoc
            */

            /**
             * @name dxPopupOptions.resizeEnabled
             * @type boolean
             * @default false
             */

            /**
            * @name dxPopupOptions.onResizeStart
            * @extends Action
            * @action
            */

            /**
            * @name dxPopupOptions.onResize
            * @extends Action
            * @action
            */

            /**
            * @name dxPopupOptions.onResizeEnd
            * @extends Action
            * @action
            */

            /**
             * @name dxPopupOptions.width
             * @fires dxPopupOptions.onResize
             * @inheritdoc
             */

            /**
             * @name dxPopupOptions.height
             * @fires dxPopupOptions.onResize
             * @inheritdoc
             */

            /**
            * @name dxPopupOptions.toolbarItems
            * @type Array<Object>
            */
            /**
            * @name dxPopupOptions.toolbarItems.toolbar
            * @type Enums.Toolbar
            * @default 'top'
            */
            /**
            * @name dxPopupOptions.toolbarItems.html
            * @type String
            */
            /**
            * @name dxPopupOptions.toolbarItems.text
            * @type String
            */
            /**
            * @name dxPopupOptions.toolbarItems.visible
            * @type boolean
            * @default true
            */
            /**
            * @name dxPopupOptions.toolbarItems.disabled
            * @type boolean
            * @default false
            */
            /**
            * @name dxPopupOptions.toolbarItems.template
            * @type template
            */
            /**
            * @name dxPopupOptions.toolbarItems.widget
            * @type Enums.ToolbarItemWidget
            */
            /**
            * @name dxPopupOptions.toolbarItems.options
            * @type object
            */
            /**
            * @name dxPopupOptions.toolbarItems.location
            * @type Enums.ToolbarItemLocation
            * @default 'center'
            */
            toolbarItems: [],

            /**
            * @name dxPopupOptions.showCloseButton
            * @type boolean
            * @default false
            */
            showCloseButton: false,

            bottomTemplate: "bottom",
            useDefaultToolbarButtons: false,
            useFlatToolbarButtons: false,
            toolbarCompactMode: false
        });
    },

    _defaultOptionsRules: function() {
        return this.callBase().concat([
            {
                device: function(device) {
                    return device.phone && themes.isWin8();
                },
                options: {
                    position: {
                        my: "top center",
                        at: "top center",
                        offset: "0 0"
                    }
                }
            },
            {
                device: { platform: "ios" },
                options: {
                    /**
                    * @name dxPopupOptions.animation
                    * @default { show: { type: 'slide', duration: 400, from: { position: { my: 'top', at: 'bottom', of: window } }, to: { position: { my: 'center', at: 'center', of: window } } }, hide: { type: 'slide', duration: 400, from: { position: { my: 'center', at: 'center', of: window } }, to: { position: { my: 'top', at: 'bottom', of: window } } }} @for iOS
                    * @inheritdoc
                    */
                    /**
                    * @name dxPopupOptions.animation.show
                    * @default { type: 'slide', duration: 400, from: { position: { my: 'top', at: 'bottom', of: window } }, to: { position: { my: 'center', at: 'center', of: window } }} @for iOS
                    * @inheritdoc
                    */
                    /**
                    * @name dxPopupOptions.animation.hide
                    * @default { type: 'slide', duration: 400, from: { position: { my: 'center', at: 'center', of: window } }, to: { position: { my: 'top', at: 'bottom', of: window } }} @for iOS
                    * @inheritdoc
                    */
                    animation: this._iosAnimation
                }
            },
            {
                device: { platform: "android" },
                options: {
                    animation: this._androidAnimation
                }
            },
            {
                device: { platform: "generic" },
                options: {
                    /**
                    * @name dxPopupOptions.showCloseButton
                    * @default true @for desktop
                    */
                    showCloseButton: true
                }
            },
            {
                device: function(device) {
                    return devices.real().platform === "generic" && device.platform === "generic";
                },
                options: {
                    /**
                    * @name dxPopupOptions.dragEnabled
                    * @default true @for desktop
                    */
                    dragEnabled: true
                }
            },
            {
                device: function() {
                    return devices.real().deviceType === "desktop" && !devices.isSimulator();
                },
                options: {
                    /**
                    * @name dxPopupOptions.focusStateEnabled
                    * @type boolean
                    * @default true @for desktop
                    * @inheritdoc
                    */
                    focusStateEnabled: true
                }
            },
            {
                device: function() {
                    return themes.isMaterial();
                },
                options: {
                    useDefaultToolbarButtons: true,
                    useFlatToolbarButtons: true
                }
            }
        ]);
    },

    _iosAnimation: {
        show: {
            type: "slide",
            duration: 400,
            from: {
                position: {
                    my: "top",
                    at: "bottom"
                }
            },
            to: {
                position: {
                    my: "center",
                    at: "center"
                }
            }
        },
        hide: {
            type: "slide",
            duration: 400,
            from: {
                opacity: 1,
                position: {
                    my: "center",
                    at: "center"
                }
            },
            to: {
                opacity: 1,
                position: {
                    my: "top",
                    at: "bottom"
                }
            }
        }
    },

    _androidAnimation: function() {
        var fullScreenConfig = {
                show: { type: "slide", duration: 300, from: { top: "30%", opacity: 0 }, to: { top: 0, opacity: 1 } },
                hide: { type: "slide", duration: 300, from: { top: 0, opacity: 1 }, to: { top: "30%", opacity: 0 } }
            },
            defaultConfig = {
                show: { type: "fade", duration: 400, from: 0, to: 1 },
                hide: { type: "fade", duration: 400, from: 1, to: 0 }
            };

        return this.option("fullScreen") ? fullScreenConfig : defaultConfig;
    },

    _init: function() {
        this.callBase();

        this.$element().addClass(POPUP_CLASS);
        this._wrapper().addClass(POPUP_WRAPPER_CLASS);
        this._$popupContent = this._$content
            .wrapInner($("<div>").addClass(POPUP_CONTENT_CLASS))
            .children().eq(0);
    },

    _render: function() {
        var isFullscreen = this.option("fullScreen");

        this._toggleFullScreenClass(isFullscreen);
        this.callBase();
    },

    _toggleFullScreenClass: function(value) {
        this._$content
            .toggleClass(POPUP_FULL_SCREEN_CLASS, value)
            .toggleClass(POPUP_NORMAL_CLASS, !value);
    },

    _initTemplates: function() {
        this.callBase();

        this._defaultTemplates["title"] = new EmptyTemplate(this);
        this._defaultTemplates["bottom"] = new EmptyTemplate(this);
    },

    _renderContentImpl: function() {
        this.callBase();
        this._renderTitle();
        this._renderBottom();
    },

    _renderTitle: function() {
        var items = this._getToolbarItems("top"),
            titleText = this.option("title"),
            showTitle = this.option("showTitle");

        if(showTitle && !!titleText) {
            items.unshift({
                location: devices.current().ios ? "center" : "before",
                text: titleText
            });
        }

        if(showTitle || items.length > 0) {
            this._$title && this._$title.remove();
            var $title = $("<div>").addClass(POPUP_TITLE_CLASS).insertBefore(this.$content());
            this._$title = this._renderTemplateByType("titleTemplate", items, $title).addClass(POPUP_TITLE_CLASS);
            this._renderDrag();
            this._executeTitleRenderAction(this._$title);
        } else if(this._$title) {
            this._$title.detach();
        }
    },

    _renderTemplateByType: function(optionName, data, $container) {
        var template = this._getTemplateByOption(optionName),
            toolbarTemplate = template instanceof EmptyTemplate;

        if(toolbarTemplate) {
            var toolbarOptions = {
                items: data,
                rtlEnabled: this.option("rtlEnabled"),
                useDefaultButtons: this.option("useDefaultToolbarButtons"),
                useFlatButtons: this.option("useFlatToolbarButtons")
            };

            this._getTemplate("dx-polymorph-widget").render({
                container: $container,
                model: {
                    widget: "dxToolbarBase",
                    options: toolbarOptions
                }
            });
            var $toolbar = $container.children("div");
            $container.replaceWith($toolbar);
            return $toolbar;
        } else {
            var $result = $(template.render({ container: getPublicElement($container) }));
            if($result.hasClass(TEMPLATE_WRAPPER_CLASS)) {
                $container.replaceWith($result);
                $container = $result;
            }
            return $container;
        }
    },

    _executeTitleRenderAction: function($titleElement) {
        this._getTitleRenderAction()({
            titleElement: getPublicElement($titleElement)
        });
    },

    _getTitleRenderAction: function() {
        return this._titleRenderAction || this._createTitleRenderAction();
    },

    _createTitleRenderAction: function() {
        return (this._titleRenderAction = this._createActionByOption("onTitleRendered", {
            element: this.element(),
            excludeValidators: ["designMode", "disabled", "readOnly"]
        }));
    },

    _getCloseButton: function() {
        return {
            toolbar: "top",
            location: "after",
            template: this._getCloseButtonRenderer()
        };
    },

    _getCloseButtonRenderer: function() {
        return (function(_, __, container) {
            var $button = $("<div>").addClass(POPUP_TITLE_CLOSEBUTTON_CLASS);
            this._createComponent($button, Button, {
                icon: 'close',
                onClick: this._createToolbarItemAction(undefined),
                integrationOptions: {}
            });
            $(container).append($button);
        }).bind(this);
    },

    _getToolbarItems: function(toolbar) {

        var toolbarItems = this.option("toolbarItems");

        var toolbarsItems = [];

        this._toolbarItemClasses = [];

        var currentPlatform = devices.current().platform,
            index = 0;

        each(toolbarItems, (function(_, data) {
            var isShortcut = isDefined(data.shortcut),
                item = isShortcut ? getButtonPlace(data.shortcut) : data;

            if(isShortcut && currentPlatform === "ios" && index < 2) {
                item.toolbar = "top";
                index++;
            }

            item.toolbar = data.toolbar || item.toolbar || "top";

            if(item && item.toolbar === toolbar) {
                if(isShortcut) {
                    extend(item, { location: data.location }, this._getToolbarItemByAlias(data));
                }

                var isLTROrder = currentPlatform === "win" || currentPlatform === "generic";

                if((data.shortcut === "done" && isLTROrder) || (data.shortcut === "cancel" && !isLTROrder)) {
                    toolbarsItems.unshift(item);
                } else {
                    toolbarsItems.push(item);
                }
            }
        }).bind(this));

        if(toolbar === "top" && this.option("showCloseButton") && this.option("showTitle")) {
            toolbarsItems.push(this._getCloseButton());
        }

        return toolbarsItems;
    },

    _getToolbarItemByAlias: function(data) {
        var that = this,
            itemType = data.shortcut;

        if(inArray(itemType, ALLOWED_TOOLBAR_ITEM_ALIASES) < 0) {
            return false;
        }

        var itemConfig = extend({
            text: messageLocalization.format(camelize(itemType, true)),
            onClick: this._createToolbarItemAction(data.onClick),
            integrationOptions: {},
            type: that.option("useDefaultToolbarButtons") ? BUTTON_DEFAULT_TYPE : BUTTON_NORMAL_TYPE
        }, data.options || {});

        var itemClass = POPUP_CLASS + "-" + itemType;
        if(that.option("useFlatToolbarButtons")) {
            itemClass += " " + BUTTON_FLAT_CLASS;
        }

        this._toolbarItemClasses.push(itemClass);

        return {
            template: function(_, __, container) {
                var $toolbarItem = $("<div>").addClass(itemClass).appendTo(container);
                that._createComponent($toolbarItem, Button, itemConfig);
            }
        };
    },

    _createToolbarItemAction: function(clickAction) {
        return this._createAction(clickAction, {
            afterExecute: function(e) {
                e.component.hide();
            }
        });
    },

    _renderBottom: function() {
        var items = this._getToolbarItems("bottom");

        if(items.length) {
            this._$bottom && this._$bottom.remove();
            var $bottom = $("<div>").addClass(POPUP_BOTTOM_CLASS).insertAfter(this.$content());
            this._$bottom = this._renderTemplateByType("bottomTemplate", items, $bottom).addClass(POPUP_BOTTOM_CLASS);
            this.$bottomToolbarContentItems = this._$bottom.find(".dx-toolbar-items-container > div");
            this._toggleClasses();
        } else {
            this._$bottom && this._$bottom.detach();
        }
    },

    _getBottomToolbarWidth: function() {
        var width = 0;

        if(this.$bottomToolbarContentItems) {
            this.$bottomToolbarContentItems.each(function(index, item) {
                width += $(item).outerWidth();
            });
        }

        return width;
    },

    _updateBottomToolbarCompactMode: function() {
        if(this._$bottom) {
            this._$bottom.removeClass(POPUP_TOOLBAR_COMPACT_CLASS);

            if(this._$bottom.width() < this._getBottomToolbarWidth()) {
                this._$bottom.addClass(POPUP_TOOLBAR_COMPACT_CLASS);
            }
        }
    },

    _show: function() {
        var result = this.callBase.apply(this, arguments);

        if(this.option("toolbarCompactMode")) {
            this._updateBottomToolbarCompactMode();
        }

        return result;
    },

    _toggleClasses: function() {
        var aliases = ALLOWED_TOOLBAR_ITEM_ALIASES;

        each(aliases, (function(_, alias) {
            var className = POPUP_CLASS + "-" + alias;

            if(inArray(className, this._toolbarItemClasses) >= 0) {
                this._wrapper().addClass(className + "-visible");
                this._$bottom.addClass(className);
            } else {
                this._wrapper().removeClass(className + "-visible");
                this._$bottom.removeClass(className);
            }
        }).bind(this));
    },

    _getDragTarget: function() {
        return this._$title;
    },

    _renderGeometryImpl: function() {
        this._resetContentHeight();
        this.callBase.apply(this, arguments);
        this._setContentHeight();
    },

    _resetContentHeight: function() {
        this._$popupContent.css({
            "height": "auto"
        });
    },

    _renderDrag: function() {
        this.callBase();

        this._$content.toggleClass(POPUP_DRAGGABLE_CLASS, this.option("dragEnabled"));
    },

    _renderResize: function() {
        this.callBase();

        this._resizable.option("onResize", (function() {
            this._setContentHeight();

            this._actions.onResize(arguments);
        }).bind(this));
    },

    _setContentHeight: function() {
        (this.option("forceApplyBindings") || noop)();

        if(this._disallowUpdateContentHeight()) {
            return;
        }

        var contentPaddings = this._$content.outerHeight() - this._$content.height(),
            contentHeight = this._$content.get(0).getBoundingClientRect().height - contentPaddings;
        if(this._$title && this._$title.is(":visible")) {
            contentHeight -= this._$title.get(0).getBoundingClientRect().height || 0;
        }
        if(this._$bottom && this._$bottom.is(":visible")) {
            contentHeight -= this._$bottom.get(0).getBoundingClientRect().height || 0;
        }

        this._$popupContent.css("height", contentHeight < 0 ? 0 : contentHeight);
    },

    _disallowUpdateContentHeight: function() {
        var isHeightAuto = this._$content.get(0).style.height === "auto",
            maxHeightSpecified = this._$content.css("maxHeight") !== "none",
            minHeightSpecified = parseInt(this._$content.css("minHeight")) > 0;

        return isHeightAuto && !(maxHeightSpecified || minHeightSpecified);
    },

    _renderDimensions: function() {
        if(this.option("fullScreen")) {
            this._$content.css({
                width: "100%",
                height: "100%"
            });
        } else {
            this.callBase.apply(this, arguments);
        }
        if(windowUtils.hasWindow()) {
            this._renderFullscreenWidthClass();
        }
    },

    _renderFullscreenWidthClass: function() {
        this.overlayContent().toggleClass(POPUP_FULL_SCREEN_WIDTH_CLASS, this.overlayContent().outerWidth() === $(window).width());
    },

    _renderShadingDimensions: function() {
        if(this.option("fullScreen")) {
            this._wrapper().css({
                width: "100%",
                height: "100%"
            });
        } else {
            this.callBase.apply(this, arguments);
        }
    },

    refreshPosition: function() {
        this._renderPosition();
    },

    _renderPosition: function() {
        if(this.option("fullScreen")) {
            translator.move(this._$content, {
                top: 0,
                left: 0
            });
        } else {
            (this.option("forceApplyBindings") || noop)();

            return this.callBase.apply(this, arguments);
        }
    },

    _optionChanged: function(args) {
        switch(args.name) {
            case "showTitle":
            case "title":
            case "titleTemplate":
                this._renderTitle();
                this._renderGeometry();
                break;
            case "bottomTemplate":
            case "toolbarCompactMode":
                this._renderBottom();
                this._renderGeometry();
                break;
            case "onTitleRendered":
                this._createTitleRenderAction(args.value);
                break;
            case "toolbarItems":
            case "useDefaultToolbarButtons":
            case "useFlatToolbarButtons":
                var isPartialUpdate = args.fullName.search(".options") !== -1;
                this._renderTitle();
                this._renderBottom();

                if(!isPartialUpdate) {
                    this._renderGeometry();
                }
                break;
            case "dragEnabled":
                this._renderDrag();
                break;
            case "fullScreen":
                this._toggleFullScreenClass(args.value);
                this._renderGeometry();
                domUtils.triggerResizeEvent(this._$content);
                break;
            case "showCloseButton":
                this._renderTitle();
                break;
            default:
                this.callBase(args);
        }
    },

    bottomToolbar: function() {
        return this._$bottom;
    },

    $content: function() {
        return this._$popupContent;
    },

    content: function() {
        return getPublicElement(this._$popupContent);
    },

    overlayContent: function() {
        return this._$content;
    }

});

registerComponent("dxPopup", Popup);

module.exports = Popup;
