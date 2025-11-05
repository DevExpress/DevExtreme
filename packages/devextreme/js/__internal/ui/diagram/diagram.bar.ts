// eslint-disable-next-line @stylistic/max-len
/* eslint-disable @typescript-eslint/explicit-module-boundary-types,@typescript-eslint/no-unused-vars */
import { getDiagram } from '@ts/ui/diagram/diagram.importer';

class DiagramBar {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChanged: any;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _owner: any;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(owner: any) {
    const { EventDispatcher } = getDiagram();
    this.onChanged = new EventDispatcher(); // IBar.onChanged: EventDispatcher<IBarListener>
    this._owner = owner;
  }

  raiseBarCommandExecuted(key, parameter): void {
    this.onChanged.raise('notifyBarCommandExecuted', parseInt(key, 10), parameter);
  }

  getCommandKeys(): void {
    // IBar.getCommandKeys(): DiagramCommand[]
    throw 'Not Implemented';
  }

  setItemValue(key, value): void {
    // IBar.setItemValue(key: DiagramCommand, value: any)
  }

  setItemEnabled(key, enabled): void {
    // IBar.setItemEnabled(key: DiagramCommand, enabled: boolean)
  }

  setItemVisible(key, enabled): void {
    // IBar.setItemVisible(key: DiagramCommand, visible: boolean)
  }

  setEnabled(enabled): void {
    // IBar.setEnabled(enabled: boolean)
  }

  setItemSubItems(key, items): void {
    // IBar.setItemSubItems(key: DiagramCommand, items: any[])
  }

  isVisible(): boolean {
    // IBar.isVisible(): boolean
    return true;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _getKeys(items) {
    const keys = items.reduce((commands, item) => {
      if (item.command !== undefined) {
        commands.push(item.command);
      }
      if (item.items) {
        // eslint-disable-next-line no-param-reassign
        commands = commands.concat(this._getKeys(item.items));
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return commands;
    }, []);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return keys;
  }
}

export default DiagramBar;
