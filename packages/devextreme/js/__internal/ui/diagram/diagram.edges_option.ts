import ItemsOption from '@ts/ui/diagram/diagram.items_option';

class EdgesOption extends ItemsOption {
  // eslint-disable-next-line @stylistic/max-len
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type,@typescript-eslint/explicit-module-boundary-types
  _getKeyExpr() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this._diagramWidget._createOptionGetter('edges.keyExpr');
  }
}

export default EdgesOption;
