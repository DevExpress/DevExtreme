import type { CommandParams } from '@ts/ui/diagram/diagram.commands_manager';
import DiagramCommandsManager from '@ts/ui/diagram/diagram.commands_manager';
import DiagramToolbar from '@ts/ui/diagram/ui.diagram.toolbar';

class DiagramMainToolbar extends DiagramToolbar {
  _getCommands(): CommandParams {
    // @ts-expect-error ts-error
    const { commands, excludeCommands } = this.option();
    return DiagramCommandsManager.getMainToolbarCommands(
      commands,
      excludeCommands,
    );
  }
}

export default DiagramMainToolbar;
