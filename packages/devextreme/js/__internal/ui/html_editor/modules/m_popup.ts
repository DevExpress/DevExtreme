import eventsEngine from '@js/common/core/events/core/events_engine';
import { addNamespace } from '@js/common/core/events/utils/index';
import $ from '@js/core/renderer';
import { extend } from '@js/core/utils/extend';
import { getHeight } from '@js/core/utils/size';
import type ListType from '@js/ui/list';
import List from '@js/ui/list_light';
import Popup from '@js/ui/popup';
import windowUtils from '@ts/core/utils/m_window';
import Quill from 'devextreme-quill';

import BaseModule from './m_base';

const MODULE_NAMESPACE = 'dxHtmlEditorPopupModule';

// eslint-disable-next-line import/no-mutable-exports
let ListPopupModule = BaseModule;

if (Quill) {
  const SUGGESTION_LIST_CLASS = 'dx-suggestion-list';
  const SUGGESTION_LIST_WRAPPER_CLASS = 'dx-suggestion-list-wrapper';
  const DROPDOWN_EDITOR_OVERLAY_CLASS = 'dx-dropdowneditor-overlay';

  const MIN_HEIGHT = 100;
  // @ts-expect-error
  ListPopupModule = class ListPopupModule extends BaseModule {
    _list!: ListType;

    _popup: Popup;

    caretPosition?: number;

    options: any;

    constructor(quill, options) {
      // @ts-expect-error
      super(quill, options);

      this.options = extend({}, this._getDefaultOptions(), options);
      this._popup = this.renderPopup();
      // @ts-expect-error
      this._popup.$wrapper().addClass(`${SUGGESTION_LIST_WRAPPER_CLASS} ${DROPDOWN_EDITOR_OVERLAY_CLASS}`);
      this._renderPreventFocusOut();
    }

    _getDefaultOptions() {
      return {
        dataSource: null,
      };
    }

    renderList($container, options) {
      const $list = $('<div>')
        .addClass(SUGGESTION_LIST_CLASS)
        .appendTo($container);
      this._list = this.options.editorInstance._createComponent($list, List, options);
    }

    renderPopup(): Popup {
      const { editorInstance } = this.options;
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
          show: {
            type: 'fade', duration: 0, from: 0, to: 1,
          },
          hide: {
            type: 'fade', duration: 400, from: 1, to: 0,
          },
        },
        fullScreen: false,
        maxHeight: this.maxHeight,
      };
    }

    _getListConfig(options) {
      return {
        dataSource: options.dataSource,
        onSelectionChanged: this.selectionChangedHandler.bind(this),
        selectionMode: 'single',
        pageLoadMode: 'scrollBottom',
      };
    }

    get maxHeight() {
      const window = windowUtils.getWindow();
      const windowHeight = window && getHeight(window) || 0;
      return Math.max(MIN_HEIGHT, windowHeight * 0.5);
    }

    selectionChangedHandler(e) {
      if (this._popup.option('visible')) {
        this._popup.hide();

        this.insertEmbedContent(e);
      }
    }

    _renderPreventFocusOut() {
      const eventName = addNamespace('mousedown', MODULE_NAMESPACE);
      // @ts-expect-error
      eventsEngine.on(this._popup.$wrapper(), eventName, (e) => {
        e.preventDefault();
      });
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
