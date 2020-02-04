import DiagramToolbar from './ui.diagram.toolbar';
import DiagramCommandsManager from './diagram.commands_manager';

class DiagramViewSettingsToolbar extends DiagramToolbar {
    _getCommands() {
        return DiagramCommandsManager.getViewSettingsToolbarCommands(this.option('commands'));
    }
}

module.exports = DiagramViewSettingsToolbar;
