import Popup from '../../popup';
import Form from '../../form';
import ButtonGroup from '../../button_group';
import ColorBox from '../../color_box';
import ScrollView from '../../scroll_view';

import $ from '../../../core/renderer';
import { getWindow } from '../../../core/utils/window';
import { isDefined } from '../../../core/utils/type';
import { each } from '../../../core/utils/iterator';

import devices from '../../../core/devices';

import { getOuterHeight, getOuterWidth } from '../../../core/utils/size';
import { noop } from '../../../core/utils/common';

import localizationMessage from '../../../localization/message';

const MIN_HEIGHT = 400;
const BORDER_STYLES = ['none', 'hidden', 'dotted', 'dashed', 'solid', 'double', 'groove', 'ridge', 'inset', 'outset'];
let formPopup;
let applyHandler = noop;

const createFormPopup = (editorInstance) => {
    const $popup = $('<div>').appendTo(editorInstance.$element());
    formPopup = editorInstance._createComponent($popup, Popup, {
        deferRendering: true,
        showTitle: true,
        width: 800,
        height: 'auto',
        shading: false,
        closeOnTargetScroll: true,
        closeOnOutsideClick: true,
        animation: {
            show: { type: 'fade', duration: 0, from: 0, to: 1 },
            hide: { type: 'fade', duration: 400, from: 1, to: 0 }
        },
        fullScreen: getFullScreen(),
        visible: false,
        maxHeight: getMaxHeight(),
        toolbarItems: [
            {
                toolbar: 'bottom',
                location: 'after',
                widget: 'dxButton',
                options: {
                    text: localizationMessage.format('OK'),
                    onClick: () => {
                        applyHandler();
                    }
                }
            }, {
                toolbar: 'bottom',
                location: 'after',
                widget: 'dxButton',
                options: {
                    text: localizationMessage.format('Cancel'),
                    onClick: () => {
                        formPopup.hide();
                    }
                }
            }
        ]
    });
};

const getMaxHeight = () => {
    const window = getWindow();
    const windowHeight = window?.innerHeight || 0;
    return Math.max(MIN_HEIGHT, windowHeight * 0.9);
};

const getFullScreen = () => {
    return devices.real().deviceType === 'phone';
};

const getRowElements = ($table, index = 0) => {
    return $table.find(`th:nth-child(${(1 + index)}), td:nth-child(${(1 + index)})`);
};

export const unfixTableWidth = ($table) => {
    $table.css('width', 'initial');
};

export const getColumnElements = ($table, index = 0) => {
    return $table.find('tr').eq(index).find('th, td');
};

const applyTableDimensionChanges = ($table, newHeight, newWidth) => {
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
};

export const getAutoSizedElements = ($table, direction = 'horizontal') => {
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
};

const applyCellDimensionChanges = ($target, newHeight, newWidth) => {
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
};

export const setLineElementsAttrValue = ($lineElements, property, value) => {
    each($lineElements, (i, element) => {
        $(element).attr(property, value + 'px');
    });
};

export const getLineElements = ($table, index, direction = 'horizontal') => {
    return direction === 'horizontal' ? getRowElements($table, index) : getColumnElements($table, index);
};

export const showTablePropertiesForm = (editorInstance, $table) => {
    formPopup?.dispose();
    createFormPopup(editorInstance);

    const window = getWindow();
    let formInstance;
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
            caption: 'Border',
            colCountByScreen: {
                xs: 2
            },
            colCount: 2,
            items: [
                {
                    dataField: 'borderStyle',
                    label: { text: 'Style' },
                    editorType: 'dxSelectBox',
                    editorOptions: {
                        items: BORDER_STYLES,
                        placeholder: 'Select style'
                    }
                },
                {
                    dataField: 'borderWidth',
                    label: { text: 'Width' },
                    editorOptions: {
                        placeholder: 'Pixels'
                    }
                },
                {
                    itemType: 'simple',
                    dataField: 'borderColor',
                    label: { text: 'Color' },
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
            caption: 'Dimensions',
            colCountByScreen: {
                xs: 2
            },
            colCount: 2,
            items: [
                {
                    dataField: 'width',
                    editorOptions: {
                        min: 0,
                        placeholder: 'Pixels'
                    }
                },
                {
                    dataField: 'height',
                    editorOptions: {
                        min: 0,
                        placeholder: 'Pixels'
                    }
                }
            ]
        }, {
            itemType: 'group',
            caption: 'Background',
            items: [
                {
                    itemType: 'simple',
                    dataField: 'backgroundColor',
                    label: { text: 'Color' },
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
            caption: 'Alignment',
            items: [{
                itemType: 'simple',
                label: { text: 'Horizontal' },
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

    applyHandler = () => {
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

        formPopup.hide();
    };

    formPopup.option({
        'contentTemplate': (container) => {
            const $content = $('<div>').appendTo(container);
            const $form = $('<div>').appendTo($content);
            editorInstance._createComponent($form, Form, formOptions);
            editorInstance._createComponent($content, ScrollView, {});
            formInstance = $form.dxForm('instance');

            return $content;
        },
        title: 'Table Properties'
    });

    formPopup.show();
    return formPopup;
};


export const showCellPropertiesForm = (editorInstance, $cell) => {
    formPopup?.dispose();
    createFormPopup(editorInstance);

    const window = getWindow();
    let formInstance;
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
            caption: 'Border',
            colCountByScreen: {
                xs: 2
            },
            colCount: 2,
            items: [
                {
                    dataField: 'borderStyle',
                    label: { text: 'Style' },
                    editorType: 'dxSelectBox',
                    editorOptions: {
                        items: BORDER_STYLES
                    }
                },
                {
                    dataField: 'borderWidth',
                    label: { text: 'Width' },
                    editorOptions: {
                        placeholder: 'Pixels'
                    }
                },
                {
                    itemType: 'simple',
                    dataField: 'borderColor',
                    colSpan: 2,
                    label: { text: 'Color' },
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
            caption: 'Dimensions',
            colCount: 2,
            colCountByScreen: {
                xs: 2
            },
            items: [
                {
                    dataField: 'width',
                    editorOptions: {
                        min: 0,
                        placeholder: 'Pixels'
                    }
                },
                {
                    dataField: 'height',
                    editorOptions: {
                        min: 0,
                        placeholder: 'Pixels'
                    }
                },
                {
                    dataField: 'verticalPadding',
                    label: { text: 'Padding Vertical' },
                    editorOptions: {
                        placeholder: 'Pixels'
                    }
                },
                {
                    label: { text: 'Padding Horizontal' },
                    dataField: 'horizontalPadding',
                    editorOptions: {
                        placeholder: 'Pixels'
                    }
                }
            ]
        }, {
            itemType: 'group',
            caption: 'Background',
            items: [
                {
                    itemType: 'simple',
                    dataField: 'backgroundColor',
                    label: { text: 'Color' },
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
            caption: 'Alignment',
            colCount: 2,
            items: [
                {
                    itemType: 'simple',
                    label: { text: 'Horizontal' },
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
                    label: { text: 'Vertical' },
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

    applyHandler = () => {
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

        formPopup.hide();
    };

    formPopup.option({
        'contentTemplate': (container) => {
            const $content = $('<div>').appendTo(container);
            const $form = $('<div>').appendTo($content);
            editorInstance._createComponent($form, Form, formOptions);
            editorInstance._createComponent($content, ScrollView, {});
            formInstance = $form.dxForm('instance');

            return $content;
        },
        title: 'Cell Properties'
    });
    formPopup.show();

    return formPopup;
};

export const getTableOperationHandler = (quill, operationName, ...rest) => {
    return () => {
        const table = quill.getModule('table');

        if(!table) {
            return;
        }
        quill.focus();
        return table[operationName](...rest);
    };
};
