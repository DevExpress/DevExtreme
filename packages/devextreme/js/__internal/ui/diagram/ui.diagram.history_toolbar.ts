import type { CommandParams } from '@ts/ui/diagram/diagram.commands_manager';
import DiagramCommandsManager from '@ts/ui/diagram/diagram.commands_manager';
import DiagramToolbar from '@ts/ui/diagram/ui.diagram.toolbar';

class DiagramHistoryToolbar extends DiagramToolbar {
  _getCommands(): CommandParams[] {
    return DiagramCommandsManager.getHistoryToolbarCommands(
      this.option('commands'),
      this._getExcludeCommands(),
    );
  }

  _getExcludeCommands(): CommandParams[] {
    // @ts-expect-error ts-error
    const { excludeCommands } = this.option();
    const commands = [].concat(excludeCommands);
    if (!this.option('isMobileView')) {
      // @ts-expect-error ts-error
      commands.push(DiagramCommandsManager.SHOW_TOOLBOX_COMMAND_NAME);
    }
    return commands;
  }
}

export default DiagramHistoryToolbar;
