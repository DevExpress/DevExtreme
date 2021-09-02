import Popup from '../../popup';
import Form from '../../form';
import $ from '../../../core/renderer';
import { getWindow } from '../../../core/utils/window';
import { isDefined } from '../../../core/utils/type';

const MIN_HEIGHT = 250;
let formPopup;

const createFormPopup = (editorInstance) => {
    const $popup = $('<div>').appendTo(editorInstance._$element);
    formPopup = editorInstance._createComponent($popup, Popup, {
        contentTemplate: () => {},
        deferRendering: false,
        showTitle: false,
        width: 300,
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
    return Math.max(MIN_HEIGHT, windowHeight * 0.5);
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

    let formInstance;
    const startTableWidth = $table.outerWidth();

    const formOptions = {
        formData: {
            width: startTableWidth,
            height: $table.outerHeight()
        },
        items: [{
            itemType: 'group',
            caption: 'Dimentions',
            colCount: 2,
            items: [ 'width', 'height', {
                itemType: 'button',
                horizontalAlignment: 'left',
                buttonOptions: {
                    text: 'Ok',
                    type: 'success',
                    onClick: (e) => {
                        // console.log('save changes');
                        const formDataWidth = formInstance.option('formData').width;
                        const widthArg = formDataWidth === startTableWidth ? undefined : formDataWidth;
                        applyDimensionChanges($table, formInstance.option('formData').height, widthArg);
                        formPopup.hide();
                    }
                }
            }]
        }],
        // showColonAfterLabel: true,
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

    let formInstance;

    const formOptions = {
        formData: {
            width: $cell.outerWidth(),
            height: $cell.outerHeight()
        },
        items: [{
            itemType: 'group',
            caption: 'Dimentions',
            colCount: 2,
            items: [ 'width', 'height', {
                itemType: 'button',
                horizontalAlignment: 'left',
                buttonOptions: {
                    text: 'Ok',
                    type: 'success',
                    onClick: (e) => {
                        applyDimensionChanges($cell, formInstance.option('formData').height, formInstance.option('formData').width);
                        formPopup.hide();
                    }
                }
            }]
        }],
        // showColonAfterLabel: true,
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
