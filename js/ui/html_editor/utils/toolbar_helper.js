import $ from '../../../core/renderer';
import localizationMessage from '../../../localization/message';
import { showCellPropertiesForm, showTablePropertiesForm } from '../ui/tableForms';
// import { getTableOperationHandler } from './table_helper';
import { isDefined, isBoolean } from '../../../core/utils/type';


const USER_ACTION = 'user';
const SILENT_ACTION = 'silent';

const DIALOG_COLOR_CAPTION = 'dxHtmlEditor-dialogColorCaption';
const DIALOG_BACKGROUND_CAPTION = 'dxHtmlEditor-dialogBackgroundCaption';
const DIALOG_LINK_CAPTION = 'dxHtmlEditor-dialogLinkCaption';
const DIALOG_IMAGE_CAPTION = 'dxHtmlEditor-dialogImageCaption';
const DIALOG_TABLE_CAPTION = 'dxHtmlEditor-dialogInsertTableCaption';

class FormatHelper {
    constructor(module) {
        this.module = module;
        this.editorInstance = module.editorInstance;
        this.quill = module.quill;
    }

    getFormatHandlers(module) {
        return {
            clear: ({ event }) => {
                const range = this.quill.getSelection();
                if(range) {
                    this.saveValueChangeEvent(event);
                    this.quill.removeFormat(range);
                    this.updateFormatWidgets();
                }
            },
            link: this.prepareLinkHandler(this.quill, this.editorInstance).bind(this),
            image: this.prepareImageHandler(this.quill, this.editorInstance),
            color: this.prepareColorClickHandler('color', this.quill, this.editorInstance).bind(this),
            background: this.prepareColorClickHandler('background', this.quill, this.editorInstance).bind(this),
            orderedList: this.prepareShortcutHandler('list', 'ordered', this.quill, this.editorInstance).bind(this),
            bulletList: this.prepareShortcutHandler('list', 'bullet', this.quill, this.editorInstance).bind(this),
            alignLeft: this.prepareShortcutHandler('align', 'left', this.quill, this.editorInstance).bind(this),
            alignCenter: this.prepareShortcutHandler('align', 'center', this.quill, this.editorInstance).bind(this),
            alignRight: this.prepareShortcutHandler('align', 'right', this.quill, this.editorInstance).bind(this),
            alignJustify: this.prepareShortcutHandler('align', 'justify', this.quill, this.editorInstance).bind(this),
            codeBlock: this.getDefaultClickHandler('code-block', this.quill, this.editorInstance).bind(this),
            undo: ({ event }) => {
                this.saveValueChangeEvent(event);
                this.quill.history.undo();
            },
            redo: ({ event }) => {
                this.saveValueChangeEvent(event);
                this.quill.history.redo();
            },
            increaseIndent: ({ event }) => {
                this._applyFormat(['indent', '+1', USER_ACTION], event);
            },
            decreaseIndent: ({ event }) => {
                this._applyFormat(['indent', '-1', USER_ACTION], event);
            },
            superscript: this.prepareShortcutHandler('script', 'super', this.quill, this.editorInstance),
            subscript: this.prepareShortcutHandler('script', 'sub', this.quill, this.editorInstance),
            insertTable: this.prepareInsertTableHandler(this.quill, this.quill).bind(this),
            insertHeaderRow: this.getTableOperationHandler(this.quill, 'insertHeaderRow'),
            insertRowAbove: this.getTableOperationHandler(this.quill, 'insertRowAbove'),
            insertRowBelow: this.getTableOperationHandler(this.quill, 'insertRowBelow'),
            insertColumnLeft: this.getTableOperationHandler(this.quill, 'insertColumnLeft'),
            insertColumnRight: this.getTableOperationHandler(this.quill, 'insertColumnRight'),
            deleteColumn: this.getTableOperationHandler(this.quill, 'deleteColumn'),
            deleteRow: this.getTableOperationHandler(this.quill, 'deleteRow'),
            deleteTable: this.getTableOperationHandler(this.quill, 'deleteTable'),
            cellProperties: () => {
                const domNode = this.getTargetTableNode(this.quill, 'cell');
                showCellPropertiesForm(this.editorInstance, $(domNode));
            },
            tableProperties: () => {
                const domNode = this.getTargetTableNode(this.quill, 'table');
                showTablePropertiesForm(this.editorInstance, $(domNode));
            }
        };
    }

    applyFormat(formatArgs, event) {
        this.editorInstance._saveValueChangeEvent(event);
        this.quill.format(...formatArgs);
    }

    getTargetTableNode(partName) {
        const currentSelectionParts = this.quill.getModule('table').getTable();
        return partName === 'table' ? currentSelectionParts[0].domNode : currentSelectionParts[2].domNode;
    }

    prepareLinkHandler() {
        return () => {
            this.quill.focus();

            const selection = this.quill.getSelection();
            const hasEmbedContent = this._hasEmbedContent(selection);
            const formats = selection ? this.quill.getFormat() : {};
            const formData = {
                href: formats.link || '',
                text: selection && !hasEmbedContent ? this.quill.getText(selection) : '',
                target: Object.prototype.hasOwnProperty.call(formats, 'target') ? !!formats.target : true
            };
            this.editorInstance.formDialogOption('title', localizationMessage.format(DIALOG_LINK_CAPTION));

            const promise = this.editorInstance.showFormDialog({
                formData: formData,
                items: this._getLinkFormItems(selection)
            });

            promise.done((formData, event) => {
                if(selection && !hasEmbedContent) {
                    const text = formData.text || formData.href;
                    const { index, length } = selection;

                    formData.text = undefined;
                    this.saveValueChangeEvent(event);

                    length && this.quill.deleteText(index, length, SILENT_ACTION);
                    this.quill.insertText(index, text, 'link', formData, USER_ACTION);
                    this.quill.setSelection(index + text.length, 0, USER_ACTION);
                } else {
                    formData.text = !selection && !formData.text ? formData.href : formData.text;
                    this.applyFormat.bind(this)(['link', formData, USER_ACTION], event, this.quill);
                }
            });

            promise.fail(() => {
                this.quill.focus();
            });
        };
    }

    prepareImageHandler(editorInstance) {
        return () => {
            const formData = this.quill.getFormat();
            const isUpdateDialog = Object.prototype.hasOwnProperty.call(formData, 'imageSrc');
            const defaultIndex = this._defaultPasteIndex;

            if(isUpdateDialog) {
                const { imageSrc } = this.quill.getFormat(defaultIndex - 1, 1);

                formData.src = formData.imageSrc;
                delete formData.imageSrc;

                if(!imageSrc || defaultIndex === 0) {
                    this.quill.setSelection(defaultIndex + 1, 0, SILENT_ACTION);
                }
            }

            const formatIndex = this._embedFormatIndex;

            editorInstance.formDialogOption('title', localizationMessage.format(DIALOG_IMAGE_CAPTION));

            const promise = editorInstance.showFormDialog({
                formData: formData,
                items: this._imageFormItems
            });

            promise
                .done((formData, event) => {
                    let index = defaultIndex;

                    this.saveValueChangeEvent(event);

                    if(isUpdateDialog) {
                        index = formatIndex;
                        this.quill.deleteText(index, 1, SILENT_ACTION);
                    }

                    this.quill.insertEmbed(index, 'extendedImage', formData, USER_ACTION);
                    this.quill.setSelection(index + 1, 0, USER_ACTION);
                })
                .always(() => {
                    this.quill.focus();
                });
        };
    }

    prepareColorClickHandler(name, quill, editorInstance) {
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
                this.applyFormat.bind(this)([name, formData[name], USER_ACTION], event, quill);
            });
            promise.fail(() => {
                quill.focus();
            });
        };
    }

    prepareShortcutHandler(name, shortcutValue, quill, editorInstance) {
        return ({ event }) => {
            const formats = quill.getFormat();
            const value = formats[name] === shortcutValue ? false : shortcutValue;

            this.applyFormat.bind(this)([name, value, USER_ACTION], event, quill, editorInstance);
            this.updateFormatWidgets(true);
        };
    }

    getDefaultClickHandler(name, quill, editorInstance) {
        return ({ event }) => {
            const formats = quill.getFormat();
            const value = formats[name];
            const newValue = !(isBoolean(value) ? value : isDefined(value));

            this.applyFormat.bind(this)([name, newValue, USER_ACTION], event, quill, editorInstance);

            this._updateFormatWidget(name, newValue, formats);
        };
    }

    prepareInsertTableHandler(quill) {
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

}

function getFormatHandlers() {

}

export {
    getFormatHandlers,
    FormatHelper
};
