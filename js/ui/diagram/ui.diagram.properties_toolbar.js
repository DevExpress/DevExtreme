import DiagramToolbar from './ui.diagram.toolbar';
import DiagramCommandsManager from './diagram.commands_manager';

class DiagramPropertiesToolbar extends DiagramToolbar {
    _getCommands() {
        return DiagramCommandsManager.getPropertiesToolbarCommands();
    }
}

export default DiagramPropertiesToolbar;
