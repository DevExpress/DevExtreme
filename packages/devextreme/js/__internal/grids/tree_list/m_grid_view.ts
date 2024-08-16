import { gridViewModule, ResizingController } from '@ts/grids/grid_core/views/m_grid_view';

import treeListCore from './m_core';

const TREELIST_EXPANDABLE_INSTRUCTION = 'dxTreeList-ariaExpandableInstruction';

class TreeListResizingController extends ResizingController {
  protected _expandableWidgetAriaId = TREELIST_EXPANDABLE_INSTRUCTION;

  protected _getWidgetAriaLabel() {
    return 'dxTreeList-ariaTreeList';
  }

  protected _toggleBestFitMode(isBestFit) {
    super._toggleBestFitMode(isBestFit);

    const $rowsTable = this._rowsView.getTableElement();
    $rowsTable!.find('.dx-treelist-cell-expandable').toggleClass(this.addWidgetPrefix('best-fit'), isBestFit);
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
