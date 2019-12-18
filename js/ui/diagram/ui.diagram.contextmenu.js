import $ from '../../core/renderer';

import Widget from '../widget/ui.widget';
import ContextMenu from '../context_menu';
import DiagramCommands from './ui.diagram.commands';
import DiagramBar from './diagram_bar';

class DiagramContextMenu extends Widget {
    _init() {
        super._init();
        this._createOnVisibleChangedAction();
        this.bar = new ContextMenuBar(this);
        this._tempState = undefined;
        this._commandToIndexMap = {};
    }
    _initMarkup() {
        super._initMarkup();
        const items = DiagramCommands.getContextMenu();
        const $contextMenu = $('<div>')
            .appendTo(this.$element());
        this._contextMenuInstance = this._createComponent($contextMenu, ContextMenu, {
            target: this.option('container'),
            dataSource: items,
            displayExpr: 'text',
            onItemClick: ({ itemData }) => this._onItemClick(itemData.command),
            onShowing: (e) => {
                this._tempState = true;
                this._onVisibleChangedAction({ visible: true, component: this });
                delete this._tempState;
            },
            onHiding: (e) => {
                this._tempState = false;
                this._onVisibleChangedAction({ visible: false, component: this });
                delete this._tempState;
            }
        });
        items.forEach((item, index) => this._commandToIndexMap[item.command] = index);
    }
    _onItemClick(command) {
        this.bar.raiseBarCommandExecuted(command);
        this._contextMenuInstance.hide();
    }
    _setItemEnabled(key, enabled) {
        if(key in this._commandToIndexMap) {
            this._contextMenuInstance.option(`items[${this._commandToIndexMap[key]}].disabled`, !enabled);
        }
    }
    _setEnabled(enabled) {
        this._contextMenuInstance.option('disabled', !enabled);
    }
    isVisible() {
        if(this._tempState !== undefined) {
            return this._tempState;
        }
        return !!this._contextMenuInstance.option('visible');
    }
    _createOnVisibleChangedAction() {
        this._onVisibleChangedAction = this._createActionByOption('onVisibleChanged');
    }
    _optionChanged(args) {
        switch(args.name) {
            case 'onVisibleChanged':
                this._createOnVisibleChangedAction();
                break;
            default:
                super._optionChanged(args);
        }
    }
}

class ContextMenuBar extends DiagramBar {
    getCommandKeys() {
        return DiagramCommands.getContextMenu().map(c => c.command);
    }
    setItemEnabled(key, enabled) {
        this._owner._setItemEnabled(key, enabled);
    }
    setEnabled(enabled) {
        this._owner._setEnabled(enabled);
    }
    isVisible() {
        return this._owner.isVisible();
    }
}

module.exports = DiagramContextMenu;
