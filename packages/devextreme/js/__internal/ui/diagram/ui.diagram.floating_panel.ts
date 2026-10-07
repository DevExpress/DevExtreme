/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { extend } from '@js/core/utils/extend';
import {
  getHeight,
  getOuterHeight,
  getOuterWidth,
  getWidth,
} from '@js/core/utils/size';
import { hasWindow } from '@js/core/utils/window';
import type { dxPopupAnimation } from '@js/ui/popup';
import DiagramPanel, { type DiagramPanelProperties } from '@ts/ui/diagram/ui.diagram.panel';
import type { PopupProperties } from '@ts/ui/popup/popup';
import Popup from '@ts/ui/popup/popup';

const DIAGRAM_MOBILE_POPUP_CLASS = 'dx-diagram-mobile-popup';

interface VisibilityEvent {
  // eslint-disable-next-line @typescript-eslint/no-use-before-define -- the component of the event
  component: DiagramFloatingPanel;
  visible: boolean;
}

export interface DiagramFloatingPanelProperties extends DiagramPanelProperties {
  isVisible?: boolean;
  isMobileView?: boolean;
  offsetParent?: dxElementWrapper;
  offsetX?: number;
  offsetY?: number;
  onVisibilityChanging?: (e: VisibilityEvent) => void;
  onVisibilityChanged?: (e: VisibilityEvent) => void;
}

class DiagramFloatingPanel<
  TProperties extends DiagramFloatingPanelProperties = DiagramFloatingPanelProperties,
> extends DiagramPanel<TProperties> {
  _popup?: Popup;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _onVisibilityChangingAction?: any;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _onVisibilityChangedAction?: any;

  _init(): void {
    super._init();

    this._createOnVisibilityChangingAction();
    this._createOnVisibilityChangedAction();
  }

  isVisible(): boolean {
    const { isVisible } = this.option();
    return Boolean(isVisible);
  }

  isMobileView(): boolean {
    const { isMobileView } = this.option();
    return Boolean(isMobileView);
  }

  _initMarkup(): void {
    super._initMarkup();

    const $parent = this.$element();

    const $popupElement = $('<div>')
      .addClass(this._getPopupClass())
      // @ts-expect-error ts-error
      .addClass(this.isMobileView() && DIAGRAM_MOBILE_POPUP_CLASS)
      .appendTo($parent);

    this._popup = this._createComponent(
      $popupElement,
      Popup,
      this._getPopupOptions(),
    );
    this._updatePopupVisible();
  }

  show(): void {
    this.option('isVisible', true);
  }

  hide(): void {
    this.option('isVisible', false);
  }

  toggle(): void {
    this.option('isVisible', !this.isVisible());
  }

  repaint(): void {
    this._popup?.repaint();
  }

  _getPopupContent(): HTMLElement | undefined {
    return this._popup?.content();
  }

  _getPopupTitle(): dxElementWrapper {
    const $content = $(this._getPopupContent());
    return $content.parent().find('.dx-popup-title');
  }

  _getPointerUpElements(): (dxElementWrapper | HTMLElement | undefined)[] {
    return [this._getPopupContent(), this._getPopupTitle()];
  }

  _getVerticalPaddingsAndBorders(): number {
    const $content = $(this._getPopupContent());
    return getOuterHeight($content) - getHeight($content);
  }

  _getHorizontalPaddingsAndBorders(): number {
    const $content = $(this._getPopupContent());
    return getOuterWidth($content) - getWidth($content);
  }

  _getPopupClass(): string {
    return '';
  }

  _getPopupWidth(): string | number {
    const { width } = this.option();
    return width ?? 'auto';
  }

  _getPopupMaxWidth(): string | number {
    const { maxWidth } = this.option();
    // @ts-expect-error ts-error
    return maxWidth;
  }

  _getPopupMinWidth(): string | number {
    const { minWidth } = this.option();
    // @ts-expect-error ts-error
    return minWidth;
  }

  _getPopupHeight(): string | number {
    const { height } = this.option();
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    return height || 'auto';
  }

  _getPopupMaxHeight(): string | number {
    const { maxHeight } = this.option();
    // @ts-expect-error ts-error
    return maxHeight;
  }

  _getPopupMinHeight(): string | number {
    const { minHeight } = this.option();
    // @ts-expect-error ts-error
    return minHeight;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _getPopupPosition() {
    return {};
  }

  _getPopupContainer(): string | Element | dxElementWrapper | undefined {
    const { container } = this.option();
    return container;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _getPopupSlideAnimationObject(properties) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return extend(
      {
        type: 'slide',
        start: () => {
          $('body').css('overflow', 'hidden');
        },
        complete: () => {
          $('body').css('overflow', '');
        },
      },
      properties,
    );
  }

  _getPopupAnimation(): dxPopupAnimation {
    return {
      hide: { type: 'fadeOut' },
      show: { type: 'fadeIn' },
    };
  }

  _getPopupOptions(): PopupProperties {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this;
    let wrapperClass = this._getPopupClass();

    if (this.isMobileView()) {
      wrapperClass += ` ${DIAGRAM_MOBILE_POPUP_CLASS}`;
    }

    return {
      animation: hasWindow() ? this._getPopupAnimation() : null,
      shading: false,
      showTitle: false,
      focusStateEnabled: false,
      container: this._getPopupContainer(),
      width: this._getPopupWidth(),
      height: this._getPopupHeight(),
      maxWidth: this._getPopupMaxWidth(),
      maxHeight: this._getPopupMaxHeight(),
      minWidth: this._getPopupMinWidth(),
      minHeight: this._getPopupMinHeight(),
      position: this._getPopupPosition(),
      showCloseButton: true,
      wrapperAttr: { class: wrapperClass },
      onContentReady(): void {
        that._renderPopupContent(that._popup?.content());
      },
      onShowing: (): void => {
        this._onVisibilityChangingAction({ visible: true, component: this });
      },
      onShown: (): void => {
        this.option('isVisible', true);
        this._onVisibilityChangedAction({ visible: true, component: this });
      },
      onHiding: (): void => {
        this._onVisibilityChangingAction({ visible: false, component: this });
      },
      onHidden: (): void => {
        this.option('isVisible', false);
        this._onVisibilityChangedAction({ visible: false, component: this });
      },
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _renderPopupContent($parent): void {}

  _updatePopupVisible(): void {
    this._popup?.option('visible', this.isVisible());
  }

  _createOnVisibilityChangingAction(): void {
    this._onVisibilityChangingAction = this._createActionByOption(
      'onVisibilityChanging',
    );
  }

  _createOnVisibilityChangedAction(): void {
    this._onVisibilityChangedAction = this._createActionByOption(
      'onVisibilityChanged',
    );
  }

  _optionChanged(args): void {
    switch (args.name) {
      case 'onVisibilityChanging':
        this._createOnVisibilityChangingAction();
        break;
      case 'onVisibilityChanged':
        this._createOnVisibilityChangedAction();
        break;
      case 'container':
        this._popup?.option('container', this._getPopupContainer());
        break;
      case 'width':
        this._popup?.option('width', this._getPopupWidth());
        break;
      case 'height':
        this._popup?.option('height', this._getPopupHeight());
        break;
      case 'maxWidth':
        this._popup?.option('maxWidth', this._getPopupMaxWidth());
        break;
      case 'maxHeight':
        this._popup?.option('maxHeight', this._getPopupMaxHeight());
        break;
      case 'minWidth':
        this._popup?.option('minWidth', this._getPopupMinWidth());
        break;
      case 'minHeight':
        this._popup?.option('minHeight', this._getPopupMinHeight());
        break;
      case 'isMobileView':
        this._invalidate();
        break;
      case 'isVisible':
        this._updatePopupVisible();
        break;
      default:
        super._optionChanged(args);
    }
  }

  _getDefaultOptions(): TProperties {
    return extend(super._getDefaultOptions(), {
      isVisible: true,
      isMobileView: false,
      offsetX: 0,
      offsetY: 0,
    }) as TProperties;
  }
}
export default DiagramFloatingPanel;
