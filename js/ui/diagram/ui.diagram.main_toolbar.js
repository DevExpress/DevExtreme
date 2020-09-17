import DiagramToolbar from './ui.diagram.toolbar';
import DiagramCommandsManager from './diagram.commands_manager';

class DiagramMainToolbar extends DiagramToolbar {
    _getCommands() {
        return DiagramCommandsManager.getMainToolbarCommands(this.option('commands'), this.option('excludeCommands'));
    }
}

export default DiagramMainToolbar;
