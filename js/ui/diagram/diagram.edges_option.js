import ItemsOption from './diagram.items_option';

class EdgesOption extends ItemsOption {
    _handlePush(changes) {
        this._diagramWidget._onEdgesPushed(changes);
    }
    _getKeyExpr() {
        return this._diagramWidget._createOptionGetter('edges.keyExpr');
    }
}

export default EdgesOption;
