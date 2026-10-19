import { CLASSES as GRID_VIEW_CLASSES } from '@ts/grids/grid_core/grid_view/const';
import { gridViewModule, ResizingController } from '@ts/grids/grid_core/grid_view/grid_view';

import treeListCore from './core';

const TREELIST_EXPANDABLE_INSTRUCTION = 'dxTreeList-ariaExpandableInstruction';

class TreeListResizingController extends ResizingController {
  protected _expandableWidgetAriaId = TREELIST_EXPANDABLE_INSTRUCTION;

  protected _getWidgetAriaLabel(): string {
    return 'dxTreeList-ariaTreeList';
  }

  protected _toggleBestFitMode(isBestFit: boolean): void {
    super._toggleBestFitMode(isBestFit);

    const $rowsTable = this._rowsView.getTableElement();

    $rowsTable?.find('.dx-treelist-cell-expandable').toggleClass(this.addWidgetPrefix(GRID_VIEW_CLASSES.bestFit), isBestFit);
  }
}

treeListCore.registerModule('gridView', {
  defaultOptions: gridViewModule.defaultOptions,
  controllers: {
    ...gridViewModule.controllers,
    resizing: TreeListResizingController,
  },
  views: gridViewModule.views,
});
