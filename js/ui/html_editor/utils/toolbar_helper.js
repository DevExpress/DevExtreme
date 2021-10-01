import $ from '../../../core/renderer';
import localizationMessage from '../../../localization/message';
import { showCellPropertiesForm, showTablePropertiesForm } from '../ui/tableForms';
import { getTableOperationHandler, hasEmbedContent } from './table_helper';
import { isDefined, isBoolean } from '../../../core/utils/type';


const USER_ACTION = 'user';
const SILENT_ACTION = 'silent';

const DIALOG_COLOR_CAPTION = 'dxHtmlEditor-dialogColorCaption';
const DIALOG_BACKGROUND_CAPTION = 'dxHtmlEditor-dialogBackgroundCaption';
const DIALOG_LINK_CAPTION = 'dxHtmlEditor-dialogLinkCaption';
const DIALOG_IMAGE_CAPTION = 'dxHtmlEditor-dialogImageCaption';
const DIALOG_TABLE_CAPTION = 'dxHtmlEditor-dialogInsertTableCaption';

const DIALOG_LINK_FIELD_URL = 'dxHtmlEditor-dialogLinkUrlField';
const DIALOG_LINK_FIELD_TEXT = 'dxHtmlEditor-dialogLinkTextField';
const DIALOG_LINK_FIELD_TARGET = 'dxHtmlEditor-dialogLinkTargetField';
const DIALOG_LINK_FIELD_TARGET_CLASS = 'dx-formdialog-field-target';

const DIALOG_IMAGE_FIELD_URL = 'dxHtmlEditor-dialogImageUrlField';
const DIALOG_IMAGE_FIELD_ALT = 'dxHtmlEditor-dialogImageAltField';
const DIALOG_IMAGE_FIELD_WIDTH = 'dxHtmlEditor-dialogImageWidthField';
const DIALOG_IMAGE_FIELD_HEIGHT = 'dxHtmlEditor-dialogImageHeightField';

function getFormatHandlers(module) {
    return {
        clear: ({ event }) => {
            const range = this.quill.getSelection();
            if(range) {
                module.saveValueChangeEvent(event);
                module.quill.removeFormat(range);
                module.updateFormatWidgets();
            }
        },
        link: prepareLinkHandler(module),
        image: prepareImageHandler(module),
        color: prepareColorClickHandler('color', module),
        background: prepareColorClickHandler('background', module),
        orderedList: prepareShortcutHandler('list', 'ordered', module),
        bulletList: prepareShortcutHandler('list', 'bullet', module),
        alignLeft: prepareShortcutHandler('align', 'left', module),
        alignCenter: prepareShortcutHandler('align', 'center', module),
        alignRight: prepareShortcutHandler('align', 'right', module),
        alignJustify: prepareShortcutHandler('align', 'justify', module),
        codeBlock: getDefaultClickHandler('code-block', module),
        undo: ({ event }) => {
            module.saveValueChangeEvent(event);
            module.quill.history.undo();
        },
        redo: ({ event }) => {
            module.saveValueChangeEvent(event);
            module.quill.history.redo();
        },
        increaseIndent: ({ event }) => {
            applyFormat(['indent', '+1', USER_ACTION], event, module);
        },
        decreaseIndent: ({ event }) => {
            applyFormat(['indent', '-1', USER_ACTION], event, module);
        },
        superscript: prepareShortcutHandler('script', 'super', module),
        subscript: prepareShortcutHandler('script', 'sub', module),
        insertTable: prepareInsertTableHandler(module),
        insertHeaderRow: getTableOperationHandler(module.quill, 'insertHeaderRow'),
        insertRowAbove: getTableOperationHandler(module.quill, 'insertRowAbove'),
        insertRowBelow: getTableOperationHandler(module.quill, 'insertRowBelow'),
        insertColumnLeft: getTableOperationHandler(module.quill, 'insertColumnLeft'),
        insertColumnRight: getTableOperationHandler(module.quill, 'insertColumnRight'),
        deleteColumn: getTableOperationHandler(module.quill, 'deleteColumn'),
        deleteRow: getTableOperationHandler(module.quill, 'deleteRow'),
        deleteTable: getTableOperationHandler(module.quill, 'deleteTable'),
        cellProperties: () => {
            const domNode = getTargetTableNode(module.quill, 'cell');
            showCellPropertiesForm(module.editorInstance, $(domNode));
        },
        tableProperties: () => {
            const domNode = getTargetTableNode(module.quill, 'table');
            showTablePropertiesForm(module.editorInstance, $(domNode));
        }
    };
}

function applyFormat(formatArgs, event, module) {
    module.editorInstance._saveValueChangeEvent(event);
    module.quill.format(...formatArgs);
}

function getTargetTableNode(partName, module) {
    const currentSelectionParts = module.quill.getModule('table').getTable();
    return partName === 'table' ? currentSelectionParts[0].domNode : currentSelectionParts[2].domNode;
}


function prepareLinkHandler(module) {
    return () => {
        module.quill.focus();

        const selection = module.quill.getSelection();
        const hasEmbedContent = hasEmbedContent(selection, module);
        const formats = selection ? module.quill.getFormat() : {};
        const formData = {
            href: formats.link || '',
            text: selection && !hasEmbedContent ? module.quill.getText(selection) : '',
            target: Object.prototype.hasOwnProperty.call(formats, 'target') ? !!formats.target : true
        };
        module.editorInstance.formDialogOption('title', localizationMessage.format(DIALOG_LINK_CAPTION));

        const promise = module.editorInstance.showFormDialog({
            formData: formData,
            items: getLinkFormItems(selection)
        });

        promise.done((formData, event) => {
            if(selection && !hasEmbedContent) {
                const text = formData.text || formData.href;
                const { index, length } = selection;

                formData.text = undefined;
                module.saveValueChangeEvent(event);

                length && module.quill.deleteText(index, length, SILENT_ACTION);
                module.quill.insertText(index, text, 'link', formData, USER_ACTION);
                module.quill.setSelection(index + text.length, 0, USER_ACTION);
            } else {
                formData.text = !selection && !formData.text ? formData.href : formData.text;
                module.applyFormat(['link', formData, USER_ACTION], event, this.quill);
            }
        });

        promise.fail(() => {
            module.quill.focus();
        });
    };
}

function prepareImageHandler(module) {
    return () => {
        const formData = this.quill.getFormat();
        const isUpdateDialog = Object.prototype.hasOwnProperty.call(formData, 'imageSrc');
        const defaultIndex = defaultPasteIndex();

        if(isUpdateDialog) {
            const { imageSrc } = this.quill.getFormat(defaultIndex - 1, 1);

            formData.src = formData.imageSrc;
            delete formData.imageSrc;

            if(!imageSrc || defaultIndex === 0) {
                module.quill.setSelection(defaultIndex + 1, 0, SILENT_ACTION);
            }
        }

        const formatIndex = embedFormatIndex();

        module.editorInstance.formDialogOption('title', localizationMessage.format(DIALOG_IMAGE_CAPTION));

        const promise = module.editorInstance.showFormDialog({
            formData: formData,
            items: imageFormItems()
        });

        promise
            .done((formData, event) => {
                let index = defaultIndex;

                module.saveValueChangeEvent(event);

                if(isUpdateDialog) {
                    index = formatIndex;
                    module.quill.deleteText(index, 1, SILENT_ACTION);
                }

                module.quill.insertEmbed(index, 'extendedImage', formData, USER_ACTION);
                module.quill.setSelection(index + 1, 0, USER_ACTION);
            })
            .always(() => {
                module.quill.focus();
            });
    };
}

function getLinkFormItems(selection) {
    return [
        { dataField: 'href', label: { text: localizationMessage.format(DIALOG_LINK_FIELD_URL) } },
        {
            dataField: 'text',
            label: { text: localizationMessage.format(DIALOG_LINK_FIELD_TEXT) },
            visible: !hasEmbedContent(selection)
        },
        {
            dataField: 'target',
            editorType: 'dxCheckBox',
            editorOptions: {
                text: localizationMessage.format(DIALOG_LINK_FIELD_TARGET)
            },
            cssClass: DIALOG_LINK_FIELD_TARGET_CLASS,
            label: { visible: false }
        }
    ];
}

function embedFormatIndex() {
    const selection = this.quill.getSelection();

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

function defaultPasteIndex() {
    const selection = this.quill.getSelection();
    return selection?.index ?? this.quill.getLength();
}

function imageFormItems() {
    return [
        { dataField: 'src', label: { text: localizationMessage.format(DIALOG_IMAGE_FIELD_URL) } },
        { dataField: 'width', label: { text: localizationMessage.format(DIALOG_IMAGE_FIELD_WIDTH) } },
        { dataField: 'height', label: { text: localizationMessage.format(DIALOG_IMAGE_FIELD_HEIGHT) } },
        { dataField: 'alt', label: { text: localizationMessage.format(DIALOG_IMAGE_FIELD_ALT) } }
    ];
}

function prepareColorClickHandler(name, quill, editorInstance) {
    return () => {
        const formData = quill.getFormat();
        const caption = name === 'color' ? DIALOG_COLOR_CAPTION : DIALOG_BACKGROUND_CAPTION;
        editorInstance.formDialogOption('title', localizationMessage.format(caption));
        const promise = editorInstance.showFormDialog({
            formData: formData,
            items: [{
                dataField: name,
                editorType: 'dxColorView',
                editorOptions: {
                    focusStateEnabled: false
                },
                label: { visible: false }
            }]
        });

        promise.done((formData, event) => {
            this.applyFormat([name, formData[name], USER_ACTION], event, quill);
        });
        promise.fail(() => {
            quill.focus();
        });
    };
}

function prepareShortcutHandler(name, shortcutValue, quill, editorInstance) {
    return ({ event }) => {
        const formats = quill.getFormat();
        const value = formats[name] === shortcutValue ? false : shortcutValue;

        this.applyFormat.bind(this)([name, value, USER_ACTION], event, quill, editorInstance);
        this.updateFormatWidgets(true);
    };
}

function getDefaultClickHandler(name, quill, editorInstance) {
    return ({ event }) => {
        const formats = quill.getFormat();
        const value = formats[name];
        const newValue = !(isBoolean(value) ? value : isDefined(value));

        this.applyFormat.bind(this)([name, newValue, USER_ACTION], event, quill, editorInstance);

        this._updateFormatWidget(name, newValue, formats);
    };
}

function prepareInsertTableHandler(quill) {
    return () => {
        const formats = quill.getFormat();
        const isTableFocused = this._tableFormats.some(
            format => Object.prototype.hasOwnProperty.call(formats, format)
        );
        const formData = { rows: 1, columns: 1 };

        if(isTableFocused) {
            quill.focus();
            return;
        }

        this.editorInstance.formDialogOption('title', localizationMessage.format(DIALOG_TABLE_CAPTION));

        const promise = this.editorInstance.showFormDialog({
            formData,
            items: this._insertTableFormItems
        });

        promise
            .done((formData, event) => {
                quill.focus();

                const table = quill.getModule('table');
                if(table) {
                    this.saveValueChangeEvent(event);

                    const { columns, rows } = formData;
                    table.insertTable(columns, rows);
                }
            })
            .always(() => {
                quill.focus();
            });
    };
}

export {
    getFormatHandlers
};
