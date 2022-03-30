import $ from '../../../core/renderer';
import localizationMessage from '../../../localization/message';
import { map } from '../../../core/utils/iterator';

const DIALOG_IMAGE_CAPTION = 'dxHtmlEditor-dialogImageCaption';

const DIALOG_IMAGE_FIELD_URL = 'dxHtmlEditor-dialogImageUrlField';
const DIALOG_IMAGE_FIELD_ALT = 'dxHtmlEditor-dialogImageAltField';
const DIALOG_IMAGE_FIELD_WIDTH = 'dxHtmlEditor-dialogImageWidthField';
const DIALOG_IMAGE_FIELD_HEIGHT = 'dxHtmlEditor-dialogImageHeightField';

const DIALOG_IMAGE_POPUP_CLASS = 'dx-htmleditor-add-image-popup';
const DIALOG_IMAGE_POPUP_WITH_TABS_CLASS = 'dx-htmleditor-add-image-popup-with-tabs';

const DIALOG_IMAGE_FIX_RATIO_CONTAINER = 'dx-fix-ratio-container';

const FORM_DIALOG_CLASS = 'dx-formdialog';

const USER_ACTION = 'user';
const SILENT_ACTION = 'silent';


import ButtonGroup from '../../button_group';
import FileUploader from '../../file_uploader';
import TextBox from '../../text_box';
// import { extend } from 'jquery';

export class ImageUploader {
    constructor(module, config) {
        this.module = module;
        this.config = config ?? {};

        this.tabPanelIndex = 0;
        // this.updateStrategy = new ImageUpdateStrategy(this);
        // this.addStrategy = this.getImageAddStrategy(config.mode);
        // this.renderTabs();

        // this.tabs = this.getTabsConfig();


        // this.tabs = this.getFormConfig();
    }

    render() {
        // const strategy = this.isUpdating ? this.updateStrategy : this.addStrategy;

        this.formData = this.getFormData();

        this.tabs = this.createTabs(this.formData);

        // const dialogConfig();


        const formConfig = this.getFormConfig();

        // strategy.updateSelectionBefore();

        this
            .showDialog(formConfig)
            .done((formData, event) => {
                this.tabs[this.getActiveTabIndex()].strategy.pasteImage(formData, event);
                // this.tabs
                // strategy.pasteImage(formData, event);
            })
            .always(() => {
                // ...
                this.module.quill.focus();
            });
    }

    // getTabsConfig() {
    //     if(this.config.tabs) {
    //         this.config.tabs.forEach


    //     }
    // }

    getActiveTabIndex() {
        return this.tabPanelIndex;
    }

    getFormData() {
        return this.getUpdateDialogFormData(this.module.quill.getFormat());
    }

    getUpdateDialogFormData(formData) {
        const resultFormData = formData;
        resultFormData.src = resultFormData.imageSrc ?? resultFormData.src;
        delete resultFormData.imageSrc;

        return resultFormData;
    }

    createTabs(formData) {
        const result = [];

        if(!this.config.tabs) {
            this.config.tabs = ['url'];
        }

        this.config.tabs.forEach((tabName) => {
            const newTab = tabName === 'url' ? new UrlTab(this.module, this.config, formData) : new FileTab(this.module, this.config);

            result.push(newTab);
        });

        return result;
    }

    modifyDialogPopupOptions() {
        this.module.editorInstance.formDialogOption({
            title: localizationMessage.format(DIALOG_IMAGE_CAPTION),
            'toolbarItems[0].options.text': 'Add'
        });
        let wrapperClassString = `${DIALOG_IMAGE_POPUP_CLASS} ${FORM_DIALOG_CLASS}`;
        if(this.useTabbedItems()) {
            wrapperClassString += ` ${DIALOG_IMAGE_POPUP_WITH_TABS_CLASS}`;
        }

        this.module.editorInstance.formDialogOption('wrapperAttr', { class: wrapperClassString });
    }

    serverUpload() {

    }

    base64Upload() {

    }

    urlUpload() {

    }

    showDialog(formConfig) {
        this.modifyDialogPopupOptions();
        return this.module.editorInstance.showFormDialog(formConfig);
    }

    useTabbedItems() {
        return this.config.tabs.length > 1;
    }

    getFormConfig() {
        return {
            formData: this.formData,
            width: 493,
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

    getTabConfig(tab) {
        // tabName = tabName || this.config.tabs[0];

        // this.strategy = this.getStrategy(tabName);
        // return;
        return tab.getFormConfig();

    }

}

// class ImageUploadTab {
//     constructor() {

//     }

//     getFormConfig() {

//     }

//     getFormItems() {

//     }

//     render() {

//     }
// }

class BaseTab {
    constructor(module, config) {
        this.module = module;
        this.config = config;

    }

    getItemsConfig() {
        return this.strategy.getItemsConfig();
    }
}

class UrlTab extends BaseTab {
    constructor(module, config, formData) {

        super(module, config);
        this.formData = formData;
        this.shouldKeepAspectRatio = true;

        this.strategy = this.getStrategy();
        // this.config = config;


    }

    getTabName() {
        return 'Specify Url';
    }

    isImageUpdating() {
        return Object.prototype.hasOwnProperty.call(this.module.quill.getFormat() ?? {}, 'imageSrc');
    }

    getStrategy() {
        return this.isImageUpdating() ? new UpdateUrlStrategy(this.module, this.config, this.formData) : new AddUrlStrategy(this.module, this.config);
    }

    urlUpload() {
        // formData = updateFormDataDimensions(formData);
        // module.quill.insertEmbed(index, 'extendedImage', formData, USER_ACTION);
        // module.quill.setSelection(index + 1, 0, USER_ACTION);
    }

}

class FileTab extends BaseTab {
    constructor(module, config) {
        super(module, config);

        this.strategy = this.getStrategy();
    }

    getTabName() {
        return 'Select File';
    }

    getStrategy() {
        let strategy = {};

        switch(this.config.fileUploadMode) {
            case 'both':
                strategy = MixedFileStrategy;
                break;
            case 'server':
                strategy = ServerFileStrategy;
                break;
            default:
                strategy = Base64FileStrategy;
                break;
        }

        return new strategy(this.module, this.config);
    }

}


// class UrlImageUploadStrategy extends BaseStrategy {

// }

// class UrlImageUpdateStrategy {

// }
class BaseStrategy {
    constructor(module, config) {
        this.module = module;
        this.config = config;
        this.selection = this.getQuillSelection();
    }

    // defaultPasteIndex() {
    //     const selection = this.module.quill.getSelection();
    //     // console.log('defaultPasteIndex = ' + selection?.index ?? this.module.quill.getLength());
    //     return { index: selection?.index ?? this.module.quill.getLength(), length: };
    // }

    getQuillSelection() {
        const selection = this.module.quill.getSelection();
        // console.log('defaultPasteIndex = ' + selection?.index ?? this.module.quill.getLength());
        return { index: selection?.index ?? this.module.quill.getLength(), length: selection?.length || 0 };
    }

    pasteImage() {

    }
}

class BaseUrlStrategy extends BaseStrategy {
    constructor(module, config) {
        super(module, config);
        // this.config = config;
        this.shouldKeepAspectRatio = true;


        // this.modifyFormData();

    }

    pasteImage(formData, event) {
        this.module.saveValueChangeEvent(event);
        urlUpload(this.module.quill, this.selection.index, formData);
    }

    modifyFormData() {}

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

    getItemsConfig() {
        return [
            { dataField: 'src', colSpan: 11, label: { text: localizationMessage.format(DIALOG_IMAGE_FIELD_URL) } },
            { dataField: 'width', colSpan: 6, label: { text: localizationMessage.format(DIALOG_IMAGE_FIELD_WIDTH) }, template: (data) => {
                const $content = $('<div>').addClass(DIALOG_IMAGE_FIX_RATIO_CONTAINER);
                const $widthEditor = $('<div>').appendTo($content);

                this.widthEditor = this.module.editorInstance._createComponent($widthEditor, TextBox, {
                    value: data.component.option('formData')[data.dataField],
                    onEnterKey: data.component.option('onEditorEnterKey').bind(this.module.editorInstance._formDialog, data),
                    onValueChanged: (e) => {
                        this.keepAspectRatio(data, { dependentEditor: this.heightEditor, e });
                    }
                });

                const $ratioEditor = $('<div>').appendTo($content);

                this.module.editorInstance._createComponent($ratioEditor, ButtonGroup, {
                    items: [{
                        icon: 'link',
                        value: 'keepRatio',
                    }],
                    hint: 'Keep aspect ratio',
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

                this.heightEditor = this.module.editorInstance._createComponent($content, TextBox, {
                    value: data.component.option('formData')[data.dataField],
                    onEnterKey: data.component.option('onEditorEnterKey').bind(this.module.editorInstance._formDialog, data),
                    onValueChanged: (e) => {
                        this.keepAspectRatio(data, { dependentEditor: this.widthEditor, e });
                    }
                });

                return $content;
            } },
            { dataField: 'alt', colSpan: 11, label: { text: localizationMessage.format(DIALOG_IMAGE_FIELD_ALT) } }
        ];
    }

}

class UpdateUrlStrategy extends BaseUrlStrategy {
    constructor(module, config, formData) {
        super(module, config);
        // this.config = config;
        this.formData = formData;
        // this.modifySelectionData();
        this.modifyFormData();
        this.shouldKeepAspectRatio = true;
    }

    //     if(!imageSrc || defaultIndex === 0) {
    //         module.quill.setSelection(defaultIndex + 1, 0, SILENT_ACTION);
    //     }

    // modifyQuillSelection() {
    //     const selection = this.module.quill.getSelection();
    //     // console.log('defaultPasteIndex = ' + selection?.index ?? this.module.quill.getLength());
    //     return { index: selection?.index ?? this.module.quill.getLength(), length: selection?.length || 0 };
    // }

    modifyFormData() {
        // const { imageSrc } = this.module.quill.getFormat(this.selection.index - 1, 1);

        // this.formData = this.getUpdateDialogFormData();

        // if(!imageSrc || this.selection.index === 0) {
        //     this.module.quill.setSelection(this.selection.index + 1, 0, SILENT_ACTION);
        // }
        // const index = this.defaultPasteIndex();
        // const { imageSrc } = this.module.quill.getFormat(index - 1, 1);

        // this.formData.src = this.formData.imageSrc;
        // delete this.formData.imageSrc;


        // this.formData = getUpdateDialogFormData(module, this.formData);
    }

    getUpdateDialogFormData() {
        const resultFormData = this.formData;
        resultFormData.src = resultFormData.imageSrc;
        delete resultFormData.imageSrc;

        return resultFormData;
    }

    pasteImage(formData, event) {
        this.module.quill.deleteText(this.embedFormatIndex(), 1, SILENT_ACTION);
        super.pasteImage(formData, event);
    }
    //         index = formatIndex;
    //         module.quill.deleteText(index, 1, SILENT_ACTION);

    embedFormatIndex() {
        const selection = this.selection ?? this.module.quill.getSelection();

        if(selection) {
            if(selection.length) {
                return selection.index;
            } else {
                return selection.index - 1;
            }
        } else {
            return this.module.quill.getLength();
        }
    }
}


class AddUrlStrategy extends BaseUrlStrategy {
    // constructor(module, config) {
    //     super(module, config);
    // }
}

class BaseFileStrategy extends BaseStrategy {
    constructor(module, config) {
        super(module, config);

        this.useBase64 = this.shouldUseBase64();
    }

    pasteImage() {}

    shouldUseBase64() {}

    shouldClosePopupAfterUpload() {}

    closeDialogPopup(editorInstance, data) {
        editorInstance._formDialog.hide({ file: data.value ? data.value[0] : data.file }, data.event);
    }

    // serverUpload(module, data) {

    // }

    uploadToServer(fileUploader, file) {
        // serverUpload(fileUploader, file);
    }

    base64UploadImpl() {}

    serverUploadImpl() {}

    isMixedUploadMode() {
        return false;
    }

    getUploadMode() {
        // return this.shouldUseBase64() ? 'useButtons' : 'instantly';
        return 'instantly';
    }

    getItemsConfig() {
        // let useBase64 = this.shouldUseBase64();

        return [
            {
                itemType: 'simple',
                dataField: 'files',
                colSpan: 11,
                label: { visible: false },
                template: (formTemplateData) => {
                    const $content = $('<div>');
                    this.module.editorInstance._createComponent($content, FileUploader, {
                        multiple: false,
                        value: [],
                        name: 'photo',
                        accept: 'image/*',
                        uploadUrl: this.config.uploadUrl,
                        uploadMode: this.getUploadMode(),
                        onValueChanged: (data) => {
                            // if(this.shouldUseBase64()) {
                            //     this.base64UploadImpl(this.module, data.value);
                            // } else {
                            //     this.uploadToServer(data.component, data.value[0]);
                            //     this.serverUpload(this.module, data);
                            // }

                            this.base64UploadImpl(data);


                            // console.log('value changed');
                        },
                        onUploaded: (data) => {
                            this.serverUploadImpl(data);
                            // console.log('on uploaded');
                            // if(!useBase64) {
                            //     const formInstance = formTemplateData.component;
                            //     const file = data.file;
                            //     const uploadDirectory = this.config.uploadDirectory;
                            //     this.serverUpload({ formInstance, file, uploadDirectory });
                            // }

                        }
                    });
                    return $content;
                }
            }, {
                itemType: 'simple',
                // dataField: 'useBase64',
                colSpan: 11,
                label: { visible: false },
                editorType: 'dxCheckBox',
                editorOptions: {
                    value: this.useBase64,
                    disabled: !this.isMixedUploadMode(),
                    text: 'Encode to base 64',
                    onValueChanged: (e) => {
                        this.useBase64 = e.value;
                    },
                }
            }
        ];
    }

}

class Base64FileStrategy extends BaseFileStrategy {
    constructor(module, config) {
        super(module, config);
    }

    shouldUseBase64() {
        return true;
    }

    base64UploadImpl(data) {
        base64Upload(this.module.quill, data.value);
        this.closeDialogPopup(this.module.editorInstance, data);
    }

    shouldClosePopupAfterUpload() {
        return true;
    }

    // base64UploadImpl(module, data) {
    //     super.base64UploadImpl(module, data);
    //     if(this.shouldClosePopupAfterUpload()) {
    //         this.closeDialogPopup(module.editorInstance, data);
    //     }
    // }

    // base64Upload(module, data) {
    //     this.base64Upload(module, data);
    // }


}

class ServerFileStrategy extends BaseFileStrategy {

    shouldUseBase64() {
        return false;
    }

    shouldClosePopupAfterUpload() {
        return true;
    }
    // constructor(module, config) {
    //     super(module, config);
    // }

}

class MixedFileStrategy extends BaseFileStrategy {
    constructor(module, config) {
        super(module, config);
        this.useBase64 = false;
    }

    shouldUseBase64() {
        return this.useBase64;
    }

    isMixedUploadMode() {
        return true;
    }

    base64UploadImpl(data) {
        if(this.shouldUseBase64()) {
            base64Upload(this.module.quill, data.value);
            this.closeDialogPopup(this.module.editorInstance, data);
        }
    }

    pasteImage(formData, event) {
        if(this.shouldUseBase64()) {
            super.pasteImage(formData, event);
        }
    }

    serverUploadImpl(data) {
        if(!this.shouldUseBase64()) {
            const imageUrl = this.config.uploadDirectory + data.file.name;
            // const index = this.defaultPasteIndex(this.module);

            urlUpload(this.module.quill, this.selection.index, { src: imageUrl });
            this.closeDialogPopup(this.module.editorInstance, data);
        }
    }
}

export function base64Upload(quill, files) {
    const range = quill.getSelection();
    quill.getModule('uploader').upload(range, files);
}

export function serverUpload(fileUploader, file) {
    fileUploader.upload(file);
    // const range = quill.getSelection();
    // quill.getModule('uploader').upload(range, files);
}

// function updateFormDataDimensions(formData) {
//     formData = normalizeFormDataDimension(formData, 'width');
//     formData = normalizeFormDataDimension(formData, 'height');

//     return formData;
// }

// function normalizeFormDataDimension(formData, name) {
//     if(isDefined(formData[name])) {
//         formData[name] = formData[name].toString();
//     }

//     return formData;
// }

export function urlUpload(quill, index, attributes) {
    // const index = defaultPasteIndex(module);

    // formData = updateFormDataDimensions(formData);
    quill.insertEmbed(index, 'extendedImage', attributes, USER_ACTION);
    quill.setSelection(index + 1, 0, USER_ACTION);
    // const range = quill.getSelection();
    // quill.getModule('uploader').upload(range, files);
}
