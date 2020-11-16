import { move } from '../animation/translator';
import registerComponent from '../core/component_registrator';
import devices from '../core/devices';
import { getPublicElement } from '../core/element';
import $ from '../core/renderer';
import { EmptyTemplate } from '../core/templates/empty_template';
import { inArray } from '../core/utils/array';
import browser from '../core/utils/browser';
import { noop } from '../core/utils/common';
import { extend } from '../core/utils/extend';
import { camelize } from '../core/utils/inflector';
import { each } from '../core/utils/iterator';
import {
    getVisibleHeight,
    addOffsetToMaxHeight,
    addOffsetToMinHeight,
    getVerticalOffsets
} from '../core/utils/size';
import { getBoundingRect } from '../core/utils/position';
import { isDefined } from '../core/utils/type';
import { compare as compareVersions } from '../core/utils/version';
import { getWindow, hasWindow } from '../core/utils/window';
import { triggerResizeEvent } from '../events/visibility_change';
import messageLocalization from '../localization/message';
import Button from './button';
import Overlay from './overlay';
import { isMaterial, current as currentTheme } from './themes';
import './toolbar/ui.toolbar.base';

const window = getWindow();

// STYLE popup

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

const getButtonPlace = name => {

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
        toolbar,
        location
    };
};

const Popup = Overlay.inherit({

    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            fullScreen: false,

            title: '',

            showTitle: true,


            titleTemplate: 'title',

            onTitleRendered: null,

            dragEnabled: false,


            toolbarItems: [],

            showCloseButton: false,

            bottomTemplate: 'bottom',
            useDefaultToolbarButtons: false,
            useFlatToolbarButtons: false,
            autoResizeEnabled: true
        });
    },

    _defaultOptionsRules: function() {
        const themeName = currentTheme();

        return this.callBase().concat([
            {
                device: { platform: 'ios' },
                options: {
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
                    showCloseButton: true
                }
            },
            {
                device: function(device) {
                    return devices.real().deviceType === 'desktop' && device.platform === 'generic';
                },
                options: {
                    dragEnabled: true
                }
            },
            {
                device: function() {
                    return devices.real().deviceType === 'desktop' && !devices.isSimulator();
                },
                options: {
                    focusStateEnabled: true
                }
            },
            {
                device: function() {
                    return isMaterial(themeName);
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
            const integrationOptions = extend({}, this.option('integrationOptions'), { skipTemplates: ['content', 'title'] });
            const toolbarOptions = extend(additionalToolbarOptions, {
                items: data,
                rtlEnabled: this.option('rtlEnabled'),
                useDefaultButtons: this.option('useDefaultToolbarButtons'),
                useFlatButtons: this.option('useFlatToolbarButtons'),
                integrationOptions
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
        return (_, __, container) => {
            const $button = $('<div>').addClass(POPUP_TITLE_CLOSEBUTTON_CLASS);
            this._createComponent($button, Button, {
                icon: 'close',
                onClick: this._createToolbarItemAction(undefined),
                integrationOptions: {}
            });
            $(container).append($button);
        };
    },

    _getToolbarItems: function(toolbar) {

        const toolbarItems = this.option('toolbarItems');

        const toolbarsItems = [];

        this._toolbarItemClasses = [];

        const currentPlatform = devices.current().platform;
        let index = 0;

        each(toolbarItems, (_, data) => {
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
        });

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

        each(aliases, (_, alias) => {
            const className = POPUP_CLASS + '-' + alias;

            if(inArray(className, this._toolbarItemClasses) >= 0) {
                this._wrapper().addClass(className + '-visible');
                this._$bottom.addClass(className);
            } else {
                this._wrapper().removeClass(className + '-visible');
                this._$bottom.removeClass(className);
            }
        });
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
        this.callBase(...arguments);
        this._setContentHeight();
    },

    _resetContentHeight: function() {
        this._$popupContent.css({
            'height': 'auto',
            'maxHeight': 'none'
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
                    ? Math.min(getBoundingRect(overlayContent).height, getWindow().innerHeight)
                    : getBoundingRect(overlayContent).height;
                const contentHeight = overlayHeight - toolbarsAndVerticalOffsetsHeight;
                cssStyles = {
                    height: Math.max(0, contentHeight),
                    minHeight: 'auto',
                    maxHeight: 'auto'
                };
            }
        } else {
            const container = $(this._getContainer()).get(0);
            const maxHeightValue = addOffsetToMaxHeight(contentMaxHeight, -toolbarsAndVerticalOffsetsHeight, container);
            const minHeightValue = addOffsetToMinHeight(contentMinHeight, -toolbarsAndVerticalOffsetsHeight, container);

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
            header: getVisibleHeight(topToolbar && topToolbar.get(0)),
            footer: getVisibleHeight(bottomToolbar && bottomToolbar.get(0)),
            contentVerticalOffsets: getVerticalOffsets(this.overlayContent().get(0), true),
            popupVerticalOffsets: getVerticalOffsets(this.$content().get(0), true),
            popupVerticalPaddings: getVerticalOffsets(this.$content().get(0), false)
        };
    },

    _shouldFixBodyPosition: function() {
        return this.callBase() || this.option('fullScreen');
    },

    _toggleSafariFullScreen: function(value) {
        const toggleFullScreenBeforeShown = this._shouldFixBodyPosition() && value && !this._isShown;
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
                height: '100%',
                minWidth: '',
                maxWidth: '',
                minHeight: '',
                maxHeight: ''
            });
        } else {
            this.callBase(...arguments);
        }
        if(hasWindow()) {
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
            move(this._$content, {
                top: 0,
                left: 0
            });
        } else {
            (this.option('forceApplyBindings') || noop)();

            return this.callBase(...arguments);
        }
    },

    _optionChanged: function(args) {
        switch(args.name) {
            case 'showTitle':
            case 'title':
            case 'titleTemplate':
                this._renderTitle();
                this._renderGeometry();
                triggerResizeEvent(this._$content);
                break;
            case 'bottomTemplate':
                this._renderBottom();
                this._renderGeometry();
                triggerResizeEvent(this._$content);
                break;
            case 'onTitleRendered':
                this._createTitleRenderAction(args.value);
                break;
            case 'toolbarItems':
            case 'useDefaultToolbarButtons':
            case 'useFlatToolbarButtons': {
                // NOTE: Geometry rendering after "toolbarItems" runtime change breaks the popup animation first appereance.
                // But geometry rendering for options connected to the popup position still should be called.
                const shouldRenderGeometry = !args.fullName.match(/^toolbarItems((\[\d+\])(\.(options|visible).*)?)?$/);

                this._renderTitle();
                this._renderBottom();

                if(shouldRenderGeometry) {
                    this._renderGeometry();
                    triggerResizeEvent(this._$content);
                }
                break;
            }
            case 'dragEnabled':
                this._renderDrag();
                break;
            case 'autoResizeEnabled':
                this._renderGeometry();
                triggerResizeEvent(this._$content);
                break;
            case 'fullScreen':
                this._toggleFullScreenClass(args.value);

                this._toggleSafariFullScreen(args.value);

                this._renderGeometry();

                triggerResizeEvent(this._$content);
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

export default Popup;
