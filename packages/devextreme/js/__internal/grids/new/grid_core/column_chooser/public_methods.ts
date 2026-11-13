import type { Constructor } from '../types';
import type { GridCoreNewBase } from '../widget';

/* eslint-disable-next-line
  @typescript-eslint/explicit-module-boundary-types,
  @typescript-eslint/explicit-function-return-type
  -- TS can't name the class type of a generic mixin */
export function PublicMethods<TBase extends Constructor<GridCoreNewBase>>(GridCore: TBase) {
  return class GridCoreWithColumnChooser extends GridCore {
    public showColumnChooser(): void {
      this.columnChooserView.show();
    }

    public hideColumnChooser(): void {
      this.columnChooserView.hide();
    }
  };
}
