/* eslint-disable max-classes-per-file */
import localizationMessage from '@js/common/core/localization/message';
import devices from '@js/core/devices';
import $ from '@js/core/renderer';
import { extend } from '@js/core/utils/extend';
import { map } from '@js/core/utils/iterator';
import { getHeight, getWidth } from '@js/core/utils/size';
import { isDefined } from '@js/core/utils/type';
import ButtonGroup from '@js/ui/button_group';
import FileUploader from '@js/ui/file_uploader';
import TextBox from '@js/ui/text_box';
import { isFluent } from '@js/ui/themes';

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

export class ImageUploader {
  module: any;

  config: any;

  quill: any;

  editorInstance: any;

  tabPanelIndex!: number;

  formData?: any;

  tabsModel?: any;

  tabs?: any;

  isUpdating?: boolean;

  constructor(module, config) {
    this.module = module;
    this.config = config ?? {};
    this.quill = this.module.quill;
    this.editorInstance = this.module.editorInstance;
  }

  render() {
    if (this.editorInstance._formDialog) {
      this.editorInstance._formDialog.beforeAddButtonAction = () => this.getCurrentTab().upload();
    }

    this.tabPanelIndex = 0;
    this.formData = this.getFormData();
    this.isUpdating = this.isImageUpdating();

    this.tabsModel = this.createTabsModel(this.config.tabs);
    this.tabs = this.createTabs(this.formData);

    const formConfig = this.getFormConfig();

    this.updatePopupConfig();
    this.updateAddButtonState();

    this.editorInstance.showFormDialog(formConfig)
      .done((formData, event) => {
        this.tabs[this.getActiveTabIndex()].strategy.pasteImage(formData, event);
      })
      .always(() => {
        this.resetDialogPopupOptions();
        this.quill.focus();
      });
  }

  getCurrentTab() {
    return this.tabs[this.tabPanelIndex];
  }

  updateAddButtonState() {
    const isDisabled = this.getCurrentTab().isDisableButton();
    this.setAddButtonDisabled(isDisabled);
  }

  setAddButtonDisabled(value) {
    this.editorInstance.formDialogOption({
      'toolbarItems[0].options.disabled': value,
    });
  }

  getActiveTabIndex() {
    return this.isUpdating ? 0 : this.tabPanelIndex;
  }

  getFormData() {
    return this.getUpdateDialogFormData(this.quill.getFormat());
  }

  getUpdateDialogFormData(formData) {
    const { imageSrc, src, ...props } = formData;
    return {
      src: imageSrc ?? src,
      ...props,
    };
  }

  createUrlTab(formData) {
    return new UrlTab(this.module, {
      config: this.config,
      formData,
      isUpdating: this.isUpdating,
    }, () => this.updateAddButtonState());
  }

  createFileTab() {
    // @ts-expect-error
    return new FileTab(this.module, {
      config: this.config,
    }, () => this.updateAddButtonState());
  }

  createTabsModel(model = []) {
    if (model.length === 0 || this.isUpdating) {
      return ['url'];
    }
    // @ts-expect-error
    return model.map((tab) => (typeof tab === 'object' ? tab.name : tab));
  }

  createTabs(formData) {
    return this.tabsModel.map((tabName) => {
      const isUrlTab = tabName === 'url';
      return isUrlTab ? this.createUrlTab(formData) : this.createFileTab();
    });
  }

  isImageUpdating() {
    return Object.prototype.hasOwnProperty.call(this.module.quill.getFormat() ?? {}, 'imageSrc');
  }

  updatePopupConfig() {
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

  resetDialogPopupOptions() {
    this.editorInstance.formDialogOption({
      'toolbarItems[0].options.text': localizationMessage.format('OK'),
      'toolbarItems[0].options.visible': true,
      'toolbarItems[0].options.disabled': false,
      wrapperAttr: { class: FORM_DIALOG_CLASS },
    });
  }

  useTabbedItems() {
    return this.tabsModel.length > 1;
  }

  getFormWidth() {
    return isMobile ? '100%' : 493;
  }

  getFormConfig() {
    return {
      formData: this.formData,
      width: this.getFormWidth(),
      labelLocation: 'top',
      colCount: this.useTabbedItems() ? 1 : 11,
      items: this.getItemsConfig(),
    };
  }

  getItemsConfig() {
    if (this.useTabbedItems()) {
      const tabsConfig = map(this.tabs, (tabController) => ({
        title: tabController.getTabName(),
        colCount: 11,
        items: tabController.getItemsConfig(),
      }));

      return [{
        itemType: 'tabbed',
        tabPanelOptions: {
          onSelectionChanged: (e) => {
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

class BaseTab {
  strategy: UpdateUrlStrategy | AddUrlStrategy | FileStrategy;

  isUpdating: boolean;

  formData: any;

  config: any;

  onFileSelected: any;

  module: any;

  constructor(module, { config, formData, isUpdating }, onFileSelected) {
    this.module = module;
    this.config = config;
    this.formData = formData;
    this.isUpdating = isUpdating;
    this.onFileSelected = onFileSelected;

    this.strategy = this.createStrategy();
  }

  getItemsConfig() {
    return this.strategy.getItemsConfig();
  }

  createStrategy(): UpdateUrlStrategy | AddUrlStrategy | FileStrategy {
    return this.isUpdating
      ? new UpdateUrlStrategy(this.module, this.config, this.formData)
      : new AddUrlStrategy(this.module, this.config, this.onFileSelected);
  }

  isDisableButton() {
    return false;
  }

  upload() {
    return this.strategy.upload();
  }
}

class UrlTab extends BaseTab {
  getTabName() {
    return localizationMessage.format(DIALOG_IMAGE_SPECIFY_URL);
  }
}

class FileTab extends BaseTab {
  getTabName() {
    return localizationMessage.format(DIALOG_IMAGE_SELECT_FILE);
  }

  createStrategy() {
    return new FileStrategy(this.module, this.config, this.onFileSelected);
  }

  isDisableButton() {
    return !this.strategy.isValid();
  }
}

class BaseStrategy {
  quill: any;

  module: any;

  config: any;

  editorInstance: any;

  selection: { index: number; length: number };

  constructor(module, config) {
    this.module = module;
    this.config = config;
    this.editorInstance = module.editorInstance;
    this.quill = module.quill;
    this.selection = this.getQuillSelection();
  }

  getQuillSelection() {
    const selection = this.quill.getSelection();

    return selection ?? { index: this.quill.getLength(), length: 0 };
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  pasteImage(formData, event) {}

  isValid() {
    return true;
  }

  upload() {}
}
class AddUrlStrategy extends BaseStrategy {
  formData: any;

  preventRecalculating?: boolean;

  shouldKeepAspectRatio: boolean;

  widthEditor: any;

  heightEditor: any;

  constructor(module, config, onFileSelected) {
    // @ts-expect-error
    super(module, config, onFileSelected);

    this.shouldKeepAspectRatio = true;
  }

  pasteImage(formData, event) {
    this.module.saveValueChangeEvent(event);
    urlUpload(this.quill, this.selection.index, formData);
  }

  keepAspectRatio(data, { dependentEditor, e }) {
    // eslint-disable-next-line radix
    const newValue = parseInt(e.value);
    // eslint-disable-next-line radix
    const previousValue = parseInt(e.previousValue);
    // eslint-disable-next-line radix
    const previousDependentEditorValue = parseInt(dependentEditor.option('value'));

    data.component.updateData(data.dataField, newValue);

    if (this.shouldKeepAspectRatio && previousDependentEditorValue && previousValue && !this.preventRecalculating) {
      this.preventRecalculating = true;
      // @ts-expect-error
      // eslint-disable-next-line radix
      dependentEditor.option('value', Math.round(newValue * previousDependentEditorValue / parseInt(previousValue)).toString());
    }

    this.preventRecalculating = false;
  }

  createKeepAspectRatioEditor($container, data, dependentEditorDataField) {
    return this.editorInstance._createComponent($container, TextBox, extend(true, data.editorOptions, {
      value: data.component.option('formData')[data.dataField],
      onEnterKey: data.component.option('onEditorEnterKey').bind(this.editorInstance._formDialog, data),
      onValueChanged: (e) => {
        this.keepAspectRatio(data, { dependentEditor: this[`${dependentEditorDataField}Editor`], e });
      },
    }));
  }

  upload() {
    const result = this.editorInstance._formDialog._form.validate();
    return result.isValid;
  }

  getItemsConfig() {
    // @ts-expect-error
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
        template: (data) => {
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
            onSelectionChanged: (e) => {
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
        template: (data) => {
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
  constructor(module, config, formData, onFileSelected?: any) {
    super(module, config, onFileSelected);
    this.formData = formData;
    this.modifyFormData();
  }

  modifyFormData() {
    const { imageSrc } = this.quill.getFormat(this.selection.index - 1, 1);

    if (!imageSrc || this.selection.index === 0) {
      this.selection = {
        index: this.selection.index + 1,
        length: 0,
      };
      this.quill.setSelection(this.selection.index, this.selection.length, SILENT_ACTION);
    }

    const imgElement = this.quill.getLeaf(this.selection.index)[0].domNode;
    if (imgElement) {
      this.formData.width = this.formData.width ?? getWidth($(imgElement));
      this.formData.height = this.formData.height ?? getHeight($(imgElement));
    }
  }

  pasteImage(formData, event) {
    this.quill.deleteText(this.embedFormatIndex(), 1, SILENT_ACTION);
    this.selection.index -= 1;
    super.pasteImage(formData, event);
  }

  embedFormatIndex() {
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

  onFileSelected: any;

  data: any;

  constructor(module, config, onFileSelected) {
    // @ts-expect-error
    super(module, config, onFileSelected);
    this.useBase64 = !isDefined(this.config.fileUploadMode) || this.config.fileUploadMode === 'base64';

    this.isValidInternal = false;
    this.onFileSelected = onFileSelected;
    this.data = null;
  }

  upload() {
    if (this.useBase64) {
      this.base64Upload(this.data);
    } else if (this.data.value.length) {
      this.data.component.upload();
    }

    return true;
  }

  isValid() {
    return this.isValidInternal;
  }

  onUploaded(data) {
    serverUpload(this.config.uploadDirectory, data.file.name, this.quill, this.selection.index);
  }

  base64Upload(data) {
    this.quill.getModule('uploader').upload(this.selection, data.value, true);
  }

  pasteImage(formData, event) {
    if (this.useBase64) {
      super.pasteImage(formData, event);
    }
  }

  isBase64Editable() {
    return this.config.fileUploadMode === 'both';
  }

  validate(e) {
    const fileUploader = e.component;

    this.isValidInternal = !fileUploader._files.some((file) => !file.isValid());
    if (fileUploader._files.length === 0) {
      this.isValidInternal = false;
    }
  }

  getFileUploaderOptions() {
    const fileUploaderOptions = {
      uploadUrl: this.config.uploadUrl,
      onValueChanged: (data) => {
        this.validate(data);

        this.data = data;
        this.onFileSelected();
      },
      onUploaded: (e) => this.onUploaded(e),
    };

    return extend({}, getFileUploaderBaseOptions(), fileUploaderOptions, this.config.fileUploaderOptions);
  }

  getItemsConfig() {
    return [
      {
        itemType: 'simple',
        dataField: 'files',
        colSpan: 11,
        label: { visible: false },
        template: () => {
          const $content = $('<div>');
          this.module.editorInstance._createComponent($content, FileUploader, this.getFileUploaderOptions());

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
          onValueChanged: (e) => {
            if (this.isBase64Editable()) {
              this.useBase64 = e.value;
            }
          },
        },
      },
    ];
  }
}

export function correctSlashesInUrl(url) {
  return url[url.length - 1] !== '/' ? `${url}/` : url;
}

export function getFileUploaderBaseOptions() {
  return {
    value: [],
    name: FILE_UPLOADER_NAME,
    accept: 'image/*',
    uploadMode: 'useButtons',
  };
}

export function urlUpload(quill, index, attributes) {
  quill.insertEmbed(index, 'extendedImage', attributes, USER_ACTION);
  quill.setSelection(index + 1, 0, USER_ACTION);
}

export function serverUpload(url, fileName, quill, pasteIndex) {
  if (url) {
    const imageUrl = correctSlashesInUrl(url) + fileName;

    urlUpload(quill, pasteIndex, { src: imageUrl });
  }
}
