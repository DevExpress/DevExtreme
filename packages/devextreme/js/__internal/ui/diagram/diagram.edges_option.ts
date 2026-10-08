import type { ItemKey, ItemKeyGetter } from '@ts/ui/diagram/diagram.items_option';
import ItemsOption from '@ts/ui/diagram/diagram.items_option';

class EdgesOption extends ItemsOption {
  _getKeyExpr(): ItemKeyGetter | undefined {
    return this._diagramWidget._createOptionGetter<ItemKey>('edges.keyExpr');
  }
}

export default EdgesOption;
