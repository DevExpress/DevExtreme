import ItemsOption from './diagram.items_option';

class EdgesOption extends ItemsOption {
    _getKeyExpr() {
        return this._diagramWidget._createOptionGetter('edges.keyExpr');
    }
}

export default EdgesOption;
