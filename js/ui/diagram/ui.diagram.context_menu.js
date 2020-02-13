import $ from '../../core/renderer';

import Widget from '../widget/ui.widget';
import ContextMenu from '../context_menu';
import DiagramCommandsManager from './diagram.commands_manager';
import DiagramMenuHelper from './ui.diagram.menu_helper';

import DiagramBar from './diagram.bar';
import { getDiagram } from './diagram.importer';

const DIAGRAM_TOUCHBAR_CLASS = 'dx-diagram-touchbar';
const DIAGRAM_TOUCHBAR_TARGET_CLASS = 'dx-diagram-touchbar-target';
const DIAGRAM_TOUCHBAR_MIN_UNWRAPPED_WIDTH = 800;
const DIAGRAM_TOUCHBAR_Y_OFFSET = 32;

class DiagramContextMenu extends Widget {
    _init() {
        super._init();
        this._createOnVisibleChangedAction();
        this._createOnItemClickAction();
        this._tempState = undefined;

        this._commands = [];
        this._commandToIndexMap = {};
        this.bar = new ContextMenuBar(this);
    }
    _initMarkup() {
        super._initMarkup();

        this._commands = this._getCommands();
        this._commandToIndexMap = {};
        this._fillCommandToIndexMap(this._commands, []);

        this._$contextMenuTargetElement = $('<div>')
            .addClass(DIAGRAM_TOUCHBAR_TARGET_CLASS)
            .appendTo(this.$element());

        const $contextMenu = $('<div>')
            .appendTo(this.$element());

        const { Browser } = getDiagram();
        this._contextMenuInstance = this._createComponent($contextMenu, ContextMenu, {
            closeOnOutsideClick: false,
            showEvent: '',
            cssClass: Browser.TouchUI ? DIAGRAM_TOUCHBAR_CLASS : DiagramMenuHelper.getContextMenuCssClass(),
            items: this._getItems(this._commands),
            focusStateEnabled: false,
            position: (Browser.TouchUI ? {
                my: { x: 'center', y: 'bottom' },
                at: { x: 'center', y: 'top' },
                of: this._$contextMenuTargetElement
            } : {}),
            itemTemplate: function(itemData, itemIndex, itemElement) {
                DiagramMenuHelper.getContextMenuItemTemplate(itemData, itemIndex, itemElement, this._menuHasCheckedItems);
            },
            onItemClick: ({ itemData }) => this._onItemClick(itemData),
            onShowing: (e) => {
                if(this._inOnShowing === true) return;

                this._inOnShowing = true;
                this._onVisibleChangedAction({ visible: true, component: this });
                e.component.option('items', this._getItems(this._commands, true));
                delete this._inOnShowing;
            }
        });
    }
    _show(x, y, selection) {
        this.clickPosition = { x, y };
        const { Browser } = getDiagram();

        this._contextMenuInstance.hide();
        if(Browser.TouchUI) {
            this._$contextMenuTargetElement.show();
            if(!selection) {
                selection = { x, y, width: 0, height: 0 };
            }
            const widthCorrection = selection.width > DIAGRAM_TOUCHBAR_MIN_UNWRAPPED_WIDTH ? 0 : (DIAGRAM_TOUCHBAR_MIN_UNWRAPPED_WIDTH - selection.width) / 2;
            this._$contextMenuTargetElement.css({
                left: selection.x - widthCorrection,
                top: selection.y - DIAGRAM_TOUCHBAR_Y_OFFSET,
                width: selection.width + 2 * widthCorrection,
                height: selection.height + 2 * DIAGRAM_TOUCHBAR_Y_OFFSET,
            });
            this._contextMenuInstance.show();
        } else {
            this._contextMenuInstance.option('position', { offset: x + ' ' + y });
            this._contextMenuInstance.show();
        }
    }
    _hide() {
        this._$contextMenuTargetElement.hide();
        this._contextMenuInstance.hide();
    }
    _onItemClick(itemData) {
        let processed = false;
        if(this._onItemClickAction) {
            processed = this._onItemClickAction(itemData);
        }

        if(!processed) {
            DiagramMenuHelper.onContextMenuItemClick(itemData, this._execDiagramCommand.bind(this));
            this._contextMenuInstance.hide();
        }
    }
    _execDiagramCommand(command, value, onExecuted) {
        if(command !== undefined) {
            this.bar.raiseBarCommandExecuted(command, value);
        }

        if(typeof onExecuted === 'function') {
            onExecuted.call(this);
        }
    }

    _getCommands() {
        return DiagramCommandsManager.getContextMenuCommands(this.option('commands'));
    }
    _fillCommandToIndexMap(commands, indexPath) {
        commands.forEach((command, index) => {
            const commandIndexPath = indexPath.concat([index]);
            if(command.command !== undefined) {
                this._commandToIndexMap[command.command] = commandIndexPath;
            }
            if(Array.isArray(command.items)) {
                this._fillCommandToIndexMap(command.items, commandIndexPath);
            }
        });
    }
    _getCommandByKey(key) {
        const indexPath = this._commandToIndexMap[key];
        if(indexPath) {
            let command;
            let commands = this._commands;
            indexPath.forEach(index => {
                command = commands[index];
                commands = command.items;
            });
            return command;
        }
    }
    _getItems(commands, onlyVisible) {
        const result = [];
        commands.forEach(command => {
            if(command.visible !== false || !onlyVisible) {
                result.push(command);
            }
        });
        return result;
    }
    _setItemEnabled(key, enabled) {
        this._setItemVisible(key, enabled);
    }
    _setItemVisible(key, visible) {
        const command = this._getCommandByKey(key);
        if(command) command.visible = visible;
    }
    _setItemValue(key, value) {
        const command = this._getCommandByKey(key);
        if(command) {
            if(value === true || value === false) {
                this._setHasCheckedItems(-1);
                command.checked = value;
            } else if(value !== undefined) {
                this._setHasCheckedItems(key);
                command.items = command.items.map(item => {
                    return {
                        'value': item.value,
                        'text': item.text,
                        'checked': item.value === value,
                        'rootCommand': key
                    };
                });
            }
        }
    }
    _setItemSubItems(key, items) {
        const command = this._getCommandByKey(key);
        if(command) {
            command.items = items.map(item => {
                return {
                    'value': DiagramMenuHelper.getItemValue(item),
                    'text': item.text,
                    'checked': item.checked,
                    'rootCommand': key
                };
            });
        }
    }
    _setEnabled(enabled) {
        this._contextMenuInstance.option('disabled', !enabled);
    }
    isVisible() {
        return this._inOnShowing;
    }
    _setHasCheckedItems(key) {
        if(!this._contextMenuInstance._menuHasCheckedItems) {
            this._contextMenuInstance._menuHasCheckedItems = {};
        }
        this._contextMenuInstance._menuHasCheckedItems[key] = true;
    }
    _createOnVisibleChangedAction() {
        this._onVisibleChangedAction = this._createActionByOption('onVisibleChanged');
    }
    _createOnItemClickAction() {
        this._onItemClickAction = this._createActionByOption('onItemClick');
    }
    _optionChanged(args) {
        switch(args.name) {
            case 'onVisibleChanged':
                this._createOnVisibleChangedAction();
                break;
            case 'onItemClick':
                this._createOnItemClickAction();
                break;
            case 'commands':
                this._invalidate();
                break;
            default:
                super._optionChanged(args);
        }
    }
}

class ContextMenuBar extends DiagramBar {
    constructor(owner) {
        super(owner);
    }

    getCommandKeys() {
        return this._getKeys(this._owner._commands);
    }
    setItemValue(key, value) {
        this._owner._setItemValue(key, value);
    }
    setItemEnabled(key, enabled) {
        this._owner._setItemEnabled(key, enabled);
    }
    setItemVisible(key, visible) {
        this._owner._setItemVisible(key, visible);
    }
    setItemSubItems(key, items) {
        this._owner._setItemSubItems(key, items);
    }
    setEnabled(enabled) {
        this._owner._setEnabled(enabled);
    }
    isVisible() {
        return this._owner.isVisible();
    }
}

module.exports = DiagramContextMenu;
