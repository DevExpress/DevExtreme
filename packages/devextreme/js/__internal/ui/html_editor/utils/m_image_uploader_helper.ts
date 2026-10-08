/* eslint-disable max-classes-per-file */
import localizationMessage from '@js/common/core/localization/message';
import devices from '@js/core/devices';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { extend } from '@js/core/utils/extend';
import { map } from '@js/core/utils/iterator';
import { getHeight, getWidth } from '@js/core/utils/size';
import { isDefined } from '@js/core/utils/type';
import type { SelectionChangedEvent as ButtonGroupSelectionChangedEvent } from '@js/ui/button_group';
import ButtonGroup from '@js/ui/button_group';
import type { ValueChangedEvent as CheckBoxValueChangedEvent } from '@js/ui/check_box';
import type {
  Properties as FileUploaderProperties,
  UploadedEvent as FileUploaderUploadedEvent,
  ValueChangedEvent as FileUploaderValueChangedEvent,
} from '@js/ui/file_uploader';
import FileUploader from '@js/ui/file_uploader';
import type {
  Item as FormItem,
  Properties as FormProperties,
  SimpleItem,
  SimpleItemTemplateData,
} from '@js/ui/form';
import type { dxHtmlEditorImageUpload, HtmlEditorImageUploadTab } from '@js/ui/html_editor';
import type { SelectionChangedEvent as TabPanelSelectionChangedEvent } from '@js/ui/tab_panel';
import type {
  EnterKeyEvent as TextBoxEnterKeyEvent,
  ValueChangedEvent as TextBoxValueChangedEvent,
} from '@js/ui/text_box';
import TextBox from '@js/ui/text_box';
import { isFluent } from '@js/ui/themes';

import type HtmlEditor from '../html_editor';
import type { BaseHtmlEditorModule } from '../modules/m_base';
import type { QuillInstance, RangeStatic } from '../types/quill';

/** The image dialog form data: the extendedImage formats plus the fields the user edits. */
type ImageFormData = Record<string, unknown> & {
  src?: string;
  width?: number | string;
  height?: number | string;
  alt?: string;
};

interface TabOptions {
  config: dxHtmlEditorImageUpload;
  formData?: Record<string, unknown>;
  isUpdating?: boolean;
}

const isMobile = devices.current().deviceType === 'phone';

const DIALOG_IMAGE_CAPTION = 'dxHtmlEditor-dialogImageCaption';
const DIALOG_UPDATE_IMAGE_CAPTION = 'dxHtmlEditor-dialogUpdateImageCaption';
const DIALOG_IMAGE_FIELD_URL = 'dxHtmlEditor-dialogImageUrlField';
const DIALOG_IMAGE_FIELD_ALT = 'dxHtmlEditor-dialogImageAltField';
const DIALOG_IMAGE_FIELD_WIDTH = 'dxHtmlEditor-dialogImageWidthField';
const DIALOG_IMAGE_FIELD_HEIGHT = 'dxHtmlEditor-dialogImageHeightField';
const DIALOG_IMAGE_ADD_BUTTON = 'dxHtmlEditor-dialogImageAddButton';
const DIALOG_IMAGE_UPDATE_BUTTON = 'dxHtmlEditor-dialogImageUpdateButton';
const DIALOG_IMAGE_SPECIFY_URL = 'dxHtmlEditor-dialogImageSpecifyUrl';
const DIALOG_IMAGE_SELECT_FILE = 'dxHtmlEditor-dialogImageSelectFile';
const DIALOG_IMAGE_KEEP_ASPECT_RATIO = 'dxHtmlEditor-dialogImageKeepAspectRatio';
const DIALOG_IMAGE_ENCODE_TO_BASE64 = 'dxHtmlEditor-dialogImageEncodeToBase64';

const DIALOG_IMAGE_POPUP_CLASS = 'dx-htmleditor-add-image-popup';
const DIALOG_IMAGE_POPUP_WITH_TABS_CLASS = 'dx-htmleditor-add-image-popup-with-tabs';
const DIALOG_IMAGE_FIX_RATIO_CONTAINER = 'dx-fix-ratio-container';
const FORM_DIALOG_CLASS = 'dx-formdialog';

const USER_ACTION = 'user';
const SILENT_ACTION = 'silent';

const FILE_UPLOADER_NAME = 'dx-htmleditor-image';

export function correctSlashesInUrl(url: string): string {
  return url.endsWith('/') ? url : `${url}/`;
}

export function getFileUploaderBaseOptions(): FileUploaderProperties {
  return {
    value: [],
    name: FILE_UPLOADER_NAME,
    allowedFileExtensions: ['image/*'],
    uploadMode: 'useButtons',
  };
}

export function urlUpload(quill: QuillInstance, index: number, attributes: ImageFormData): void {
  quill.insertEmbed(index, 'extendedImage', attributes, USER_ACTION);
  quill.setSelection(index + 1, 0, USER_ACTION);
}

export function serverUpload(
  url: string | undefined,
  fileName: string,
  quill: QuillInstance,
  pasteIndex: number,
): void {
  if (url) {
    const imageUrl = correctSlashesInUrl(url) + fileName;

    urlUpload(quill, pasteIndex, { src: imageUrl });
  }
}

class BaseStrategy {
  quill: QuillInstance;

  module: BaseHtmlEditorModule;

  config: dxHtmlEditorImageUpload;

  editorInstance: HtmlEditor;

  selection: RangeStatic;

  constructor(module: BaseHtmlEditorModule, config: dxHtmlEditorImageUpload) {
    this.module = module;
    this.config = config;
    this.editorInstance = module.editorInstance;
    this.quill = module.quill;
    this.selection = this.getQuillSelection();
  }

  getQuillSelection(): RangeStatic {
    const selection = this.quill.getSelection();

    return selection ?? { index: this.quill.getLength(), length: 0 };
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  pasteImage(formData: ImageFormData, event: Event | undefined): void {}

  isValid(): boolean {
    return true;
  }

  upload(): void {}
}
class AddUrlStrategy extends BaseStrategy {
  formData!: Record<string, unknown>;

  preventRecalculating?: boolean;

  shouldKeepAspectRatio: boolean;

  widthEditor!: TextBox;

  heightEditor!: TextBox;

  constructor(
    module: BaseHtmlEditorModule,
    config: dxHtmlEditorImageUpload,
    onFileSelected?: () => void,
  ) {
    // @ts-expect-error BaseStrategy takes no onFileSelected (see Findings)
    super(module, config, onFileSelected);

    this.shouldKeepAspectRatio = true;
  }

  pasteImage(formData: ImageFormData, event: Event | undefined): void {
    this.module.saveValueChangeEvent(event);
    urlUpload(this.quill, this.selection.index, formData);
  }

  keepAspectRatio(
    data: SimpleItemTemplateData,
    { dependentEditor, e }: { dependentEditor: TextBox; e: TextBoxValueChangedEvent },
  ): void {
    // eslint-disable-next-line radix
    const newValue = parseInt(e.value);
    // eslint-disable-next-line radix
    const previousValue = parseInt(e.previousValue);
    // eslint-disable-next-line radix
    const previousDependentEditorValue = parseInt(String(dependentEditor.option('value')));

    // @ts-expect-error dataField is optional in SimpleItemTemplateData; these items set it
    data.component.updateData(data.dataField, newValue);

    if (
      this.shouldKeepAspectRatio
      && previousDependentEditorValue
      && previousValue
      && !this.preventRecalculating
    ) {
      this.preventRecalculating = true;
      dependentEditor.option(
        'value',
        Math.round((newValue * previousDependentEditorValue) / previousValue).toString(),
      );
    }

    this.preventRecalculating = false;
  }

  createKeepAspectRatioEditor(
    $container: dxElementWrapper,
    data: SimpleItemTemplateData,
    dependentEditorDataField: 'width' | 'height',
  ): TextBox {
    return this.editorInstance._createComponent<TextBox>(
      $container,
      TextBox,
      extend(true, data.editorOptions, {
        // @ts-expect-error dataField is optional in SimpleItemTemplateData; these items set it
        value: data.component.option('formData')[data.dataField],
        onEnterKey: (e: TextBoxEnterKeyEvent): void => {
          // @ts-expect-error the form's handler reads only e.event, which this event carries too
          data.component.option('onEditorEnterKey')?.(e);
        },
        onValueChanged: (e: TextBoxValueChangedEvent): void => {
          this.keepAspectRatio(data, { dependentEditor: this[`${dependentEditorDataField}Editor`], e });
        },
      }),
    );
  }

  upload(): boolean {
    const result = this.editorInstance._formDialog._form.validate();
    // @ts-expect-error isValid is optional in validation_group.d.ts; validate() always sets it
    return result.isValid;
  }

  getItemsConfig(): SimpleItem[] {
    // @ts-expect-error isFluent's theme param is required in themes.d.ts; it defaults to current()
    const stylingMode = isFluent() ? 'text' : 'outlined';

    return [
      {
        dataField: 'src',
        colSpan: 11,
        label: { text: localizationMessage.format(DIALOG_IMAGE_FIELD_URL) },
        validationRules: [{ type: 'required' }, { type: 'stringLength', min: 1 }],
      },
      {
        dataField: 'width',
        colSpan: 6,
        label: { text: localizationMessage.format(DIALOG_IMAGE_FIELD_WIDTH) },
        template: (data: SimpleItemTemplateData): dxElementWrapper => {
          const $content = $('<div>').addClass(DIALOG_IMAGE_FIX_RATIO_CONTAINER);
          const $widthEditor = $('<div>').appendTo($content);

          this.widthEditor = this.createKeepAspectRatioEditor($widthEditor, data, 'height');

          const $ratioEditor = $('<div>').appendTo($content);

          this.editorInstance._createComponent($ratioEditor, ButtonGroup, {
            items: [{
              icon: 'imgarlock',
              value: 'keepRatio',
            }],
            hint: localizationMessage.format(DIALOG_IMAGE_KEEP_ASPECT_RATIO),
            focusStateEnabled: false,
            keyExpr: 'value',
            stylingMode,
            selectionMode: 'multiple',
            selectedItemKeys: ['keepRatio'],
            onSelectionChanged: (e: ButtonGroupSelectionChangedEvent): void => {
              // @ts-expect-error selectedItems is optional in button_group.d.ts
              this.shouldKeepAspectRatio = !!e.component.option('selectedItems').length;
            },
          });

          return $content;
        },
      },
      {
        dataField: 'height',
        colSpan: 5,
        label: { text: localizationMessage.format(DIALOG_IMAGE_FIELD_HEIGHT) },
        template: (data: SimpleItemTemplateData): dxElementWrapper => {
          const $content = $('<div>');

          this.heightEditor = this.createKeepAspectRatioEditor($content, data, 'width');

          return $content;
        },
      },
      { dataField: 'alt', colSpan: 11, label: { text: localizationMessage.format(DIALOG_IMAGE_FIELD_ALT) } },
    ];
  }
}

class UpdateUrlStrategy extends AddUrlStrategy {
  constructor(
    module: BaseHtmlEditorModule,
    config: dxHtmlEditorImageUpload,
    formData: Record<string, unknown>,
    onFileSelected?: () => void,
  ) {
    super(module, config, onFileSelected);
    this.formData = formData;
    this.modifyFormData();
  }

  modifyFormData(): void {
    const { imageSrc } = this.quill.getFormat(this.selection.index - 1, 1);

    if (!imageSrc || this.selection.index === 0) {
      this.selection = {
        index: this.selection.index + 1,
        length: 0,
      };
      this.quill.setSelection(this.selection.index, this.selection.length, SILENT_ACTION);
    }

    // @ts-expect-error the leaf may be null; it is dereferenced before the guard (see Findings)
    const imgElement: Node = this.quill.getLeaf(this.selection.index)[0].domNode;
    if (imgElement) {
      this.formData.width = this.formData.width ?? getWidth($(imgElement));
      this.formData.height = this.formData.height ?? getHeight($(imgElement));
    }
  }

  pasteImage(formData: ImageFormData, event: Event | undefined): void {
    this.quill.deleteText(this.embedFormatIndex(), 1, SILENT_ACTION);
    this.selection.index -= 1;
    super.pasteImage(formData, event);
  }

  embedFormatIndex(): number {
    const selection = this.selection ?? this.quill.getSelection();

    if (selection) {
      if (selection.length) {
        return selection.index;
      }
      return selection.index - 1;
    }
    return this.quill.getLength();
  }
}

class FileStrategy extends BaseStrategy {
  useBase64: boolean;

  isValidInternal: boolean;

  onFileSelected: () => void;

  data: FileUploaderValueChangedEvent | null;

  constructor(
    module: BaseHtmlEditorModule,
    config: dxHtmlEditorImageUpload,
    onFileSelected: () => void,
  ) {
    // @ts-expect-error BaseStrategy takes no onFileSelected (see Findings)
    super(module, config, onFileSelected);
    this.useBase64 = !isDefined(this.config.fileUploadMode) || this.config.fileUploadMode === 'base64';

    this.isValidInternal = false;
    this.onFileSelected = onFileSelected;
    this.data = null;
  }

  upload(): boolean {
    if (this.useBase64) {
      // @ts-expect-error data is set once a file is selected, which enables the add button
      this.base64Upload(this.data);
    // @ts-expect-error data and its value are set once a file is selected (see above)
    } else if (this.data.value.length) {
      // @ts-expect-error see above
      this.data.component.upload();
    }

    return true;
  }

  isValid(): boolean {
    return this.isValidInternal;
  }

  onUploaded(data: FileUploaderUploadedEvent): void {
    serverUpload(this.config.uploadDirectory, data.file.name, this.quill, this.selection.index);
  }

  base64Upload(data: FileUploaderValueChangedEvent): void {
    // @ts-expect-error getModule('uploader') is typed unknown (types/quill.ts)
    this.quill.getModule('uploader').upload(this.selection, data.value, true);
  }

  pasteImage(formData: ImageFormData, event: Event | undefined): void {
    if (this.useBase64) {
      super.pasteImage(formData, event);
    }
  }

  isBase64Editable(): boolean {
    return this.config.fileUploadMode === 'both';
  }

  validate(e: FileUploaderValueChangedEvent): void {
    const fileUploader = e.component;

    // @ts-expect-error _files is internal to FileUploader (ui/file_uploader/file_uploader.ts)
    this.isValidInternal = !fileUploader._files.some((file) => !file.isValid());
    // @ts-expect-error see above
    if (fileUploader._files.length === 0) {
      this.isValidInternal = false;
    }
  }

  getFileUploaderOptions(): FileUploaderProperties {
    const fileUploaderOptions: FileUploaderProperties = {
      uploadUrl: this.config.uploadUrl,
      onValueChanged: (data: FileUploaderValueChangedEvent): void => {
        this.validate(data);

        this.data = data;
        this.onFileSelected();
      },
      onUploaded: (e: FileUploaderUploadedEvent): void => this.onUploaded(e),
    };

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return -- extend is typed any
    return extend(
      {},
      getFileUploaderBaseOptions(),
      fileUploaderOptions,
      this.config.fileUploaderOptions,
    );
  }

  getItemsConfig(): SimpleItem[] {
    return [
      {
        itemType: 'simple',
        dataField: 'files',
        colSpan: 11,
        label: { visible: false },
        template: (): dxElementWrapper => {
          const $content = $('<div>');
          this.module.editorInstance._createComponent<FileUploader, FileUploaderProperties>(
            $content,
            FileUploader,
            this.getFileUploaderOptions(),
          );

          return $content;
        },
      }, {
        itemType: 'simple',
        colSpan: 11,
        label: { visible: false },
        editorType: 'dxCheckBox',
        editorOptions: {
          value: this.useBase64,
          visible: this.isBase64Editable(),
          text: localizationMessage.format(DIALOG_IMAGE_ENCODE_TO_BASE64),
          onValueChanged: (e: CheckBoxValueChangedEvent): void => {
            if (this.isBase64Editable()) {
              this.useBase64 = e.value;
            }
          },
        },
      },
    ];
  }
}

class BaseTab {
  strategy: UpdateUrlStrategy | AddUrlStrategy | FileStrategy;

  isUpdating?: boolean;

  formData?: Record<string, unknown>;

  config: dxHtmlEditorImageUpload;

  onFileSelected: () => void;

  module: BaseHtmlEditorModule;

  constructor(
    module: BaseHtmlEditorModule,
    { config, formData, isUpdating }: TabOptions,
    onFileSelected: () => void,
  ) {
    this.module = module;
    this.config = config;
    this.formData = formData;
    this.isUpdating = isUpdating;
    this.onFileSelected = onFileSelected;

    this.strategy = this.createStrategy();
  }

  getItemsConfig(): SimpleItem[] {
    return this.strategy.getItemsConfig();
  }

  createStrategy(): UpdateUrlStrategy | AddUrlStrategy | FileStrategy {
    return this.isUpdating
      // @ts-expect-error formData is undefined only for FileTab, which overrides createStrategy
      ? new UpdateUrlStrategy(this.module, this.config, this.formData)
      : new AddUrlStrategy(this.module, this.config, this.onFileSelected);
  }

  isDisableButton(): boolean {
    return false;
  }

  upload(): boolean {
    return this.strategy.upload();
  }
}

class UrlTab extends BaseTab {
  getTabName(): string {
    return localizationMessage.format(DIALOG_IMAGE_SPECIFY_URL);
  }
}

class FileTab extends BaseTab {
  getTabName(): string {
    return localizationMessage.format(DIALOG_IMAGE_SELECT_FILE);
  }

  createStrategy(): FileStrategy {
    return new FileStrategy(this.module, this.config, this.onFileSelected);
  }

  isDisableButton(): boolean {
    return !this.strategy.isValid();
  }
}

export class ImageUploader {
  module: BaseHtmlEditorModule;

  config: dxHtmlEditorImageUpload;

  quill: QuillInstance;

  editorInstance: HtmlEditor;

  tabPanelIndex!: number;

  formData!: Record<string, unknown>;

  tabsModel!: (HtmlEditorImageUploadTab | undefined)[];

  tabs!: (UrlTab | FileTab)[];

  isUpdating!: boolean;

  constructor(
    module: BaseHtmlEditorModule,
    config: dxHtmlEditorImageUpload | undefined,
  ) {
    this.module = module;
    this.config = config ?? {};
    this.quill = this.module.quill;
    this.editorInstance = this.module.editorInstance;
  }

  render(): void {
    if (this.editorInstance._formDialog) {
      this.editorInstance._formDialog.beforeAddButtonAction = (): boolean => this
        .getCurrentTab()
        .upload();
    }

    this.tabPanelIndex = 0;
    this.formData = this.getFormData();
    this.isUpdating = this.isImageUpdating();

    this.tabsModel = this.createTabsModel(this.config.tabs);
    this.tabs = this.createTabs(this.formData);

    const formConfig = this.getFormConfig();

    this.updatePopupConfig();
    this.updateAddButtonState();

    this.editorInstance.showFormDialog<ImageFormData>(formConfig)
      ?.done((formData: ImageFormData, event: Event | undefined): void => {
        this.tabs[this.getActiveTabIndex()].strategy.pasteImage(formData, event);
      })
      .always(() => {
        this.resetDialogPopupOptions();
        this.quill.focus();
      });
  }

  getCurrentTab(): UrlTab | FileTab {
    return this.tabs[this.tabPanelIndex];
  }

  updateAddButtonState(): void {
    const isDisabled = this.getCurrentTab().isDisableButton();
    this.setAddButtonDisabled(isDisabled);
  }

  setAddButtonDisabled(value: boolean): void {
    this.editorInstance.formDialogOption({
      'toolbarItems[0].options.disabled': value,
    });
  }

  getActiveTabIndex(): number {
    return this.isUpdating ? 0 : this.tabPanelIndex;
  }

  getFormData(): Record<string, unknown> {
    return this.getUpdateDialogFormData(this.quill.getFormat());
  }

  getUpdateDialogFormData(formData: Record<string, unknown>): Record<string, unknown> {
    const { imageSrc, src, ...props } = formData;
    return {
      src: imageSrc ?? src,
      ...props,
    };
  }

  createUrlTab(formData: Record<string, unknown>): UrlTab {
    return new UrlTab(this.module, {
      config: this.config,
      formData,
      isUpdating: this.isUpdating,
    }, () => this.updateAddButtonState());
  }

  createFileTab(): FileTab {
    return new FileTab(this.module, {
      config: this.config,
    }, () => this.updateAddButtonState());
  }

  createTabsModel(
    model: dxHtmlEditorImageUpload['tabs'] = [],
  ): (HtmlEditorImageUploadTab | undefined)[] {
    if (model.length === 0 || this.isUpdating) {
      return ['url'];
    }
    return model.map((tab) => (typeof tab === 'object' ? tab.name : tab));
  }

  createTabs(formData: Record<string, unknown>): (UrlTab | FileTab)[] {
    return this.tabsModel.map((tabName) => {
      const isUrlTab = tabName === 'url';
      return isUrlTab ? this.createUrlTab(formData) : this.createFileTab();
    });
  }

  isImageUpdating(): boolean {
    return Object.prototype.hasOwnProperty.call(this.module.quill.getFormat() ?? {}, 'imageSrc');
  }

  updatePopupConfig(): void {
    let wrapperClasses = `${DIALOG_IMAGE_POPUP_CLASS} ${FORM_DIALOG_CLASS}`;
    if (this.useTabbedItems()) {
      wrapperClasses += ` ${DIALOG_IMAGE_POPUP_WITH_TABS_CLASS}`;
    }

    const titleKey = this.isUpdating ? DIALOG_UPDATE_IMAGE_CAPTION : DIALOG_IMAGE_CAPTION;
    const addButtonTextKey = this.isUpdating ? DIALOG_IMAGE_UPDATE_BUTTON : DIALOG_IMAGE_ADD_BUTTON;

    this.editorInstance.formDialogOption({
      title: localizationMessage.format(titleKey),
      'toolbarItems[0].options.text': localizationMessage.format(addButtonTextKey),
      wrapperAttr: { class: wrapperClasses },
    });
  }

  resetDialogPopupOptions(): void {
    this.editorInstance.formDialogOption({
      'toolbarItems[0].options.text': localizationMessage.format('OK'),
      'toolbarItems[0].options.visible': true,
      'toolbarItems[0].options.disabled': false,
      wrapperAttr: { class: FORM_DIALOG_CLASS },
    });
  }

  useTabbedItems(): boolean {
    return this.tabsModel.length > 1;
  }

  getFormWidth(): string | number {
    return isMobile ? '100%' : 493;
  }

  getFormConfig(): FormProperties {
    return {
      formData: this.formData,
      width: this.getFormWidth(),
      labelLocation: 'top',
      colCount: this.useTabbedItems() ? 1 : 11,
      items: this.getItemsConfig(),
    };
  }

  getItemsConfig(): FormItem[] {
    if (this.useTabbedItems()) {
      const tabsConfig = map(this.tabs, (tabController: UrlTab | FileTab) => ({
        title: tabController.getTabName(),
        colCount: 11,
        items: tabController.getItemsConfig(),
      }));

      return [{
        itemType: 'tabbed',
        tabPanelOptions: {
          onSelectionChanged: (e: TabPanelSelectionChangedEvent): void => {
            // @ts-expect-error selectedIndex is optional in tab_panel.d.ts
            this.tabPanelIndex = e.component.option('selectedIndex');
            this.updateAddButtonState();
          },
        },
        tabs: tabsConfig,
      }];
    }

    return this.tabs[0].getItemsConfig();
  }
}
