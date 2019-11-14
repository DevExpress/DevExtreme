import ItemsOption from "./ui.diagram.items";

class NodesOption extends ItemsOption {
    _getKeyOf() {
        return this._diagramWidget._createOptionGetter("nodes.keyExpr");
    }
}

module.exports = NodesOption;
