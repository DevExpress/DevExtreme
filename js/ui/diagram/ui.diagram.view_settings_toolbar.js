import DiagramToolbar from './ui.diagram.toolbar';
import DiagramCommands from './diagram.commands';

class DiagramViewSettingsToolbar extends DiagramToolbar {
    _getCommands() {
        return DiagramCommands.getViewSettingsToolbarCommands(this.option('commands'));
    }
}

module.exports = DiagramViewSettingsToolbar;
