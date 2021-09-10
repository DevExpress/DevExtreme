import Popup from '../../popup';
import Form from '../../form';
import ButtonGroup from '../../button_group';
import ColorBox from '../../color_box';

import $ from '../../../core/renderer';
import { getWindow } from '../../../core/utils/window';
import { isDefined } from '../../../core/utils/type';
import { each } from '../../../core/utils/iterator';

const MIN_HEIGHT = 250;
const BORDER_STYLES = ['none', 'hidden', 'dotted', 'dashed', 'solid', 'double', 'groove', 'ridge', 'inset', 'outset'];
let formPopup;

const createFormPopup = (editorInstance) => {
    const $popup = $('<div>').addClass('test-123').appendTo(editorInstance.$element());
    formPopup = editorInstance._createComponent($popup, Popup, {
        // contentTemplate: () => { return $('<div>').addClass('test-1234'); },
        // deferRendering: true,
        showTitle: false,
        width: 600,
        height: 'auto',
        shading: false,
        // closeOnTargetScroll: true,
        closeOnOutsideClick: true,
        // animation: {
        //     show: null,
        //     hide: null,
        //     // show: { type: 'fade', duration: 0, from: 0, to: 1 },
        //     // hide: { type: 'fade', duration: 400, from: 1, to: 0 }
        // },
        // animation: null,
        fullScreen: false,
        visible: false,
        maxHeight: getMaxHeight()
    });
};

const getMaxHeight = () => {
    const window = getWindow();
    const windowHeight = window && $(window).height() || 0;
    return Math.max(MIN_HEIGHT, windowHeight * 0.9);
};


const applyDimensionChanges = ($target, newHeight, newWidth) => {
    if(isDefined(newWidth)) {
        // $target.css('width', 'initial');
        $target.attr('width', newWidth);
    }

    $target.attr('height', newHeight);
};

const applyCellDimensionChanges = ($target, newHeight, newWidth) => {
    if(isDefined(newWidth)) {
        const index = $($target).index();
        let $verticalCells = getLineElements($target.closest('table'), index);

        const widthDiff = newWidth - $target.width();
        setLineElementsAttrValue($verticalCells, 'width', newWidth);

        const $nextColumnCell = $target.next();

        if($nextColumnCell.length === 1) {
            $verticalCells = getLineElements($target.closest('table'), index + 1);
            setLineElementsAttrValue($verticalCells, 'width', $verticalCells.eq().width() - widthDiff);
        } else {
            const $prevColumnCell = $target.prev();
            if($prevColumnCell.length === 1) {
                $verticalCells = getLineElements($target.closest('table'), index - 1);
                setLineElementsAttrValue($verticalCells, 'width', $verticalCells.eq().width() - widthDiff);
            }
        }
    }

    const $horizontalCells = $target.closest('tr, thead').find('td');


    setLineElementsAttrValue($horizontalCells, 'height', newHeight);

};

export const setLineElementsAttrValue = ($lineElements, property, value) => {
    each($lineElements, (i, element) => {
        $(element).attr(property, value + 'px');
    });
};

export const getLineElements = ($table, index, direction) => {
    let result;
    if(direction !== 'vertical') {
        result = $table.find(`td:nth-child(${(1 + index)})`);
    } else {
        result = $table.find('tr').eq(index).find('td');
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
    const startTableWidth = $table.outerWidth();
    const tableStyles = window.getComputedStyle($table.get(0));
    const startTextAlign = tableStyles.textAlign === 'start' ? 'left' : tableStyles.textAlign;

    const formOptions = {
        formData: {
            width: startTableWidth,
            height: $table.outerHeight(),
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
                'width', 'height', {
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
                    applyDimensionChanges($table, formData.height, widthArg);
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
        const $form = $('<div>').appendTo(container);
        editorInstance._createComponent($form, Form, formOptions);

        formInstance = $form.dxForm('instance');

        return $form;
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
    const startCellWidth = $cell.outerWidth();
    const cellStyles = window.getComputedStyle($cell.get(0));
    const startTextAlign = cellStyles.textAlign === 'start' ? 'left' : cellStyles.textAlign;

    const formOptions = {
        formData: {
            width: startCellWidth,
            height: $cell.outerHeight(),
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
                'width', 'height', 'padding'
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
        minColWidth: 300,

    };

    formPopup.option('contentTemplate', (container) => {
        const $form = $('<div>').appendTo(container);
        editorInstance._createComponent($form, Form, formOptions);

        formInstance = $form.dxForm('instance');

        return $form;
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
