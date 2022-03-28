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


import ButtonGroup from '../../button_group';
import FileUploader from '../../file_uploader';
import TextBox from '../../text_box';
// import { extend } from 'jquery';

export class ImageUploader {
    constructor(module, config) {
        this.module = module;
        this.config = config ?? {};
        // this.updateStrategy = new ImageUpdateStrategy(this);
        // this.addStrategy = this.getImageAddStrategy(config.mode);
        // this.renderTabs();

        // this.tabs = this.getTabsConfig();


        // this.tabs = this.getFormConfig();
    }

    render() {
        // const strategy = this.isUpdating ? this.updateStrategy : this.addStrategy;

        this.tabs = this.createTabs();

        this.formData = this.getFormData();

        // const dialogConfig();


        const formConfig = this.getFormConfig();

        // strategy.updateSelectionBefore();

        this
            .showDialog(formConfig)
            .done((formData, event) => {
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

    getFormData() {
        return this.getUpdateDialogFormData(this.module.quill.getFormat());
    }

    getUpdateDialogFormData(formData) {
        const resultFormData = formData;
        resultFormData.src = resultFormData.imageSrc;
        delete resultFormData.imageSrc;

        return resultFormData;
    }

    createTabs() {
        const result = [];

        this.config.tabs.forEach((tabName) => {
            const newTab = tabName === 'url' ? new UrlImageUploadTab(this.module, this.config) : new FileImageUploadTab(this.module, this.config);

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

class BaseUploadTab {
    constructor(module, config) {
        this.module = module;
        this.config = config;
        this.strategy = this.getStrategy();
    }

    getItemsConfig() {
        return this.strategy.getItemsConfig();
    }
}

class UrlImageUploadTab extends BaseUploadTab {
    constructor(module, config) {
        super(module, config);
        // this.config = config;
        this.shouldKeepAspectRatio = true;

    }

    getTabName() {
        return 'Specify Url';
    }

    getStrategy() {
        return new addImageByUrlStrategy(this.module, this.config);
    }

    urlUpload() {
        // formData = updateFormDataDimensions(formData);
        // module.quill.insertEmbed(index, 'extendedImage', formData, USER_ACTION);
        // module.quill.setSelection(index + 1, 0, USER_ACTION);
    }


}

class FileImageUploadTab extends BaseUploadTab {
    getTabName() {
        return 'Select File';
    }

    getStrategy() {
        let strategy = {};

        switch(this.config.fileUploadMode) {
            case 'both':
                strategy = MixedUploadStrategy;
                break;
            case 'server':
                strategy = ServerUploadStrategy;
                break;
            default:
                strategy = Base64UploadStrategy;
                break;
        }

        return new strategy(this.module, this.config);
    }

}


// class UrlImageUploadStrategy extends BaseUploadStrategy {

// }

// class UrlImageUpdateStrategy {

// }
class BaseUploadStrategy {
    constructor(module, config) {
        this.module = module;
        this.config = config;
    }

    defaultPasteIndex(module) {
        const selection = module.quill.getSelection();
        return selection?.index ?? module.quill.getLength();
    }

    pasteImage() {

    }
}

class addImageByUrlStrategy extends BaseUploadStrategy {
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

class BaseFileUploadStrategy extends BaseUploadStrategy {
    constructor(module, config) {
        super(module, config);

        this.useBase64 = this.shouldUseBase64();
    }

    pasteImage() {}

    shouldUseBase64() {}

    shouldClosePopupAfterUpload() {}

    closeDialogPopup(editorInstance, data) {
        editorInstance._formDialog.hide({ file: data.value[0] }, data.event);
    }

    base64UploadImpl(module, data) {
        base64Upload(module.quill, data.value);
        // this.closeDialogPopup(module.editorInstance, data);
    }

    serverUpload(module, data) {
        const imageUrl = this.config.uploadDirectory + '/' + data.value[0].name;
        const index = this.defaultPasteIndex(module);

        urlUpload(module.quill, index, { src: imageUrl });
    }

    uploadToServer(fileUploader, file) {
        // serverUpload(fileUploader, file);
    }

    isMixedUploadMode() {
        return false;
    }

    getUploadMode() {
        // return this.shouldUseBase64() ? 'useButtons' : 'instantly';
        return 'useButtons';
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
                            if(this.shouldUseBase64()) {
                                this.base64UploadImpl(this.module, data);
                            } else {
                                this.uploadToServer(data.component, data.value[0]);
                                this.serverUpload(this.module, data);
                            }


                            // console.log('value changed');
                        },
                        onUploaded: (data) => {
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

class Base64UploadStrategy extends BaseFileUploadStrategy {
    constructor(module, config) {
        super(module, config);
    }

    shouldUseBase64() {
        return true;
    }

    shouldClosePopupAfterUpload() {
        return true;
    }

    base64UploadImpl(module, data) {
        super.base64UploadImpl(module, data);
        if(this.shouldClosePopupAfterUpload()) {
            this.closeDialogPopup(module.editorInstance, data);
        }
    }

    // base64Upload(module, data) {
    //     this.base64Upload(module, data);
    // }


}

class ServerUploadStrategy extends BaseFileUploadStrategy {

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

class MixedUploadStrategy extends BaseFileUploadStrategy {
    // constructor(module, config) {
    //     super(module, config);
    // }

    shouldUseBase64() {
        return false;
    }

    isMixedUploadMode() {
        return true;
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

// function defaultPasteIndex(module) {
//     const selection = module.quill.getSelection();
//     return selection?.index ?? module.quill.getLength();
// }

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

export function urlUpload(quill, index, { src, width, height }) {

    // const index = defaultPasteIndex(module);


    // formData = updateFormDataDimensions(formData);
    quill.insertEmbed(index, 'extendedImage', { src, width, height }, USER_ACTION);
    quill.setSelection(index + 1, 0, USER_ACTION);
    // const range = quill.getSelection();
    // quill.getModule('uploader').upload(range, files);
}
