"use strict";

exports.GanttToolbar = exports.GanttContextMenuBar = void 0;
var _renderer = _interopRequireDefault(require("../../core/renderer"));
var _toolbar = _interopRequireDefault(require("../toolbar"));
var _context_menu = _interopRequireDefault(require("../context_menu"));
var _message = _interopRequireDefault(require("../../localization/message"));
var _extend = require("../../core/utils/extend");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
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
  toggleDependencies: 15
};
class Bar {
  constructor(element, owner) {
    this._element = element;
    this._owner = owner;
    this._items = [];
    this._createControl();
  }
  createItems(items) {
    this._cache = null;
    this._items = this._createItemsCore(items);
    this._menu.option('items', this._items);
  }
  _createItemsCore(items) {
    return items.map(item => {
      let result;
      if (typeof item === 'string') {
        result = this._createItemByText(item);
      } else {
        result = item.name ? (0, _extend.extend)(this._createItemByText(item.name), item) : (0, _extend.extend)(this._getDefaultItemOptions(), item);
      }
      if (item.items) {
        result.items = this._createItemsCore(item.items);
      }
      return result;
    });
  }
  _createItemByText(text) {
    switch (text.toLowerCase()) {
      case 'separator':
        return this._createSeparator();
      case 'undo':
        return this._createDefaultItem(COMMANDS.undo, _message.default.format('dxGantt-undo'), this._getIcon('undo'));
      case 'redo':
        return this._createDefaultItem(COMMANDS.redo, _message.default.format('dxGantt-redo'), this._getIcon('redo'));
      case 'expandall':
        return this._createDefaultItem(COMMANDS.expandAll, _message.default.format('dxGantt-expandAll'), this._getIcon('expand'));
      case 'collapseall':
        return this._createDefaultItem(COMMANDS.collapseAll, _message.default.format('dxGantt-collapseAll'), this._getIcon('collapse'));
      case 'addtask':
        return this._createDefaultItem(COMMANDS.createTask, _message.default.format('dxGantt-addNewTask'), this._getIcon('add'));
      case 'addsubtask':
        return this._createDefaultItem(COMMANDS.createSubTask, _message.default.format('dxGantt-contextMenuNewSubtask'), this._getIcon('add-sub-task'));
      case 'deletetask':
        return this._createDefaultItem(COMMANDS.removeTask, _message.default.format('dxGantt-deleteSelectedTask'), this._getIcon('delete'));
      case 'deletedependency':
        return this._createDefaultItem(COMMANDS.removeDependency, _message.default.format('dxGantt-contextMenuDeleteDependency'), this._getIcon('delete-dependency'));
      case 'zoomin':
        return this._createDefaultItem(COMMANDS.zoomIn, _message.default.format('dxGantt-zoomIn'), this._getIcon('zoom-in'));
      case 'zoomout':
        return this._createDefaultItem(COMMANDS.zoomOut, _message.default.format('dxGantt-zoomOut'), this._getIcon('zoom-out'));
      case 'fullscreen':
        return this._createDefaultItem(COMMANDS.fullScreen, _message.default.format('dxGantt-fullScreen'), this._getIcon('full-screen'));
      case 'taskdetails':
        return this._createDefaultItem(COMMANDS.taskInformation, _message.default.format('dxGantt-dialogTaskDetailsTitle') + '...', this._getIcon('task-details'));
      case 'resourcemanager':
        return this._createDefaultItem(COMMANDS.resourceManager, _message.default.format('dxGantt-dialogResourceManagerTitle'), this._getIcon('resource-manager'));
      case 'showresources':
        return this._createDefaultItem(COMMANDS.toggleResources, _message.default.format('dxGantt-showResources'), this._getIcon('toggle-resources'));
      case 'showdependencies':
        return this._createDefaultItem(COMMANDS.toggleDependencies, _message.default.format('dxGantt-showDependencies'), this._getIcon('toggle-dependencies'));
      default:
        return (0, _extend.extend)(this._getDefaultItemOptions(), {
          options: {
            text: text
          }
        });
    }
  }
  _getDefaultItemOptions() {
    return {};
  }
  _getItemsCache() {
    if (!this._cache) {
      this._cache = {};
      this._fillCache(this._items);
    }
    return this._cache;
  }
  _fillCache(items) {
    items.forEach(item => {
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
  _getIcon(name) {
    return 'dx-gantt-i dx-gantt-i-' + name;
  }

  // IBar
  getCommandKeys() {
    const itemsCache = this._getItemsCache();
    const result = [];
    for (const itemKey in itemsCache) {
      result.push(parseInt(itemKey));
    }
    return result;
  }
  setItemEnabled(key, enabled) {
    const itemsCache = this._getItemsCache();
    itemsCache[key].forEach(item => {
      item.disabled = !enabled;
    });
  }
  setItemVisible(key, visible) {
    const itemsCache = this._getItemsCache();
    itemsCache[key].forEach(item => {
      item.visible = visible;
    });
  }
  setItemValue(_key, _value) {}
  setEnabled(enabled) {
    this._menu.option('disabled', !enabled);
  }
  updateItemsList() {}
  isVisible() {
    return true;
  }
  isContextMenu() {
    return false;
  }
  completeUpdate() {}
}
class GanttToolbar extends Bar {
  _createControl() {
    this._menu = this._owner._createComponent(this._element, _toolbar.default, {
      onItemClick: e => {
        const commandId = e.itemData.commandId;
        if (commandId !== undefined) {
          this._executeCommand(e.itemData.commandId);
        }
      }
    });
  }
  _executeCommand(commandId) {
    switch (commandId) {
      case COMMANDS.toggleResources:
        this._owner.option('showResources', !this._owner.option('showResources'));
        break;
      case COMMANDS.toggleDependencies:
        this._owner.option('showDependencies', !this._owner.option('showDependencies'));
        break;
      default:
        this._owner._executeCoreCommand(commandId);
    }
  }
  _createDefaultItem(commandId, hint, icon) {
    return {
      commandId: commandId,
      disabled: true,
      widget: 'dxButton',
      location: 'before',
      options: {
        icon: icon,
        stylingMode: 'text',
        hint: hint
      }
    };
  }
  _createSeparator() {
    return {
      location: 'before',
      template: (_data, _index, element) => {
        (0, _renderer.default)(element).addClass(TOOLBAR_SEPARATOR_CLASS);
      }
    };
  }
  _getDefaultItemOptions() {
    return {
      location: 'before',
      widget: 'dxButton'
    };
  }

  // IBar
  completeUpdate() {
    this._menu.option('items', this._items);
  }
}
exports.GanttToolbar = GanttToolbar;
class GanttContextMenuBar extends Bar {
  _createControl() {
    this._menu = this._owner._createComponent(this._element, _context_menu.default, {
      showEvent: undefined,
      onItemClick: e => {
        if (e.itemData.commandId !== undefined) {
          this._owner._executeCoreCommand(e.itemData.commandId);
        } else {
          if (e.itemData.name !== undefined) {
            this._owner._actionsManager.raiseCustomCommand(e.itemData.name);
          }
        }
      }
    });
  }
  createItems(items) {
    if (!items || items.length === 0) {
      items = this._getDefaultItems();
    }
    super.createItems(items);
  }
  _getDefaultItems() {
    return [{
      text: _message.default.format('dxGantt-dialogButtonAdd'),
      commandId: COMMANDS.taskAddContextItem,
      icon: this._getIcon('add'),
      items: [{
        text: _message.default.format('dxGantt-contextMenuNewTask'),
        commandId: COMMANDS.createTask,
        icon: this._getIcon('add-task')
      }, {
        text: _message.default.format('dxGantt-contextMenuNewSubtask'),
        commandId: COMMANDS.createSubTask,
        icon: this._getIcon('add-sub-task')
      }]
    }, {
      text: _message.default.format('dxGantt-dialogTaskDetailsTitle') + '...',
      commandId: COMMANDS.taskInformation,
      icon: this._getIcon('task-details')
    }, {
      text: _message.default.format('dxGantt-contextMenuDeleteTask'),
      commandId: COMMANDS.removeTask,
      icon: this._getIcon('delete')
    }, {
      text: _message.default.format('dxGantt-contextMenuDeleteDependency'),
      commandId: COMMANDS.removeDependency,
      icon: this._getIcon('delete-dependency')
    }];
  }
  _createDefaultItem(commandId, text, icon) {
    return {
      commandId: commandId,
      text: text,
      icon: icon
    };
  }
  show(point, items) {
    this._menu.option('items', items || this._items);
    this._menu.option('position.offset', {
      x: point.x,
      y: point.y
    });
    this._menu.option('position.collision', 'fit');
    this._menu.show();
  }
  hide() {
    this._menu.hide();
  }

  // IBar
  isContextMenu() {
    return true;
  }
}
exports.GanttContextMenuBar = GanttContextMenuBar;