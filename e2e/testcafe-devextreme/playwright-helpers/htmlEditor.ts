import type { Page, Locator } from '@playwright/test';

const CLASS = {
  toolbar: 'dx-htmleditor-toolbar',
  content: 'dx-htmleditor-content',
  addImagePopup: 'dx-htmleditor-add-image-popup',
  formDialog: 'dx-formdialog',
  form: 'dx-formdialog-form',
  popup: 'dx-popup',
  popupContent: 'dx-popup-content',
  popupBottom: 'dx-popup-bottom',
  overlayContent: 'dx-overlay-content',
  tabs: 'dx-tabs',
  tabItem: 'dx-tab',
  button: 'dx-button',
  buttonGroup: 'dx-buttongroup',
  textBox: 'dx-textbox',
  textEditorInput: 'dx-texteditor-input',
  fileUploader: 'dx-fileuploader',
  fileUploaderInput: 'dx-fileuploader-input',
  fileUploaderFile: 'dx-fileuploader-file',
  fileUploaderFileName: 'dx-fileuploader-file-name',
  fileUploaderFileSize: 'dx-fileuploader-file-size',
  fileUploaderFileStatusMessage: 'dx-fileuploader-file-status-message',
  fileUploaderFileCancelButton: 'dx-fileuploader-cancel-button',
  fileUploaderValidationMessage: 'dx-fileuploader-file-status-message',
  invalidState: 'dx-invalid',
  stateDisabled: 'dx-state-disabled',
} as const;

type ToolbarItemName = 'image' | 'color' | 'link' | 'ai';

export class HtmlEditorDialogFooterToolbar {
  readonly element: Locator;

  constructor(element: Locator) {
    this.element = element;
  }

  get addButton(): HtmlEditorButton {
    return new HtmlEditorButton(this.element.locator(`.${CLASS.button}`).nth(0));
  }

  get cancelButton(): HtmlEditorButton {
    return new HtmlEditorButton(this.element.locator(`.${CLASS.button}`).nth(1));
  }
}

export class HtmlEditorButton {
  readonly element: Locator;

  constructor(element: Locator) {
    this.element = element;
  }

  get isDisabled(): Promise<boolean> {
    return this.element.evaluate(
      (el, cls) => el.classList.contains(cls),
      CLASS.stateDisabled,
    );
  }

  get text(): Promise<string> {
    return this.element.textContent().then((t) => t ?? '');
  }
}

export class HtmlEditorDialogTabs {
  readonly element: Locator;

  constructor(element: Locator) {
    this.element = element;
  }

  getItem(index: number): { element: Locator } {
    return { element: this.element.locator(`.${CLASS.tabItem}`).nth(index) };
  }
}

export class HtmlEditorAddImageUrlForm {
  readonly element: Locator;

  constructor(element: Locator) {
    this.element = element;
  }

  get url(): HtmlEditorTextBox {
    return new HtmlEditorTextBox(this.element.locator(`.${CLASS.textBox}`).first());
  }

  get lockButton(): HtmlEditorButton {
    return new HtmlEditorButton(
      this.element.locator(`.${CLASS.buttonGroup} .${CLASS.button}`).first(),
    );
  }
}

export class HtmlEditorTextBox {
  readonly element: Locator;

  constructor(element: Locator) {
    this.element = element;
  }

  get isInvalid(): Promise<boolean> {
    return this.element.evaluate(
      (el, cls) => el.classList.contains(cls),
      CLASS.invalidState,
    );
  }

  get input(): Locator {
    return this.element.locator(`.${CLASS.textEditorInput}`);
  }
}

export class HtmlEditorFileUploader {
  readonly element: Locator;

  constructor(element: Locator) {
    this.element = element;
  }

  get input(): Locator {
    return this.element.locator('input[type="file"]');
  }

  get fileCount(): Promise<number> {
    return this.element.locator(`.${CLASS.fileUploaderFile}`).count();
  }

  getFile(index = 0): HtmlEditorFileUploaderFile {
    return new HtmlEditorFileUploaderFile(
      this.element.locator(`.${CLASS.fileUploaderFile}`).nth(index),
    );
  }
}

export class HtmlEditorFileUploaderFile {
  readonly element: Locator;

  constructor(element: Locator) {
    this.element = element;
  }

  get fileName(): Promise<string> {
    return this.element.locator(`.${CLASS.fileUploaderFileName}`).textContent()
      .then((t) => t ?? '');
  }

  get fileSize(): Promise<string> {
    return this.element.locator(`.${CLASS.fileUploaderFileSize}`).textContent()
      .then((t) => t ?? '');
  }

  get statusMessage(): Promise<string> {
    return this.element.locator(`.${CLASS.fileUploaderFileStatusMessage}`).textContent()
      .then((t) => t ?? '');
  }

  get validationMessage(): Promise<string> {
    return this.element.locator(`.${CLASS.fileUploaderValidationMessage}`).textContent()
      .then((t) => t ?? '');
  }

  get cancelButton(): HtmlEditorButton {
    return new HtmlEditorButton(
      this.element.locator('xpath=..').locator(`.${CLASS.fileUploaderFileCancelButton}`),
    );
  }
}

export class HtmlEditorAddImageFileForm {
  readonly element: Locator;

  constructor(element: Locator) {
    this.element = element;
  }

  get fileUploader(): HtmlEditorFileUploader {
    return new HtmlEditorFileUploader(this.element.locator(`.${CLASS.fileUploader}`));
  }
}

export class HtmlEditorDialog {
  readonly page: Page;
  readonly element: Locator;

  constructor(page: Page) {
    this.page = page;
    this.element = page.locator(`.dx-overlay-wrapper.${CLASS.formDialog}`);
  }

  get footerToolbar(): HtmlEditorDialogFooterToolbar {
    return new HtmlEditorDialogFooterToolbar(this.element.locator(`.${CLASS.popupBottom}`));
  }

  get tabs(): HtmlEditorDialogTabs {
    return new HtmlEditorDialogTabs(this.element.locator(`.${CLASS.tabs}`));
  }

  get addImageUrlForm(): HtmlEditorAddImageUrlForm {
    return new HtmlEditorAddImageUrlForm(this.element.locator(`.${CLASS.form}`));
  }

  get addImageFileForm(): HtmlEditorAddImageFileForm {
    return new HtmlEditorAddImageFileForm(this.element.locator(`.${CLASS.form}`));
  }
}

export class HtmlEditorToolbar {
  readonly element: Locator;

  constructor(element: Locator) {
    this.element = element;
  }

  getItemByName(itemName: ToolbarItemName): Locator {
    return this.element.locator(`.dx-${itemName}-format`).locator('..').locator('..');
  }
}

export class HtmlEditor {
  readonly page: Page;
  readonly selector: string;
  readonly element: Locator;
  readonly toolbar: HtmlEditorToolbar;
  readonly dialog: HtmlEditorDialog;
  readonly content: Locator;

  constructor(page: Page, selector = '#container') {
    this.page = page;
    this.selector = selector;
    this.element = page.locator(selector);
    this.toolbar = new HtmlEditorToolbar(this.element.locator(`.${CLASS.toolbar}`));
    this.dialog = new HtmlEditorDialog(page);
    this.content = this.element.locator(`.${CLASS.content}`);
  }

  async option(name: string, value?: unknown): Promise<unknown> {
    const sel = this.selector;
    if (arguments.length === 2) {
      return this.page.evaluate(
        ({ sel: s, name: n, value: v }) => {
          ($(s) as any).dxHtmlEditor('instance').option(n, v);
        },
        { sel, name, value },
      );
    }
    return this.page.evaluate(
      ({ sel: s, name: n }) => ($(s) as any).dxHtmlEditor('instance').option(n),
      { sel, name },
    );
  }

  async focus(): Promise<void> {
    const sel = this.selector;
    await this.page.evaluate(
      (s) => { ($(s) as any).dxHtmlEditor('instance').focus(); },
      sel,
    );
  }
}
