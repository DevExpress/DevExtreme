import ContextMenu from "../context_menu";

class GanttContextMenuBar { // IBar
    constructor(element, owner) {
        this._element = element;
        this._owner = owner;
        this._createControl();
    }
    _createControl() {
        this._createItems();

        this._menu = this._owner._createComponent(this._element, ContextMenu, {
            showEvent: undefined,
            items: this._items,
            onItemClick: (e) => {
                const commandId = e.itemData.commandId;
                if(commandId !== undefined) {
                    this._owner._executeCoreCommand(e.itemData.commandId);
                }
            }
        });
    }
    _createItems() {
        const commandIds = {
            createTask: 0,
            createSubTask: 1,
            removeTask: 2,
            removeDependency: 3,
            showTasksDialog: 4,
            addTask: 5
        };
        this._items = [
            { text: "Add",
                commandId: commandIds.addTask,
                items: [
                    { text: "Task", commandId: commandIds.createTask },
                    { text: "Subtask", commandId: commandIds.createSubTask }
                ]
            },
            { text: "Task Details...", commandId: commandIds.showTasksDialog },
            { text: "Remove Task", commandId: commandIds.removeTask },
            { text: "Remove Dependency", commandId: commandIds.removeDependency },
        ];
    }
    // IBar
    getCommandKeys() {
        const itemsCache = this._getItemsCache();
        const result = [];
        for(let itemKey in itemsCache) {
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
        this._menu.option("disabled", !enabled);
    }
    updateItemsList() {}
    isVisible() {
        return true;
    }
    isContextMenu() {
        return true;
    }
    // end IBar

    show(point) {
        this._menu.option("items", this._items);
        this._menu.option("position.offset", { x: point.x, y: point.y });
        this._menu.show();
    }

    _getItemsCache() {
        if(!this._cache) {
            this._cache = {};
            this._fillCache(this._items);
        }
        return this._cache;
    }
    _fillCache(items) {
        items.forEach(item => {
            const key = item.commandId;
            if(key !== undefined) {
                if(!this._cache[key]) {
                    this._cache[key] = [];
                }
                this._cache[key].push(item);
            }
            if(item.items) {
                this._fillCache(item.items);
            }
        });
    }
}

module.exports = GanttContextMenuBar;
