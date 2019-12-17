const $ = require('../core/renderer');
const window = require('../core/utils/window').getWindow();
const translator = require('../animation/translator');
const camelize = require('../core/utils/inflector').camelize;
const noop = require('../core/utils/common').noop;
const getPublicElement = require('../core/utils/dom').getPublicElement;
const each = require('../core/utils/iterator').each;
const isDefined = require('../core/utils/type').isDefined;
const inArray = require('../core/utils/array').inArray;
const extend = require('../core/utils/extend').extend;
const browser = require('../core/utils/browser');
const compareVersions = require('../core/utils/version').compare;
const messageLocalization = require('../localization/message');
const devices = require('../core/devices');
const registerComponent = require('../core/component_registrator');
const Button = require('./button');
const themes = require('./themes');
const Overlay = require('./overlay');
const EmptyTemplate = require('../core/templates/empty_template').EmptyTemplate;
const domUtils = require('../core/utils/dom');
const sizeUtils = require('../core/utils/size');
const windowUtils = require('../core/utils/window');

require('./toolbar/ui.toolbar.base');

const POPUP_CLASS = 'dx-popup';
const POPUP_WRAPPER_CLASS = 'dx-popup-wrapper';
const POPUP_FULL_SCREEN_CLASS = 'dx-popup-fullscreen';
const POPUP_FULL_SCREEN_WIDTH_CLASS = 'dx-popup-fullscreen-width';
const POPUP_NORMAL_CLASS = 'dx-popup-normal';
const POPUP_CONTENT_CLASS = 'dx-popup-content';

const POPUP_DRAGGABLE_CLASS = 'dx-popup-draggable';

const POPUP_TITLE_CLASS = 'dx-popup-title';
const POPUP_TITLE_CLOSEBUTTON_CLASS = 'dx-closebutton';

const POPUP_BOTTOM_CLASS = 'dx-popup-bottom';

const TEMPLATE_WRAPPER_CLASS = 'dx-template-wrapper';

const POPUP_CONTENT_FLEX_HEIGHT_CLASS = 'dx-popup-flex-height';
const POPUP_CONTENT_INHERIT_HEIGHT_CLASS = 'dx-popup-inherit-height';

const ALLOWED_TOOLBAR_ITEM_ALIASES = ['cancel', 'clear', 'done'];

const BUTTON_DEFAULT_TYPE = 'default';
const BUTTON_NORMAL_TYPE = 'normal';
const BUTTON_TEXT_MODE = 'text';
const BUTTON_CONTAINED_MODE = 'contained';

const IS_IE11 = (browser.msie && parseInt(browser.version) === 11);
const IS_OLD_SAFARI = browser.safari && compareVersions(browser.version, [11]) < 0;
const HEIGHT_STRATEGIES = { static: '', inherit: POPUP_CONTENT_INHERIT_HEIGHT_CLASS, flex: POPUP_CONTENT_FLEX_HEIGHT_CLASS };

const getButtonPlace = function(name) {

    const device = devices.current();
    const platform = device.platform;
    let toolbar = 'bottom';
    let location = 'before';

    if(platform === 'ios') {
        switch(name) {
            case 'cancel':
                toolbar = 'top';
                break;
            case 'clear':
                toolbar = 'top';
                location = 'after';
                break;
            case 'done':
                location = 'after';
                break;
        }
    } else if(platform === 'android' && device.version && parseInt(device.version[0]) > 4) {
        switch(name) {
            case 'cancel':
                location = 'after';
                break;
            case 'done':
                location = 'after';
                break;
        }
    } else if(platform === 'android') {
        location = 'center';
    }

    return {
        toolbar: toolbar,
        location: location
    };
};

/**
 * @name dxPopup
 * @inherits dxOverlay
 * @hasTranscludedContent
 * @module ui/popup
 * @export default
 */
const Popup = Overlay.inherit({

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
            title: '',

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
            titleTemplate: 'title',

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
             */

            /**
             * @name dxPopupOptions.height
             * @fires dxPopupOptions.onResize
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

            bottomTemplate: 'bottom',
            useDefaultToolbarButtons: false,
            useFlatToolbarButtons: false,
            autoResizeEnabled: true
        });
    },

    _defaultOptionsRules: function() {
        const themeName = themes.current();

        return this.callBase().concat([
            {
                device: { platform: 'ios' },
                options: {
                    /**
                    * @name dxPopupOptions.animation
                    * @default { show: { type: 'slide', duration: 400, from: { position: { my: 'top', at: 'bottom', of: window } }, to: { position: { my: 'center', at: 'center', of: window } } }, hide: { type: 'slide', duration: 400, from: { position: { my: 'center', at: 'center', of: window } }, to: { position: { my: 'top', at: 'bottom', of: window } } }} @for iOS
                    */
                    /**
                    * @name dxPopupOptions.animation.show
                    * @default { type: 'slide', duration: 400, from: { position: { my: 'top', at: 'bottom', of: window } }, to: { position: { my: 'center', at: 'center', of: window } }} @for iOS
                    */
                    /**
                    * @name dxPopupOptions.animation.hide
                    * @default { type: 'slide', duration: 400, from: { position: { my: 'center', at: 'center', of: window } }, to: { position: { my: 'top', at: 'bottom', of: window } }} @for iOS
                    */
                    animation: this._iosAnimation
                }
            },
            {
                device: { platform: 'android' },
                options: {
                    animation: this._androidAnimation
                }
            },
            {
                device: { platform: 'generic' },
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
                    return devices.real().deviceType === 'desktop' && device.platform === 'generic';
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
                    return devices.real().deviceType === 'desktop' && !devices.isSimulator();
                },
                options: {
                    /**
                    * @name dxPopupOptions.focusStateEnabled
                    * @type boolean
                    * @default true @for desktop
                    */
                    focusStateEnabled: true
                }
            },
            {
                device: function() {
                    return themes.isMaterial(themeName);
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
            type: 'slide',
            duration: 400,
            from: {
                position: {
                    my: 'top',
                    at: 'bottom'
                }
            },
            to: {
                position: {
                    my: 'center',
                    at: 'center'
                }
            }
        },
        hide: {
            type: 'slide',
            duration: 400,
            from: {
                opacity: 1,
                position: {
                    my: 'center',
                    at: 'center'
                }
            },
            to: {
                opacity: 1,
                position: {
                    my: 'top',
                    at: 'bottom'
                }
            }
        }
    },

    _androidAnimation: function() {
        const fullScreenConfig = {
            show: { type: 'slide', duration: 300, from: { top: '30%', opacity: 0 }, to: { top: 0, opacity: 1 } },
            hide: { type: 'slide', duration: 300, from: { top: 0, opacity: 1 }, to: { top: '30%', opacity: 0 } }
        };
        const defaultConfig = {
            show: { type: 'fade', duration: 400, from: 0, to: 1 },
            hide: { type: 'fade', duration: 400, from: 1, to: 0 }
        };

        return this.option('fullScreen') ? fullScreenConfig : defaultConfig;
    },

    _init: function() {
        this.callBase();

        this.$element().addClass(POPUP_CLASS);
        this._wrapper().addClass(POPUP_WRAPPER_CLASS);
        this._$popupContent = this._$content
            .wrapInner($('<div>').addClass(POPUP_CONTENT_CLASS))
            .children().eq(0);
    },

    _render: function() {
        const isFullscreen = this.option('fullScreen');

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
        this._templateManager.addDefaultTemplates({
            title: new EmptyTemplate(),
            bottom: new EmptyTemplate()
        });
    },

    _renderContentImpl: function() {
        this._renderTitle();
        this.callBase();
        this._renderBottom();
    },

    _renderTitle: function() {
        const items = this._getToolbarItems('top');
        const titleText = this.option('title');
        const showTitle = this.option('showTitle');

        if(showTitle && !!titleText) {
            items.unshift({
                location: devices.current().ios ? 'center' : 'before',
                text: titleText
            });
        }

        if(showTitle || items.length > 0) {
            this._$title && this._$title.remove();
            const $title = $('<div>').addClass(POPUP_TITLE_CLASS).insertBefore(this.$content());
            this._$title = this._renderTemplateByType('titleTemplate', items, $title).addClass(POPUP_TITLE_CLASS);
            this._renderDrag();
            this._executeTitleRenderAction(this._$title);
        } else if(this._$title) {
            this._$title.detach();
        }
    },

    _renderTemplateByType: function(optionName, data, $container, additionalToolbarOptions) {
        const template = this._getTemplateByOption(optionName);
        const toolbarTemplate = template instanceof EmptyTemplate;

        if(toolbarTemplate) {
            const toolbarOptions = extend(additionalToolbarOptions, {
                items: data,
                rtlEnabled: this.option('rtlEnabled'),
                useDefaultButtons: this.option('useDefaultToolbarButtons'),
                useFlatButtons: this.option('useFlatToolbarButtons')
            });

            this._getTemplate('dx-polymorph-widget').render({
                container: $container,
                model: {
                    widget: 'dxToolbarBase',
                    options: toolbarOptions
                }
            });
            const $toolbar = $container.children('div');
            $container.replaceWith($toolbar);
            return $toolbar;
        } else {
            const $result = $(template.render({ container: getPublicElement($container) }));
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
        return (this._titleRenderAction = this._createActionByOption('onTitleRendered', {
            element: this.element(),
            excludeValidators: ['disabled', 'readOnly']
        }));
    },

    _getCloseButton: function() {
        return {
            toolbar: 'top',
            location: 'after',
            template: this._getCloseButtonRenderer()
        };
    },

    _getCloseButtonRenderer: function() {
        return (function(_, __, container) {
            const $button = $('<div>').addClass(POPUP_TITLE_CLOSEBUTTON_CLASS);
            this._createComponent($button, Button, {
                icon: 'close',
                onClick: this._createToolbarItemAction(undefined),
                integrationOptions: {}
            });
            $(container).append($button);
        }).bind(this);
    },

    _getToolbarItems: function(toolbar) {

        const toolbarItems = this.option('toolbarItems');

        const toolbarsItems = [];

        this._toolbarItemClasses = [];

        const currentPlatform = devices.current().platform;
        let index = 0;

        each(toolbarItems, (function(_, data) {
            const isShortcut = isDefined(data.shortcut);
            const item = isShortcut ? getButtonPlace(data.shortcut) : data;

            if(isShortcut && currentPlatform === 'ios' && index < 2) {
                item.toolbar = 'top';
                index++;
            }

            item.toolbar = data.toolbar || item.toolbar || 'top';

            if(item && item.toolbar === toolbar) {
                if(isShortcut) {
                    extend(item, { location: data.location }, this._getToolbarItemByAlias(data));
                }

                const isLTROrder = currentPlatform === 'generic';

                if((data.shortcut === 'done' && isLTROrder) || (data.shortcut === 'cancel' && !isLTROrder)) {
                    toolbarsItems.unshift(item);
                } else {
                    toolbarsItems.push(item);
                }
            }
        }).bind(this));

        if(toolbar === 'top' && this.option('showCloseButton') && this.option('showTitle')) {
            toolbarsItems.push(this._getCloseButton());
        }

        return toolbarsItems;
    },

    _getLocalizationKey(itemType) {
        return itemType.toLowerCase() === 'done' ? 'OK' : camelize(itemType, true);
    },

    _getToolbarItemByAlias: function(data) {
        const that = this;
        const itemType = data.shortcut;

        if(inArray(itemType, ALLOWED_TOOLBAR_ITEM_ALIASES) < 0) {
            return false;
        }

        const itemConfig = extend({
            text: messageLocalization.format(this._getLocalizationKey(itemType)),
            onClick: this._createToolbarItemAction(data.onClick),
            integrationOptions: {},
            type: that.option('useDefaultToolbarButtons') ? BUTTON_DEFAULT_TYPE : BUTTON_NORMAL_TYPE,
            stylingMode: that.option('useFlatToolbarButtons') ? BUTTON_TEXT_MODE : BUTTON_CONTAINED_MODE
        }, data.options || {});

        const itemClass = POPUP_CLASS + '-' + itemType;

        this._toolbarItemClasses.push(itemClass);

        return {
            template: function(_, __, container) {
                const $toolbarItem = $('<div>').addClass(itemClass).appendTo(container);
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
        const items = this._getToolbarItems('bottom');

        if(items.length) {
            this._$bottom && this._$bottom.remove();
            const $bottom = $('<div>').addClass(POPUP_BOTTOM_CLASS).insertAfter(this.$content());
            this._$bottom = this._renderTemplateByType('bottomTemplate', items, $bottom, { compactMode: true }).addClass(POPUP_BOTTOM_CLASS);
            this._toggleClasses();
        } else {
            this._$bottom && this._$bottom.detach();
        }
    },

    _toggleClasses: function() {
        const aliases = ALLOWED_TOOLBAR_ITEM_ALIASES;

        each(aliases, (function(_, alias) {
            const className = POPUP_CLASS + '-' + alias;

            if(inArray(className, this._toolbarItemClasses) >= 0) {
                this._wrapper().addClass(className + '-visible');
                this._$bottom.addClass(className);
            } else {
                this._wrapper().removeClass(className + '-visible');
                this._$bottom.removeClass(className);
            }
        }).bind(this));
    },

    _getContainer: function() {
        if(this.option('fullScreen')) {
            return $(window);
        }

        return this.callBase();
    },

    _getDragTarget: function() {
        return this.topToolbar();
    },

    _renderGeometryImpl: function(isDimensionChanged) {
        if(!isDimensionChanged) {
            this._resetContentHeight();
        }
        this.callBase.apply(this, arguments);
        this._setContentHeight();
    },

    _resetContentHeight: function() {
        this._$popupContent.css({
            'height': 'auto'
        });
    },

    _renderDrag: function() {
        this.callBase();

        this._$content.toggleClass(POPUP_DRAGGABLE_CLASS, this.option('dragEnabled'));
    },

    _renderResize: function() {
        this.callBase();

        this._resizable.option('onResize', (function() {
            this._setContentHeight();

            this._actions.onResize(arguments);
        }).bind(this));
    },

    _setContentHeight: function() {
        (this.option('forceApplyBindings') || noop)();

        const overlayContent = this.overlayContent().get(0);
        const currentHeightStrategyClass = this._chooseHeightStrategy(overlayContent);

        this.$content().css(this._getHeightCssStyles(currentHeightStrategyClass, overlayContent));
        this._setHeightClasses(this.overlayContent(), currentHeightStrategyClass);
    },

    _heightStrategyChangeOffset: function(currentHeightStrategyClass, popupVerticalPaddings) {
        return currentHeightStrategyClass === HEIGHT_STRATEGIES.flex ? -popupVerticalPaddings : 0;
    },

    _chooseHeightStrategy: function(overlayContent) {
        const isAutoWidth = overlayContent.style.width === 'auto' || overlayContent.style.width === '';
        let currentHeightStrategyClass = HEIGHT_STRATEGIES.static;

        if(this._isAutoHeight() && this.option('autoResizeEnabled')) {
            if(isAutoWidth || IS_OLD_SAFARI) {
                if(!IS_IE11) {
                    currentHeightStrategyClass = HEIGHT_STRATEGIES.inherit;
                }
            } else {
                currentHeightStrategyClass = HEIGHT_STRATEGIES.flex;
            }
        }

        return currentHeightStrategyClass;
    },

    _getHeightCssStyles: function(currentHeightStrategyClass, overlayContent) {
        let cssStyles = {};
        const contentMaxHeight = this._getOptionValue('maxHeight', overlayContent);
        const contentMinHeight = this._getOptionValue('minHeight', overlayContent);
        const popupHeightParts = this._splitPopupHeight();
        const toolbarsAndVerticalOffsetsHeight = popupHeightParts.header
                + popupHeightParts.footer
                + popupHeightParts.contentVerticalOffsets
                + popupHeightParts.popupVerticalOffsets
                + this._heightStrategyChangeOffset(currentHeightStrategyClass, popupHeightParts.popupVerticalPaddings);

        if(currentHeightStrategyClass === HEIGHT_STRATEGIES.static) {
            if(!this._isAutoHeight() || contentMaxHeight || contentMinHeight) {
                const overlayHeight = this.option('fullScreen')
                    ? Math.min(overlayContent.getBoundingClientRect().height, windowUtils.getWindow().innerHeight)
                    : overlayContent.getBoundingClientRect().height;
                const contentHeight = overlayHeight - toolbarsAndVerticalOffsetsHeight;
                cssStyles = {
                    height: Math.max(0, contentHeight),
                    minHeight: 'auto',
                    maxHeight: 'auto'
                };
            }
        } else {
            const container = $(this._getContainer()).get(0);
            const maxHeightValue = sizeUtils.addOffsetToMaxHeight(contentMaxHeight, -toolbarsAndVerticalOffsetsHeight, container);
            const minHeightValue = sizeUtils.addOffsetToMinHeight(contentMinHeight, -toolbarsAndVerticalOffsetsHeight, container);

            cssStyles = {
                height: 'auto',
                minHeight: minHeightValue,
                maxHeight: maxHeightValue
            };
        }

        return cssStyles;
    },

    _setHeightClasses: function($container, currentClass) {
        let excessClasses = '';

        for(const name in HEIGHT_STRATEGIES) {
            if(HEIGHT_STRATEGIES[name] !== currentClass) {
                excessClasses += ' ' + HEIGHT_STRATEGIES[name];
            }
        }

        $container.removeClass(excessClasses).addClass(currentClass);
    },

    _isAutoHeight: function() {
        return this.overlayContent().get(0).style.height === 'auto';
    },

    _splitPopupHeight: function() {
        const topToolbar = this.topToolbar();
        const bottomToolbar = this.bottomToolbar();

        return {
            header: sizeUtils.getVisibleHeight(topToolbar && topToolbar.get(0)),
            footer: sizeUtils.getVisibleHeight(bottomToolbar && bottomToolbar.get(0)),
            contentVerticalOffsets: sizeUtils.getVerticalOffsets(this.overlayContent().get(0), true),
            popupVerticalOffsets: sizeUtils.getVerticalOffsets(this.$content().get(0), true),
            popupVerticalPaddings: sizeUtils.getVerticalOffsets(this.$content().get(0), false)
        };
    },

    _useFixedPosition: function() {
        return this.callBase() || this.option('fullScreen');
    },

    _toggleSafariFullScreen: function(value) {
        const toggleFullScreenBeforeShown = this._useFixedPosition() && value && !this._isShown;
        if(toggleFullScreenBeforeShown) {
            this._bodyScrollTop = value ? window.pageYOffset : undefined;
        } else {
            this._toggleSafariScrolling(!value);
        }
    },

    _renderDimensions: function() {
        if(this.option('fullScreen')) {
            this._$content.css({
                width: '100%',
                height: '100%'
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

    refreshPosition: function() {
        this._renderPosition();
    },

    _renderPosition: function() {
        if(this.option('fullScreen')) {
            translator.move(this._$content, {
                top: 0,
                left: 0
            });
        } else {
            (this.option('forceApplyBindings') || noop)();

            return this.callBase.apply(this, arguments);
        }
    },

    _optionChanged: function(args) {
        switch(args.name) {
            case 'showTitle':
            case 'title':
            case 'titleTemplate':
                this._renderTitle();
                this._renderGeometry();
                break;
            case 'bottomTemplate':
                this._renderBottom();
                this._renderGeometry();
                break;
            case 'onTitleRendered':
                this._createTitleRenderAction(args.value);
                break;
            case 'toolbarItems':
            case 'useDefaultToolbarButtons':
            case 'useFlatToolbarButtons':
                // NOTE: Geometry rendering after "toolbarItems" runtime change breaks the popup animation first appereance.
                // But geometry rendering for options connected to the popup position still should be called.
                const shouldRenderGeometry = !args.fullName.match(/^toolbarItems((\[\d+\])(\.(options|visible).*)?)?$/);

                this._renderTitle();
                this._renderBottom();

                if(shouldRenderGeometry) {
                    this._renderGeometry();
                }
                break;
            case 'dragEnabled':
                this._renderDrag();
                break;
            case 'autoResizeEnabled':
                this._renderGeometry();
                domUtils.triggerResizeEvent(this._$content);
                break;
            case 'fullScreen':
                this._toggleFullScreenClass(args.value);

                this._toggleSafariFullScreen(args.value);

                this._renderGeometry();

                domUtils.triggerResizeEvent(this._$content);
                break;
            case 'showCloseButton':
                this._renderTitle();
                break;
            default:
                this.callBase(args);
        }
    },

    bottomToolbar: function() {
        return this._$bottom;
    },

    topToolbar: function() {
        return this._$title;
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

registerComponent('dxPopup', Popup);

module.exports = Popup;
