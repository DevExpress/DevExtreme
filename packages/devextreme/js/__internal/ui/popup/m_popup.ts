import '@js/ui/toolbar/ui.toolbar.base';

import { triggerResizeEvent } from '@js/common/core/events/visibility_change';
import messageLocalization from '@js/common/core/localization/message';
import registerComponent from '@js/core/component_registrator';
import devices from '@js/core/devices';
import { getPublicElement } from '@js/core/element';
import Guid from '@js/core/guid';
import type { DefaultOptionsRule } from '@js/core/options/utils';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import resizeObserverSingleton from '@js/core/resize_observer';
import { EmptyTemplate } from '@js/core/templates/empty_template';
import type { TemplateBase } from '@js/core/templates/template_base';
import { noop } from '@js/core/utils/common';
import type { DeferredObj } from '@js/core/utils/deferred';
import { contains } from '@js/core/utils/dom';
import { extend } from '@js/core/utils/extend';
import { camelize } from '@js/core/utils/inflector';
import { each } from '@js/core/utils/iterator';
import { getBoundingRect } from '@js/core/utils/position';
import {
  addOffsetToMaxHeight,
  addOffsetToMinHeight,
  getHeight,
  getOuterWidth,
  getVerticalOffsets,
  getVisibleHeight,
  getWidth,
} from '@js/core/utils/size';
import { isDefined, isObject } from '@js/core/utils/type';
import type { Properties as ButtonProperties } from '@js/ui/button';
import Button from '@js/ui/button';
import type { dxPopupAnimation, Properties, ToolbarItem } from '@js/ui/popup';
import type { ResizeEndEvent, ResizeEvent, ResizeStartEvent } from '@js/ui/resizable';
import Resizable from '@js/ui/resizable';
import {
  current,
  isFluent,
  isMaterial,
  isMaterialBased,
} from '@js/ui/themes';
import type { Properties as ToolbarProperties } from '@js/ui/toolbar';
import type Toolbar from '@js/ui/toolbar';
import windowUtils from '@ts/core/utils/m_window';
import type { OptionChanged } from '@ts/core/widget/types';
import type { SupportedKeys } from '@ts/core/widget/widget';
import type { GeometryOptions, OverlayActions } from '@ts/ui/overlay/overlay';
import Overlay from '@ts/ui/overlay/overlay';
import type {
  ControllerOverlayElements,
  ControllerProperties,
} from '@ts/ui/overlay/overlay_position_controller';
import * as zIndexPool from '@ts/ui/overlay/z_index';
import type { ToolbarBaseProperties } from '@ts/ui/toolbar/toolbar.base';

import PopupDrag from './m_popup_drag';
import type { OverflowManager } from './m_popup_overflow_manager';
import { createBodyOverflowManager } from './m_popup_overflow_manager';
import type {
  PopupControllerProperties,
  PopupPositionControllerConstructor,
} from './popup_position_controller';
import { PopupPositionController } from './popup_position_controller';

// STYLE popup

const window = windowUtils.getWindow();

export const POPUP_CLASS = 'dx-popup';
const POPUP_WRAPPER_CLASS = 'dx-popup-wrapper';
const POPUP_FULL_SCREEN_CLASS = 'dx-popup-fullscreen';
const POPUP_FULL_SCREEN_WIDTH_CLASS = 'dx-popup-fullscreen-width';
const POPUP_NORMAL_CLASS = 'dx-popup-normal';
export const POPUP_CONTENT_CLASS = 'dx-popup-content';
export const POPUP_CONTENT_SCROLLABLE_CLASS = 'dx-popup-content-scrollable';

const POPUP_DRAGGABLE_CLASS = 'dx-popup-draggable';
const POPUP_TITLE_CLASS = 'dx-popup-title';
export const POPUP_TITLE_CLOSEBUTTON_CLASS = 'dx-closebutton';
const POPUP_BOTTOM_CLASS = 'dx-popup-bottom';
const POPUP_HAS_CLOSE_BUTTON_CLASS = 'dx-has-close-button';
const POPUP_CONTENT_FLEX_HEIGHT_CLASS = 'dx-popup-flex-height';
const POPUP_CONTENT_INHERIT_HEIGHT_CLASS = 'dx-popup-inherit-height';

const TOOLBAR_LABEL_CLASS = 'dx-toolbar-label';
const DISABLED_STATE_CLASS = 'dx-state-disabled';
export const TEMPLATE_WRAPPER_CLASS = 'dx-template-wrapper';

const ALLOWED_TOOLBAR_ITEM_ALIASES = ['cancel', 'clear', 'done'];

const BUTTON_DEFAULT_TYPE = 'default';
const BUTTON_NORMAL_TYPE = 'normal';
const BUTTON_TEXT_MODE = 'text';
const BUTTON_CONTAINED_MODE = 'contained';
const BUTTON_OUTLINED_MODE = 'outlined';

const TOOLBAR_NAME_BASE = 'dxToolbarBase';

const HEIGHT_STRATEGIES = {
  static: '',
  inherit: POPUP_CONTENT_INHERIT_HEIGHT_CLASS,
  flex: POPUP_CONTENT_FLEX_HEIGHT_CLASS,
} as const;

type HeightStrategiesType = typeof HEIGHT_STRATEGIES[keyof typeof HEIGHT_STRATEGIES];
type TitleRenderAction = (event?: Record<string, unknown>) => void;

interface PopupActions extends OverlayActions {
  onResizeStart?: (event?: ResizeStartEvent) => void;
  onResize?: (event?: ResizeEvent) => void;
  onResizeEnd?: (event?: ResizeEndEvent) => void;
}

interface HeightCssStyles {
  height: number | string;
  minHeight: number | string;
  maxHeight: number | string;
}

const getButtonPlace = (name: string): { toolbar: string; location: string } => {
  const device = devices.current();
  const { platform } = device;
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
    location,
  };
};

const getLocalizationKey = (itemType: string): string => (itemType.toLowerCase() === 'done' ? 'OK' : camelize(itemType, true));

const getHeightStrategyChangeOffset = (
  currentHeightStrategyClass: HeightStrategiesType,
  popupVerticalPaddings: number,
): number => (currentHeightStrategyClass === HEIGHT_STRATEGIES.flex ? -popupVerticalPaddings : 0);

export interface PopupProperties extends Properties {
  outsideDragFactor?: number;

  forceApplyBindings?: () => void;

  preventScrollEvents?: boolean;

  _wrapperClassExternal?: string;

  useResizeObserver?: boolean;

  useDefaultToolbarButtons?: boolean;

  useFlatToolbarButtons?: boolean;
}

class Popup<
  TProperties extends PopupProperties = PopupProperties,
> extends Overlay<TProperties> {
  _actions?: PopupActions;

  _positionController!: PopupPositionController;

  _bodyOverflowManager?: OverflowManager;

  _$topToolbar?: dxElementWrapper | null;

  _topToolbar?: Toolbar;

  _$bottomToolbar?: dxElementWrapper | null;

  _bottomToolbar?: Toolbar;

  _$popupContent?: dxElementWrapper;

  _resizable!: Resizable;

  _drag?: PopupDrag;

  _renderedDimensions?: {
    width: number;
    height: number;
  };

  _toolbarItemClasses!: string[];

  _shouldSkipContentResize!: (entry: ResizeObserverEntry) => boolean;

  _titleRenderAction?: TitleRenderAction;

  _supportedKeys(): SupportedKeys {
    return {
      ...super._supportedKeys(),
      upArrow: (e): void => { this._drag?.moveUp(e); },
      downArrow: (e): void => { this._drag?.moveDown(e); },
      leftArrow: (e): void => { this._drag?.moveLeft(e); },
      rightArrow: (e): void => { this._drag?.moveRight(e); },
    };
  }

  _getDefaultOptions(): TProperties {
    return {
      ...super._getDefaultOptions(),
      fullScreen: false,
      title: '',
      showTitle: true,
      titleTemplate: 'title',
      onTitleRendered: null,
      dragOutsideBoundary: false,
      dragEnabled: false,
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
      autoResizeEnabled: true,
    };
  }

  _defaultOptionsRules(): DefaultOptionsRule<TProperties>[] {
    // @ts-expect-error ts-error
    return super._defaultOptionsRules().concat([
      {
        device: { platform: 'ios' },
        options: {
          animation: this._iosAnimation,
        },
      },
      {
        device: { platform: 'android' },
        options: {
          animation: this._androidAnimation,
        },
      },
      {
        device: { platform: 'generic' },
        options: {
          showCloseButton: true,
        },
      },
      {
        device(device): boolean {
          return devices.real().deviceType === 'desktop' && device.platform === 'generic';
        },
        options: {
          dragEnabled: true,
        },
      },
      {
        device(): boolean {
          return devices.real().deviceType === 'desktop' && !devices.isSimulator();
        },
        options: {
          focusStateEnabled: true,
        },
      },
      {
        device(): boolean {
          return isMaterialBased(current());
        },
        options: {
          useFlatToolbarButtons: true,
        },
      },
      {
        device(): boolean {
          return isMaterial(current());
        },
        options: {
          useDefaultToolbarButtons: true,
          showCloseButton: false,
        },
      },
    ]);
  }

  // eslint-disable-next-line class-methods-use-this
  _iosAnimation(): dxPopupAnimation {
    return {
      show: {
        type: 'slide',
        duration: 400,
        from: {
          position: {
            my: 'top',
            at: 'bottom',
          },
        },
        to: {
          position: {
            my: 'center',
            at: 'center',
          },
        },
      },
      hide: {
        type: 'slide',
        duration: 400,
        from: {
          opacity: 1,
          position: {
            my: 'center',
            at: 'center',
          },
        },
        to: {
          opacity: 1,
          position: {
            my: 'top',
            at: 'bottom',
          },
        },
      },
    };
  }

  _androidAnimation(): dxPopupAnimation {
    const fullScreenConfig = {
      show: {
        type: 'slide', duration: 300, from: { top: '30%', opacity: 0 }, to: { top: 0, opacity: 1 },
      },
      hide: {
        type: 'slide', duration: 300, from: { top: 0, opacity: 1 }, to: { top: '30%', opacity: 0 },
      },
    };
    const defaultConfig = {
      show: {
        type: 'fade', duration: 400, from: 0, to: 1,
      },
      hide: {
        type: 'fade', duration: 400, from: 1, to: 0,
      },
    };
    // @ts-expect-error ts-error
    return this.option('fullScreen') ? fullScreenConfig : defaultConfig;
  }

  _init(): void {
    const { _wrapperClassExternal: popupWrapperClassExternal } = this.option();
    const popupWrapperClasses = popupWrapperClassExternal
      ? `${POPUP_WRAPPER_CLASS} ${popupWrapperClassExternal}`
      : POPUP_WRAPPER_CLASS;

    super._init();

    this._createBodyOverflowManager();
    this._updateResizeCallbackSkipCondition();

    this.$element().addClass(POPUP_CLASS);
    this.$wrapper()?.addClass(popupWrapperClasses);

    this._$popupContent = this._$content
      ?.wrapInner($('<div>').addClass(POPUP_CONTENT_CLASS))
      .children().eq(0);

    this._toggleContentScrollClass();

    this.$overlayContent().attr('role', 'dialog');
  }

  _render(): void {
    const isFullscreen = Boolean(this.option('fullScreen'));

    this._toggleFullScreenClass(isFullscreen);
    super._render();
  }

  _createBodyOverflowManager(): void {
    this._bodyOverflowManager = createBodyOverflowManager();
  }

  _toggleFullScreenClass(value: boolean): void {
    this.$overlayContent()
      .toggleClass(POPUP_FULL_SCREEN_CLASS, value)
      .toggleClass(POPUP_NORMAL_CLASS, !value);
  }

  _initTemplates(): void {
    super._initTemplates();
    this._templateManager.addDefaultTemplates({
      title: new EmptyTemplate(),
      bottom: new EmptyTemplate(),
    });
  }

  _getActionsList(): string[] {
    return super._getActionsList().concat(['onResizeStart', 'onResize', 'onResizeEnd']);
  }

  _contentResizeHandler(entry: ResizeObserverEntry): void {
    if (!this._shouldSkipContentResize(entry)) {
      this._renderGeometry({ shouldOnlyReposition: true });
    }
  }

  _isShowAnimationResizing(): boolean {
    const animation = this.option('animation');

    return ['to', 'from'].some((prop) => {
      // @ts-expect-error ts-error
      const config = animation?.show?.[prop];
      return isObject(config) && ('width' in config || 'height' in config);
    });
  }

  _updateResizeCallbackSkipCondition(): void {
    const isShowAnimationResizing = this._isShowAnimationResizing();

    this._shouldSkipContentResize = (
      entry: ResizeObserverEntry,
    ): boolean => (isShowAnimationResizing
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      && this._showAnimationProcessing) || this._areContentDimensionsRendered(entry);
  }

  _observeContentResize(shouldObserve: boolean): void {
    if (!this.option('useResizeObserver')) {
      return;
    }

    const contentElement = this._$content?.get(0);

    if (shouldObserve) {
      resizeObserverSingleton.observe(contentElement, (
        entry: ResizeObserverEntry,
      ) => { this._contentResizeHandler(entry); });
    } else {
      resizeObserverSingleton.unobserve(contentElement);
    }
  }

  _areContentDimensionsRendered(entry: ResizeObserverEntry): boolean {
    const contentBox = entry.contentBoxSize?.[0];
    if (contentBox) {
      // @ts-expect-error ts-error
      return parseInt(contentBox.inlineSize, 10) === this._renderedDimensions?.width
        // @ts-expect-error ts-error
        && parseInt(contentBox.blockSize, 10) === this._renderedDimensions?.height;
    }

    const { contentRect } = entry;
    // @ts-expect-error ts-error
    return parseInt(contentRect.width, 10) === this._renderedDimensions?.width
      // @ts-expect-error ts-error
      && parseInt(contentRect.height, 10) === this._renderedDimensions?.height;
  }

  _renderContent(): void {
    super._renderContent();
    // NOTE: This observe should not be called before async showing is called. See T1130045.
    this._observeContentResize(true);
  }

  _processContentRendering(): void {
    this._renderTopToolbar();
    this._renderBottomToolbar();
    this._renderResize();
    super._processContentRendering();
  }

  _getTopToolbarItems(): ToolbarItem[] {
    const { showTitle, title } = this.option();
    const { ios: isIOS } = devices.current();

    const items = this._getToolbarItems('top');

    if (showTitle && Boolean(title)) {
      items.unshift({
        location: isIOS ? 'center' : 'before',
        text: title,
      });
    }

    return items;
  }

  _renderTopToolbar(): void {
    const { showTitle } = this.option();
    const items = this._getTopToolbarItems();
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    const shouldBeShown = showTitle || items.length > 0;

    if (shouldBeShown) {
      if (this._$topToolbar) {
        this._updateToolbarOptions('top', { items });
      } else {
        this._renderTopToolbarImpl();
      }

      this._$topToolbar?.toggleClass(POPUP_HAS_CLOSE_BUTTON_CLASS, this._hasCloseButton());
    } else {
      this._$topToolbar?.remove();
      this._$topToolbar = undefined;
    }

    this._toggleAriaLabel();
  }

  _renderTopToolbarImpl(): void {
    this._$topToolbar?.remove();

    const items = this._getTopToolbarItems();
    const $content = this.$content();

    if (!$content) {
      return;
    }

    const $toolbarContainer = $('<div>')
      .addClass(POPUP_TITLE_CLASS)
      .insertBefore($content);

    this._$topToolbar = this._renderToolbar(
      'titleTemplate',
      items,
      $toolbarContainer,
      {
        onInitialized: (e): void => {
          this._topToolbar = e.component;
        },
      },
    );

    this._$topToolbar.addClass(POPUP_TITLE_CLASS);

    this._renderDrag();
    this._executeTitleRenderAction(this._$topToolbar);
  }

  _renderBottomToolbar(): void {
    const items = this._getToolbarItems('bottom');

    if (!items.length) {
      this._$bottomToolbar?.remove();
      this._$bottomToolbar = undefined;
      return;
    }

    if (this._$bottomToolbar) {
      this._updateToolbarOptions('bottom', { items });
    } else {
      this._renderBottomToolbarImpl();
    }

    this._toggleClasses();
  }

  _renderBottomToolbarImpl(): void {
    this._$bottomToolbar?.remove();

    const items = this._getToolbarItems('bottom');
    const $content = this.$content();

    if (!$content) {
      return;
    }

    const $toolbarContainer = $('<div>')
      .addClass(POPUP_BOTTOM_CLASS)
      .insertAfter($content);

    this._$bottomToolbar = this._renderToolbar(
      'bottomTemplate',
      items,
      $toolbarContainer,
      {
        compactMode: true,
        onInitialized: (e): void => {
          this._bottomToolbar = e.component;
        },
      },
    );

    this._$bottomToolbar.addClass(POPUP_BOTTOM_CLASS);
  }

  _triggerToolbarResizeEvent(): void {
    // To trigger toolbar width to set overflow menu button width (T1245421)
    [this._$topToolbar, this._$bottomToolbar].forEach(($toolbar) => {
      if ($toolbar) {
        triggerResizeEvent($toolbar);
        triggerResizeEvent($toolbar);
      }
    });
  }

  _renderToolbar(
    optionName: string,
    items: ToolbarItem[],
    $container: dxElementWrapper,
    additionalToolbarOptions: Partial<ToolbarBaseProperties> = {},
  ): dxElementWrapper {
    const template = this._getTemplateByOption(optionName);
    const isEmptyTemplate = template instanceof EmptyTemplate;

    if (isEmptyTemplate) {
      return this._renderByPolymorphicTemplate(items, $container, additionalToolbarOptions);
    }

    return this._renderByTemplate(template, $container);
  }

  _getIntegrationOptions(): Record<string, unknown> {
    // @ts-expect-error integrationOptions
    const { integrationOptions } = this.option();

    return {
      ...integrationOptions as Record<string, unknown>,
      skipTemplates: ['content', 'title'],
    };
  }

  _renderByPolymorphicTemplate(
    items: ToolbarItem[],
    $container: dxElementWrapper,
    additionalToolbarOptions: Partial<ToolbarBaseProperties>,
  ): dxElementWrapper {
    const {
      disabled,
      rtlEnabled,
      useDefaultToolbarButtons,
      useFlatToolbarButtons,
    } = this.option();

    const integrationOptions = this._getIntegrationOptions();

    const toolbarOptions = extend(additionalToolbarOptions, {
      disabled,
      rtlEnabled,
      items,
      useDefaultButtons: useDefaultToolbarButtons,
      useFlatButtons: useFlatToolbarButtons,
      integrationOptions,
    });

    const template = this._getTemplate('dx-polymorph-widget');

    template.render({
      container: $container,
      model: {
        widget: this._getToolbarName(),
        options: toolbarOptions,
      },
    });

    const $toolbar = $container.children('div');

    $container.replaceWith($toolbar);

    return $toolbar;
  }

  // eslint-disable-next-line class-methods-use-this
  _renderByTemplate(
    template: TemplateBase,
    $container: dxElementWrapper,
  ): dxElementWrapper {
    const $result = $(template.render({ container: getPublicElement($container) }));
    const resultInContainer = contains($container.get(0), $result.get(0));

    if (!resultInContainer) {
      $container.append($result);
    }

    return $container;
  }

  _updateToolbarOptions(toolbar: string, options: Partial<ToolbarProperties>): void {
    const instance = toolbar === 'top' ? this._topToolbar : this._bottomToolbar;

    if (!instance) {
      return;
    }

    const integrationOptions = this._getIntegrationOptions();

    // @ts-expect-error integrationOptions
    instance.option({
      ...options,
      integrationOptions,
    });
  }

  _toggleAriaLabel(): void {
    const { title, showTitle } = this.option();
    const shouldSetAriaLabel = showTitle && Boolean(title);
    const titleId = shouldSetAriaLabel ? new Guid().toString() : null;

    this._$topToolbar?.find(`.${TOOLBAR_LABEL_CLASS}`).eq(0).attr('id', titleId);
    this.$overlayContent().attr('aria-labelledby', titleId);
  }

  _animateShowing(): void {
    this._triggerToolbarResizeEvent();
    super._animateShowing();
  }

  _renderVisibilityAnimate(visible: boolean): DeferredObj<unknown> | Promise<unknown> {
    return super._renderVisibilityAnimate(visible);
  }

  _hide(): DeferredObj<unknown> | Promise<unknown> {
    this._observeContentResize(false);

    return super._hide();
  }

  _executeTitleRenderAction($titleElement: dxElementWrapper): void {
    this._getTitleRenderAction()({
      titleElement: getPublicElement($titleElement),
    });
  }

  _getTitleRenderAction(): TitleRenderAction {
    return this._titleRenderAction ?? this._createTitleRenderAction();
  }

  _createTitleRenderAction(): TitleRenderAction {
    this._titleRenderAction = this._createActionByOption('onTitleRendered', {
      element: this.element(),
      excludeValidators: ['disabled', 'readOnly'],
    });

    return this._titleRenderAction;
  }

  _getCloseButton(): ToolbarItem {
    return {
      toolbar: 'top',
      location: 'after',
      template: this._getCloseButtonRenderer(),
    };
  }

  _getCloseButtonRenderer(): (_, __, container: dxElementWrapper) => void {
    return (_, __, container): void => {
      const $button = $('<div>').addClass(POPUP_TITLE_CLOSEBUTTON_CLASS);

      this._createComponent<Button, ButtonProperties>($button, Button, {
        icon: 'close',
        onClick: this._createToolbarItemAction(undefined),
        stylingMode: 'text',
        // @ts-expect-error ts-error
        integrationOptions: {},
      });

      $(container).append($button);
    };
  }

  _getToolbarItems(toolbar: 'bottom' | 'top'): ToolbarItem[] {
    const { platform: currentPlatform } = devices.current();
    const { toolbarItems } = this.option();
    const toolbarsItems: ToolbarItem[] = [];

    this._toolbarItemClasses = [];

    let index = 0;

    each(toolbarItems, (_, data) => {
      const isShortcut = isDefined(data.shortcut);
      const item = isShortcut ? getButtonPlace(data.shortcut) : data;

      if (isShortcut && currentPlatform === 'ios' && index < 2) {
        item.toolbar = 'top';
        // eslint-disable-next-line no-plusplus
        index++;
      }

      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      item.toolbar = data.toolbar || item.toolbar || 'top';

      if (item && item.toolbar === toolbar) {
        if (isShortcut) {
          extend(item, { location: data.location }, this._getToolbarItemByAlias(data));
        }

        const isLTROrder = currentPlatform === 'generic';

        if ((data.shortcut === 'done' && isLTROrder) || (data.shortcut === 'cancel' && !isLTROrder)) {
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
  }

  _hasCloseButton(): boolean | undefined {
    const { showCloseButton, showTitle } = this.option();

    return showCloseButton && showTitle;
  }

  _getToolbarButtonStylingMode(shortcut: string): string {
    if (isFluent(current())) {
      return shortcut === 'done' ? BUTTON_CONTAINED_MODE : BUTTON_OUTLINED_MODE;
    }

    return this.option('useFlatToolbarButtons') ? BUTTON_TEXT_MODE : BUTTON_CONTAINED_MODE;
  }

  _getToolbarButtonType(shortcut: string): typeof BUTTON_DEFAULT_TYPE | typeof BUTTON_NORMAL_TYPE {
    if ((isFluent(current()) && shortcut === 'done') || this.option('useDefaultToolbarButtons')) {
      return BUTTON_DEFAULT_TYPE;
    }

    return BUTTON_NORMAL_TYPE;
  }

  // eslint-disable-next-line @stylistic/max-len
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
  _getToolbarItemByAlias(data: any): {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    template: (_: any, __: any, container: dxElementWrapper) => void;
  } | boolean {
    const itemType = data.shortcut;

    if (!ALLOWED_TOOLBAR_ITEM_ALIASES.includes(itemType)) {
      return false;
    }

    const itemConfig = extend({
      text: messageLocalization.format(getLocalizationKey(itemType)),
      onClick: this._createToolbarItemAction(data.onClick),
      integrationOptions: {},
      type: this._getToolbarButtonType(itemType),
      stylingMode: this._getToolbarButtonStylingMode(itemType),
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    }, data.options || {});

    const itemClass = `${POPUP_CLASS}-${itemType}`;

    this._toolbarItemClasses.push(itemClass);

    return {
      template: (_, __, container: dxElementWrapper): void => {
        const $toolbarItem = $('<div>').addClass(itemClass).appendTo(container);
        this._createComponent<Button, ButtonProperties>($toolbarItem, Button, itemConfig);
      },
    };
  }

  _createToolbarItemAction(clickAction?: () => void): (e) => void {
    return this._createAction(clickAction, {
      afterExecute(e) {
        // @ts-expect-error ts-error
        e.component.hide();
      },
    });
  }

  // eslint-disable-next-line class-methods-use-this
  _getToolbarName(): string {
    return TOOLBAR_NAME_BASE;
  }

  _toggleDisabledState(value: boolean): void {
    // @ts-expect-error ts-error
    // eslint-disable-next-line prefer-rest-params
    super._toggleDisabledState(...arguments);

    this.$content()?.toggleClass(DISABLED_STATE_CLASS, Boolean(value));
  }

  _toggleClasses(): void {
    const aliases = ALLOWED_TOOLBAR_ITEM_ALIASES;

    each(aliases, (_, alias) => {
      const className = `${POPUP_CLASS}-${alias}`;
      const isVisible = this._toolbarItemClasses.includes(className);

      this.$wrapper()?.toggleClass(`${className}-visible`, isVisible);
      this._$bottomToolbar?.toggleClass(className, isVisible);
    });
  }

  _toggleFocusClass(isFocused: boolean, $element?: dxElementWrapper): void {
    super._toggleFocusClass(isFocused, $element);

    if (isFocused && !zIndexPool.isLastZIndexInStack(this._zIndex)) {
      const zIndex = zIndexPool.create(this._zIndexInitValue());

      zIndexPool.remove(this._zIndex);

      this._zIndex = zIndex;

      this._$wrapper?.css('zIndex', zIndex);
      this._$content?.css('zIndex', zIndex);
    }
  }

  _toggleContentScrollClass(): void {
    const isNativeScrollingEnabled = !this.option('preventScrollEvents');

    this.$content()?.toggleClass(POPUP_CONTENT_SCROLLABLE_CLASS, isNativeScrollingEnabled);
  }

  _getPositionControllerConfig(): PopupPositionControllerConstructor {
    const superConfiguration = super._getPositionControllerConfig();

    const {
      fullScreen,
      forceApplyBindings,
      dragOutsideBoundary,
      dragAndResizeArea,
      outsideDragFactor,
    } = this.option();

    const properties: ControllerProperties<PopupControllerProperties> = {
      ...superConfiguration.properties,
      fullScreen,
      forceApplyBindings,
      dragOutsideBoundary,
      dragAndResizeArea,
      outsideDragFactor,
    };

    const elements: ControllerOverlayElements = {
      ...superConfiguration.elements,
    };

    const configuration: PopupPositionControllerConstructor = {
      properties,
      elements,
    };

    return configuration;
  }

  _initPositionController(): void {
    if (this._positionController) {
      return;
    }

    this._positionController = new PopupPositionController(
      this._getPositionControllerConfig(),
    );
  }

  _getDragTarget(): dxElementWrapper | undefined | null {
    return this.topToolbar();
  }

  _renderGeometry(options: GeometryOptions = {}): void {
    const { visible, useResizeObserver } = this.option();
    const { forceStopAnimation, shouldOnlyReposition, isDimensionChange } = options;

    if (visible && windowUtils.hasWindow()) {
      const isAnimated = this._showAnimationProcessing;
      const shouldRepeatAnimation = isAnimated && !forceStopAnimation && useResizeObserver;

      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      this._isAnimationPaused = shouldRepeatAnimation || undefined;
      this._stopAnimation();

      if (shouldOnlyReposition) {
        this._renderPosition(false);
      } else {
        this._renderGeometryImpl(isDimensionChange);
      }

      if (shouldRepeatAnimation) {
        this._animateShowing();
        this._isAnimationPaused = undefined;
      }
    }
  }

  _cacheDimensions(): void {
    if (!this.option('useResizeObserver')) {
      return;
    }

    this._renderedDimensions = {
      width: parseInt(getWidth(this._$content), 10),
      height: parseInt(getHeight(this._$content), 10),
    };
  }

  _renderGeometryImpl(isDimensionChange = false): void {
    if (!isDimensionChange) { // NOTE: to save content scroll position T1113123
      // NOTE: for correct new position calculation
      this._resetContentHeight();
    }

    super._renderGeometryImpl();

    this._cacheDimensions();
    this._setContentHeight();
  }

  _resetContentHeight(): void {
    const height = this._getOptionValue('height');

    if (height === 'auto') {
      this.$content()?.css({
        height: 'auto',
        maxHeight: 'none',
      });
    }
  }

  _renderDrag(): void {
    const $dragTarget = this._getDragTarget();
    const { dragEnabled } = this.option();

    if (!$dragTarget) {
      return;
    }

    const config = {
      dragEnabled,
      handle: $dragTarget.get(0),
      draggableElement: this._$content?.get(0),
      positionController: this._positionController,
    };

    if (this._drag) {
      this._drag.init(config);
    } else {
      this._drag = new PopupDrag(config);
    }

    this.$overlayContent().toggleClass(POPUP_DRAGGABLE_CLASS, dragEnabled);
  }

  _renderResize(): void {
    if (!this._$content) {
      return;
    }

    this._resizable = this._createComponent(this._$content, Resizable, {
      handles: this.option('resizeEnabled') ? 'all' : 'none',
      onResizeStart: (e: ResizeStartEvent) => {
        this._observeContentResize(false);
        this._actions?.onResizeStart?.(e);
      },
      onResize: (e: ResizeEvent) => {
        this._setContentHeight();
        this._actions?.onResize?.(e);
      },
      onResizeEnd: (e: ResizeEndEvent) => {
        this._resizeEndHandler(e);
        this._observeContentResize(true);
      },
      minHeight: 100,
      minWidth: 100,
      area: this._positionController.$dragResizeContainer,
      keepAspectRatio: false,
    });
  }

  _resizeEndHandler(e: ResizeEndEvent): void {
    const width = this._resizable.option('width');
    const height = this._resizable.option('height');

    if (width) {
      this._setOptionWithoutOptionChange('width', width);
    }

    if (height) {
      this._setOptionWithoutOptionChange('height', height);
    }

    this._cacheDimensions();

    this._positionController.resizeHandled();
    this._positionController.detectVisualPositionChange(e.event);

    this._actions?.onResizeEnd?.(e);
  }

  _setContentHeight(): void {
    const { forceApplyBindings } = this.option();

    (forceApplyBindings ?? noop)();

    const overlayContent = this.$overlayContent().get(0) as HTMLElement;
    const currentHeightStrategyClass = this._chooseHeightStrategy(overlayContent);

    this.$content()?.css(this._getHeightCssStyles(currentHeightStrategyClass, overlayContent));
    this._setHeightClasses(this.$overlayContent(), currentHeightStrategyClass);
  }

  _chooseHeightStrategy(overlayContent: HTMLElement): HeightStrategiesType {
    const isAutoWidth = overlayContent.style.width === 'auto' || overlayContent.style.width === '';

    let currentHeightStrategyClass: HeightStrategiesType = HEIGHT_STRATEGIES.static;

    if (this._isAutoHeight() && this.option('autoResizeEnabled')) {
      if (isAutoWidth) {
        currentHeightStrategyClass = HEIGHT_STRATEGIES.inherit;
      } else {
        currentHeightStrategyClass = HEIGHT_STRATEGIES.flex;
      }
    }

    return currentHeightStrategyClass;
  }

  _getHeightCssStyles(
    currentHeightStrategyClass: HeightStrategiesType,
    overlayContent: HTMLElement,
  ): HeightCssStyles {
    let cssStyles = {} as HeightCssStyles;

    const contentMaxHeight = this._getOptionValue('maxHeight', overlayContent);
    const contentMinHeight = this._getOptionValue('minHeight', overlayContent);
    const popupHeightParts = this._splitPopupHeight();

    const heightStrategyChangeOffset = getHeightStrategyChangeOffset(
      currentHeightStrategyClass,
      popupHeightParts.popupVerticalPaddings,
    );

    const toolbarsAndVerticalOffsetsHeight = popupHeightParts.header
      + popupHeightParts.footer
      + popupHeightParts.contentVerticalOffsets
      + popupHeightParts.popupVerticalOffsets
      + heightStrategyChangeOffset;

    if (currentHeightStrategyClass === HEIGHT_STRATEGIES.static) {
      if (!this._isAutoHeight() || contentMaxHeight || contentMinHeight) {
        const overlayHeight = this.option('fullScreen')
          ? Math.min(getBoundingRect(overlayContent).height, windowUtils.getWindow().innerHeight)
          : getBoundingRect(overlayContent).height;

        const contentHeight = overlayHeight - toolbarsAndVerticalOffsetsHeight;

        cssStyles = {
          height: Math.max(0, contentHeight),
          minHeight: 'auto',
          maxHeight: 'auto',
        };
      }
    } else {
      const container = $(this._positionController.$visualContainer).get(0);

      const maxHeightValue = addOffsetToMaxHeight(
        contentMaxHeight,
        -toolbarsAndVerticalOffsetsHeight,
        container,
      );

      const minHeightValue = addOffsetToMinHeight(
        contentMinHeight,
        -toolbarsAndVerticalOffsetsHeight,
        container,
      );

      cssStyles = {
        height: 'auto',
        minHeight: minHeightValue,
        maxHeight: maxHeightValue,
      };
    }

    return cssStyles;
  }

  // eslint-disable-next-line class-methods-use-this
  _setHeightClasses($container: dxElementWrapper, currentClass: string): void {
    let excessClasses = '';

    // eslint-disable-next-line no-restricted-syntax
    for (const name in HEIGHT_STRATEGIES) {
      if (HEIGHT_STRATEGIES[name] !== currentClass) {
        excessClasses += ` ${HEIGHT_STRATEGIES[name]}`;
      }
    }

    $container.removeClass(excessClasses).addClass(currentClass);
  }

  _isAutoHeight(): boolean {
    // @ts-expect-error ts-error
    return this.$overlayContent().get(0).style.height === 'auto';
  }

  _splitPopupHeight(): Record<string, number> {
    const topToolbar = this.topToolbar();
    const bottomToolbar = this.bottomToolbar();

    return {
      header: getVisibleHeight(topToolbar?.get(0)),
      footer: getVisibleHeight(bottomToolbar?.get(0)),
      contentVerticalOffsets: getVerticalOffsets(this.$overlayContent().get(0), true),
      popupVerticalOffsets: getVerticalOffsets(this.$content()?.get(0), true),
      popupVerticalPaddings: getVerticalOffsets(this.$content()?.get(0), false),
    };
  }

  _isAllWindowCovered(): boolean {
    const { fullScreen } = this.option();

    return super._isAllWindowCovered() || Boolean(fullScreen);
  }

  _renderDimensions(): void {
    if (this.option('fullScreen')) {
      this.$overlayContent().css({
        width: '100%',
        height: '100%',
        minWidth: '',
        maxWidth: '',
        minHeight: '',
        maxHeight: '',
      });
    } else {
      super._renderDimensions();
    }

    if (windowUtils.hasWindow()) {
      this._renderFullscreenWidthClass();
    }
  }

  _dimensionChanged(): void {
    this._renderGeometry({ isDimensionChange: true });
  }

  _clean(): void {
    super._clean();
    this._observeContentResize(false);
  }

  _dispose(): void {
    super._dispose();

    this._toggleBodyScroll(true);

    this._$topToolbar = null;
    this._$bottomToolbar = null;
    // @ts-expect-error _$popupContent can be null
    this._$popupContent = null;
  }

  _renderFullscreenWidthClass(): void {
    const isFullScreen = getOuterWidth(this.$overlayContent()) === getWidth(window);
    this.$overlayContent().toggleClass(POPUP_FULL_SCREEN_WIDTH_CLASS, isFullScreen);
  }

  _toggleSafariScrolling(): void {
    if (!this.option('enableBodyScroll')) {
      return;
    }

    super._toggleSafariScrolling();
  }

  _toggleBodyScroll(enabled: boolean): void {
    if (!this._bodyOverflowManager) {
      return;
    }

    const { setOverflow, restoreOverflow } = this._bodyOverflowManager;

    if (enabled) {
      restoreOverflow();
    } else {
      setOverflow();
    }
  }

  refreshPosition(): void {
    this._renderPosition();
  }

  _optionChanged(args: OptionChanged<TProperties>): void {
    const { value, name } = args;

    switch (name) {
      case 'rtlEnabled':
      case 'disabled': {
        super._optionChanged(args);

        const options = { [name]: Boolean(value) };

        this._updateToolbarOptions('top', options);
        this._updateToolbarOptions('bottom', options);

        break;
      }
      case 'animation':
        this._updateResizeCallbackSkipCondition();
        break;
      case 'enableBodyScroll':
        if (this.option('visible')) {
          // @ts-expect-error ts-error
          this._toggleBodyScroll(value);
        }
        break;
      case 'showTitle':
      case 'title':
        this._renderTopToolbar();
        this._renderGeometry();
        triggerResizeEvent(this.$overlayContent());
        break;
      case 'titleTemplate': {
        this._renderTopToolbarImpl();
        this._renderGeometry();
        triggerResizeEvent(this.$overlayContent());
        break;
      }
      case 'bottomTemplate':
        this._renderBottomToolbarImpl();
        this._renderGeometry();
        triggerResizeEvent(this.$overlayContent());
        break;
      case 'container':
        super._optionChanged(args);
        if (this.option('resizeEnabled')) {
          // @ts-expect-error resizable area option type compatibility
          this._resizable?.option('area', this._positionController.$dragResizeContainer);
        }
        break;
      case 'width':
      case 'height':
        super._optionChanged(args);
        // @ts-expect-error ts-error
        this._resizable?.option(name, value);
        break;
      case 'onTitleRendered':
        this._createTitleRenderAction();
        break;
      case 'toolbarItems':
      case 'useDefaultToolbarButtons':
      case 'useFlatToolbarButtons': {
        this._renderTopToolbar();
        this._renderBottomToolbar();
        this._renderGeometry();
        this._triggerToolbarResizeEvent();
        break;
      }
      case 'dragEnabled':
        this._renderDrag();
        break;
      case 'dragAndResizeArea':
        // @ts-expect-error property type compatibility
        this._positionController.dragAndResizeArea = value;
        if (this.option('resizeEnabled')) {
          // @ts-expect-error resizable area option type compatibility
          this._resizable.option('area', this._positionController.$dragResizeContainer);
        }
        this._positionController.positionContent();
        break;
      case 'dragOutsideBoundary':
        // @ts-expect-error property type compatibility
        this._positionController.dragOutsideBoundary = value;
        if (this.option('resizeEnabled')) {
          // @ts-expect-error resizable area option type compatibility
          this._resizable.option('area', this._positionController.$dragResizeContainer);
        }
        break;
      case 'outsideDragFactor':
        // @ts-expect-error property type compatibility
        this._positionController.outsideDragFactor = value;
        break;
      case 'resizeEnabled':
        this._renderResize();
        this._renderGeometry();
        break;
      case 'autoResizeEnabled':
        this._renderGeometry();
        triggerResizeEvent(this.$overlayContent());
        break;
      case 'fullScreen':
        // @ts-expect-error property type compatibility
        this._positionController.fullScreen = value;

        this._toggleFullScreenClass(Boolean(value));
        this._toggleSafariScrolling();

        this._renderGeometry();
        triggerResizeEvent(this.$overlayContent());
        break;
      case 'showCloseButton':
        this._renderTopToolbar();
        break;
      case 'preventScrollEvents':
        super._optionChanged(args);

        this._toggleContentScrollClass();
        break;
      default:
        super._optionChanged(args);
    }
  }

  bottomToolbar(): dxElementWrapper | undefined | null {
    return this._$bottomToolbar;
  }

  topToolbar(): dxElementWrapper | undefined | null {
    return this._$topToolbar;
  }

  $content(): dxElementWrapper | null | undefined {
    return this._$popupContent;
  }

  content(): HTMLElement {
    return getPublicElement(this.$content() as dxElementWrapper);
  }

  $overlayContent(): dxElementWrapper {
    return this._$content as dxElementWrapper;
  }

  getFocusableElements(): dxElementWrapper {
    const $wrapper = this.$wrapper();

    if (!$wrapper) {
      return $();
    }

    return $wrapper
      .find('[tabindex]')
      // @ts-expect-error ts-error
      .filter((_, item) => item.getAttribute('tabindex') >= 0);
  }
}

registerComponent('dxPopup', Popup);

export default Popup;
