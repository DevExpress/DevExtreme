import DiagramToolbar from './ui.diagram.toolbar';
import DiagramCommands from './diagram.commands';

class DiagramHistoryToolbar extends DiagramToolbar {
    _getCommands() {
        return DiagramCommands.getHistoryToolbarCommands(this.option('commands'));
    }
}

module.exports = DiagramHistoryToolbar;
