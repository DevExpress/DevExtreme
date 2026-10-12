import type { InitializedEventInfo } from '@js/common/core/events';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import type { DeferredObj } from '@js/core/utils/deferred';
import { Deferred } from '@js/core/utils/deferred';
import type { Properties as PopupProperties } from '@js/ui/popup';
import Popup from '@js/ui/popup';
import type Widget from '@js/ui/widget/ui.widget';

import type { DialogPromise } from '../types';
import { isSmallScreen } from '../utils/small_screen';

type PopupOptionArgs = [optionName: string]
| [optionName: string, optionValue: unknown]
| [options: Partial<PopupProperties>];

const DROPDOWN_EDITOR_OVERLAY_CLASS = 'dx-dropdowneditor-overlay';
abstract class BaseDialog<T = unknown, TExtra = undefined> {
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

  protected _addEscapeHandler(e: InitializedEventInfo<Widget<unknown>>): void {
    // @ts-expect-error component is always set when onInitialized fires; the d.ts marks it optional
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
      },
    }) as PopupProperties;
  }

  protected abstract _renderContent($contentElem: dxElementWrapper): void;
  protected abstract _getPopupClass(): string;

  onHiding(): void {
    this.deferred?.reject();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public show(options?: unknown): DialogPromise<T, TExtra> | undefined {
    if (this._popup.option('visible')) {
      return undefined;
    }

    this.deferred = Deferred<T>();

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this._popup.show();

    // @ts-expect-error deferred.d.ts types promise() as a native Promise; it has done/fail/always
    return this.deferred.promise();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public hide(options?: unknown, event?: unknown): void {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this._popup.hide();
  }

  public popupOption<TName extends string>(
    optionName: TName,
  ): TName extends keyof PopupProperties ? PopupProperties[TName] : unknown;
  public popupOption(options: Partial<PopupProperties>): void;
  public popupOption(optionName: string, optionValue: unknown): void;
  public popupOption(...args: PopupOptionArgs): unknown {
    // @ts-expect-error option() is overloaded; a union of tuples cannot be spread into it
    return this._popup.option(...args);
  }
}

export default BaseDialog;
