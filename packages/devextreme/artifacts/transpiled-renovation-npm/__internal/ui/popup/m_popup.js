"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
require("../../../ui/toolbar/ui.toolbar.base");
var _component_registrator = _interopRequireDefault(require("../../../core/component_registrator"));
var _devices = _interopRequireDefault(require("../../../core/devices"));
var _element = require("../../../core/element");
var _guid = _interopRequireDefault(require("../../../core/guid"));
var _renderer = _interopRequireDefault(require("../../../core/renderer"));
var _resize_observer = _interopRequireDefault(require("../../../core/resize_observer"));
var _empty_template = require("../../../core/templates/empty_template");
var _browser = _interopRequireDefault(require("../../../core/utils/browser"));
var _common = require("../../../core/utils/common");
var _extend = require("../../../core/utils/extend");
var _inflector = require("../../../core/utils/inflector");
var _iterator = require("../../../core/utils/iterator");
var _position = require("../../../core/utils/position");
var _size = require("../../../core/utils/size");
var _type = require("../../../core/utils/type");
var _version = require("../../../core/utils/version");
var _window = require("../../../core/utils/window");
var _visibility_change = require("../../../events/visibility_change");
var _message = _interopRequireDefault(require("../../../localization/message"));
var _button = _interopRequireDefault(require("../../../ui/button"));
var _ui = _interopRequireDefault(require("../../../ui/overlay/ui.overlay"));
var _resizable = _interopRequireDefault(require("../../../ui/resizable"));
var _themes = require("../../../ui/themes");
var zIndexPool = _interopRequireWildcard(require("../../ui/overlay/m_z_index"));
var _m_popup_drag = _interopRequireDefault(require("./m_popup_drag"));
var _m_popup_overflow_manager = require("./m_popup_overflow_manager");
var _m_popup_position_controller = require("./m_popup_position_controller");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const window = (0, _window.getWindow)();
const POPUP_CLASS = 'dx-popup';
const POPUP_WRAPPER_CLASS = 'dx-popup-wrapper';
const POPUP_FULL_SCREEN_CLASS = 'dx-popup-fullscreen';
const POPUP_FULL_SCREEN_WIDTH_CLASS = 'dx-popup-fullscreen-width';
const POPUP_NORMAL_CLASS = 'dx-popup-normal';
const POPUP_CONTENT_CLASS = 'dx-popup-content';
const POPUP_CONTENT_SCROLLABLE_CLASS = 'dx-popup-content-scrollable';
const DISABLED_STATE_CLASS = 'dx-state-disabled';
const POPUP_DRAGGABLE_CLASS = 'dx-popup-draggable';
const POPUP_TITLE_CLASS = 'dx-popup-title';
const POPUP_TITLE_CLOSEBUTTON_CLASS = 'dx-closebutton';
const POPUP_BOTTOM_CLASS = 'dx-popup-bottom';
const POPUP_HAS_CLOSE_BUTTON_CLASS = 'dx-has-close-button';
const TEMPLATE_WRAPPER_CLASS = 'dx-template-wrapper';
const POPUP_CONTENT_FLEX_HEIGHT_CLASS = 'dx-popup-flex-height';
const POPUP_CONTENT_INHERIT_HEIGHT_CLASS = 'dx-popup-inherit-height';
const TOOLBAR_LABEL_CLASS = 'dx-toolbar-label';
const ALLOWED_TOOLBAR_ITEM_ALIASES = ['cancel', 'clear', 'done'];
const BUTTON_DEFAULT_TYPE = 'default';
const BUTTON_NORMAL_TYPE = 'normal';
const BUTTON_TEXT_MODE = 'text';
const BUTTON_CONTAINED_MODE = 'contained';
const BUTTON_OUTLINED_MODE = 'outlined';
const IS_OLD_SAFARI = _browser.default.safari && (0, _version.compare)(_browser.default.version, [11]) < 0;
const HEIGHT_STRATEGIES = {
  static: '',
  inherit: POPUP_CONTENT_INHERIT_HEIGHT_CLASS,
  flex: POPUP_CONTENT_FLEX_HEIGHT_CLASS
};
const getButtonPlace = name => {
  const device = _devices.default.current();
  const {
    platform
  } = device;
  let toolbar = 'bottom';
  let location = 'before';
  if (platform === 'ios') {
    // eslint-disable-next-line default-case
    switch (name) {
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
  } else if (platform === 'android') {
    // eslint-disable-next-line default-case
    switch (name) {
      case 'cancel':
        location = 'after';
        break;
      case 'done':
        location = 'after';
        break;
    }
  }
  return {
    toolbar,
    location
  };
};
// @ts-expect-error
const Popup = _ui.default.inherit({
  _supportedKeys() {
    return (0, _extend.extend)(this.callBase(), {
      upArrow: e => {
        var _this$_drag;
        (_this$_drag = this._drag) === null || _this$_drag === void 0 || _this$_drag.moveUp(e);
      },
      downArrow: e => {
        var _this$_drag2;
        (_this$_drag2 = this._drag) === null || _this$_drag2 === void 0 || _this$_drag2.moveDown(e);
      },
      leftArrow: e => {
        var _this$_drag3;
        (_this$_drag3 = this._drag) === null || _this$_drag3 === void 0 || _this$_drag3.moveLeft(e);
      },
      rightArrow: e => {
        var _this$_drag4;
        (_this$_drag4 = this._drag) === null || _this$_drag4 === void 0 || _this$_drag4.moveRight(e);
      }
    });
  },
  _getDefaultOptions() {
    return (0, _extend.extend)(this.callBase(), {
      fullScreen: false,
      title: '',
      showTitle: true,
      titleTemplate: 'title',
      onTitleRendered: null,
      dragOutsideBoundary: false,
      dragEnabled: false,
      dragAndResizeArea: undefined,
      enableBodyScroll: true,
      outsideDragFactor: 0,
      onResizeStart: null,
      onResize: null,
      onResizeEnd: null,
      resizeEnabled: false,
      toolbarItems: [],
      showCloseButton: false,
      bottomTemplate: 'bottom',
      useDefaultToolbarButtons: false,
      useFlatToolbarButtons: false,
      autoResizeEnabled: true
    });
  },
  _defaultOptionsRules() {
    return this.callBase().concat([{
      device: {
        platform: 'ios'
      },
      options: {
        animation: this._iosAnimation
      }
    }, {
      device: {
        platform: 'android'
      },
      options: {
        animation: this._androidAnimation
      }
    }, {
      device: {
        platform: 'generic'
      },
      options: {
        showCloseButton: true
      }
    }, {
      device(device) {
        return _devices.default.real().deviceType === 'desktop' && device.platform === 'generic';
      },
      options: {
        dragEnabled: true
      }
    }, {
      device() {
        return _devices.default.real().deviceType === 'desktop' && !_devices.default.isSimulator();
      },
      options: {
        focusStateEnabled: true
      }
    }, {
      device() {
        // @ts-expect-error
        return (0, _themes.isMaterialBased)();
      },
      options: {
        useFlatToolbarButtons: true
      }
    }, {
      device() {
        // @ts-expect-error
        return (0, _themes.isMaterial)();
      },
      options: {
        useDefaultToolbarButtons: true,
        showCloseButton: false
      }
    }]);
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
  _androidAnimation() {
    const fullScreenConfig = {
      show: {
        type: 'slide',
        duration: 300,
        from: {
          top: '30%',
          opacity: 0
        },
        to: {
          top: 0,
          opacity: 1
        }
      },
      hide: {
        type: 'slide',
        duration: 300,
        from: {
          top: 0,
          opacity: 1
        },
        to: {
          top: '30%',
          opacity: 0
        }
      }
    };
    const defaultConfig = {
      show: {
        type: 'fade',
        duration: 400,
        from: 0,
        to: 1
      },
      hide: {
        type: 'fade',
        duration: 400,
        from: 1,
        to: 0
      }
    };
    return this.option('fullScreen') ? fullScreenConfig : defaultConfig;
  },
  _init() {
    const popupWrapperClassExternal = this.option('_wrapperClassExternal');
    const popupWrapperClasses = popupWrapperClassExternal ? `${POPUP_WRAPPER_CLASS} ${popupWrapperClassExternal}` : POPUP_WRAPPER_CLASS;
    this.callBase();
    this._createBodyOverflowManager();
    this._updateResizeCallbackSkipCondition();
    this.$element().addClass(POPUP_CLASS);
    this.$wrapper().addClass(popupWrapperClasses);
    this._$popupContent = this._$content.wrapInner((0, _renderer.default)('<div>').addClass(POPUP_CONTENT_CLASS)).children().eq(0);
    this._toggleContentScrollClass();
    this.$overlayContent().attr('role', 'dialog');
  },
  _render() {
    const isFullscreen = this.option('fullScreen');
    this._toggleFullScreenClass(isFullscreen);
    this.callBase();
  },
  _createBodyOverflowManager() {
    this._bodyOverflowManager = (0, _m_popup_overflow_manager.createBodyOverflowManager)();
  },
  _toggleFullScreenClass(value) {
    this.$overlayContent().toggleClass(POPUP_FULL_SCREEN_CLASS, value).toggleClass(POPUP_NORMAL_CLASS, !value);
  },
  _initTemplates() {
    this.callBase();
    this._templateManager.addDefaultTemplates({
      title: new _empty_template.EmptyTemplate(),
      bottom: new _empty_template.EmptyTemplate()
    });
  },
  _getActionsList() {
    return this.callBase().concat(['onResizeStart', 'onResize', 'onResizeEnd']);
  },
  _contentResizeHandler(entry) {
    if (!this._shouldSkipContentResize(entry)) {
      this._renderGeometry({
        shouldOnlyReposition: true
      });
    }
  },
  _doesShowAnimationChangeDimensions() {
    const animation = this.option('animation');
    return ['to', 'from'].some(prop => {
      var _animation$show;
      const config = animation === null || animation === void 0 || (_animation$show = animation.show) === null || _animation$show === void 0 ? void 0 : _animation$show[prop];
      return (0, _type.isObject)(config) && ('width' in config || 'height' in config);
    });
  },
  _updateResizeCallbackSkipCondition() {
    const doesShowAnimationChangeDimensions = this._doesShowAnimationChangeDimensions();
    this._shouldSkipContentResize = entry => doesShowAnimationChangeDimensions && this._showAnimationProcessing || this._areContentDimensionsRendered(entry);
  },
  _observeContentResize(shouldObserve) {
    if (!this.option('useResizeObserver')) {
      return;
    }
    const contentElement = this._$content.get(0);
    if (shouldObserve) {
      _resize_observer.default.observe(contentElement, entry => {
        this._contentResizeHandler(entry);
      });
    } else {
      _resize_observer.default.unobserve(contentElement);
    }
  },
  _areContentDimensionsRendered(entry) {
    var _entry$contentBoxSize, _this$_renderedDimens3, _this$_renderedDimens4;
    const contentBox = (_entry$contentBoxSize = entry.contentBoxSize) === null || _entry$contentBoxSize === void 0 ? void 0 : _entry$contentBoxSize[0];
    if (contentBox) {
      var _this$_renderedDimens, _this$_renderedDimens2;
      return parseInt(contentBox.inlineSize, 10) === ((_this$_renderedDimens = this._renderedDimensions) === null || _this$_renderedDimens === void 0 ? void 0 : _this$_renderedDimens.width) && parseInt(contentBox.blockSize, 10) === ((_this$_renderedDimens2 = this._renderedDimensions) === null || _this$_renderedDimens2 === void 0 ? void 0 : _this$_renderedDimens2.height);
    }
    const {
      contentRect
    } = entry;
    return parseInt(contentRect.width, 10) === ((_this$_renderedDimens3 = this._renderedDimensions) === null || _this$_renderedDimens3 === void 0 ? void 0 : _this$_renderedDimens3.width) && parseInt(contentRect.height, 10) === ((_this$_renderedDimens4 = this._renderedDimensions) === null || _this$_renderedDimens4 === void 0 ? void 0 : _this$_renderedDimens4.height);
  },
  _renderContent() {
    this.callBase();
    // NOTE: This observe should not be called before async showing is called. See T1130045.
    this._observeContentResize(true);
  },
  _renderContentImpl() {
    this._renderTitle();
    this.callBase();
    this._renderResize();
    this._renderBottom();
  },
  _renderTitle() {
    const items = this._getToolbarItems('top');
    const {
      title,
      showTitle
    } = this.option();
    if (showTitle && !!title) {
      items.unshift({
        location: _devices.default.current().ios ? 'center' : 'before',
        text: title
      });
    }
    if (showTitle || items.length > 0) {
      this._$title && this._$title.remove();
      const $title = (0, _renderer.default)('<div>').addClass(POPUP_TITLE_CLASS).insertBefore(this.$content());
      this._$title = this._renderTemplateByType('titleTemplate', items, $title).addClass(POPUP_TITLE_CLASS);
      this._renderDrag();
      this._executeTitleRenderAction(this._$title);
      this._$title.toggleClass(POPUP_HAS_CLOSE_BUTTON_CLASS, this._hasCloseButton());
    } else if (this._$title) {
      this._$title.detach();
    }
    this._toggleAriaLabel();
  },
  _toggleAriaLabel() {
    var _this$_$title;
    const {
      title,
      showTitle
    } = this.option();
    const shouldSetAriaLabel = showTitle && !!title;
    const titleId = shouldSetAriaLabel ? new _guid.default() : null;
    (_this$_$title = this._$title) === null || _this$_$title === void 0 || _this$_$title.find(`.${TOOLBAR_LABEL_CLASS}`).eq(0).attr('id', titleId);
    this.$overlayContent().attr('aria-labelledby', titleId);
  },
  _renderTemplateByType(optionName, data, $container, additionalToolbarOptions) {
    const {
      rtlEnabled,
      useDefaultToolbarButtons,
      useFlatToolbarButtons,
      disabled
    } = this.option();
    const template = this._getTemplateByOption(optionName);
    const toolbarTemplate = template instanceof _empty_template.EmptyTemplate;
    if (toolbarTemplate) {
      const integrationOptions = (0, _extend.extend)({}, this.option('integrationOptions'), {
        skipTemplates: ['content', 'title']
      });
      const toolbarOptions = (0, _extend.extend)(additionalToolbarOptions, {
        items: data,
        rtlEnabled,
        useDefaultButtons: useDefaultToolbarButtons,
        useFlatButtons: useFlatToolbarButtons,
        disabled,
        integrationOptions
      });
      this._getTemplate('dx-polymorph-widget').render({
        container: $container,
        model: {
          widget: this._getToolbarName(),
          options: toolbarOptions
        }
      });
      const $toolbar = $container.children('div');
      $container.replaceWith($toolbar);
      return $toolbar;
    }
    const $result = (0, _renderer.default)(template.render({
      container: (0, _element.getPublicElement)($container)
    }));
    if ($result.hasClass(TEMPLATE_WRAPPER_CLASS)) {
      $container.replaceWith($result);
      $container = $result;
    }
    return $container;
  },
  _getToolbarName() {
    return 'dxToolbarBase';
  },
  _renderVisibilityAnimate(visible) {
    return this.callBase(visible);
  },
  _hide() {
    this._observeContentResize(false);
    return this.callBase();
  },
  _executeTitleRenderAction($titleElement) {
    this._getTitleRenderAction()({
      titleElement: (0, _element.getPublicElement)($titleElement)
    });
  },
  _getTitleRenderAction() {
    return this._titleRenderAction || this._createTitleRenderAction();
  },
  _createTitleRenderAction() {
    // eslint-disable-next-line no-return-assign
    return this._titleRenderAction = this._createActionByOption('onTitleRendered', {
      element: this.element(),
      excludeValidators: ['disabled', 'readOnly']
    });
  },
  _getCloseButton() {
    return {
      toolbar: 'top',
      location: 'after',
      template: this._getCloseButtonRenderer()
    };
  },
  _getCloseButtonRenderer() {
    return (_, __, container) => {
      const $button = (0, _renderer.default)('<div>').addClass(POPUP_TITLE_CLOSEBUTTON_CLASS);
      this._createComponent($button, _button.default, {
        icon: 'close',
        onClick: this._createToolbarItemAction(undefined),
        stylingMode: 'text',
        integrationOptions: {}
      });
      (0, _renderer.default)(container).append($button);
    };
  },
  _getToolbarItems(toolbar) {
    const toolbarItems = this.option('toolbarItems');
    const toolbarsItems = [];
    this._toolbarItemClasses = [];
    const currentPlatform = _devices.default.current().platform;
    let index = 0;
    (0, _iterator.each)(toolbarItems, (_, data) => {
      const isShortcut = (0, _type.isDefined)(data.shortcut);
      const item = isShortcut ? getButtonPlace(data.shortcut) : data;
      if (isShortcut && currentPlatform === 'ios' && index < 2) {
        item.toolbar = 'top';
        index++;
      }
      item.toolbar = data.toolbar || item.toolbar || 'top';
      if (item && item.toolbar === toolbar) {
        if (isShortcut) {
          (0, _extend.extend)(item, {
            location: data.location
          }, this._getToolbarItemByAlias(data));
        }
        const isLTROrder = currentPlatform === 'generic';
        if (data.shortcut === 'done' && isLTROrder || data.shortcut === 'cancel' && !isLTROrder) {
          toolbarsItems.unshift(item);
        } else {
          toolbarsItems.push(item);
        }
      }
    });
    if (toolbar === 'top' && this._hasCloseButton()) {
      toolbarsItems.push(this._getCloseButton());
    }
    return toolbarsItems;
  },
  _hasCloseButton() {
    return this.option('showCloseButton') && this.option('showTitle');
  },
  _getLocalizationKey(itemType) {
    return itemType.toLowerCase() === 'done' ? 'OK' : (0, _inflector.camelize)(itemType, true);
  },
  _getToolbarButtonStylingMode(shortcut) {
    // @ts-expect-error
    if ((0, _themes.isFluent)()) {
      return shortcut === 'done' ? BUTTON_CONTAINED_MODE : BUTTON_OUTLINED_MODE;
    }
    return this.option('useFlatToolbarButtons') ? BUTTON_TEXT_MODE : BUTTON_CONTAINED_MODE;
  },
  _getToolbarButtonType(shortcut) {
    // @ts-expect-error
    if ((0, _themes.isFluent)() && shortcut === 'done' || this.option('useDefaultToolbarButtons')) {
      return BUTTON_DEFAULT_TYPE;
    }
    return BUTTON_NORMAL_TYPE;
  },
  _getToolbarItemByAlias(data) {
    const that = this;
    const itemType = data.shortcut;
    if (!ALLOWED_TOOLBAR_ITEM_ALIASES.includes(itemType)) {
      return false;
    }
    const itemConfig = (0, _extend.extend)({
      text: _message.default.format(this._getLocalizationKey(itemType)),
      onClick: this._createToolbarItemAction(data.onClick),
      integrationOptions: {},
      type: this._getToolbarButtonType(itemType),
      stylingMode: this._getToolbarButtonStylingMode(itemType)
    }, data.options || {});
    const itemClass = `${POPUP_CLASS}-${itemType}`;
    this._toolbarItemClasses.push(itemClass);
    return {
      template(_, __, container) {
        const $toolbarItem = (0, _renderer.default)('<div>').addClass(itemClass).appendTo(container);
        that._createComponent($toolbarItem, _button.default, itemConfig);
      }
    };
  },
  _createToolbarItemAction(clickAction) {
    return this._createAction(clickAction, {
      afterExecute(e) {
        e.component.hide();
      }
    });
  },
  _renderBottom() {
    const items = this._getToolbarItems('bottom');
    if (items.length) {
      this._$bottom && this._$bottom.remove();
      const $bottom = (0, _renderer.default)('<div>').addClass(POPUP_BOTTOM_CLASS).insertAfter(this.$content());
      this._$bottom = this._renderTemplateByType('bottomTemplate', items, $bottom, {
        compactMode: true
      }).addClass(POPUP_BOTTOM_CLASS);
      this._toggleClasses();
    } else {
      this._$bottom && this._$bottom.detach();
    }
  },
  _toggleDisabledState(value) {
    this.callBase(...arguments);
    this.$content().toggleClass(DISABLED_STATE_CLASS, Boolean(value));
  },
  _toggleClasses() {
    const aliases = ALLOWED_TOOLBAR_ITEM_ALIASES;
    (0, _iterator.each)(aliases, (_, alias) => {
      const className = `${POPUP_CLASS}-${alias}`;
      if (this._toolbarItemClasses.includes(className)) {
        this.$wrapper().addClass(`${className}-visible`);
        this._$bottom.addClass(className);
      } else {
        this.$wrapper().removeClass(`${className}-visible`);
        this._$bottom.removeClass(className);
      }
    });
  },
  _toggleFocusClass(isFocused, $element) {
    this.callBase(isFocused, $element);
    if (isFocused && !zIndexPool.isLastZIndexInStack(this._zIndex)) {
      const zIndex = zIndexPool.create(this._zIndexInitValue());
      zIndexPool.remove(this._zIndex);
      this._zIndex = zIndex;
      this._$wrapper.css('zIndex', zIndex);
      this._$content.css('zIndex', zIndex);
    }
  },
  _toggleContentScrollClass() {
    const isNativeScrollingEnabled = !this.option('preventScrollEvents');
    this.$content().toggleClass(POPUP_CONTENT_SCROLLABLE_CLASS, isNativeScrollingEnabled);
  },
  _getPositionControllerConfig() {
    const {
      fullScreen,
      forceApplyBindings,
      dragOutsideBoundary,
      dragAndResizeArea,
      outsideDragFactor
    } = this.option();
    return (0, _extend.extend)({}, this.callBase(), {
      fullScreen,
      forceApplyBindings,
      dragOutsideBoundary,
      dragAndResizeArea,
      outsideDragFactor
    });
  },
  _initPositionController() {
    this._positionController = new _m_popup_position_controller.PopupPositionController(this._getPositionControllerConfig());
  },
  _getDragTarget() {
    return this.topToolbar();
  },
  _renderGeometry(options) {
    const {
      visible,
      useResizeObserver
    } = this.option();
    if (visible && (0, _window.hasWindow)()) {
      const isAnimated = this._showAnimationProcessing;
      const shouldRepeatAnimation = isAnimated && !(options !== null && options !== void 0 && options.forceStopAnimation) && useResizeObserver;
      this._isAnimationPaused = shouldRepeatAnimation || undefined;
      this._stopAnimation();
      if (options !== null && options !== void 0 && options.shouldOnlyReposition) {
        this._renderPosition(false);
      } else {
        this._renderGeometryImpl(options === null || options === void 0 ? void 0 : options.isDimensionChange);
      }
      if (shouldRepeatAnimation) {
        this._animateShowing();
        this._isAnimationPaused = undefined;
      }
    }
  },
  _cacheDimensions() {
    if (!this.option('useResizeObserver')) {
      return;
    }
    this._renderedDimensions = {
      width: parseInt((0, _size.getWidth)(this._$content), 10),
      height: parseInt((0, _size.getHeight)(this._$content), 10)
    };
  },
  _renderGeometryImpl() {
    let isDimensionChange = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
    if (!isDimensionChange) {
      // NOTE: to save content scroll position T1113123
      // NOTE: for correct new position calculation
      this._resetContentHeight();
    }
    this.callBase();
    this._cacheDimensions();
    this._setContentHeight();
  },
  _resetContentHeight() {
    const height = this._getOptionValue('height');
    if (height === 'auto') {
      this.$content().css({
        height: 'auto',
        maxHeight: 'none'
      });
    }
  },
  _renderDrag() {
    const $dragTarget = this._getDragTarget();
    const dragEnabled = this.option('dragEnabled');
    if (!$dragTarget) {
      return;
    }
    const config = {
      dragEnabled,
      handle: $dragTarget.get(0),
      draggableElement: this._$content.get(0),
      positionController: this._positionController
    };
    if (this._drag) {
      this._drag.init(config);
    } else {
      this._drag = new _m_popup_drag.default(config);
    }
    this.$overlayContent().toggleClass(POPUP_DRAGGABLE_CLASS, dragEnabled);
  },
  _renderResize() {
    this._resizable = this._createComponent(this._$content, _resizable.default, {
      handles: this.option('resizeEnabled') ? 'all' : 'none',
      onResizeEnd: e => {
        this._resizeEndHandler(e);
        this._observeContentResize(true);
      },
      onResize: e => {
        this._setContentHeight();
        this._actions.onResize(e);
      },
      onResizeStart: e => {
        this._observeContentResize(false);
        this._actions.onResizeStart(e);
      },
      minHeight: 100,
      minWidth: 100,
      area: this._positionController.$dragResizeContainer,
      keepAspectRatio: false
    });
  },
  _resizeEndHandler(e) {
    const width = this._resizable.option('width');
    const height = this._resizable.option('height');
    width && this._setOptionWithoutOptionChange('width', width);
    height && this._setOptionWithoutOptionChange('height', height);
    this._cacheDimensions();
    this._positionController.resizeHandled();
    this._positionController.detectVisualPositionChange(e.event);
    this._actions.onResizeEnd(e);
  },
  _setContentHeight() {
    (this.option('forceApplyBindings') || _common.noop)();
    const overlayContent = this.$overlayContent().get(0);
    const currentHeightStrategyClass = this._chooseHeightStrategy(overlayContent);
    this.$content().css(this._getHeightCssStyles(currentHeightStrategyClass, overlayContent));
    this._setHeightClasses(this.$overlayContent(), currentHeightStrategyClass);
  },
  _heightStrategyChangeOffset(currentHeightStrategyClass, popupVerticalPaddings) {
    return currentHeightStrategyClass === HEIGHT_STRATEGIES.flex ? -popupVerticalPaddings : 0;
  },
  _chooseHeightStrategy(overlayContent) {
    const isAutoWidth = overlayContent.style.width === 'auto' || overlayContent.style.width === '';
    let currentHeightStrategyClass = HEIGHT_STRATEGIES.static;
    if (this._isAutoHeight() && this.option('autoResizeEnabled')) {
      if (isAutoWidth || IS_OLD_SAFARI) {
        currentHeightStrategyClass = HEIGHT_STRATEGIES.inherit;
      } else {
        currentHeightStrategyClass = HEIGHT_STRATEGIES.flex;
      }
    }
    return currentHeightStrategyClass;
  },
  _getHeightCssStyles(currentHeightStrategyClass, overlayContent) {
    let cssStyles = {};
    const contentMaxHeight = this._getOptionValue('maxHeight', overlayContent);
    const contentMinHeight = this._getOptionValue('minHeight', overlayContent);
    const popupHeightParts = this._splitPopupHeight();
    const toolbarsAndVerticalOffsetsHeight = popupHeightParts.header + popupHeightParts.footer + popupHeightParts.contentVerticalOffsets + popupHeightParts.popupVerticalOffsets + this._heightStrategyChangeOffset(currentHeightStrategyClass, popupHeightParts.popupVerticalPaddings);
    if (currentHeightStrategyClass === HEIGHT_STRATEGIES.static) {
      if (!this._isAutoHeight() || contentMaxHeight || contentMinHeight) {
        const overlayHeight = this.option('fullScreen') ? Math.min((0, _position.getBoundingRect)(overlayContent).height, (0, _window.getWindow)().innerHeight) : (0, _position.getBoundingRect)(overlayContent).height;
        const contentHeight = overlayHeight - toolbarsAndVerticalOffsetsHeight;
        cssStyles = {
          height: Math.max(0, contentHeight),
          minHeight: 'auto',
          maxHeight: 'auto'
        };
      }
    } else {
      const container = (0, _renderer.default)(this._positionController.$visualContainer).get(0);
      const maxHeightValue = (0, _size.addOffsetToMaxHeight)(contentMaxHeight, -toolbarsAndVerticalOffsetsHeight, container);
      const minHeightValue = (0, _size.addOffsetToMinHeight)(contentMinHeight, -toolbarsAndVerticalOffsetsHeight, container);
      cssStyles = {
        height: 'auto',
        minHeight: minHeightValue,
        maxHeight: maxHeightValue
      };
    }
    return cssStyles;
  },
  _setHeightClasses($container, currentClass) {
    let excessClasses = '';
    // eslint-disable-next-line no-restricted-syntax
    for (const name in HEIGHT_STRATEGIES) {
      if (HEIGHT_STRATEGIES[name] !== currentClass) {
        excessClasses += ` ${HEIGHT_STRATEGIES[name]}`;
      }
    }
    $container.removeClass(excessClasses).addClass(currentClass);
  },
  _isAutoHeight() {
    return this.$overlayContent().get(0).style.height === 'auto';
  },
  _splitPopupHeight() {
    const topToolbar = this.topToolbar();
    const bottomToolbar = this.bottomToolbar();
    return {
      header: (0, _size.getVisibleHeight)(topToolbar && topToolbar.get(0)),
      footer: (0, _size.getVisibleHeight)(bottomToolbar && bottomToolbar.get(0)),
      contentVerticalOffsets: (0, _size.getVerticalOffsets)(this.$overlayContent().get(0), true),
      popupVerticalOffsets: (0, _size.getVerticalOffsets)(this.$content().get(0), true),
      popupVerticalPaddings: (0, _size.getVerticalOffsets)(this.$content().get(0), false)
    };
  },
  _isAllWindowCovered() {
    return this.callBase() || this.option('fullScreen');
  },
  _renderDimensions() {
    if (this.option('fullScreen')) {
      this.$overlayContent().css({
        width: '100%',
        height: '100%',
        minWidth: '',
        maxWidth: '',
        minHeight: '',
        maxHeight: ''
      });
    } else {
      this.callBase();
    }
    if ((0, _window.hasWindow)()) {
      this._renderFullscreenWidthClass();
    }
  },
  _dimensionChanged() {
    this._renderGeometry({
      isDimensionChange: true
    });
  },
  _clean() {
    this.callBase();
    this._observeContentResize(false);
  },
  _dispose() {
    this.callBase();
    this._toggleBodyScroll(true);
  },
  _renderFullscreenWidthClass() {
    this.$overlayContent().toggleClass(POPUP_FULL_SCREEN_WIDTH_CLASS, (0, _size.getOuterWidth)(this.$overlayContent()) === (0, _size.getWidth)(window));
  },
  _toggleSafariScrolling() {
    if (!this.option('enableBodyScroll')) {
      return;
    }
    this.callBase();
  },
  _toggleBodyScroll(enabled) {
    if (!this._bodyOverflowManager) {
      return;
    }
    const {
      setOverflow,
      restoreOverflow
    } = this._bodyOverflowManager;
    if (enabled) {
      restoreOverflow();
    } else {
      setOverflow();
    }
  },
  refreshPosition() {
    this._renderPosition();
  },
  _optionChanged(args) {
    var _this$_resizable2;
    const {
      value,
      name
    } = args;
    switch (name) {
      case 'disabled':
        this.callBase(args);
        this._renderTitle();
        this._renderBottom();
        break;
      case 'animation':
        this._updateResizeCallbackSkipCondition();
        break;
      case 'enableBodyScroll':
        if (this.option('visible')) {
          this._toggleBodyScroll(value);
        }
        break;
      case 'showTitle':
      case 'title':
      case 'titleTemplate':
        this._renderTitle();
        this._renderGeometry();
        (0, _visibility_change.triggerResizeEvent)(this.$overlayContent());
        break;
      case 'bottomTemplate':
        this._renderBottom();
        this._renderGeometry();
        (0, _visibility_change.triggerResizeEvent)(this.$overlayContent());
        break;
      case 'container':
        this.callBase(args);
        if (this.option('resizeEnabled')) {
          var _this$_resizable;
          (_this$_resizable = this._resizable) === null || _this$_resizable === void 0 || _this$_resizable.option('area', this._positionController.$dragResizeContainer);
        }
        break;
      case 'width':
      case 'height':
        this.callBase(args);
        (_this$_resizable2 = this._resizable) === null || _this$_resizable2 === void 0 || _this$_resizable2.option(name, value);
        break;
      case 'onTitleRendered':
        this._createTitleRenderAction(value);
        break;
      case 'toolbarItems':
      case 'useDefaultToolbarButtons':
      case 'useFlatToolbarButtons':
        {
          // NOTE: Geometry rendering after "toolbarItems" runtime change breaks the popup animation first appereance.
          // But geometry rendering for options connected to the popup position still should be called.
          const shouldRenderGeometry = !args.fullName.match(/^toolbarItems((\[\d+\])(\.(options|visible).*)?)?$/);
          this._renderTitle();
          this._renderBottom();
          if (shouldRenderGeometry) {
            this._renderGeometry();
            (0, _visibility_change.triggerResizeEvent)(this.$overlayContent());
          }
          break;
        }
      case 'dragEnabled':
        this._renderDrag();
        break;
      case 'dragAndResizeArea':
        this._positionController.dragAndResizeArea = value;
        if (this.option('resizeEnabled')) {
          this._resizable.option('area', this._positionController.$dragResizeContainer);
        }
        this._positionController.positionContent();
        break;
      case 'dragOutsideBoundary':
        this._positionController.dragOutsideBoundary = value;
        if (this.option('resizeEnabled')) {
          this._resizable.option('area', this._positionController.$dragResizeContainer);
        }
        break;
      case 'outsideDragFactor':
        this._positionController.outsideDragFactor = value;
        break;
      case 'resizeEnabled':
        this._renderResize();
        this._renderGeometry();
        break;
      case 'autoResizeEnabled':
        this._renderGeometry();
        (0, _visibility_change.triggerResizeEvent)(this.$overlayContent());
        break;
      case 'fullScreen':
        this._positionController.fullScreen = value;
        this._toggleFullScreenClass(value);
        this._toggleSafariScrolling();
        this._renderGeometry();
        (0, _visibility_change.triggerResizeEvent)(this.$overlayContent());
        break;
      case 'showCloseButton':
        this._renderTitle();
        break;
      case 'preventScrollEvents':
        this.callBase(args);
        this._toggleContentScrollClass();
        break;
      default:
        this.callBase(args);
    }
  },
  bottomToolbar() {
    return this._$bottom;
  },
  topToolbar() {
    return this._$title;
  },
  $content() {
    return this._$popupContent;
  },
  content() {
    return (0, _element.getPublicElement)(this.$content());
  },
  $overlayContent() {
    return this._$content;
  },
  getFocusableElements() {
    return this.$wrapper().find('[tabindex]').filter((index, item) => item.getAttribute('tabindex') >= 0);
  }
});
(0, _component_registrator.default)('dxPopup', Popup);
var _default = exports.default = Popup;