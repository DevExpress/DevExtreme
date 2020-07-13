import ItemsOption from './diagram.items_option';

class NodesOption extends ItemsOption {
    _getKeyExpr() {
        return this._diagramWidget._createOptionGetter('nodes.keyExpr');
    }
    _getItemsExpr() {
        return this._diagramWidget._createOptionGetter('nodes.itemsExpr');
    }
    _getContainerChildrenExpr() {
        return this._diagramWidget._createOptionGetter('nodes.containerChildrenExpr');
    }
}

export default NodesOption;
