import { ListModel } from '@ts/ui/list/__tests__/__mock__/model/list';

const CLASSES = {
  button: 'dx-button',
  list: 'dx-list',
  stateInvisible: 'dx-state-invisible',
};

const ATTR = {
  popupId: 'aria-owns',
};

export class DropDownButtonModel {
  constructor(protected readonly root: HTMLElement | null) {}

  public getElement(): HTMLElement | null {
    return this.root;
  }

  public getButtonElement(): HTMLElement | null {
    return this.root?.querySelector(`.${CLASSES.button}`) ?? null;
  }

  public getPopupContent(): HTMLElement | null {
    const popupId = this.root?.getAttribute(ATTR.popupId);

    return document.body.querySelector(`#${popupId}`);
  }

  public getList(): ListModel {
    return new ListModel(this.getPopupContent()?.querySelector(`.${CLASSES.list}`) ?? null);
  }

  public isOpened(): boolean {
    const popupContent = this.getPopupContent();
    const overlayContent = popupContent?.parentElement;

    return !overlayContent?.classList.contains(CLASSES.stateInvisible);
  }
}
