/* eslint-disable spellcheck/spell-checker */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

import type { Constructor } from '../types';
import type { GridCoreNewBase } from '../widget';

export function PublicMethods<TBase extends Constructor<GridCoreNewBase>>(GridCore: TBase) {
  return class GridCoreWithColumnChooser extends GridCore {
    public showColumnChooser(): void {
      this.columnChooserView.showColumnChooser();
    }

    public hideColumnChooser(): void {
      this.columnChooserView.hideColumnChooser();
    }
  };
}
