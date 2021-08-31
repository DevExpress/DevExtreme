import Popup from '../../popup';
import Form from '../../form';
import $ from '../../../core/renderer';
// import { getWindow } from '../../../core/utils/window';

// const MIN_HEIGHT = 150;
let formPopup;

const createFormPopup = (editorInstance) => {
    const $popup = $('<div>');
    formPopup = editorInstance._createComponent($popup, Popup, {
        contentTemplate: () => {},
        // deferRendering: false,
        showTitle: false,
        width: 300,
        height: 200,
        shading: false,
        closeOnTargetScroll: true,
        closeOnOutsideClick: true,
        onShowing: () => {
        },
        animation: {
            show: { type: 'fade', duration: 0, from: 0, to: 1 },
            hide: { type: 'fade', duration: 400, from: 1, to: 0 }
        },
        fullScreen: false,
        // maxHeight: () => {
        //     const window = getWindow();
        //     const windowHeight = window && $(window).height() || 0;
        //     return Math.max(MIN_HEIGHT, windowHeight * 0.5);
        // }
    });
};

export const showTableProperties = (editorInstance) => {
    if(!formPopup) {
        createFormPopup(editorInstance);
    }

    const formOptions = {
        formData: {
            width: 100,
            height: 100
        },
        items: [{
            itemType: 'group',
            caption: 'Dimentions',
            colCount: 2,
            items: [ 'width', 'height' ]
        }],
        // showColonAfterLabel: true,
        labelLocation: 'top',
        minColWidth: 300,

    };

    formPopup.option('contentTemplate', () => {
        const $form = $('<div>');
        editorInstance._createComponent($form, Form, formOptions);

        return $form;
    });

    // this._popup.hide();
    formPopup.show();
};


export const showCellProperties = (editorInstance) => {
    if(!this._formPopup) {
        return;
    }

    const formOptions = {
        formData: {
            width: 100,
            height: 100
        },
        items: [{
            itemType: 'group',
            caption: 'Dimentions',
            colCount: 2,
            items: [ 'width', 'height' ]
        }],
        // showColonAfterLabel: true,
        labelLocation: 'top',
        minColWidth: 300,

    };

    this._formPopup.option('contentTemplate', () => {
        const $form = $('<div>');
        // .addClass(SUGGESTION_LIST_CLASS)
        // .appendTo($container);
        editorInstance._createComponent($form, Form, formOptions);

        return $form;
    });

    // this._popup.hide();
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
