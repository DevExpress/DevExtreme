import { getHeight } from '../../../core/utils/size';
import Quill from 'devextreme-quill';
import $ from '../../../core/renderer';
import { extend } from '../../../core/utils/extend';
import { getWindow } from '../../../core/utils/window';
import eventsEngine from '../../../events/core/events_engine';
import { addNamespace } from '../../../events/utils/index';

import BaseModule from './base';

import Popup from '../../popup';
import List from '../../list_light';

const MODULE_NAMESPACE = 'dxHtmlEditorPopupModule';

let ListPopupModule = BaseModule;

if(Quill) {
    const SUGGESTION_LIST_CLASS = 'dx-suggestion-list';
    const SUGGESTION_LIST_WRAPPER_CLASS = 'dx-suggestion-list-wrapper';

    const MIN_HEIGHT = 100;

    ListPopupModule = class ListPopupModule extends BaseModule {

        _getDefaultOptions() {
            return {
                dataSource: null
            };
        }

        constructor(quill, options) {
            super(quill, options);

            this.options = extend({}, this._getDefaultOptions(), options);
            this._popup = this.renderPopup();
            this._popup.$wrapper().addClass(SUGGESTION_LIST_WRAPPER_CLASS);
            this._renderPreventFocusOut();
        }

        renderList($container, options) {
            const $list = $('<div>')
                .addClass(SUGGESTION_LIST_CLASS)
                .appendTo($container);
            this._list = this.options.editorInstance._createComponent($list, List, options);
        }

        renderPopup() {
            const editorInstance = this.options.editorInstance;
            const $container = $('<div>').appendTo(editorInstance.$element());
            const popupConfig = this._getPopupConfig();

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
                hideOnParentScroll: true,
                hideOnOutsideClick: true,
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
            const windowHeight = window && getHeight(window) || 0;
            return Math.max(MIN_HEIGHT, windowHeight * 0.5);
        }

        selectionChangedHandler(e) {
            if(this._popup.option('visible')) {
                this._popup.hide();

                this.insertEmbedContent(e);
            }
        }

        _renderPreventFocusOut() {
            const eventName = addNamespace('mousedown', MODULE_NAMESPACE);

            eventsEngine.on(this._popup.$wrapper(), eventName, (e) => {
                e.preventDefault();
            });
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
    };
}

export default ListPopupModule;
