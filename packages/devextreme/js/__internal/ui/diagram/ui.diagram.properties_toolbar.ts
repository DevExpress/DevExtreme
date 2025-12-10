import type { CommandParams } from '@ts/ui/diagram/diagram.commands_manager';
import DiagramCommandsManager from '@ts/ui/diagram/diagram.commands_manager';
import DiagramToolbar from '@ts/ui/diagram/ui.diagram.toolbar';

class DiagramPropertiesToolbar extends DiagramToolbar {
  _getCommands(): CommandParams[] {
    // @ts-expect-error ts-error
    return DiagramCommandsManager.getPropertiesToolbarCommands();
  }
}

export default DiagramPropertiesToolbar;
