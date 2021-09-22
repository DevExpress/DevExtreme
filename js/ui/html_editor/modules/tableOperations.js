import Popup from '../../popup';
import Form from '../../form';
import ButtonGroup from '../../button_group';
import ColorBox from '../../color_box';
import ScrollView from '../../scroll_view';

import $ from '../../../core/renderer';
import { getWindow } from '../../../core/utils/window';
import { isDefined } from '../../../core/utils/type';
import { each } from '../../../core/utils/iterator';

import { getOuterHeight, getOuterWidth } from '../../../core/utils/size';

const MIN_HEIGHT = 400;
const BORDER_STYLES = ['none', 'hidden', 'dotted', 'dashed', 'solid', 'double', 'groove', 'ridge', 'inset', 'outset'];
let formPopup;

const createFormPopup = (editorInstance) => {
    const $popup = $('<div>').addClass('test-123').appendTo(editorInstance.$element());
    formPopup = editorInstance._createComponent($popup, Popup, {
        deferRendering: true,
        showTitle: false,
        width: 600,
        height: 'auto',
        shading: false,
        closeOnTargetScroll: true,
        closeOnOutsideClick: true,
        animation: {
            show: { type: 'fade', duration: 0, from: 0, to: 1 },
            hide: { type: 'fade', duration: 400, from: 1, to: 0 }
        },
        fullScreen: false,
        visible: false,
        maxHeight: getMaxHeight()
    });
};

const getMaxHeight = () => {
    const window = getWindow();
    const windowHeight = window?.innerHeight || 0;
    return Math.max(MIN_HEIGHT, windowHeight * 0.9);
};

const getRowElements = ($table, index = 0) => {
    return $table.find(`th:nth-child(${(1 + index)}), td:nth-child(${(1 + index)})`);
};

const applyTableDimensionChanges = ($table, newHeight, newWidth) => {
    if(isDefined(newWidth)) {
        const autoWidthColumns = getAutoWidthColumns($table);

        if(autoWidthColumns.length > 0) {
            $table.css('width', newWidth); // to do support style width
        } else {
            const $columns = $table.find('tr').eq(0).find('td');
            const oldTableWidth = getOuterWidth($table);

            $table.css('width', 'initial');

            each($columns, (i, element) => {
                const $element = $(element);
                const newElementWidth = newWidth / oldTableWidth * getOuterWidth($element);
                $element.attr('width', newElementWidth);

                const $lineElements = getLineElements($table, $element.index(), 'horizontal');

                setLineElementsAttrValue($lineElements, 'width', newElementWidth);
            });
        }
    }

    const autoHeightRows = getAutoHeightRows($table);

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

const getAutoHeightRows = ($table) => {
    const result = [];
    getRowElements($table).each((index, element) => {
        const $element = $(element);
        if(!isDefined($element.attr('height'))) {
            result.push($element);
        }
    });

    return result;
};

export const getAutoWidthColumns = ($table) => {
    const result = [];
    $table.find('tr').eq(0).find('th, td').each((index, element) => {
        const $element = $(element);
        if(!isDefined($element.attr('width'))) {
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
            $table.css('width', 'initial');
        }

        setLineElementsAttrValue($verticalCells, 'width', newWidth);

        const $nextColumnCell = $target.next();
        const shouldUpdateNearestColumnWidth = getAutoWidthColumns($table).length === 0;

        if(shouldUpdateNearestColumnWidth) {
            $table.css('width', 'initial');
            if($nextColumnCell.length === 1) {
                $verticalCells = getLineElements($table, index + 1);
                const nextColumnWidth = getOuterWidth($verticalCells.eq(0)) - widthDiff;
                setLineElementsAttrValue($verticalCells, 'width', nextColumnWidth > 0 ? nextColumnWidth : 0);
            } else {
                const $prevColumnCell = $target.prev();
                if($prevColumnCell.length === 1) {
                    $verticalCells = getLineElements($table, index - 1);
                    const prevColumnWidth = getOuterWidth($verticalCells.eq(0)) - widthDiff;
                    setLineElementsAttrValue($verticalCells, 'width', prevColumnWidth > 0 ? prevColumnWidth : 0);
                }
            }
        }
    }

    const $horizontalCells = $target.closest('tr').find('td');


    setLineElementsAttrValue($horizontalCells, 'height', newHeight);
    const autoHeightRows = getAutoHeightRows($table);

    if(autoHeightRows.length === 0) {
        $table.css('height', 'auto');
    }

};

export const setLineElementsAttrValue = ($lineElements, property, value) => {
    each($lineElements, (i, element) => {
        $(element).attr(property, value + 'px');
    });
};

export const getLineElements = ($table, index, direction) => {
    let result;
    if(direction !== 'vertical') {
        result = getRowElements($table, index);
    } else {
        result = $table.find('tr').eq(index).find('th, td');
    }
    return result;
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
        formData: {
            width: startTableWidth,
            height: getOuterHeight($table),
            backgroundColor: tableStyles.backgroundColor,
            borderStyle: tableStyles.borderStyle,
            borderColor: tableStyles.borderColor,
            borderWidth: tableStyles.borderWidth,
            alignment: startTextAlign,
        },
        items: [{
            itemType: 'group',
            caption: 'Border',
            colCount: 3,
            items: [
                {
                    dataField: 'borderStyle',
                    caption: 'Style',
                    editorType: 'dxSelectBox',
                    editorOptions: {
                        items: BORDER_STYLES
                    }
                },

                {
                    itemType: 'simple',
                    dataField: 'borderColor',
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
                    },
                },
                {
                    dataField: 'borderWidth',
                    caption: 'Width'
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
                    },
                },
            ]
        }, {
            itemType: 'group',
            caption: 'Dimentions',
            colCount: 3,
            items: [
                {
                    dataField: 'width',
                    editorOptions: {
                        min: 0
                    }
                },
                {
                    dataField: 'height',
                    editorOptions: {
                        min: 0
                    }
                },
                {
                    itemType: 'simple',
                    template: () => {
                        const $content = $('<div>');
                        editorInstance._createComponent($content, ButtonGroup, {
                            items: [{ value: 'left', icon: 'alignleft' }, { value: 'center', icon: 'aligncenter' }, { value: 'right', icon: 'alignright' }],
                            keyExpr: 'value',
                            selectedItemKeys: [startTextAlign],
                            onInitialized: (e) => {
                                alignmentEditorInstance = e.component;
                            }
                        });
                        return $content;
                    },
                }
            ]
        }, {
            itemType: 'button',
            horizontalAlignment: 'left',
            buttonOptions: {
                text: 'Ok',
                type: 'success',
                onClick: (e) => {
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
                }
            }
        }],
        showColonAfterLabel: true,
        labelLocation: 'top',
        minColWidth: 300,
    };

    formPopup.option('contentTemplate', (container) => {
        const $content = $('<div>').appendTo(container);
        const $form = $('<div>').appendTo($content);
        editorInstance._createComponent($form, Form, formOptions);
        editorInstance._createComponent($content, ScrollView, {});
        formInstance = $form.dxForm('instance');

        return $content;
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
        formData: {
            width: startCellWidth,
            height: getOuterHeight($cell),
            backgroundColor: cellStyles.backgroundColor,
            borderStyle: cellStyles.borderStyle,
            borderColor: cellStyles.borderColor,
            borderWidth: cellStyles.borderWidth,
            alignment: startTextAlign,
            verticalAlignment: cellStyles.verticalAlign,
            padding: cellStyles.padding,
        },
        items: [{
            itemType: 'group',
            caption: 'Border',
            colCount: 3,
            items: [
                {
                    dataField: 'borderStyle',
                    caption: 'Style',
                    editorType: 'dxSelectBox',
                    editorOptions: {
                        items: BORDER_STYLES
                    }
                },
                {
                    itemType: 'simple',
                    dataField: 'borderColor',
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
                    },
                },
                {
                    dataField: 'borderWidth',
                    caption: 'Width'
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
                    },
                }
            ]
        }, {
            itemType: 'group',
            caption: 'Dimentions',
            colCount: 3,
            items: [
                {
                    dataField: 'width',
                    editorOptions: {
                        min: 0
                    }
                },
                {
                    dataField: 'height',
                    editorOptions: {
                        min: 0
                    }
                }, 'padding'
            ]
        }, {
            itemType: 'group',
            caption: 'Alignment',
            colCount: 3,
            items: [
                {
                    itemType: 'simple',
                    template: () => {
                        const $content = $('<div>');
                        editorInstance._createComponent($content, ButtonGroup, {
                            items: [{ value: 'left', icon: 'alignleft' }, { value: 'center', icon: 'aligncenter' }, { value: 'right', icon: 'alignright' }],
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
                    label: { text: 'Alignment' },
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
        }, {
            itemType: 'button',
            horizontalAlignment: 'left',
            buttonOptions: {
                text: 'Ok',
                type: 'success',
                onClick: (e) => {
                    const formData = formInstance.option('formData');
                    const widthArg = formData.width === startCellWidth ? undefined : formData.width;
                    applyCellDimensionChanges($cell, formData.height, widthArg);
                    $cell.css({
                        'backgroundColor': backgroundColorEditorInstance.option('value'),
                        'borderStyle': formData.borderStyle,
                        'borderColor': borderColorEditorInstance.option('value'),
                        'borderWidth': formData.borderWidth,
                        'textAlign': alignmentEditorInstance.option('selectedItemKeys')[0],
                        'verticalAlign': verticalAlignmentEditorInstance.option('selectedItemKeys')[0],
                        'padding': formData.padding
                    });

                    formPopup.hide();
                }
            }
        }],
        showColonAfterLabel: true,
        labelLocation: 'top',
        minColWidth: 300
    };

    formPopup.option('contentTemplate', (container) => {
        const $content = $('<div>').appendTo(container);
        const $form = $('<div>').appendTo($content);
        editorInstance._createComponent($form, Form, formOptions);
        editorInstance._createComponent($content, ScrollView, {});
        formInstance = $form.dxForm('instance');

        return $content;
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
