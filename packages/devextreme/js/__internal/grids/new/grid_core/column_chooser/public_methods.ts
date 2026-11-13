import type { GridCoreClass, Mixin } from '../types';
import type { ColumnChooserPublicMethods } from './types';

export function PublicMethods<TBase extends GridCoreClass>(
  GridCore: TBase,
): Mixin<TBase, ColumnChooserPublicMethods> {
  return class GridCoreWithColumnChooser extends GridCore {
    public showColumnChooser(): void {
      this.columnChooserView.show();
    }

    public hideColumnChooser(): void {
      this.columnChooserView.hide();
    }
  };
}
