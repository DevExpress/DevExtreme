import Popup from '../../popup';
import Form from '../../form';
import $ from '../../../core/renderer';
import { getWindow } from '../../../core/utils/window';
import { isDefined } from '../../../core/utils/type';

const MIN_HEIGHT = 250;
const BORDER_STYLES = ['none', 'hidden', 'dotted', 'dashed', 'solid', 'double', 'groove', 'ridge', 'inset', 'outset'];
let formPopup;

const createFormPopup = (editorInstance) => {
    const $popup = $('<div>').appendTo(editorInstance._$element);
    formPopup = editorInstance._createComponent($popup, Popup, {
        contentTemplate: () => {},
        deferRendering: false,
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

export const showTablePropertiesForm = (editorInstance, $table) => {
    if(!formPopup) {
        createFormPopup(editorInstance);
    }

    const window = getWindow();

    let formInstance;
    const startTableWidth = $table.outerWidth();
    const tableStyles = window.getComputedStyle($table.get(0));

    const formOptions = {
        formData: {
            width: startTableWidth,
            height: $table.outerHeight(),
            backgroundColor: tableStyles.backgroundColor,
            borderStyle: tableStyles.borderStyle,
            borderColor: tableStyles.borderColor,
            borderWidth: tableStyles.borderWidth,
            alignment: tableStyles.textAlign,
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
                    dataField: 'borderColor',
                    caption: 'Color',
                    editorType: 'dxColorBox',
                    editorOptions: {
                        editAlphaChannel: true
                    }
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
                    dataField: 'backgroundColor',
                    caption: 'Color',
                    editorType: 'dxColorBox',
                    editorOptions: {
                        editAlphaChannel: true
                    }
                }
            ]
        }, {
            itemType: 'group',
            caption: 'Dimentions',
            colCount: 3,
            items: [
                'width', 'height', {
                    dataField: 'alignment',
                    editorType: 'dxSelectBox', // todo use buttons group
                    editorOptions: {
                        items: ['left', 'center', 'right']
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
                    const widthArg = formData.width === startTableWidth ? undefined : formData.width;
                    applyDimensionChanges($table, formData.height, widthArg);
                    $table.css({
                        'backgroundColor': formData.backgroundColor,
                        'borderStyle': formData.borderStyle,
                        'borderColor': formData.borderColor,
                        'borderWidth': formData.borderWidth,
                        'textAlign': formData.alignment
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
};


export const showCellPropertiesForm = (editorInstance, $cell) => {
    if(!formPopup) {
        createFormPopup(editorInstance);
    }

    const window = getWindow();

    let formInstance;
    const startCellWidth = $cell.outerWidth();
    const cellStyles = window.getComputedStyle($cell.get(0));

    const formOptions = {
        formData: {
            width: startCellWidth,
            height: $cell.outerHeight(),
            backgroundColor: cellStyles.backgroundColor,
            borderStyle: cellStyles.borderStyle,
            borderColor: cellStyles.borderColor,
            borderWidth: cellStyles.borderWidth,
            alignment: cellStyles.textAlign,
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
                    dataField: 'borderColor',
                    caption: 'Color',
                    editorType: 'dxColorBox',
                    editorOptions: {
                        editAlphaChannel: true
                    }
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
                    dataField: 'backgroundColor',
                    caption: 'Color',
                    editorType: 'dxColorBox',
                    editorOptions: {
                        editAlphaChannel: true
                    }
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
                    dataField: 'alignment',
                    editorType: 'dxSelectBox', // todo use buttons group
                    editorOptions: {
                        items: ['left', 'center', 'right']
                    }
                },
                {
                    dataField: 'verticalAlignment',
                    editorType: 'dxSelectBox', // todo use buttons group
                    editorOptions: {
                        items: ['top', 'middle', 'bottom']
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
                    applyDimensionChanges($cell, formData.height, widthArg);
                    $cell.css({
                        'backgroundColor': formData.backgroundColor,
                        'borderStyle': formData.borderStyle,
                        'borderColor': formData.borderColor,
                        'borderWidth': formData.borderWidth,
                        'textAlign': formData.alignment
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
