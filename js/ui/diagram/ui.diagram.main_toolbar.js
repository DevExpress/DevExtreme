import DiagramToolbar from './ui.diagram.toolbar';
import DiagramCommands from './diagram.commands';

class DiagramMainToolbar extends DiagramToolbar {
    _getCommands() {
        return DiagramCommands.getMainToolbarCommands(this.option('commands'));
    }
}

module.exports = DiagramMainToolbar;
