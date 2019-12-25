import { getQuill } from '../quill_importer';
import $ from '../../../core/renderer';
import { extend } from '../../../core/utils/extend';
import { getWindow } from '../../../core/utils/window';

import Popup from '../../popup';
import List from '../../list';

const SUGGESTION_LIST_CLASS = 'dx-suggestion-list';
const SUGGESTION_LIST_WRAPPER_CLASS = 'dx-suggestion-list-wrapper';
const BaseModule = getQuill().import('core/module');

const MIN_HEIGHT = 100;

class ListPopupModule extends BaseModule {

    _getDefaultOptions() {
        return {
            dataSource: null
        };
    }

    constructor(quill, options) {
        super(quill, options);

        this.options = extend({}, this._getDefaultOptions(), options);
        this._popup = this.renderPopup();
        this._popup._wrapper().addClass(SUGGESTION_LIST_WRAPPER_CLASS);
    }

    renderList($container, options) {
        const $list = $('<div>')
            .addClass(SUGGESTION_LIST_CLASS)
            .appendTo($container);
        this._list = this.options.editorInstance._createComponent($list, List, options);
    }

    renderPopup() {
        let editorInstance = this.options.editorInstance,
            $container = $('<div>').appendTo(editorInstance.$element()),
            popupConfig = this._getPopupConfig();

        return editorInstance._createComponent($container, Popup, popupConfig);
    }

    _getPopupConfig() {
        return {
            contentTemplate: (contentElem) => {
                const listConfig = this._getListConfig(this.options);
                this.renderList($(contentElem), listConfig);
            },
            deferRendering: false,
            onShown: () => {
                this._list.focus();
            },
            onHidden: () => {
                this._list.unselectAll();
                this._list.option('focusedElement', null);
            },
            showTitle: false,
            width: 'auto',
            height: 'auto',
            shading: false,
            closeOnTargetScroll: true,
            closeOnOutsideClick: true,
            animation: {
                show: { type: 'fade', duration: 0, from: 0, to: 1 },
                hide: { type: 'fade', duration: 400, from: 1, to: 0 }
            },
            fullScreen: false,
            maxHeight: this.maxHeight
        };
    }

    _getListConfig(options) {
        return {
            dataSource: options.dataSource,
            onSelectionChanged: this.selectionChangedHandler.bind(this),
            selectionMode: 'single',
            pageLoadMode: 'scrollBottom'
        };
    }

    get maxHeight() {
        const window = getWindow();
        const windowHeight = window && $(window).height() || 0;
        return Math.max(MIN_HEIGHT, windowHeight * 0.5);
    }

    selectionChangedHandler(e) {
        if(this._popup.option('visible')) {
            this._popup.hide();

            this.insertEmbedContent(e);
        }
    }

    insertEmbedContent(selectionChangedEvent) { }

    showPopup() {
        this._popup && this._popup.show();
    }

    savePosition(position) {
        this.caretPosition = position;
    }

    getPosition() {
        return this.caretPosition;
    }
}

export default ListPopupModule;
