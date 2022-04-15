import $ from '../../../core/renderer';
import localizationMessage from '../../../localization/message';
import { map } from '../../../core/utils/iterator';
import { extend } from '../../../core/utils/extend';
import { getHeight, getWidth } from '../../../core/utils/size';
import devices from '../../../core/devices';
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

import ButtonGroup from '../../button_group';
import FileUploader from '../../file_uploader';
import TextBox from '../../text_box';

export class ImageUploader {
    constructor(module, config) {
        this.module = module;
        this.config = config ?? {};
        this.quill = this.module.quill;
        this.editorInstance = this.module.editorInstance;
        this.tabPanelIndex = 0;
    }

    render() {
        this.formData = this.getFormData();
        this.isUpdating = this.isImageUpdating();
        this.actualTabs = this.config.tabs?.slice();
        this.tabs = this.createTabs(this.formData);
        const formConfig = this.getFormConfig();

        this.modifyDialogPopupOptions();

        this.editorInstance.showFormDialog(formConfig)
            .done((formData, event) => {
                this.tabs[this.getActiveTabIndex()].strategy.pasteImage(formData, event);
            })
            .always(() => {
                this.resetDialogPopupOptions();
                this.quill.focus();
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
            ...props
        };
    }

    createTabs(formData) {
        const result = [];

        if(!this.actualTabs || this.isUpdating) {
            this.actualTabs = ['url'];
        }

        this.actualTabs = this.normalizeTabs(this.actualTabs);

        this.actualTabs.forEach((tabName) => {
            const newTab = tabName === 'url'
                ? new UrlTab(this.module, {
                    config: this.config,
                    formData,
                    isUpdating: this.isUpdating
                })
                : new FileTab(this.module, {
                    config: this.config
                });

            result.push(newTab);
        });

        return result;
    }

    normalizeTabs(tabsConfig) {
        return tabsConfig.map((item) => {
            return typeof item === 'object' ? item.name : item;
        });
    }

    isImageUpdating() {
        return Object.prototype.hasOwnProperty.call(this.module.quill.getFormat() ?? {}, 'imageSrc');
    }

    modifyDialogPopupOptions() {
        let wrapperClasses = `${DIALOG_IMAGE_POPUP_CLASS} ${FORM_DIALOG_CLASS}`;
        if(this.useTabbedItems()) {
            wrapperClasses += ` ${DIALOG_IMAGE_POPUP_WITH_TABS_CLASS}`;
        }

        this.editorInstance.formDialogOption({
            title: localizationMessage.format(
                this.isUpdating
                    ? DIALOG_UPDATE_IMAGE_CAPTION
                    : DIALOG_IMAGE_CAPTION),
            'toolbarItems[0].options.text': localizationMessage.format(
                this.isUpdating
                    ? DIALOG_IMAGE_UPDATE_BUTTON
                    : DIALOG_IMAGE_ADD_BUTTON),
            'toolbarItems[0].options.visible': !this.shouldHideAddButton(),
            'wrapperAttr': { class: wrapperClasses }
        });
    }

    shouldHideAddButton() {
        return !this.isUpdating && this.actualTabs.length === 1 && this.actualTabs[0] !== 'url';
    }

    resetDialogPopupOptions() {
        this.editorInstance.formDialogOption({
            'toolbarItems[0].options.text': localizationMessage.format('OK'),
            'toolbarItems[0].options.visible': true,
            wrapperAttr: { class: FORM_DIALOG_CLASS }
        });
    }

    useTabbedItems() {
        return this.actualTabs.length > 1;
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
            items: this.getItemsConfig()
        };
    }

    getItemsConfig() {
        let config = {};

        if(this.useTabbedItems()) {
            const tabsConfig = map(this.tabs, (tabController) => {
                return {
                    title: tabController.getTabName(),
                    colCount: 11,
                    items: tabController.getItemsConfig()
                };
            });

            config = [{
                itemType: 'tabbed',
                tabPanelOptions: {
                    onSelectionChanged: (e) => {
                        this.tabPanelIndex = e.component.option('selectedIndex');
                    }
                },
                tabs: tabsConfig
            }];
        } else {
            config = this.tabs[0].getItemsConfig();
        }

        return config;
    }
}

class BaseTab {
    constructor(module, { config, formData, isUpdating }) {
        this.module = module;
        this.config = config;
        this.formData = formData;
        this.isUpdating = isUpdating;
        this.strategy = this.getStrategy();
    }

    getItemsConfig() {
        return this.strategy.getItemsConfig();
    }
}

class UrlTab extends BaseTab {
    getTabName() {
        return localizationMessage.format(DIALOG_IMAGE_SPECIFY_URL);
    }

    getStrategy() {
        return this.isUpdating
            ? new UpdateUrlStrategy(this.module, this.config, this.formData)
            : new AddUrlStrategy(this.module, this.config);
    }
}

class FileTab extends BaseTab {
    getTabName() {
        return localizationMessage.format(DIALOG_IMAGE_SELECT_FILE);
    }

    getStrategy() {
        return new FileStrategy(this.module, this.config);
    }
}

class BaseStrategy {
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

    pasteImage() {}
}
class AddUrlStrategy extends BaseStrategy {
    constructor(module, config) {
        super(module, config);

        this.shouldKeepAspectRatio = true;
    }

    pasteImage(formData, event) {
        this.module.saveValueChangeEvent(event);
        urlUpload(this.quill, this.selection.index, formData);
    }

    keepAspectRatio(data, { dependentEditor, e }) {
        const newValue = parseInt(e.value);
        const previousValue = parseInt(e.previousValue);
        const previousDependentEditorValue = parseInt(dependentEditor.option('value'));

        data.component.updateData(data.dataField, newValue);

        if(this.shouldKeepAspectRatio && previousDependentEditorValue && previousValue && !this.preventRecalculating) {
            this.preventRecalculating = true;
            dependentEditor.option('value', Math.round(newValue * previousDependentEditorValue / parseInt(previousValue)).toString());
        }

        this.preventRecalculating = false;
    }

    createKeepAspectRatioEditor($container, data, dependentEditorDataField) {
        return this.editorInstance._createComponent($container, TextBox, extend(true, data.editorOptions, {
            value: data.component.option('formData')[data.dataField],
            onEnterKey: data.component.option('onEditorEnterKey').bind(this.editorInstance._formDialog, data),
            onValueChanged: (e) => {
                this.keepAspectRatio(data, { dependentEditor: this[dependentEditorDataField + 'Editor'], e });
            }
        }));
    }

    getItemsConfig() {
        return [
            { dataField: 'src', colSpan: 11, label: { text: localizationMessage.format(DIALOG_IMAGE_FIELD_URL) } },
            { dataField: 'width', colSpan: 6, label: { text: localizationMessage.format(DIALOG_IMAGE_FIELD_WIDTH) }, template: (data) => {
                const $content = $('<div>').addClass(DIALOG_IMAGE_FIX_RATIO_CONTAINER);
                const $widthEditor = $('<div>').appendTo($content);

                this.widthEditor = this.createKeepAspectRatioEditor($widthEditor, data, 'height');

                const $ratioEditor = $('<div>').appendTo($content);

                this.editorInstance._createComponent($ratioEditor, ButtonGroup, {
                    items: [{
                        icon: 'link',
                        value: 'keepRatio',
                    }],
                    hint: localizationMessage.format(DIALOG_IMAGE_KEEP_ASPECT_RATIO),
                    focusStateEnabled: false,
                    keyExpr: 'value',
                    stylingMode: 'outlined',
                    selectionMode: 'multiple',
                    selectedItemKeys: ['keepRatio'],
                    onSelectionChanged: (e) => {
                        this.shouldKeepAspectRatio = !!e.component.option('selectedItems').length;
                    }
                });

                return $content;
            } },
            { dataField: 'height', colSpan: 5, label: { text: localizationMessage.format(DIALOG_IMAGE_FIELD_HEIGHT) }, template: (data) => {
                const $content = $('<div>');

                this.heightEditor = this.createKeepAspectRatioEditor($content, data, 'width');

                return $content;
            } },
            { dataField: 'alt', colSpan: 11, label: { text: localizationMessage.format(DIALOG_IMAGE_FIELD_ALT) } }
        ];
    }

}

class UpdateUrlStrategy extends AddUrlStrategy {
    constructor(module, config, formData) {
        super(module, config);
        this.formData = formData;
        this.modifyFormData();
    }

    modifyFormData() {
        const { imageSrc } = this.quill.getFormat(this.selection.index - 1, 1);

        if(!imageSrc || this.selection.index === 0) {
            this.selection = {
                index: this.selection.index + 1,
                length: 0
            };
            this.quill.setSelection(this.selection.index, this.selection.length, SILENT_ACTION);
        }

        const imgElement = this.quill.getLeaf(this.selection.index)[0].domNode;
        if(imgElement) {
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

        if(selection) {
            if(selection.length) {
                return selection.index;
            } else {
                return selection.index - 1;
            }
        } else {
            return this.quill.getLength();
        }
    }
}

class FileStrategy extends BaseStrategy {
    constructor(module, config) {
        super(module, config);

        this.useBase64 = this.config.fileUploadMode === 'base64';
    }

    closeDialogPopup(data) {
        this.editorInstance._formDialog.hide({ file: data.value ? data.value[0] : data.file }, data.event);
    }

    serverUpload(data) {
        if(!this.useBase64) {
            const imageUrl = correctSlashesInUrl(this.config.uploadDirectory) + data.file.name;

            urlUpload(this.quill, this.selection.index, { src: imageUrl });
            this.closeDialogPopup(data);
        }
    }

    base64Upload(data) {
        this.quill.getModule('uploader').upload(this.selection, data.value, true);
        this.closeDialogPopup(data);
    }

    pasteImage(formData, event) {
        if(this.useBase64) {
            super.pasteImage(formData, event);
        }
    }

    isBase64Editable() {
        return this.config.fileUploadMode === 'both';
    }

    getFileUploaderOptions() {
        const fileUploaderOptions = {
            uploadUrl: this.config.uploadUrl,
            onValueChanged: (data) => {
                if(this.useBase64) {
                    this.base64Upload(data);
                }
            },
            onUploaded: (data) => {
                this.serverUpload(data);
            }
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
                }
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
                        if(this.isBase64Editable()) {
                            this.useBase64 = e.value;
                        }
                    }
                }
            }
        ];
    }
}

export function correctSlashesInUrl(url) {
    return url[url.length - 1] !== '/' ? (url + '/') : url;
}

export function getFileUploaderBaseOptions() {
    return {
        value: [],
        name: FILE_UPLOADER_NAME,
        accept: 'image/*',
        uploadMode: 'instantly'
    };
}

export function urlUpload(quill, index, attributes) {
    quill.insertEmbed(index, 'extendedImage', attributes, USER_ACTION);
    quill.setSelection(index + 1, 0, USER_ACTION);
}
