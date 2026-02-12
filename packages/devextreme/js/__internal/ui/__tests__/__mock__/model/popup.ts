import Popup from '@js/ui/popup';

const CLASSES = {
  popupWrapper: 'dx-popup-wrapper',
  popupTitle: 'dx-popup-title',
  overlayContent: 'dx-overlay-content',
};

const SELECTORS = {
  cancelButton: '[role="button"][aria-label*="Cancel"]',
};

export class PopupModel {
  protected getPopupWrapper(): HTMLElement {
    return document.body.querySelector(`.${CLASSES.popupWrapper}`) as HTMLElement;
  }

  public getOverlayContent(): HTMLElement {
    const wrapper = this.getPopupWrapper();
    return wrapper?.querySelector(`.${CLASSES.overlayContent}`) as HTMLElement;
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
    const element = this.getElement();
    return Popup.getInstance(element) as Popup;
  }

  public getCancelButton(): HTMLElement {
    const wrapper = this.getPopupWrapper();
    return wrapper?.querySelector(SELECTORS.cancelButton) as HTMLElement;
  }
}
