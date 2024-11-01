import eventsEngine from '@js/common/core/events/core/events_engine';
import { addNamespace } from '@js/common/core/events/utils/index';
import localizationMessage from '@js/common/core/localization/message';
import $ from '@js/core/renderer';
import { extend } from '@js/core/utils/extend';
import { camelize, titleize } from '@js/core/utils/inflector';
import { each } from '@js/core/utils/iterator';
import { isObject, isString } from '@js/core/utils/type';
import type { Item } from '@js/ui/context_menu';
import ContextMenu from '@js/ui/context_menu';
import Quill from 'devextreme-quill';

import { getTableFormats } from '../utils/m_table_helper';
import { getDefaultClickHandler, getFormatHandlers, ICON_MAP } from '../utils/m_toolbar_helper';
import BaseModule from './m_base';

const MODULE_NAMESPACE = 'dxHtmlEditorTableContextMenu';

const CONTEXT_MENU_EVENT = addNamespace('dxcontextmenu', MODULE_NAMESPACE);
// eslint-disable-next-line import/no-mutable-exports
let TableContextMenuModule = BaseModule;

const localize = (name) => localizationMessage.format(`dxHtmlEditor-${camelize(name)}`);

if (Quill) {
  // @ts-expect-error
  TableContextMenuModule = class TableContextMenuModule extends BaseModule {
    quill: any;

    editorInstance: any;

    enabled: boolean;

    _quillContainer: any;

    _formatHandlers: any;

    _tableFormats: any;

    _contextMenu!: ContextMenu;

    _targetElement: any;

    constructor(quill, options) {
      // @ts-expect-error
      super(quill, options);
      this.enabled = !!options.enabled;
      this._quillContainer = this.editorInstance._getQuillContainer();
      // @ts-expect-error
      this.addCleanCallback(this.prepareCleanCallback());
      this._formatHandlers = getFormatHandlers(this);
      this._tableFormats = getTableFormats(quill);

      if (this.enabled) {
        this._enableContextMenu(options.items);
      }
    }

    _enableContextMenu(items?: Item[]) {
      this._contextMenu?.dispose();
      this._contextMenu = this._createContextMenu(items);

      this._attachEvents();
    }

    _attachEvents() {
      eventsEngine.on(this.editorInstance._getContent(), CONTEXT_MENU_EVENT, this._prepareContextMenuHandler());
    }

    _detachEvents() {
      eventsEngine.off(this.editorInstance._getContent(), CONTEXT_MENU_EVENT);
    }

    _createContextMenu(items) {
      const $container = $('<div>').appendTo(this.editorInstance.$element());
      const menuConfig = this._getMenuConfig(items);

      return this.editorInstance._createComponent($container, ContextMenu, menuConfig);
    }

    showPropertiesForm(type = 'cell') {
      const $element = $(this._targetElement).closest(type === 'cell' ? 'th, td' : 'table');
      this._contextMenu.hide();
      this._formatHandlers[`${type}Properties`]($element);
      this._targetElement = null;
    }

    _isAcceptableItem(widget, acceptableWidgetName) {
      return !widget || widget === acceptableWidgetName;
    }

    _handleObjectItem(item) {
      if (item.name && this._isAcceptableItem(item.widget, 'dxButton')) {
        const defaultButtonItemConfig = this._prepareMenuItemConfig(item.name);
        const buttonItemConfig = extend(true, defaultButtonItemConfig, item);

        return buttonItemConfig;
      } if (item.items) {
        item.items = this._prepareMenuItems(item.items);
        return item;
      }
      return item;
    }

    _prepareMenuItemConfig(name) {
      const iconName = ICON_MAP[name] ?? name;
      const buttonText = titleize(name);

      return {
        text: localize(buttonText),
        icon: iconName.toLowerCase(),
        onClick: this._formatHandlers[name] ?? getDefaultClickHandler(this, name),
      };
    }

    _prepareMenuItems(items) {
      const resultItems: Item[] = [];
      each(items, (_, item) => {
        let newItem;
        if (isObject(item)) {
          newItem = this._handleObjectItem(item);
        } else if (isString(item)) {
          newItem = this._prepareMenuItemConfig(item);
        }
        if (newItem) {
          resultItems.push(newItem);
        }
      });

      return resultItems;
    }

    _getMenuConfig(items) {
      const defaultItems = [
        {
          text: localize('insert'),
          items: [
            'insertHeaderRow',
            'insertRowAbove',
            'insertRowBelow',
            extend(this._prepareMenuItemConfig('insertColumnLeft'), { beginGroup: true }),
            'insertColumnRight',
          ],
        },
        {
          text: localize('delete'),
          items: [
            'deleteColumn',
            'deleteRow',
            'deleteTable',
          ],
        },
        extend(this._prepareMenuItemConfig('cellProperties'), { onClick: () => { this.showPropertiesForm('cell'); } }),
        extend(this._prepareMenuItemConfig('tableProperties'), { onClick: () => { this.showPropertiesForm('table'); } }),
      ];

      const customItems = this._prepareMenuItems(items?.length ? items : defaultItems);

      return {
        target: this._quillContainer,
        showEvent: null,
        hideOnParentScroll: false,
        items: customItems,
      };
    }

    _prepareContextMenuHandler() {
      return (event) => {
        if (this._isTableTarget(event.target)) {
          this._targetElement = event.target;
          this._setContextMenuPosition(event);
          this._contextMenu.show();
          event.preventDefault();
        }
      };
    }

    _setContextMenuPosition(event) {
      const startPosition = this._quillContainer.get(0).getBoundingClientRect();
      // @ts-expect-error
      this._contextMenu.option({
        position: {
          my: 'left top',
          at: 'left top',
          collision: 'fit fit',
          offset: { x: event.clientX - startPosition.left, y: event.clientY - startPosition.top },
        },
      });
    }

    _isTableTarget(targetElement) {
      return !!$(targetElement).closest('.dx-htmleditor-content td, .dx-htmleditor-content th').length;
    }

    clean() {
      this._detachEvents();
    }

    option(option, value) {
      if (option === 'tableContextMenu') {
        // @ts-expect-error
        this.handleOptionChangeValue(value);
        return;
      }

      if (option === 'enabled') {
        this.enabled = value;
        value ? this._enableContextMenu() : this.clean();
      } else if (option === 'items') {
        this._contextMenu?.dispose();
        this._contextMenu = this._createContextMenu(value);
      }
    }

    prepareCleanCallback() {
      return () => {
        this.clean();
      };
    }
  };
}

export default TableContextMenuModule;
