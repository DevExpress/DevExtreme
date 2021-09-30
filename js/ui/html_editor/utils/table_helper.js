import $ from '../../../core/renderer';
import { isDefined, isBoolean } from '../../../core/utils/type';
import { each } from '../../../core/utils/iterator';
import { showCellPropertiesForm, showTablePropertiesForm } from '../ui/tableForms';
import localizationMessage from '../../../localization/message';

const TABLE_FORMATS = ['table', 'tableHeaderCell'];
const TABLE_OPERATIONS = [
    'insertTable',
    'insertHeaderRow',
    'insertRowAbove',
    'insertRowBelow',
    'insertColumnLeft',
    'insertColumnRight',
    'deleteColumn',
    'deleteRow',
    'deleteTable',
    'cellProperties',
    'tableProperties'
];

const USER_ACTION = 'user';
const SILENT_ACTION = 'silent';

const DIALOG_COLOR_CAPTION = 'dxHtmlEditor-dialogColorCaption';
const DIALOG_BACKGROUND_CAPTION = 'dxHtmlEditor-dialogBackgroundCaption';
const DIALOG_LINK_CAPTION = 'dxHtmlEditor-dialogLinkCaption';
const DIALOG_IMAGE_CAPTION = 'dxHtmlEditor-dialogImageCaption';
const DIALOG_TABLE_CAPTION = 'dxHtmlEditor-dialogInsertTableCaption';

function getTargetTableNode(quill, partName) {
    const currentSelectionParts = quill.getModule('table').getTable();
    return partName === 'table' ? currentSelectionParts[0].domNode : currentSelectionParts[2].domNode;
}

function getTableFormats(quill) {
    const tableModule = quill.getModule('table');

    // backward compatibility with an old devextreme-quill packages
    return tableModule?.tableFormats ? tableModule.tableFormats() : TABLE_FORMATS;
}

function applyFormat(formatArgs, event, quill, editorInstance) {
    editorInstance.saveValueChangeEvent(event);
    quill.format(...formatArgs);
}

function prepareLinkHandler(quill) {
    return () => {
        quill.focus();

        const selection = quill.getSelection();
        const hasEmbedContent = this._hasEmbedContent(selection);
        const formats = selection ? quill.getFormat() : {};
        const formData = {
            href: formats.link || '',
            text: selection && !hasEmbedContent ? quill.getText(selection) : '',
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
                quill.insertText(index, text, 'link', formData, USER_ACTION);
                quill.setSelection(index + text.length, 0, USER_ACTION);
            } else {
                formData.text = !selection && !formData.text ? formData.href : formData.text;
                applyFormat(['link', formData, USER_ACTION], event, quill, this.editorInstance);
            }
        });

        promise.fail(() => {
            quill.focus();
        });
    };
}

function prepareImageHandler() {
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

        this.editorInstance.formDialogOption('title', localizationMessage.format(DIALOG_IMAGE_CAPTION));

        const promise = this.editorInstance.showFormDialog({
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

function prepareColorClickHandler(name, quill) {
    return () => {
        const formData = quill.getFormat();
        const caption = name === 'color' ? DIALOG_COLOR_CAPTION : DIALOG_BACKGROUND_CAPTION;
        this.editorInstance.formDialogOption('title', localizationMessage.format(caption));
        const promise = this.editorInstance.showFormDialog({
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
            applyFormat([name, formData[name], USER_ACTION], event, quill, this.editorInstance);
        });
        promise.fail(() => {
            quill.focus();
        });
    };
}

function prepareShortcutHandler(name, shortcutValue, quill) {
    return ({ event }) => {
        const formats = quill.getFormat();
        const value = formats[name] === shortcutValue ? false : shortcutValue;

        applyFormat([name, value, USER_ACTION], event, quill, this.editorInstance);
        this.updateFormatWidgets(true);
    };
}

function getDefaultClickHandler(name, quill) {
    return ({ event }) => {
        const formats = quill.getFormat();
        const value = formats[name];
        const newValue = !(isBoolean(value) ? value : isDefined(value));

        applyFormat([name, newValue, USER_ACTION], event, quill, this.editorInstance);

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

function getFormatHandlers() {
    return {
        clear: ({ event }) => {
            const range = this.quill.getSelection();
            if(range) {
                this.saveValueChangeEvent(event);
                this.quill.removeFormat(range);
                this.updateFormatWidgets();
            }
        },
        link: prepareLinkHandler(this.quill).bind(this),
        image: prepareImageHandler(this.quill).bind(this),
        color: prepareColorClickHandler('color', this.quill).bind(this),
        background: prepareColorClickHandler('background', this.quill).bind(this),
        orderedList: prepareShortcutHandler('list', 'ordered', this.quill),
        bulletList: prepareShortcutHandler('list', 'bullet', this.quill).bind(this),
        alignLeft: prepareShortcutHandler('align', 'left', this.quill).bind(this),
        alignCenter: prepareShortcutHandler('align', 'center', this.quill).bind(this),
        alignRight: prepareShortcutHandler('align', 'right', this.quill).bind(this),
        alignJustify: prepareShortcutHandler('align', 'justify', this.quill).bind(this),
        codeBlock: getDefaultClickHandler('code-block', this.quill).bind(this),
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
        superscript: prepareShortcutHandler('script', 'super', this.quill).bind(this),
        subscript: prepareShortcutHandler('script', 'sub', this.quill).bind(this),
        insertTable: prepareInsertTableHandler(this.quill, this.quill).bind(this),
        insertHeaderRow: getTableOperationHandler(this.quill, 'insertHeaderRow'),
        insertRowAbove: getTableOperationHandler(this.quill, 'insertRowAbove'),
        insertRowBelow: getTableOperationHandler(this.quill, 'insertRowBelow'),
        insertColumnLeft: getTableOperationHandler(this.quill, 'insertColumnLeft'),
        insertColumnRight: getTableOperationHandler(this.quill, 'insertColumnRight'),
        deleteColumn: getTableOperationHandler(this.quill, 'deleteColumn'),
        deleteRow: getTableOperationHandler(this.quill, 'deleteRow'),
        deleteTable: getTableOperationHandler(this.quill, 'deleteTable'),
        cellProperties: () => {
            const domNode = getTargetTableNode(this.quill, 'cell');
            showCellPropertiesForm(this.editorInstance, $(domNode));
        },
        tableProperties: () => {
            const domNode = getTargetTableNode(this.quill, 'table');
            showTablePropertiesForm(this.editorInstance, $(domNode));
        }
    };
}


function getTableOperationHandler(quill, operationName, ...rest) {
    return () => {
        const table = quill.getModule('table');

        if(!table) {
            return;
        }
        quill.focus();
        return table[operationName](...rest);
    };
}

function unfixTableWidth($table) {
    $table.css('width', 'initial');
}

function getColumnElements($table, index = 0) {
    return $table.find('tr').eq(index).find('th, td');
}

function getAutoSizedElements($table, direction = 'horizontal') {
    const result = [];
    const isHorizontal = direction === 'horizontal';
    const $lineElements = isHorizontal ? getColumnElements($table) : getRowElements($table);

    $lineElements.each((index, element) => {
        const $element = $(element);
        if(!isDefined($element.attr(isHorizontal ? 'width' : 'height'))) {
            result.push($element);
        }
    });

    return result;
}

function setLineElementsAttrValue($lineElements, property, value) {
    each($lineElements, (i, element) => {
        $(element).attr(property, value + 'px');
    });
}

function getLineElements($table, index, direction = 'horizontal') {
    return direction === 'horizontal' ? getRowElements($table, index) : getColumnElements($table, index);
}

function getRowElements($table, index = 0) {
    return $table.find(`th:nth-child(${(1 + index)}), td:nth-child(${(1 + index)})`);
}

export {
    TABLE_OPERATIONS,
    getTableFormats,
    getTableOperationHandler,
    unfixTableWidth,
    getColumnElements,
    getAutoSizedElements,
    setLineElementsAttrValue,
    getLineElements,
    getRowElements,
    getFormatHandlers
};
