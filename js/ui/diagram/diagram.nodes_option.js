import ItemsOption from './diagram.items_option';

class NodesOption extends ItemsOption {
    _getKeyExpr() {
        return this._diagramWidget._createOptionGetter('nodes.keyExpr');
    }
}

export default NodesOption;
