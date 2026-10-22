import eventsEngine from '@js/common/core/events/core/events_engine';
import { addNamespace } from '@js/common/core/events/utils';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { extend } from '@js/core/utils/extend';
import { getHeight } from '@js/core/utils/size';
import type { DxEvent } from '@js/events';
import type { dxHtmlEditorVariables } from '@js/ui/html_editor';
import type {
  Properties as ListProperties,
  SelectionChangedEvent as ListSelectionChangedEvent,
} from '@js/ui/list';
import type { Properties as PopupProperties } from '@js/ui/popup';
import windowUtils from '@ts/core/utils/m_window';
import List from '@ts/ui/list/list.edit.search';
import Popup from '@ts/ui/popup/popup.full';
import Quill from 'devextreme-quill';

import type { QuillInstance } from '../types/quill';
import type { BaseHtmlEditorModule, BaseModuleOptions } from './base';
import BaseModule from './base';

const MODULE_NAMESPACE = 'dxHtmlEditorPopupModule';

export interface ListPopupModuleOptions extends BaseModuleOptions {
  dataSource?: dxHtmlEditorVariables['dataSource'];
}

export interface ListPopupModuleDefaults {
  dataSource: null;
}

export interface ListPopupModuleInstance extends BaseHtmlEditorModule {
  _list: List;
  _popup: Popup;
  caretPosition?: number;
  options: ListPopupModuleOptions;
  readonly maxHeight: number;
  renderPopup: () => Popup;
  selectionChangedHandler: (e: ListSelectionChangedEvent) => void;
  _renderPreventFocusOut: () => void;
  savePosition: (position: number) => void;
  getPosition: () => number | undefined;
  // eslint-disable-next-line @typescript-eslint/method-signature-style -- overridden by methods
  _getDefaultOptions(): ListPopupModuleDefaults;
  // eslint-disable-next-line @typescript-eslint/method-signature-style -- overridden by methods
  renderList($container: dxElementWrapper, options: ListProperties): void;
  // eslint-disable-next-line @typescript-eslint/method-signature-style -- overridden by methods
  _getPopupConfig(): PopupProperties;
  // eslint-disable-next-line @typescript-eslint/method-signature-style -- overridden by methods
  _getListConfig(options: ListPopupModuleOptions): ListProperties;
  // eslint-disable-next-line @typescript-eslint/method-signature-style -- overridden by methods
  insertEmbedContent(selectionChangedEvent: ListSelectionChangedEvent): void;
  // eslint-disable-next-line @typescript-eslint/method-signature-style -- overridden by methods
  showPopup(): void;
}

export type ListPopupModuleClass = new (
  quill: QuillInstance,
  options: ListPopupModuleOptions,
) => ListPopupModuleInstance;

// @ts-expect-error the no-Quill stand-in has no module members; subclasses only need a constructor
// eslint-disable-next-line import/no-mutable-exports
let ListPopupModule: ListPopupModuleClass = BaseModule;

if (Quill) {
  const SUGGESTION_LIST_CLASS = 'dx-suggestion-list';
  const SUGGESTION_LIST_WRAPPER_CLASS = 'dx-suggestion-list-wrapper';
  const DROPDOWN_EDITOR_OVERLAY_CLASS = 'dx-dropdowneditor-overlay';

  const MIN_HEIGHT = 100;
  ListPopupModule = class extends BaseModule {
    _list!: List;

    _popup: Popup;

    caretPosition?: number;

    declare options: ListPopupModuleOptions;

    constructor(quill: QuillInstance, options: ListPopupModuleOptions) {
      super(quill, options);

      this.options = extend({}, this._getDefaultOptions(), options);
      this._popup = this.renderPopup();
      // @ts-expect-error $wrapper() is typed as possibly null; renderPopup() has rendered it
      this._popup.$wrapper().addClass(`${SUGGESTION_LIST_WRAPPER_CLASS} ${DROPDOWN_EDITOR_OVERLAY_CLASS}`);
      this._renderPreventFocusOut();
    }

    _getDefaultOptions(): ListPopupModuleDefaults {
      return {
        dataSource: null,
      };
    }

    renderList($container: dxElementWrapper, options: ListProperties): void {
      const $list = $('<div>')
        .addClass(SUGGESTION_LIST_CLASS)
        .appendTo($container);
      this._list = this.options.editorInstance._createComponent($list, List, options);
    }

    renderPopup(): Popup {
      const { editorInstance } = this.options;
      const $container = $('<div>').appendTo(editorInstance.$element());
      const popupConfig = this._getPopupConfig();

      return editorInstance._createComponent<Popup, PopupProperties>(
        $container,
        Popup,
        popupConfig,
      );
    }

    _getPopupConfig(): PopupProperties {
      return {
        contentTemplate: (contentElem): void => {
          const listConfig = this._getListConfig(this.options);
          this.renderList($(contentElem), listConfig);
        },
        deferRendering: false,
        onShown: (): void => {
          this._list.focus();
        },
        onHidden: (): void => {
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

    _getListConfig(options: ListPopupModuleOptions): ListProperties {
      return {
        dataSource: options.dataSource,
        onSelectionChanged: this.selectionChangedHandler.bind(this),
        selectionMode: 'single',
        pageLoadMode: 'scrollBottom',
      };
    }

    get maxHeight(): number {
      const window = windowUtils.getWindow();
      const windowHeight = (window && getHeight(window)) || 0;
      return Math.max(MIN_HEIGHT, windowHeight * 0.5);
    }

    selectionChangedHandler(e: ListSelectionChangedEvent): void {
      if (this._popup.option('visible') && e.addedItems.length) {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises -- result not used
        this._popup.hide();

        this.insertEmbedContent(e);
      }
    }

    _renderPreventFocusOut(): void {
      const eventName = addNamespace('mousedown', MODULE_NAMESPACE);
      eventsEngine.on(this._popup.$wrapper(), eventName, (e: DxEvent) => {
        e.preventDefault();
      });
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    insertEmbedContent(selectionChangedEvent: ListSelectionChangedEvent): void { }

    showPopup(): void {
      if (this._popup) {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises -- result not used
        this._popup.show();
      }
    }

    savePosition(position: number): void {
      this.caretPosition = position;
    }

    getPosition(): number | undefined {
      return this.caretPosition;
    }
  };
}

export default ListPopupModule;
