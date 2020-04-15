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

        this._createOnVisibilityChangingAction();
        this._createOnCustomCommand();
        this._createOnItemClickAction();
        this._tempState = undefined;

        this._commands = [];
        this._commandToIndexMap = {};
        this.bar = new DiagramContextMenuBar(this);
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
            items: this._commands,
            focusStateEnabled: false,
            position: (Browser.TouchUI ? {
                my: { x: 'center', y: 'bottom' },
                at: { x: 'center', y: 'top' },
                of: this._$contextMenuTargetElement
            } : {}),
            itemTemplate: function(itemData, itemIndex, itemElement) {
                DiagramMenuHelper.getContextMenuItemTemplate(this, itemData, itemIndex, itemElement);
            },
            onItemClick: ({ itemData }) => this._onItemClick(itemData),
            onShowing: (e) => {
                if(this._inOnShowing === true) return;

                this._inOnShowing = true;
                this._onVisibilityChangingAction({ visible: true, component: this });
                e.component.option('items', e.component.option('items'));
                delete this._inOnShowing;
            }
        });
    }
    _show(x, y, selection) {
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
            DiagramMenuHelper.onContextMenuItemClick(this, itemData, this._executeCommand.bind(this));
            this._contextMenuInstance.hide();
        }
    }
    _executeCommand(command, value) {
        if(command === undefined) return;

        if(typeof command === 'number') {
            this.bar.raiseBarCommandExecuted(command, value);
        }
        if(typeof command === 'string') {
            this._onCustomCommandAction({ command });
        }
    }
    _createOnCustomCommand() {
        this._onCustomCommandAction = this._createActionByOption('onCustomCommand');
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
    _setItemEnabled(key, enabled) {
        this._setItemVisible(key, enabled);
    }
    _setItemVisible(key, visible) {
        const itemOptionText = DiagramMenuHelper.getItemOptionText(this._contextMenuInstance, this._commandToIndexMap[key]);
        DiagramMenuHelper.updateContextMenuItemVisible(this._contextMenuInstance, itemOptionText, visible);
    }
    _setItemValue(key, value) {
        const itemOptionText = DiagramMenuHelper.getItemOptionText(this._contextMenuInstance, this._commandToIndexMap[key]);
        DiagramMenuHelper.updateContextMenuItemValue(this._contextMenuInstance, itemOptionText, key, value);
    }
    _setItemSubItems(key, items) {
        const itemOptionText = DiagramMenuHelper.getItemOptionText(this._contextMenuInstance, this._commandToIndexMap[key]);
        DiagramMenuHelper.updateContextMenuItems(this._contextMenuInstance, itemOptionText, key, items);
    }
    _setEnabled(enabled) {
        this._contextMenuInstance.option('disabled', !enabled);
    }
    isVisible() {
        return this._inOnShowing;
    }

    _createOnVisibilityChangingAction() {
        this._onVisibilityChangingAction = this._createActionByOption('onVisibilityChanging');
    }
    _createOnItemClickAction() {
        this._onItemClickAction = this._createActionByOption('onItemClick');
    }
    _optionChanged(args) {
        switch(args.name) {
            case 'onVisibilityChanging':
                this._createOnVisibilityChangingAction();
                break;
            case 'onCustomCommand':
                this._createOnCustomCommand();
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

class DiagramContextMenuBar extends DiagramBar {
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
