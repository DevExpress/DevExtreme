import devices from '@js/core/devices';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import type { DeferredObj } from '@js/core/utils/deferred';
import { Deferred } from '@js/core/utils/deferred';
import {
  // @ts-expect-error
  getCurrentScreenFactor,
  hasWindow,
} from '@js/core/utils/window';
import type { Properties as PopupProperties } from '@js/ui/popup';
import Popup from '@js/ui/popup';

const DROPDOWN_EDITOR_OVERLAY_CLASS = 'dx-dropdowneditor-overlay';

const isSmallScreen = (): boolean => {
  const screenFactor = hasWindow() ? getCurrentScreenFactor() : null;
  return devices.real().deviceType === 'phone' || screenFactor === 'xs';
};
abstract class BaseDialog<T = unknown> {
  _$container: dxElementWrapper;

  _popupUserConfig?: PopupProperties;

  _popup!: Popup;

  deferred?: DeferredObj<T>;

  constructor($container: dxElementWrapper, popupConfig?: PopupProperties) {
    this._$container = $container;
    this._popupUserConfig = popupConfig;

    this._renderPopup();
  }

  protected _renderPopup(): void {
    const $container = $('<div>')
      .addClass(this._getPopupClass())
      .appendTo(this._$container);

    this._popup = new Popup($container.get(0), this._getPopupConfig());
  }

  protected _getPopupConfig(): PopupProperties {
    return ({
      onInitialized: (e) => {
        this._popup = e.component as Popup;
        this._popup.on('hiding', () => this.onHiding());
      },
      deferRendering: false,
      focusStateEnabled: false,
      fullScreen: isSmallScreen(),
      _wrapperClassExternal: `${this._getPopupClass()} ${DROPDOWN_EDITOR_OVERLAY_CLASS}`,
      contentTemplate: (contentElem) => {
        this._renderContent($(contentElem));
      },
    }) as PopupProperties;
  }

  protected abstract _renderContent($contentElem: dxElementWrapper): void;
  protected abstract _getPopupClass(): string;

  onHiding(): void {
    this.deferred?.reject();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  show(options?: unknown): Promise<T> | undefined {
    if (this._popup.option('visible')) {
      return;
    }

    this.deferred = Deferred<T>();

    this._popup.show();

    return this.deferred.promise();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  hide(_options?: unknown, _event?: unknown): void {
    this._popup.hide();
  }

  popupOption(...args) {
    // @ts-expect-error
    return this._popup.option.apply(this._popup, args);
  }
}

export default BaseDialog;
