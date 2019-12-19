import ItemsOption from './ui.diagram.items';

class EdgesOptions extends ItemsOption {
    _dataSourceChangedHandler(newItems, e) {
        this._diagramWidget._edgesDataSourceChanged(newItems);
    }
}

module.exports = EdgesOptions;
