import $ from '../../../core/renderer';
import localizationMessage from '../../../localization/message';
import { getTableOperationHandler, hasEmbedContent, unfixTableWidth, getColumnElements, getAutoSizedElements, setLineElementsAttrValue, getLineElements, getRowElements } from './table_helper';
import { isDefined, isBoolean } from '../../../core/utils/type';
import { each } from '../../../core/utils/iterator';

import Form from '../../form';
import ButtonGroup from '../../button_group';
import ColorBox from '../../color_box';
import ScrollView from '../../scroll_view';

import { getOuterHeight, getOuterWidth } from '../../../core/utils/size';

import { getWindow } from '../../../core/utils/window';

const MIN_HEIGHT = 400;
const BORDER_STYLES = ['none', 'hidden', 'dotted', 'dashed', 'solid', 'double', 'groove', 'ridge', 'inset', 'outset'];

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


const DIALOG_TABLE_FIELD_COLUMNS = 'dxHtmlEditor-dialogInsertTableRowsField';
const DIALOG_TABLE_FIELD_ROWS = 'dxHtmlEditor-dialogInsertTableColumnsField';

const ICON_MAP = {
    insertHeaderRow: 'header',
    clear: 'clearformat'
};

function getFormatHandlers(module) {
    return {
        clear: ({ event }) => {
            const range = module.quill.getSelection();
            if(range) {
                module.saveValueChangeEvent(event);
                module.quill.removeFormat(range);
                getToolbarModule(module)?.updateFormatWidgets();
            }
        },
        link: prepareLinkHandler(module),
        image: prepareImageHandler(module),
        color: prepareColorClickHandler(module, 'color'),
        background: prepareColorClickHandler(module, 'background'),
        orderedList: prepareShortcutHandler(module, 'list', 'ordered'),
        bulletList: prepareShortcutHandler(module, 'list', 'bullet'),
        alignLeft: prepareShortcutHandler(module, 'align', 'left'),
        alignCenter: prepareShortcutHandler(module, 'align', 'center'),
        alignRight: prepareShortcutHandler(module, 'align', 'right'),
        alignJustify: prepareShortcutHandler(module, 'align', 'justify'),
        codeBlock: getDefaultClickHandler(module, 'code-block'),
        undo: ({ event }) => {
            module.saveValueChangeEvent(event);
            module.quill.history.undo();
        },
        redo: ({ event }) => {
            module.saveValueChangeEvent(event);
            module.quill.history.redo();
        },
        increaseIndent: ({ event }) => {
            applyFormat(module, ['indent', '+1', USER_ACTION], event);
        },
        decreaseIndent: ({ event }) => {
            applyFormat(module, ['indent', '-1', USER_ACTION], event);
        },
        superscript: prepareShortcutHandler(module, 'script', 'super'),
        subscript: prepareShortcutHandler(module, 'script', 'sub'),
        insertTable: prepareInsertTableHandler(module),
        insertHeaderRow: getTableOperationHandler(module.quill, 'insertHeaderRow'),
        insertRowAbove: getTableOperationHandler(module.quill, 'insertRowAbove'),
        insertRowBelow: getTableOperationHandler(module.quill, 'insertRowBelow'),
        insertColumnLeft: getTableOperationHandler(module.quill, 'insertColumnLeft'),
        insertColumnRight: getTableOperationHandler(module.quill, 'insertColumnRight'),
        deleteColumn: getTableOperationHandler(module.quill, 'deleteColumn'),
        deleteRow: getTableOperationHandler(module.quill, 'deleteRow'),
        deleteTable: getTableOperationHandler(module.quill, 'deleteTable'),
        cellProperties: prepareShowFormProperties(module, 'cell'),
        tableProperties: prepareShowFormProperties(module, 'table')
    };
}

function prepareShowFormProperties(module, type) {
    return ($element) => {
        if(!$element?.length) {
            $element = $(getTargetTableNode(module, type));
        }

        const tablePropertiesFormConfig = getFormConfigConstructor(type)(module.editorInstance, $element);

        let formInstance;

        module.editorInstance.formDialogOption({
            'contentTemplate': (container) => {
                const $content = $('<div>').appendTo(container);
                const $form = $('<div>').appendTo($content);
                module.editorInstance._createComponent($form, Form, tablePropertiesFormConfig.formOptions);
                module.editorInstance._createComponent($content, ScrollView, {});
                formInstance = $form.dxForm('instance');

                return $content;
            },
            title: localizationMessage.format(`dxHtmlEditor-${type}Properties`),
            minHeight: MIN_HEIGHT
        });

        const promise = module.editorInstance.showFormDialog();

        promise.done((formData, event) => {
            module.saveValueChangeEvent(event);
            tablePropertiesFormConfig.applyHandler(formInstance);
            formInstance.dispose();
        });

        promise.fail(() => {
            module.quill.focus();
            formInstance.dispose();
        });
    };
}

function applyFormat(module, formatArgs, event) {
    module.editorInstance._saveValueChangeEvent(event);
    module.quill.format(...formatArgs);
}

function getTargetTableNode(module, partName) {
    const currentSelectionParts = module.quill.getModule('table').getTable();
    return partName === 'table' ? currentSelectionParts[0].domNode : currentSelectionParts[2].domNode;
}


function prepareLinkHandler(module) {
    return () => {
        module.quill.focus();

        const selection = module.quill.getSelection();
        const selectionHasEmbedContent = hasEmbedContent(module, selection);
        const formats = selection ? module.quill.getFormat() : {};
        const formData = {
            href: formats.link || '',
            text: selection && !selectionHasEmbedContent ? module.quill.getText(selection) : '',
            target: Object.prototype.hasOwnProperty.call(formats, 'target') ? !!formats.target : true
        };
        module.editorInstance.formDialogOption('title', localizationMessage.format(DIALOG_LINK_CAPTION));

        const promise = module.editorInstance.showFormDialog({
            formData: formData,
            items: getLinkFormItems(module, selection)
        });

        promise.done((formData, event) => {
            if(selection && !selectionHasEmbedContent) {
                const text = formData.text || formData.href;
                const { index, length } = selection;

                formData.text = undefined;
                module.saveValueChangeEvent(event);

                length && module.quill.deleteText(index, length, SILENT_ACTION);
                module.quill.insertText(index, text, 'link', formData, USER_ACTION);
                module.quill.setSelection(index + text.length, 0, USER_ACTION);
            } else {
                formData.text = !selection && !formData.text ? formData.href : formData.text;
                applyFormat(module, ['link', formData, USER_ACTION], event);
            }
        });

        promise.fail(() => {
            module.quill.focus();
        });
    };
}

function prepareImageHandler(module) {
    return () => {
        const formData = module.quill.getFormat();
        const isUpdateDialog = Object.prototype.hasOwnProperty.call(formData, 'imageSrc');
        const defaultIndex = defaultPasteIndex(module);

        if(isUpdateDialog) {
            const { imageSrc } = module.quill.getFormat(defaultIndex - 1, 1);

            formData.src = formData.imageSrc;
            delete formData.imageSrc;

            if(!imageSrc || defaultIndex === 0) {
                module.quill.setSelection(defaultIndex + 1, 0, SILENT_ACTION);
            }
        }

        const formatIndex = embedFormatIndex(module);

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

function getLinkFormItems(module, selection) {
    return [
        { dataField: 'href', label: { text: localizationMessage.format(DIALOG_LINK_FIELD_URL) } },
        {
            dataField: 'text',
            label: { text: localizationMessage.format(DIALOG_LINK_FIELD_TEXT) },
            visible: !hasEmbedContent(module, selection)
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

function embedFormatIndex(module) {
    const selection = module.quill.getSelection();

    if(selection) {
        if(selection.length) {
            return selection.index;
        } else {
            return selection.index - 1;
        }
    } else {
        return module.quill.getLength();
    }
}

function defaultPasteIndex(module) {
    const selection = module.quill.getSelection();
    return selection?.index ?? module.quill.getLength();
}

function imageFormItems() {
    return [
        { dataField: 'src', label: { text: localizationMessage.format(DIALOG_IMAGE_FIELD_URL) } },
        { dataField: 'width', label: { text: localizationMessage.format(DIALOG_IMAGE_FIELD_WIDTH) } },
        { dataField: 'height', label: { text: localizationMessage.format(DIALOG_IMAGE_FIELD_HEIGHT) } },
        { dataField: 'alt', label: { text: localizationMessage.format(DIALOG_IMAGE_FIELD_ALT) } }
    ];
}

function prepareColorClickHandler(module, name) {
    return () => {
        const formData = module.quill.getFormat();
        const caption = name === 'color' ? DIALOG_COLOR_CAPTION : DIALOG_BACKGROUND_CAPTION;
        module.editorInstance.formDialogOption('title', localizationMessage.format(caption));
        const promise = module.editorInstance.showFormDialog({
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
            applyFormat(module, [name, formData[name], USER_ACTION], event);
        });
        promise.fail(() => {
            module.quill.focus();
        });
    };
}

function prepareShortcutHandler(module, name, shortcutValue) {
    return ({ event }) => {
        const formats = module.quill.getFormat();
        const value = formats[name] === shortcutValue ? false : shortcutValue;

        applyFormat(module, [name, value, USER_ACTION], event);

        getToolbarModule(module)?.updateFormatWidgets(true);
    };
}

function getToolbarModule(module) {
    return module._updateFormatWidget ? module : module.quill.getModule('toolbar');
}

function getDefaultClickHandler(module, name) {
    return ({ event }) => {
        const formats = module.quill.getFormat();
        const value = formats[name];
        const newValue = !(isBoolean(value) ? value : isDefined(value));

        applyFormat(module, [name, newValue, USER_ACTION], event);

        getToolbarModule(module)?._updateFormatWidget(name, newValue, formats);
    };
}

function insertTableFormItems() {
    return [
        {
            dataField: 'columns',
            editorType: 'dxNumberBox',
            editorOptions: {
                min: 1
            },
            label: { text: localizationMessage.format(DIALOG_TABLE_FIELD_COLUMNS) }
        },
        {
            dataField: 'rows',
            editorType: 'dxNumberBox',
            editorOptions: {
                min: 1
            },
            label: { text: localizationMessage.format(DIALOG_TABLE_FIELD_ROWS) }
        }
    ];
}

function prepareInsertTableHandler(module) {
    return () => {
        const formats = module.quill.getFormat();
        const isTableFocused = module._tableFormats.some(
            format => Object.prototype.hasOwnProperty.call(formats, format)
        );
        const formData = { rows: 1, columns: 1 };

        if(isTableFocused) {
            module.quill.focus();
            return;
        }

        module.editorInstance.formDialogOption('title', localizationMessage.format(DIALOG_TABLE_CAPTION));

        const promise = module.editorInstance.showFormDialog({
            formData,
            items: insertTableFormItems()
        });

        promise
            .done((formData, event) => {
                module.quill.focus();

                const table = module.quill.getModule('table');
                if(table) {
                    module.saveValueChangeEvent(event);

                    const { columns, rows } = formData;
                    table.insertTable(columns, rows);
                }
            })
            .always(() => {
                module.quill.focus();
            });
    };
}

function getTablePropertiesFormConfig(editorInstance, $table) {
    const window = getWindow();
    let alignmentEditorInstance;
    let borderColorEditorInstance;
    let backgroundColorEditorInstance;
    const startTableWidth = getOuterWidth($table);
    const tableStyles = window.getComputedStyle($table.get(0));
    const startTextAlign = tableStyles.textAlign === 'start' ? 'left' : tableStyles.textAlign;

    const formOptions = {
        colCount: 2,
        formData: {
            width: startTableWidth,
            height: getOuterHeight($table),
            backgroundColor: tableStyles.backgroundColor,
            borderStyle: tableStyles.borderStyle,
            borderColor: tableStyles.borderColor,
            borderWidth: parseInt(tableStyles.borderWidth),
            alignment: startTextAlign
        },
        items: [{
            itemType: 'group',
            caption: localizationMessage.format('dxHtmlEditor-border'),
            colCountByScreen: {
                xs: 2
            },
            colCount: 2,
            items: [
                {
                    dataField: 'borderStyle',
                    label: { text: localizationMessage.format('dxHtmlEditor-style') },
                    editorType: 'dxSelectBox',
                    editorOptions: {
                        items: BORDER_STYLES,
                        placeholder: 'Select style'
                    }
                },
                {
                    dataField: 'borderWidth',
                    label: { text: localizationMessage.format('dxHtmlEditor-borderWidth') },
                    editorOptions: {
                        placeholder: localizationMessage.format('dxHtmlEditor-pixels')
                    }
                },
                {
                    itemType: 'simple',
                    dataField: 'borderColor',
                    label: { text: localizationMessage.format('dxHtmlEditor-borderColor') },
                    colSpan: 2,
                    template: (e) => {
                        const $content = $('<div>');
                        editorInstance._createComponent($content, ColorBox, {
                            editAlphaChannel: true,
                            value: e.component.option('formData').borderColor,
                            onInitialized: (e) => {
                                borderColorEditorInstance = e.component;
                            }
                        });
                        return $content;
                    }
                }
            ]
        }, {
            itemType: 'group',
            caption: localizationMessage.format('dxHtmlEditor-dimensions'),
            colCountByScreen: {
                xs: 2
            },
            colCount: 2,
            items: [
                {
                    dataField: 'width',
                    label: { text: localizationMessage.format('dxHtmlEditor-width') },
                    editorOptions: {
                        min: 0,
                        placeholder: localizationMessage.format('dxHtmlEditor-pixels')
                    }
                },
                {
                    dataField: 'height',
                    label: { text: localizationMessage.format('dxHtmlEditor-height') },
                    editorOptions: {
                        min: 0,
                        placeholder: localizationMessage.format('dxHtmlEditor-pixels')
                    }
                }
            ]
        }, {
            itemType: 'group',
            caption: localizationMessage.format('dxHtmlEditor-tableBackground'),
            items: [
                {
                    itemType: 'simple',
                    dataField: 'backgroundColor',
                    label: { text: localizationMessage.format('dxHtmlEditor-borderColor') },
                    template: (e) => {
                        const $content = $('<div>');
                        editorInstance._createComponent($content, ColorBox, {
                            editAlphaChannel: true,
                            value: e.component.option('formData').backgroundColor,
                            onInitialized: (e) => {
                                backgroundColorEditorInstance = e.component;
                            }
                        });
                        return $content;
                    }
                }
            ]
        }, {
            itemType: 'group',
            caption: localizationMessage.format('dxHtmlEditor-alignment'),
            items: [{
                itemType: 'simple',
                label: { text: localizationMessage.format('dxHtmlEditor-horizontal') },
                template: () => {
                    const $content = $('<div>');
                    editorInstance._createComponent($content, ButtonGroup, {
                        items: [{ value: 'left', icon: 'alignleft' }, { value: 'center', icon: 'aligncenter' }, { value: 'right', icon: 'alignright' }, { value: 'justify', icon: 'alignjustify' }],
                        keyExpr: 'value',
                        selectedItemKeys: [startTextAlign],
                        onInitialized: (e) => {
                            alignmentEditorInstance = e.component;
                        }
                    });
                    return $content;
                }
            }]
        }],
        showColonAfterLabel: true,
        labelLocation: 'top',
        minColWidth: 300
    };

    const applyHandler = (formInstance) => {
        const formData = formInstance.option('formData');
        const widthArg = formData.width === startTableWidth ? undefined : formData.width;
        applyTableDimensionChanges($table, formData.height, widthArg);
        $table.css({
            'backgroundColor': backgroundColorEditorInstance.option('value'),
            'borderStyle': formData.borderStyle,
            'borderColor': borderColorEditorInstance.option('value'),
            'borderWidth': formData.borderWidth,
            'textAlign': alignmentEditorInstance.option('selectedItemKeys')[0]
        });
    };

    return {
        formOptions,
        applyHandler
    };
}

function getCellPropertiesFormConfig(editorInstance, $cell) {
    const window = getWindow();
    let alignmentEditorInstance;
    let verticalAlignmentEditorInstance;
    let borderColorEditorInstance;
    let backgroundColorEditorInstance;

    const startCellWidth = getOuterWidth($cell);
    const cellStyles = window.getComputedStyle($cell.get(0));
    const startTextAlign = cellStyles.textAlign === 'start' ? 'left' : cellStyles.textAlign;

    const formOptions = {
        colCount: 2,
        formData: {
            width: startCellWidth,
            height: getOuterHeight($cell),
            backgroundColor: cellStyles.backgroundColor,
            borderStyle: cellStyles.borderStyle,
            borderColor: cellStyles.borderColor,
            borderWidth: parseInt(cellStyles.borderWidth),
            alignment: startTextAlign,
            verticalAlignment: cellStyles.verticalAlign,
            verticalPadding: parseInt(cellStyles.paddingTop),
            horizontalPadding: parseInt(cellStyles.paddingLeft),
        },
        items: [{
            itemType: 'group',
            caption: localizationMessage.format('dxHtmlEditor-border'),
            colCountByScreen: {
                xs: 2
            },
            colCount: 2,
            items: [
                {
                    dataField: 'borderStyle',
                    label: { text: localizationMessage.format('dxHtmlEditor-style') },
                    editorType: 'dxSelectBox',
                    editorOptions: {
                        items: BORDER_STYLES
                    }
                },
                {
                    dataField: 'borderWidth',
                    label: { text: localizationMessage.format('dxHtmlEditor-borderWidth') },
                    editorOptions: {
                        placeholder: localizationMessage.format('dxHtmlEditor-pixels')
                    }
                },
                {
                    itemType: 'simple',
                    dataField: 'borderColor',
                    colSpan: 2,
                    label: { text: localizationMessage.format('dxHtmlEditor-borderColor') },
                    template: (e) => {
                        const $content = $('<div>');
                        editorInstance._createComponent($content, ColorBox, {
                            editAlphaChannel: true,
                            value: e.component.option('formData').borderColor,
                            onInitialized: (e) => {
                                borderColorEditorInstance = e.component;
                            }
                        });
                        return $content;
                    }
                }
            ]
        }, {
            itemType: 'group',
            caption: localizationMessage.format('dxHtmlEditor-dimensions'),
            colCount: 2,
            colCountByScreen: {
                xs: 2
            },
            items: [
                {
                    dataField: 'width',
                    label: { text: localizationMessage.format('dxHtmlEditor-width') },
                    editorOptions: {
                        min: 0,
                        placeholder: localizationMessage.format('dxHtmlEditor-pixels')
                    }
                },
                {
                    dataField: 'height',
                    label: { text: localizationMessage.format('dxHtmlEditor-height') },
                    editorOptions: {
                        min: 0,
                        placeholder: localizationMessage.format('dxHtmlEditor-pixels')
                    }
                },
                {
                    dataField: 'verticalPadding',
                    label: { text: localizationMessage.format('dxHtmlEditor-paddingVertical') },
                    editorOptions: {
                        placeholder: localizationMessage.format('dxHtmlEditor-pixels')
                    }
                },
                {
                    label: { text: localizationMessage.format('dxHtmlEditor-paddingHorizontal') },
                    dataField: 'horizontalPadding',
                    editorOptions: {
                        placeholder: localizationMessage.format('dxHtmlEditor-pixels')
                    }
                }
            ]
        }, {
            itemType: 'group',
            caption: localizationMessage.format('dxHtmlEditor-tableBackground'),
            items: [
                {
                    itemType: 'simple',
                    dataField: 'backgroundColor',
                    label: { text: localizationMessage.format('dxHtmlEditor-borderColor') },
                    template: (e) => {
                        const $content = $('<div>');
                        editorInstance._createComponent($content, ColorBox, {
                            editAlphaChannel: true,
                            value: e.component.option('formData').backgroundColor,
                            onInitialized: (e) => {
                                backgroundColorEditorInstance = e.component;
                            }
                        });
                        return $content;
                    }
                }
            ]
        }, {
            itemType: 'group',
            caption: localizationMessage.format('dxHtmlEditor-alignment'),
            colCount: 2,
            items: [
                {
                    itemType: 'simple',
                    label: { text: localizationMessage.format('dxHtmlEditor-horizontal') },
                    template: () => {
                        const $content = $('<div>');
                        editorInstance._createComponent($content, ButtonGroup, {
                            items: [{ value: 'left', icon: 'alignleft' }, { value: 'center', icon: 'aligncenter' }, { value: 'right', icon: 'alignright' }, { value: 'justify', icon: 'alignjustify' }],
                            keyExpr: 'value',
                            selectedItemKeys: [startTextAlign],
                            onInitialized: (e) => {
                                alignmentEditorInstance = e.component;
                            }
                        });
                        return $content;
                    }
                }, {
                    itemType: 'simple',
                    label: { text: localizationMessage.format('dxHtmlEditor-vertical') },
                    template: () => {
                        const $content = $('<div>');
                        editorInstance._createComponent($content, ButtonGroup, {
                            items: [{ value: 'top', icon: 'verticalaligntop' }, { value: 'middle', icon: 'verticalaligncenter' }, { value: 'bottom', icon: 'verticalalignbottom' }],
                            keyExpr: 'value',
                            selectedItemKeys: [cellStyles.verticalAlign],
                            onInitialized: (e) => {
                                verticalAlignmentEditorInstance = e.component;
                            }
                        });
                        return $content;
                    }
                }
            ]
        }],
        showColonAfterLabel: true,
        labelLocation: 'top',
        minColWidth: 300
    };

    const applyHandler = (formInstance) => {
        const formData = formInstance.option('formData');
        const widthArg = formData.width === startCellWidth ? undefined : formData.width;
        applyCellDimensionChanges($cell, formData.height, widthArg);
        $cell.css({
            'backgroundColor': backgroundColorEditorInstance.option('value'),
            'borderStyle': formData.borderStyle,
            'borderColor': borderColorEditorInstance.option('value'),
            'borderWidth': formData.borderWidth + 'px',
            'textAlign': alignmentEditorInstance.option('selectedItemKeys')[0],
            'verticalAlign': verticalAlignmentEditorInstance.option('selectedItemKeys')[0],
            'paddingLeft': formData.horizontalPadding + 'px',
            'paddingRight': formData.horizontalPadding + 'px',
            'paddingTop': formData.verticalPadding + 'px',
            'paddingBottom': formData.verticalPadding + 'px'
        });
    };

    return {
        formOptions,
        applyHandler
    };
}

function getFormConfigConstructor(type) {
    return type === 'cell' ? getCellPropertiesFormConfig : getTablePropertiesFormConfig;
}

function applyTableDimensionChanges($table, newHeight, newWidth) {
    if(isDefined(newWidth)) {
        const autoWidthColumns = getAutoSizedElements($table);

        if(autoWidthColumns.length > 0) {
            $table.css('width', newWidth);
        } else {
            const $columns = getColumnElements($table);
            const oldTableWidth = getOuterWidth($table);

            unfixTableWidth($table);

            each($columns, (i, element) => {
                const $element = $(element);
                const newElementWidth = newWidth / oldTableWidth * getOuterWidth($element);
                $element.attr('width', newElementWidth);

                const $lineElements = getLineElements($table, $element.index(), 'horizontal');

                setLineElementsAttrValue($lineElements, 'width', newElementWidth);
            });
        }
    }

    const autoHeightRows = getAutoSizedElements($table, 'vertical');

    if(autoHeightRows?.length > 0) {
        $table.css('height', newHeight);
    } else {
        const $rows = getRowElements($table);
        const oldTableHeight = getOuterHeight($table);

        each($rows, (i, element) => {
            const $element = $(element);
            const newElementHeight = newHeight / oldTableHeight * getOuterHeight($element);
            const $lineElements = getLineElements($table, i, 'vertical');

            setLineElementsAttrValue($lineElements, 'height', newElementHeight);
        });
    }
}

function applyCellDimensionChanges($target, newHeight, newWidth) {
    const $table = $($target.closest('table'));
    if(isDefined(newWidth)) {
        const index = $($target).index();
        let $verticalCells = getLineElements($table, index);


        const widthDiff = newWidth - getOuterWidth($target);
        const tableWidth = getOuterWidth($table);

        if(newWidth > tableWidth) {
            unfixTableWidth($table);
        }

        setLineElementsAttrValue($verticalCells, 'width', newWidth);

        const $nextColumnCell = $target.next();
        const shouldUpdateNearestColumnWidth = getAutoSizedElements($table).length === 0;

        if(shouldUpdateNearestColumnWidth) {
            unfixTableWidth($table);
            if($nextColumnCell.length === 1) {
                $verticalCells = getLineElements($table, index + 1);
                const nextColumnWidth = getOuterWidth($verticalCells.eq(0)) - widthDiff;
                setLineElementsAttrValue($verticalCells, 'width', Math.max(nextColumnWidth, 0));
            } else {
                const $prevColumnCell = $target.prev();
                if($prevColumnCell.length === 1) {
                    $verticalCells = getLineElements($table, index - 1);
                    const prevColumnWidth = getOuterWidth($verticalCells.eq(0)) - widthDiff;
                    setLineElementsAttrValue($verticalCells, 'width', Math.max(prevColumnWidth, 0));
                }
            }
        }
    }

    const $horizontalCells = $target.closest('tr').find('td');

    setLineElementsAttrValue($horizontalCells, 'height', newHeight);
    const autoHeightRows = getAutoSizedElements($table, 'vertical');

    if(autoHeightRows.length === 0) {
        $table.css('height', 'auto');
    }
}


export {
    getFormatHandlers,
    getDefaultClickHandler,
    ICON_MAP,
    applyFormat
};
