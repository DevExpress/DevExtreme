import ItemsOption from "./ui.diagram.items";

class EdgesOptions extends ItemsOption {
    _getKeyOf() {
        return this._diagramWidget._createOptionGetter("edges.keyExpr");
    }
}

module.exports = EdgesOptions;
