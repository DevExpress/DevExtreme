import type { Item } from '@js/ui/diagram';
import type { ItemKey, ItemKeyGetter, ItemsGetter } from '@ts/ui/diagram/diagram.items_option';
import ItemsOption from '@ts/ui/diagram/diagram.items_option';

class NodesOption extends ItemsOption {
  _getKeyExpr(): ItemKeyGetter | undefined {
    return this._diagramWidget._createOptionGetter<ItemKey>('nodes.keyExpr');
  }

  _getItemsExpr(): ItemsGetter | undefined {
    return this._diagramWidget._createOptionGetter<Item[] | undefined>('nodes.itemsExpr');
  }

  _getContainerChildrenExpr(): ItemsGetter | undefined {
    return this._diagramWidget._createOptionGetter<Item[] | undefined>(
      'nodes.containerChildrenExpr',
    );
  }
}

export default NodesOption;
