import ItemsOption from '@ts/ui/diagram/diagram.items_option';

class NodesOption extends ItemsOption {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _getKeyExpr(): any {
    return this._diagramWidget._createOptionGetter('nodes.keyExpr');
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _getItemsExpr(): any {
    return this._diagramWidget._createOptionGetter('nodes.itemsExpr');
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _getContainerChildrenExpr(): any {
    return this._diagramWidget._createOptionGetter(
      'nodes.containerChildrenExpr',
    );
  }
}

export default NodesOption;
