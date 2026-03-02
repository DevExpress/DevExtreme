import { PopupModel } from '../../../../../ui/__tests__/__mock__/model/popup';

const SELECTORS = {
  textEditorInput: 'dx-texteditor-input',
  item: 'dx-item',
  toolbar: 'dx-toolbar',
  saveButton: '[aria-label*="Save"]',
};

export class EditFormModel extends PopupModel {
  constructor(protected readonly root: HTMLElement | null) {
    super();
  }

  public getSaveButton(): HTMLElement {
    const overlay = this.getOverlayContent();
    const toolbar = overlay?.querySelector(`.${SELECTORS.toolbar}`);
    return toolbar?.querySelector(SELECTORS.saveButton) as HTMLElement;
  }

  public getItem(id: string): HTMLElement | null {
    return this.root?.querySelector(`.${SELECTORS.textEditorInput}[id*=_${id}]`) ?? null;
  }

  public getItems(): NodeListOf<HTMLElement> | null {
    return this.root?.querySelectorAll(`.${SELECTORS.item}`) ?? null;
  }
}
