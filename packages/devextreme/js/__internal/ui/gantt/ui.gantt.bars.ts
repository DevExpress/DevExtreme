/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
// eslint-disable-next-line max-classes-per-file
import messageLocalization from '@js/common/core/localization/message';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { extend } from '@js/core/utils/extend';
import type { ToolbarItem } from '@js/ui/gantt';
import ContextMenu from '@ts/ui/context_menu/context_menu';
import ToolbarMenu from '@ts/ui/toolbar/toolbar';

const TOOLBAR_SEPARATOR_CLASS = 'dx-gantt-toolbar-separator';

const COMMANDS = {
  createTask: 0,
  createSubTask: 1,
  removeTask: 2,
  removeDependency: 3,
  taskInformation: 4,
  taskAddContextItem: 5,
  undo: 6,
  redo: 7,
  zoomIn: 8,
  zoomOut: 9,
  fullScreen: 10,
  collapseAll: 11,
  expandAll: 12,
  resourceManager: 13,
  toggleResources: 14,
  toggleDependencies: 15,
};

export interface GanttBarItem extends ToolbarItem {
  commandId?: number;
  icon?: string;
  items?: GanttBarItem[];
}

class Bar {
  _element: dxElementWrapper;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _owner: any;

  _menu?: ToolbarMenu;

  _items: GanttBarItem[];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _cache: any;

  constructor(element, owner) {
    this._element = element;
    this._owner = owner;
    this._items = [];
    this._createControl();
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _createControl() {}

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _createSeparator() {}

  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _createDefaultItem(_commandId: number, _text: string, _icon: string): GanttBarItem {}

  createItems(items): void {
    this._cache = null;
    this._items = this._createItemsCore(items);
    this._menu?.option('items', this._items);
  }

  _createItemsCore(items): GanttBarItem[] {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return items.map((item) => {
      // eslint-disable-next-line @typescript-eslint/init-declarations
      let result;
      if (typeof item === 'string') {
        result = this._createItemByText(item);
      } else {
        result = item.name
          ? extend(this._createItemByText(item.name), item)
          : extend(this._getDefaultItemOptions(), item);
      }
      if (item.items) {
        result.items = this._createItemsCore(item.items);
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return result;
    });
  }

  _createItemByText(text: string): GanttBarItem {
    switch (text.toLowerCase()) {
      case 'separator':
        // @ts-expect-error ts-error
        return this._createSeparator();
      case 'undo':
        return this._createDefaultItem(
          COMMANDS.undo,
          messageLocalization.format('dxGantt-undo'),
          this._getIcon('undo'),
        );
      case 'redo':
        return this._createDefaultItem(
          COMMANDS.redo,
          messageLocalization.format('dxGantt-redo'),
          this._getIcon('redo'),
        );
      case 'expandall':
        return this._createDefaultItem(
          COMMANDS.expandAll,
          messageLocalization.format('dxGantt-expandAll'),
          this._getIcon('expand'),
        );
      case 'collapseall':
        return this._createDefaultItem(
          COMMANDS.collapseAll,
          messageLocalization.format('dxGantt-collapseAll'),
          this._getIcon('collapse'),
        );
      case 'addtask':
        return this._createDefaultItem(
          COMMANDS.createTask,
          messageLocalization.format('dxGantt-addNewTask'),
          this._getIcon('add'),
        );
      case 'addsubtask':
        return this._createDefaultItem(
          COMMANDS.createSubTask,
          messageLocalization.format('dxGantt-contextMenuNewSubtask'),
          this._getIcon('add-sub-task'),
        );
      case 'deletetask':
        return this._createDefaultItem(
          COMMANDS.removeTask,
          messageLocalization.format('dxGantt-deleteSelectedTask'),
          this._getIcon('delete'),
        );
      case 'deletedependency':
        return this._createDefaultItem(
          COMMANDS.removeDependency,
          messageLocalization.format('dxGantt-contextMenuDeleteDependency'),
          this._getIcon('delete-dependency'),
        );
      case 'zoomin':
        return this._createDefaultItem(
          COMMANDS.zoomIn,
          messageLocalization.format('dxGantt-zoomIn'),
          this._getIcon('zoom-in'),
        );
      case 'zoomout':
        return this._createDefaultItem(
          COMMANDS.zoomOut,
          messageLocalization.format('dxGantt-zoomOut'),
          this._getIcon('zoom-out'),
        );
      case 'fullscreen':
        return this._createDefaultItem(
          COMMANDS.fullScreen,
          messageLocalization.format('dxGantt-fullScreen'),
          this._getIcon('full-screen'),
        );
      case 'taskdetails':
        return this._createDefaultItem(
          COMMANDS.taskInformation,
          `${messageLocalization.format('dxGantt-dialogTaskDetailsTitle')}...`,
          this._getIcon('task-details'),
        );
      case 'resourcemanager':
        return this._createDefaultItem(
          COMMANDS.resourceManager,
          messageLocalization.format('dxGantt-dialogResourceManagerTitle'),
          this._getIcon('resource-manager'),
        );
      case 'showresources':
        return this._createDefaultItem(
          COMMANDS.toggleResources,
          messageLocalization.format('dxGantt-showResources'),
          this._getIcon('toggle-resources'),
        );
      case 'showdependencies':
        return this._createDefaultItem(
          COMMANDS.toggleDependencies,
          messageLocalization.format('dxGantt-showDependencies'),
          this._getIcon('toggle-dependencies'),
        );

      default:
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return extend(this._getDefaultItemOptions(), {
          options: { text },
        });
    }
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _getDefaultItemOptions() {
    return {};
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _getItemsCache() {
    if (!this._cache) {
      this._cache = {};
      this._fillCache(this._items);
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this._cache;
  }

  _fillCache(items): void {
    items.forEach((item): void => {
      const key = item.commandId;
      if (key !== undefined) {
        if (!this._cache[key]) {
          this._cache[key] = [];
        }
        this._cache[key].push(item);
      }
      if (item.items) {
        this._fillCache(item.items);
      }
    });
  }

  _getIcon(name: string): string {
    return `dx-gantt-i dx-gantt-i-${name}`;
  }

  // IBar
  getCommandKeys(): number[] {
    const itemsCache = this._getItemsCache();
    const result: number[] = [];
    // eslint-disable-next-line no-restricted-syntax,guard-for-in
    for (const itemKey in itemsCache) {
      result.push(parseInt(itemKey, 10));
    }
    return result;
  }

  setItemEnabled(key, enabled: boolean): void {
    const itemsCache = this._getItemsCache();
    itemsCache[key].forEach((item): void => {
      item.disabled = !enabled;
    });
  }

  setItemVisible(key, visible: boolean): void {
    const itemsCache = this._getItemsCache();
    itemsCache[key].forEach((item) => {
      item.visible = visible;
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setItemValue(_key, _value): void {}

  setEnabled(enabled: boolean): void {
    this._menu?.option('disabled', !enabled);
  }

  updateItemsList(): void {}

  isVisible(): boolean {
    return true;
  }

  isContextMenu(): boolean {
    return false;
  }

  completeUpdate(): void {}
}

export class GanttToolbar extends Bar {
  _createControl(): void {
    this._menu = this._owner._createComponent(this._element, ToolbarMenu, {
      onItemClick: (e) => {
        const { commandId } = e.itemData;
        if (commandId !== undefined) {
          this._owner._executeCoreCommand(commandId);
        }
      },
    });
  }

  _createDefaultItem(commandId: number, hint: string, icon: string): GanttBarItem {
    return {
      commandId,
      disabled: true,
      widget: 'dxButton',
      location: 'before',
      options: {
        icon,
        stylingMode: 'text',
        hint,
      },
    };
  }

  _createSeparator(): GanttBarItem {
    return {
      location: 'before',
      template: (_data, _index, element): void => {
        $(element).addClass(TOOLBAR_SEPARATOR_CLASS);
      },
    };
  }

  _getDefaultItemOptions(): GanttBarItem {
    return {
      location: 'before',
      widget: 'dxButton',
    };
  }

  // IBar
  completeUpdate(): void {
    this._menu?.option('items', this._items);
  }
}

export class GanttContextMenuBar extends Bar {
  _createControl(): void {
    this._menu = this._owner._createComponent(this._element, ContextMenu, {
      showEvent: undefined,
      onItemClick: (e) => {
        if (e.itemData.commandId !== undefined) {
          this._owner._executeCoreCommand(e.itemData.commandId);
        } else if (e.itemData.name !== undefined) {
          this._owner._actionsManager.raiseCustomCommand(e.itemData.name);
        }
      },
    });
  }

  createItems(items): void {
    if (!items || items.length === 0) {
      // eslint-disable-next-line no-param-reassign
      items = this._getDefaultItems();
    }
    super.createItems(items);
  }

  _getDefaultItems(): GanttBarItem[] {
    return [
      {
        text: messageLocalization.format('dxGantt-dialogButtonAdd'),
        commandId: COMMANDS.taskAddContextItem,
        icon: this._getIcon('add'),
        items: [
          {
            text: messageLocalization.format('dxGantt-contextMenuNewTask'),
            commandId: COMMANDS.createTask,
            icon: this._getIcon('add-task'),
          },
          {
            text: messageLocalization.format('dxGantt-contextMenuNewSubtask'),
            commandId: COMMANDS.createSubTask,
            icon: this._getIcon('add-sub-task'),
          },
        ],
      },
      {
        text: `${messageLocalization.format(
          'dxGantt-dialogTaskDetailsTitle',
        )}...`,
        commandId: COMMANDS.taskInformation,
        icon: this._getIcon('task-details'),
      },
      {
        text: messageLocalization.format('dxGantt-contextMenuDeleteTask'),
        commandId: COMMANDS.removeTask,
        icon: this._getIcon('delete'),
      },
      {
        text: messageLocalization.format('dxGantt-contextMenuDeleteDependency'),
        commandId: COMMANDS.removeDependency,
        icon: this._getIcon('delete-dependency'),
      },
    ];
  }

  _createDefaultItem(commandId: number, text: string, icon: string): GanttBarItem {
    return {
      commandId,
      text,
      icon,
    };
  }

  show(point, items): void {
    this._menu?.option('items', items || this._items);
    this._menu?.option('position.offset', { x: point.x, y: point.y });
    this._menu?.option('position.collision', 'fit');
    // @ts-expect-error ts-error
    this._menu.show();
  }

  hide(): void {
    // @ts-expect-error ts-error
    this._menu.hide();
  }

  // IBar
  isContextMenu(): boolean {
    return true;
  }
}
