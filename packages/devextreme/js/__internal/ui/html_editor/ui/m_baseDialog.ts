import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import type { DeferredObj } from '@js/core/utils/deferred';
import { Deferred } from '@js/core/utils/deferred';
import type { Properties as PopupProperties } from '@js/ui/popup';
import Popup from '@js/ui/popup';

import { isSmallScreen } from '../utils/small_screen';

const DROPDOWN_EDITOR_OVERLAY_CLASS = 'dx-dropdowneditor-overlay';
abstract class BaseDialog<T = unknown> {
  _$container: dxElementWrapper;

  _popupConfig?: PopupProperties;

  _popup!: Popup;

  deferred?: DeferredObj<T>;

  constructor($container: dxElementWrapper, popupConfig?: PopupProperties) {
    this._$container = $container;
    this._popupConfig = popupConfig;

    this._renderPopup();
  }

  protected _escKeyHandler(): void {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this._popup?.hide();
  }

  protected _addEscapeHandler(e): void {
    e.component.registerKeyHandler('escape', () => this._escKeyHandler());
  }

  protected _renderPopup(): void {
    const $popupContainer = $('<div>')
      .addClass(this._getPopupClass())
      .appendTo(this._$container);

    this._popup = new Popup($popupContainer.get(0), this._getPopupConfig());
  }

  protected _getPopupConfig(): PopupProperties {
    return ({
      deferRendering: false,
      focusStateEnabled: false,
      fullScreen: isSmallScreen(),
      _wrapperClassExternal: `${this._getPopupClass()} ${DROPDOWN_EDITOR_OVERLAY_CLASS}`,
      contentTemplate: (contentElem) => {
        this._renderContent($(contentElem));
      },
      onInitialized: (e) => {
        this._popup = e.component as Popup;
        this._popup.on('hiding', () => this.onHiding());
        this._addEscapeHandler.bind(this);
      },
    }) as PopupProperties;
  }

  protected abstract _renderContent($contentElem: dxElementWrapper): void;
  protected abstract _getPopupClass(): string;

  onHiding(): void {
    this.deferred?.reject();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public show(options?: unknown): Promise<T> | undefined {
    if (this._popup.option('visible')) {
      return undefined;
    }

    this.deferred = Deferred<T>();

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this._popup.show();

    return this.deferred.promise();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public hide(options?: unknown, event?: unknown): void {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this._popup.hide();
  }

  public popupOption(...args): void {
    // @ts-expect-error args is any
    return this._popup.option.apply(this._popup, args);
  }
}

export default BaseDialog;
