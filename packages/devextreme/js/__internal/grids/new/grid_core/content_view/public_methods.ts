/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable spellcheck/spell-checker */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import type dxScrollable from '@js/ui/scroll_view/ui.scrollable';
import { DataController } from '@ts/grids/new/grid_core/data_controller/index';
import type { Constructor } from '@ts/grids/new/grid_core/types';

import type { GridCoreNewBase } from '../widget';
import { ContentView } from './view';

export function PublicMethods<T extends Constructor<GridCoreNewBase>>(GridCore: T) {
  return class GridCoreWithContentView extends GridCore {
    public getScrollable(): dxScrollable {
      return this.diContext.get(ContentView).scrollableRef.current!;
    }

    public beginCustomLoading(text?: string): void {
      const contentView = this.diContext.get(ContentView);
      const dataController = this.diContext.get(DataController);

      if (text) {
        contentView.loadingText.update(text);
      }

      dataController.isLoading.update(true);
    }

    public endCustomLoading(): void {
      const dataController = this.diContext.get(DataController);

      dataController.isLoading.update(false);
    }
  };
}
