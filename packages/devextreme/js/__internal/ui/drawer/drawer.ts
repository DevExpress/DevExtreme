import { fx } from '@js/common/core/animation';
import { name as CLICK_EVENT_NAME } from '@js/common/core/events/click';
import eventsEngine from '@js/common/core/events/core/events_engine';
import { triggerResizeEvent } from '@js/common/core/events/visibility_change';
import registerComponent from '@js/core/component_registrator';
import { getPublicElement } from '@js/core/element';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { EmptyTemplate } from '@js/core/templates/empty_template';
import type { DeferredObj } from '@js/core/utils/deferred';
import { Deferred, when } from '@js/core/utils/deferred';
import { getBoundingRect } from '@js/core/utils/position';
import { isDefined, isFunction } from '@js/core/utils/type';
import { hasWindow } from '@js/core/utils/window';
import type {
  DxEvent,
  PointerInteractionEvent,
} from '@js/events';
import type { PanelLocation, Properties } from '@js/ui/drawer';
import type { OptionChanged } from '@ts/core/widget/types';
import Widget from '@ts/core/widget/widget';
import { animation } from '@ts/ui/drawer/drawer.animation';
import OverlapStrategy from '@ts/ui/drawer/drawer.rendering.strategy.overlap';
import PushStrategy from '@ts/ui/drawer/drawer.rendering.strategy.push';
import ShrinkStrategy from '@ts/ui/drawer/drawer.rendering.strategy.shrink';
import type Overlay from '@ts/ui/overlay/overlay';

const DRAWER_CLASS = 'dx-drawer';
const DRAWER_WRAPPER_CLASS = 'dx-drawer-wrapper';
const DRAWER_PANEL_CONTENT_CLASS = 'dx-drawer-panel-content';
const DRAWER_PANEL_CONTENT_HIDDEN_CLASS = 'dx-drawer-panel-content-hidden';
const DRAWER_VIEW_CONTENT_CLASS = 'dx-drawer-content';
const DRAWER_SHADER_CLASS = 'dx-drawer-shader';
const INVISIBLE_STATE_CLASS = 'dx-state-invisible';
const OPENED_STATE_CLASS = 'dx-drawer-opened';
const ANONYMOUS_TEMPLATE_NAME = 'content';
const PANEL_TEMPLATE_NAME = 'panel';

type TargetPosition = Exclude<PanelLocation, 'before' | 'after'>;

export interface DrawerProperties extends Properties {
  contentTemplate: string;

  __debugWhenPanelContentRendered?: (e: { drawer: Drawer }) => boolean;

  templateSize?: number;

  templatesRenderAsynchronously?: boolean;
}

class Drawer extends Widget<DrawerProperties> {
  _strategy!: PushStrategy | ShrinkStrategy | OverlapStrategy;

  _overlay?: Overlay;

  _$panelContentWrapper?: dxElementWrapper;

  _$wrapper!: dxElementWrapper;

  _whenAnimationCompleted?: DeferredObj<unknown>;

  _whenPanelContentRendered?: DeferredObj<unknown>;

  _whenPanelContentRefreshed?: DeferredObj<unknown>;

  _$viewContentWrapper!: dxElementWrapper;

  _$shader!: dxElementWrapper;

  _maxSize?: number;

  _minSize?: number;

  _getDefaultOptions(): DrawerProperties {
    return {
      ...super._getDefaultOptions(),
      position: 'left',
      opened: false,
      // @ts-expect-error ts-error
      minSize: null,
      // @ts-expect-error ts-error
      maxSize: null,
      shading: false,
      template: PANEL_TEMPLATE_NAME,
      openedStateMode: 'shrink',
      revealMode: 'slide',
      animationEnabled: true,
      animationDuration: 400,
      closeOnOutsideClick: false,
      contentTemplate: ANONYMOUS_TEMPLATE_NAME,
    };
  }

  _init(): void {
    super._init();

    this._initStrategy();

    this.$element().addClass(DRAWER_CLASS);

    this._whenAnimationCompleted = undefined;
    this._whenPanelContentRendered = undefined;
    this._whenPanelContentRefreshed = undefined;

    this._$wrapper = $('<div>').addClass(DRAWER_WRAPPER_CLASS);

    this._$viewContentWrapper = $('<div>').addClass(DRAWER_VIEW_CONTENT_CLASS);
    this._$wrapper.append(this._$viewContentWrapper);

    this.$element().append(this._$wrapper);
  }

  _initStrategy(): void {
    const { openedStateMode } = this.option();

    switch (openedStateMode) {
      case 'push':
        this._strategy = new PushStrategy(this);
        break;
      case 'shrink':
        this._strategy = new ShrinkStrategy(this);
        break;
      case 'overlap':
        this._strategy = new OverlapStrategy(this);
        break;
      default:
        this._strategy = new PushStrategy(this);
    }
  }

  _getAnonymousTemplateName(): string {
    return ANONYMOUS_TEMPLATE_NAME;
  }

  _initTemplates(): void {
    const defaultTemplates = {};
    defaultTemplates[PANEL_TEMPLATE_NAME] = new EmptyTemplate();
    defaultTemplates[ANONYMOUS_TEMPLATE_NAME] = new EmptyTemplate();
    this._templateManager.addDefaultTemplates(defaultTemplates);

    super._initTemplates();
  }

  _viewContentWrapperClickHandler(e: DxEvent<PointerInteractionEvent>): void {
    const { opened, shading } = this.option();
    let { closeOnOutsideClick } = this.option();

    if (isFunction(closeOnOutsideClick)) {
      closeOnOutsideClick = closeOnOutsideClick(e);
    }

    if (closeOnOutsideClick && opened) {
      this.stopAnimations();

      if (shading) {
        e.preventDefault();
      }

      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this.hide();
    }
  }

  _initMarkup(): void {
    super._initMarkup();

    const { opened } = this.option();

    this._toggleOpenedStateClass(opened);
    this._renderPanelContentWrapper();

    this._refreshOpenedStateModeClass();
    this._refreshRevealModeClass();
    this._renderShader();

    this._refreshPositionClass();

    this._whenPanelContentRendered = Deferred();
    this._strategy.renderPanelContent(this._whenPanelContentRendered);
    this._strategy.onPanelContentRendered();

    this._renderViewContent();

    eventsEngine.off(this._$viewContentWrapper, CLICK_EVENT_NAME);
    eventsEngine.on(
      this._$viewContentWrapper,
      CLICK_EVENT_NAME,
      this._viewContentWrapperClickHandler.bind(this),
    );

    this._refreshWrapperChildrenOrder();
  }

  _render(): void {
    this._initMinMaxSize();

    super._render();

    this._whenPanelContentRendered?.always(() => {
      /// #DEBUG
      if (this.option('__debugWhenPanelContentRendered')) {
        const { __debugWhenPanelContentRendered: onPanelContentRendered } = this.option();

        onPanelContentRendered?.({ drawer: this });
      }
      /// #ENDDEBUG

      this._initMinMaxSize();
      const { revealMode } = this.option();

      this._strategy.refreshPanelElementSize(revealMode === 'slide');

      this._renderPosition(true);
      this._removePanelManualPosition();
    });
  }

  _removePanelManualPosition(): void {
    if (this._$panelContentWrapper?.attr('manualposition')) {
      this._$panelContentWrapper.removeAttr('manualPosition');
      this._$panelContentWrapper.css({
        position: '', top: '', left: '', right: '', bottom: '',
      });
    }
  }

  _togglePanelContentHiddenClass(): void {
    const callback = (): void => {
      const { minSize, opened } = this.option();
      const shouldBeSet = minSize ? false : !opened;

      this._$panelContentWrapper?.toggleClass(DRAWER_PANEL_CONTENT_HIDDEN_CLASS, shouldBeSet);
    };

    if (this._whenAnimationCompleted && !this.option('opened')) {
      when(this._whenAnimationCompleted).done(callback);
    } else {
      callback();
    }
  }

  _renderPanelContentWrapper(): void {
    const { openedStateMode, opened, minSize } = this.option();

    this._$panelContentWrapper = $('<div>').addClass(DRAWER_PANEL_CONTENT_CLASS);
    this._togglePanelContentHiddenClass();

    const position = this.calcTargetPosition();
    if (openedStateMode === 'push' && position && ['top', 'bottom'].includes(position)) {
      this._$panelContentWrapper.addClass(`${DRAWER_PANEL_CONTENT_CLASS}-push-top-or-bottom`);
    }

    if (openedStateMode !== 'overlap' && !opened && !minSize) {
      this._$panelContentWrapper.attr('manualposition', true);
      this._$panelContentWrapper.css({
        position: 'absolute',
        top: '-10000px',
        left: '-10000px',
        right: 'auto',
        bottom: 'auto',
      });
    }

    this._$wrapper.append(this._$panelContentWrapper);
  }

  _refreshOpenedStateModeClass(prevOpenedStateMode?: string): void {
    if (prevOpenedStateMode) {
      this.$element().removeClass(`${DRAWER_CLASS}-${prevOpenedStateMode}`);
    }

    const { openedStateMode } = this.option();

    this.$element().addClass(`${DRAWER_CLASS}-${openedStateMode}`);
  }

  _refreshPositionClass(): void {
    const positions = ['left', 'right', 'top', 'bottom'];
    const classPrefix = `${DRAWER_CLASS}-`;

    this.$element()
      .removeClass(positions.map((position) => `${classPrefix}${position}`).join(' '))
      .addClass(`${classPrefix}${this.calcTargetPosition()}`);
  }

  _refreshWrapperChildrenOrder(): void {
    const position = this.calcTargetPosition();
    const { rtlEnabled } = this.option();

    if (this._strategy.isViewContentFirst(position, rtlEnabled)) {
      this._$wrapper.prepend(this._$viewContentWrapper);
    } else if (this._$panelContentWrapper) {
      this._$wrapper.prepend(this._$panelContentWrapper);
    }
  }

  _refreshRevealModeClass(prevRevealMode?: string): void {
    if (prevRevealMode) {
      this.$element().removeClass(`${DRAWER_CLASS}-${prevRevealMode}`);
    }

    const { revealMode } = this.option();

    this.$element().addClass(`${DRAWER_CLASS}-${revealMode}`);
  }

  _renderViewContent(): void {
    const contentTemplateOption = this.option('contentTemplate');
    const contentTemplate = this._getTemplate(contentTemplateOption);

    if (contentTemplate) {
      const $viewTemplate = contentTemplate.render({
        container: this.viewContent(),
        noModel: true,
        transclude: this._templateManager.anonymousTemplateName === contentTemplateOption,
      });

      if ($viewTemplate.hasClass('ng-scope')) {
        $(this._$viewContentWrapper)
          .children()
          .not(`.${DRAWER_SHADER_CLASS}`)
          .replaceWith($viewTemplate);
      }
    }
  }

  _renderShader(): void {
    this._$shader = this._$shader || $('<div>').addClass(DRAWER_SHADER_CLASS);
    this._$shader.appendTo(this.viewContent());

    const { opened } = this.option();

    this._toggleShaderVisibility(opened);
  }

  _initSize(): void { // TODO: keep for ui.file_manager.adaptivity.js
    this._initMinMaxSize();
  }

  _initMinMaxSize(): void {
    const realPanelSize = this.isHorizontalDirection()
      ? this.getRealPanelWidth()
      : this.getRealPanelHeight();

    const { maxSize, minSize } = this.option();

    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    this._maxSize = maxSize || realPanelSize;
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    this._minSize = minSize || 0;
  }

  calcTargetPosition(): TargetPosition | undefined {
    const { position, rtlEnabled } = this.option();

    if (position === 'before') {
      return rtlEnabled ? 'right' : 'left';
    }

    if (position === 'after') {
      return rtlEnabled ? 'left' : 'right';
    }

    return position;
  }

  getOverlayTarget(): dxElementWrapper {
    return this._$wrapper;
  }

  getOverlay(): Overlay | undefined {
    return this._overlay;
  }

  getMaxSize(): number | undefined {
    return this._maxSize;
  }

  getMinSize(): number | undefined {
    return this._minSize;
  }

  getRealPanelWidth(): number {
    if (hasWindow()) {
      const { templateSize } = this.option();

      if (isDefined(templateSize)) {
        return templateSize; // number is expected
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return getBoundingRect(this._getPanelTemplateElement()).width;
    }
    return 0;
  }

  getRealPanelHeight(): number {
    if (hasWindow()) {
      const { templateSize } = this.option();

      if (isDefined(templateSize)) {
        return templateSize; // number is expected
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return getBoundingRect(this._getPanelTemplateElement()).height;
    }
    return 0;
  }

  _getPanelTemplateElement(): Element {
    const $panelContent = this._strategy.getPanelContent();
    let $result = $panelContent;

    if ($panelContent.children().length) {
      $result = $panelContent.children().eq(0);
      if ($panelContent.hasClass('dx-overlay-content') && $result.hasClass('dx-template-wrapper') && $result.children().length) {
        // T948509, T956751
        $result = $result.children().eq(0);
      }
    }
    return $result.get(0);
  }

  isHorizontalDirection(): boolean {
    const position = this.calcTargetPosition();

    return position === 'left' || position === 'right';
  }

  stopAnimations(jumpToEnd = false): void {
    fx.stop(this._$shader.get(0), jumpToEnd);
    fx.stop($(this.content()).get(0), jumpToEnd);
    fx.stop($(this.viewContent()).get(0), jumpToEnd);

    const overlay = this.getOverlay();
    if (overlay) {
      fx.stop($(overlay.$content()).get(0), jumpToEnd);
    }
  }

  setZIndex(zIndex: number): void {
    this._$shader.css('zIndex', zIndex - 1);
    this._$panelContentWrapper?.css('zIndex', zIndex);
  }

  resizeContent(): void { // TODO: keep for ui.file_manager.adaptivity.js
    this.resizeViewContent();
  }

  resizeViewContent(): void {
    triggerResizeEvent(this.viewContent());
  }

  _isInvertedPosition(): boolean {
    const position = this.calcTargetPosition();

    return position === 'right' || position === 'bottom';
  }

  _renderPosition(
    disableAnimation?: boolean,
    jumpToEnd?: boolean,
  ): void {
    this.stopAnimations(jumpToEnd);
    this._whenAnimationCompleted = Deferred();

    const { animationDuration, animationEnabled: optionAnimationEnabled, opened } = this.option();
    const animationEnabled = !disableAnimation && optionAnimationEnabled;

    if (!animationEnabled) {
      this._whenAnimationCompleted.resolve();
    }

    if (!hasWindow()) {
      return;
    }

    // Clear possible settings from strategies:
    $(this.viewContent()).css('paddingLeft', 0);
    $(this.viewContent()).css('paddingRight', 0);
    $(this.viewContent()).css('paddingTop', 0);
    $(this.viewContent()).css('paddingBottom', 0);

    if (opened) {
      this._toggleShaderVisibility(opened);
    }

    this._strategy.renderPosition(animationEnabled, animationDuration);
  }

  _animationCompleteHandler(): void {
    this.resizeViewContent();

    this._whenAnimationCompleted?.resolve();
  }

  _getPositionCorrection(): number {
    return this._isInvertedPosition() ? -1 : 1;
  }

  _dispose(): void {
    animation.complete($(this.viewContent()));
    super._dispose();
  }

  _visibilityChanged(visible: boolean): void {
    if (visible) {
      this._dimensionChanged();
    }
  }

  _dimensionChanged(): void {
    this._initMinMaxSize();

    const { revealMode } = this.option();

    this._strategy.refreshPanelElementSize(revealMode === 'slide');
    this._renderPosition(true);
  }

  _toggleShaderVisibility(visible: boolean | undefined): void {
    if (this.option('shading')) {
      this._$shader.toggleClass(INVISIBLE_STATE_CLASS, !visible);
      this._$shader.css('visibility', visible ? 'visible' : 'hidden');
    } else {
      this._$shader.toggleClass(INVISIBLE_STATE_CLASS, true);
    }
  }

  _toggleOpenedStateClass(opened: boolean | undefined): void {
    this.$element().toggleClass(OPENED_STATE_CLASS, opened);
  }

  _refreshPanel(): void {
    $(this.viewContent()).css('left', 0); // can affect animation
    $(this.viewContent()).css('transform', 'translate(0px, 0px)'); // can affect animation
    $(this.viewContent()).removeClass('dx-theme-background-color');

    this._removePanelContentWrapper();
    this._removeOverlay();

    this._renderPanelContentWrapper();
    this._refreshWrapperChildrenOrder();

    this._whenPanelContentRefreshed = Deferred();
    this._strategy.renderPanelContent(this._whenPanelContentRefreshed);
    this._strategy.onPanelContentRendered();

    if (hasWindow()) {
      this._whenPanelContentRefreshed.always(() => {
        const { revealMode } = this.option();

        this._strategy.refreshPanelElementSize(revealMode === 'slide');
        this._renderPosition(true, true);
        this._removePanelManualPosition();
      });
    }
  }

  _clean(): void {
    this._cleanFocusState();

    this._removePanelContentWrapper();
    this._removeOverlay();
  }

  _removePanelContentWrapper(): void {
    if (this._$panelContentWrapper) {
      this._$panelContentWrapper.remove();
    }
  }

  _removeOverlay(): void {
    if (this._overlay) {
      this._overlay.dispose();
      delete this._overlay;
      delete this._$panelContentWrapper; // TODO: move to _removePanelContentWrapper?
    }
  }

  _optionChanged(args: OptionChanged<DrawerProperties>): void {
    switch (args.name) {
      case 'width':
        super._optionChanged(args);
        this._dimensionChanged();
        break;
      case 'opened':
        this._renderPosition();
        this._toggleOpenedStateClass(args.value);
        this._togglePanelContentHiddenClass();
        break;
      case 'position':
        this._refreshPositionClass();
        this._refreshWrapperChildrenOrder();
        this._invalidate();
        break;
      case 'contentTemplate':
      case 'template':
        this._invalidate();
        break;
      case 'openedStateMode':
        this._initStrategy();
        this._refreshOpenedStateModeClass(args.previousValue);

        this._refreshPanel();
        break;
      case 'minSize':
        this._initMinMaxSize();
        this._renderPosition(true);
        this._togglePanelContentHiddenClass();
        break;
      case 'maxSize':
        this._initMinMaxSize();
        this._renderPosition(true);
        break;
      case 'revealMode':
        this._refreshRevealModeClass(args.previousValue);

        this._refreshPanel();
        break;
      case 'shading': {
        const { opened } = this.option();

        this._toggleShaderVisibility(opened);
        break;
      }
      case 'animationEnabled':
      case 'animationDuration':
      case 'closeOnOutsideClick':
        break;
      default:
        super._optionChanged(args);
    }
  }

  content(): Element | undefined {
    return this._$panelContentWrapper ? getPublicElement(this._$panelContentWrapper) : undefined;
  }

  viewContent(): Element {
    return getPublicElement(this._$viewContentWrapper);
  }

  show(): Promise<unknown> | undefined {
    return this.toggle(true);
  }

  hide(): Promise<unknown> | undefined {
    return this.toggle(false);
  }

  toggle(opened?: boolean): Promise<unknown> | undefined {
    const { opened: currentOpened } = this.option();
    const targetOpened = opened ?? !currentOpened;

    this.option('opened', targetOpened);

    return this._whenAnimationCompleted?.promise();
  }
}

registerComponent('dxDrawer', Drawer);

export default Drawer;
