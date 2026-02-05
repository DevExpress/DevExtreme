import Popup from '@js/ui/popup';

const CLASSES = {
  popupWrapper: 'dx-popup-wrapper',
  popupTitle: 'dx-popup-title',
  overlayContent: 'dx-overlay-content',
};

export class PopupModel {
  protected getPopupWrapper(): HTMLElement | null {
    return document.body.querySelector(`.${CLASSES.popupWrapper}`);
  }

  public getOverlayContent(): HTMLElement | null {
    const wrapper = this.getPopupWrapper();
    return wrapper?.querySelector(`.${CLASSES.overlayContent}`) ?? null;
  }

  public isVisible(): boolean {
    return this.getOverlayContent() !== null;
  }

  public getTitle(): string | null {
    const overlay = this.getOverlayContent();
    if (!overlay) return null;

    const titleElement = overlay.querySelector(`.${CLASSES.popupTitle}`);
    return titleElement?.textContent ?? null;
  }

  public getElement(): HTMLElement | null {
    return this.getPopupWrapper();
  }

  public getInstance(): Popup | null {
    const element = this.getElement();
    if (!element) return null;

    return Popup.getInstance(element) as Popup;
  }
}
