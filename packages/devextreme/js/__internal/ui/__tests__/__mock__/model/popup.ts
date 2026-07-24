import Popup from '@ts/ui/popup/popup';

const CLASSES = {
  popup: 'dx-popup',
  popupWrapper: 'dx-popup-wrapper',
  popupTitle: 'dx-popup-title',
  overlayContent: 'dx-overlay-content',
};

const SELECTORS = {
  cancelButton: '[role="button"][aria-label*="Cancel"]',
};

export class PopupModel {
  protected getRootClass(): string {
    return CLASSES.popup;
  }

  protected getWrapperClass(): string {
    return CLASSES.popupWrapper;
  }

  protected getRoot(): HTMLElement {
    return document.body.querySelector(`.${this.getRootClass()}`) as HTMLElement;
  }

  protected getPopupWrapper(): HTMLElement {
    return document.body.querySelector(`.${this.getWrapperClass()}`) as HTMLElement;
  }

  public getOverlayContent(): HTMLElement {
    const wrapper = this.getPopupWrapper();
    return wrapper?.querySelector(`.${CLASSES.overlayContent}`) as HTMLElement;
  }

  public getRole(): string | null {
    return this.getOverlayContent()?.getAttribute('role') ?? null;
  }

  public isVisible(): boolean {
    return !!this.getOverlayContent();
  }

  public getTitle(): string {
    const overlay = this.getOverlayContent();
    const titleElement = overlay?.querySelector(`.${CLASSES.popupTitle}`);
    return titleElement?.textContent ?? '';
  }

  public getElement(): HTMLElement {
    return this.getPopupWrapper();
  }

  public getInstance(): Popup {
    return Popup.getInstance<Popup>(this.getRoot());
  }

  public getCancelButton(): HTMLElement {
    const wrapper = this.getPopupWrapper();
    return wrapper?.querySelector(SELECTORS.cancelButton) as HTMLElement;
  }
}
