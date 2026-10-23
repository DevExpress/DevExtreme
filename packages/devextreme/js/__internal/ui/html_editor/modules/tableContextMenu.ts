import eventsEngine from '@js/common/core/events/core/events_engine';
import { addNamespace } from '@js/common/core/events/utils/index';
import localizationMessage from '@js/common/core/localization/message';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { extend } from '@js/core/utils/extend';
import { camelize, titleize } from '@js/core/utils/inflector';
import { each } from '@js/core/utils/iterator';
import { isObject, isString } from '@js/core/utils/type';
import type { DxEvent } from '@js/events';
import type { InitializedEvent } from '@js/ui/context_menu';
import ContextMenu from '@js/ui/context_menu';
import type {
  ContextMenuItem,
  dxHtmlEditorTableContextMenu,
  HtmlEditorPredefinedContextMenuItem,
} from '@js/ui/html_editor';
import Quill from 'devextreme-quill';

import type { FormatHandlers } from '../types';
import type { QuillInstance } from '../types/quill';
import { getTableFormats } from '../utils/table_helper';
import { getDefaultClickHandler, getFormatHandlers, ICON_MAP } from '../utils/toolbar_helper';
import type { BaseModuleOptions } from './base';
import BaseModule from './base';

interface TableContextMenuModuleOptions extends BaseModuleOptions, dxHtmlEditorTableContextMenu {}

type ContextMenuItems = dxHtmlEditorTableContextMenu['items'];

type PredefinedItemHandler = FormatHandlers[
  HtmlEditorPredefinedContextMenuItem & keyof FormatHandlers
];

interface MenuItemConfig {
  text: string;
  icon: string;
  onClick: PredefinedItemHandler;
}

interface TableContextMenuConfig {
  target: dxElementWrapper;
  showEvent: null;
  hideOnParentScroll: boolean;
  onInitialized: (e: InitializedEvent) => void;
  items: ContextMenuItem[];
}

const MODULE_NAMESPACE = 'dxHtmlEditorTableContextMenu';

const CONTEXT_MENU_EVENT = addNamespace('dxcontextmenu', MODULE_NAMESPACE);
// eslint-disable-next-line import/no-mutable-exports
let TableContextMenuModule = BaseModule;

const localize = (name: string): string => localizationMessage.format(`dxHtmlEditor-${camelize(name)}`);

if (Quill) {
  TableContextMenuModule = class extends BaseModule {
    declare options: TableContextMenuModuleOptions;

    enabled: boolean;

    _quillContainer: dxElementWrapper;

    _formatHandlers: FormatHandlers;

    _tableFormats: string[];

    _contextMenu!: ContextMenu;

    _targetElement?: Element | null;

    constructor(quill: QuillInstance, options: TableContextMenuModuleOptions) {
      super(quill, options);
      this.enabled = !!options.enabled;
      this._quillContainer = this.editorInstance._getQuillContainer();
      this.addCleanCallback(this.prepareCleanCallback());
      this._formatHandlers = getFormatHandlers(this);
      this._tableFormats = getTableFormats(quill);

      if (this.enabled) {
        this._enableContextMenu(options.items);
      }
    }

    _enableContextMenu(items?: ContextMenuItems): void {
      this._contextMenu?.dispose();
      this._contextMenu = this._createContextMenu(items);

      this._attachEvents();
    }

    _attachEvents(): void {
      eventsEngine.on(
        this.editorInstance._getContent(),
        CONTEXT_MENU_EVENT,
        this._prepareContextMenuHandler(),
      );
    }

    _detachEvents(): void {
      eventsEngine.off(this.editorInstance._getContent(), CONTEXT_MENU_EVENT);
    }

    _onContextMenuInitialized(e: InitializedEvent): void {
      // @ts-expect-error component is optional in InitializedEventInfo; it is always set
      e.component.registerKeyHandler('escape', () => {
        this.editorInstance.focus();
      });
    }

    _createContextMenu(items?: ContextMenuItems): ContextMenu {
      const $container = $('<div>').appendTo(this.editorInstance.$element());
      const menuConfig = this._getMenuConfig(items);

      return this.editorInstance._createComponent<ContextMenu, TableContextMenuConfig>(
        $container,
        ContextMenu,
        menuConfig,
      );
    }

    showPropertiesForm(type: 'cell' | 'table' = 'cell'): void {
      const $element = $(this._targetElement).closest(type === 'cell' ? 'th, td' : 'table');
      // eslint-disable-next-line @typescript-eslint/no-floating-promises -- result not used
      this._contextMenu.hide();
      this._formatHandlers[`${type}Properties`]($element);
      this._targetElement = null;
    }

    _isAcceptableItem(widget: unknown, acceptableWidgetName: string): boolean {
      return !widget || widget === acceptableWidgetName;
    }

    _handleObjectItem(item: ContextMenuItem): ContextMenuItem {
      const widget = 'widget' in item ? item.widget : undefined;
      if (item.name && this._isAcceptableItem(widget, 'dxButton')) {
        const defaultButtonItemConfig = this._prepareMenuItemConfig(item.name);
        const buttonItemConfig = extend(true, defaultButtonItemConfig, item);

        return buttonItemConfig;
      } if (item.items) {
        item.items = this._prepareMenuItems(item.items);
        return item;
      }
      return item;
    }

    _prepareMenuItemConfig(name: HtmlEditorPredefinedContextMenuItem): MenuItemConfig {
      const iconName: string = ICON_MAP[name] ?? name;
      const buttonText = titleize(name);
      const formatHandler: PredefinedItemHandler | undefined = this._formatHandlers[name];

      return {
        text: localize(buttonText),
        icon: iconName.toLowerCase(),
        onClick: formatHandler ?? getDefaultClickHandler(this, name),
      };
    }

    _prepareMenuItems(items: NonNullable<ContextMenuItems>): ContextMenuItem[] {
      const resultItems: ContextMenuItem[] = [];
      each(items, (_, item) => {
        // eslint-disable-next-line @typescript-eslint/init-declarations -- assigned in the if-chain
        let newItem: ContextMenuItem | undefined;
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

    _getMenuConfig(items?: ContextMenuItems): TableContextMenuConfig {
      const defaultItems: NonNullable<ContextMenuItems> = [
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
        onInitialized: (e: InitializedEvent): void => {
          this._onContextMenuInitialized(e);
        },
        items: customItems,
      };
    }

    _prepareContextMenuHandler(): (event: DxEvent<MouseEvent>) => void {
      return (event: DxEvent<MouseEvent>): void => {
        if (this._isTableTarget(event.target)) {
          this._targetElement = event.target;
          this._setContextMenuPosition(event);
          // eslint-disable-next-line @typescript-eslint/no-floating-promises -- result not used
          this._contextMenu.show();
          event.preventDefault();
        }
      };
    }

    _setContextMenuPosition(event: DxEvent<MouseEvent>): void {
      const startPosition = this._quillContainer.get(0).getBoundingClientRect();
      // @ts-expect-error 'fit fit' is not in CollisionResolutionCombination; it resolves as 'fit'
      this._contextMenu.option({
        position: {
          my: 'left top',
          at: 'left top',
          collision: 'fit fit',
          offset: { x: event.clientX - startPosition.left, y: event.clientY - startPosition.top },
        },
      });
    }

    _isTableTarget(targetElement: Element): boolean {
      return !!$(targetElement).closest('.dx-htmleditor-content td, .dx-htmleditor-content th').length;
    }

    clean(): void {
      this._detachEvents();
    }

    option(option: string, value: unknown): void {
      if (option === 'tableContextMenu') {
        this.handleOptionChangeValue(value);
        return;
      }

      if (option === 'enabled') {
        // @ts-expect-error the option value is untyped (HtmlEditor._moduleOptionChanged)
        this.enabled = value;
        if (value) {
          this._enableContextMenu(this.editorInstance.option('tableContextMenu')?.items);
        } else {
          this.clean();
        }
      } else if (option === 'items') {
        this._contextMenu?.dispose();
        // @ts-expect-error the option value is untyped (HtmlEditor._moduleOptionChanged)
        this._contextMenu = this._createContextMenu(value);
      }
    }

    prepareCleanCallback(): () => void {
      return () => {
        this.clean();
      };
    }
  };
}

export default TableContextMenuModule;
