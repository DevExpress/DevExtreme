import { getDiagram } from './diagram_importer';

class DiagramBar {
    constructor(owner) {
        const { EventDispatcher } = getDiagram();
        this.onChanged = new EventDispatcher(); // IBar.onChanged: EventDispatcher<IBarListener>
        this._owner = owner;
    }
    raiseBarCommandExecuted(key, parameter) {
        this.onChanged.raise('NotifyBarCommandExecuted', parseInt(key), parameter);
    }

    getCommandKeys() { // IBar.getCommandKeys(): DiagramCommand[]
        throw 'Not Implemented';
    }
    setItemValue(key, value) { // IBar.setItemValue(key: DiagramCommand, value: any)
    }
    setItemEnabled(key, enabled) { // IBar.setItemEnabled(key: DiagramCommand, enabled: boolean)
    }
    setItemVisible(key, enabled) { // IBar.setItemVisible(key: DiagramCommand, visible: boolean)
    }
    setEnabled(enabled) { // IBar.setEnabled(enabled: boolean)
    }
    setItemSubItems(key, items) { // IBar.setItemSubItems(key: DiagramCommand, items: any[])
    }
    isVisible() { // IBar.isVisible(): boolean
        return true;
    }
}

module.exports = DiagramBar;
