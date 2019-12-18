import ItemsOption from './ui.diagram.items';

class NodesOption extends ItemsOption {
    _dataSourceChangedHandler(newItems, e) {
        this._diagramWidget._nodesDataSourceChanged(newItems);
    }
}

module.exports = NodesOption;
