import $ from '../../core/renderer';

import Widget from '../widget/ui.widget';
import ContextMenu from '../context_menu';
import DiagramCommandsManager from './diagram.commands_manager';
import DiagramBar from './diagram.bar';
import { getDiagram } from './diagram.importer';

const DIAGRAM_CONTEXT_MENU_CLASS = 'dx-diagram-contextmenu';
const DIAGRAM_TOUCHBAR_CLASS = 'dx-diagram-touchbar';
const DIAGRAM_TOUCHBAR_TARGET_CLASS = 'dx-diagram-touchbar-target';
const DIAGRAM_TOUCHBAR_MIN_UNWRAPPED_WIDTH = 800;
const DIAGRAM_TOUCHBAR_Y_OFFSET = 32;

class DiagramContextMenu extends Widget {
    _init() {
        super._init();
        this._createOnVisibleChangedAction();
        this._createOnItemClickAction();
        this.bar = new ContextMenuBar(this);
        this._tempState = undefined;

        this._commands = [];
        this._commandToIndexMap = {};
    }
    _initMarkup() {
        super._initMarkup();

        this._commands = DiagramCommandsManager.getContextMenuCommands(this.option('commands'));
        this._commandToIndexMap = {};
        this._commands.forEach((item, index) => this._commandToIndexMap[item.command] = index);

        this._$contextMenuTargetElement = $('<div>')
            .addClass(DIAGRAM_TOUCHBAR_TARGET_CLASS)
            .appendTo(this.$element());

        const $contextMenu = $('<div>')
            .appendTo(this.$element());

        const { Browser } = getDiagram();
        this._contextMenuInstance = this._createComponent($contextMenu, ContextMenu, {
            closeOnOutsideClick: false,
            showEvent: '',
            cssClass: Browser.TouchUI ? DIAGRAM_TOUCHBAR_CLASS : DIAGRAM_CONTEXT_MENU_CLASS,
            items: this._getItems(this._commands),
            focusStateEnabled: false,
            position: (Browser.TouchUI ? {
                my: { x: 'center', y: 'bottom' },
                at: { x: 'center', y: 'top' },
                of: this._$contextMenuTargetElement
            } : {}),
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
            const parameter = this._getExecCommandParameter(itemData);
            this.bar.raiseBarCommandExecuted(itemData.command, parameter);
            this._contextMenuInstance.hide();
        }
    }
    _getItems(commands, onlyVisible) {
        const result = [];
        commands.forEach(command => {
            if(command.visible || !onlyVisible) {
                result.push(command);
            }
        });
        return result;
    }
    _getExecCommandParameter(itemData) {
        if(itemData.getParameter) {
            return itemData.getParameter(this);
        }
    }
    _setItemEnabled(key, enabled) {
        this._setItemVisible(key, enabled);
    }
    _setItemVisible(key, visible) {
        if(key in this._commandToIndexMap) {
            const command = this._commands[this._commandToIndexMap[key]];
            if(command) command.visible = visible;
        }
    }
    _setEnabled(enabled) {
        this._contextMenuInstance.option('disabled', !enabled);
    }
    isVisible() {
        return this._inOnShowing;
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
    getCommandKeys() {
        return DiagramCommandsManager.getContextMenuCommands().map(c => c.command);
    }
    setItemEnabled(key, enabled) {
        this._owner._setItemEnabled(key, enabled);
    }
    setItemVisible(key, visible) {
        this._owner._setItemVisible(key, visible);
    }
    setEnabled(enabled) {
        this._owner._setEnabled(enabled);
    }
    isVisible() {
        return this._owner.isVisible();
    }
}

module.exports = DiagramContextMenu;
