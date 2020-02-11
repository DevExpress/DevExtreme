import messageLocalization from '../../localization/message';
import DiagramToolbar from './ui.diagram.toolbar';
import DiagramCommandsManager from './diagram.commands_manager';

class DiagramMainToolbar extends DiagramToolbar {
    _getCommands() {
        return DiagramCommandsManager.getMainToolbarCommands(this.option('commands'));
    }
    _getAllWidgetCommands() {
        return this._widgetCommands ||
            (this._widgetCommands = [
                {
                    command: 'options',
                    icon: 'preferences',
                    hint: messageLocalization.format('dxDiagram-commandProperties'),
                    text: messageLocalization.format('dxDiagram-commandProperties'),
                }
            ]);
    }
    _getRightAlignedCommands() {
        const widgetCommands = this._getWidgetCommands();
        return this._getAllWidgetCommands().filter(function(c) { return widgetCommands.indexOf(c.command) > -1; });
    }
}

module.exports = DiagramMainToolbar;
