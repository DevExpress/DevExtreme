import dxTreeView from '@js/ui/tree_view';
import { effect } from '@ts/core/reactive/index';

import type { ColumnsController } from '../columns_controller/index';
import type { OptionsController } from '../options_controller/options_controller';
import { ColumnChooserController } from './controller';

export class ColumnChooserControllerMock extends ColumnChooserController {
  public readonly treeView: dxTreeView;

  public readonly treeViewElement = document.createElement('div');

  constructor(
    columnsController: ColumnsController,
    options: OptionsController,
  ) {
    super(columnsController, options);

    // eslint-disable-next-line new-cap
    this.treeView = new dxTreeView(this.treeViewElement, {
      showCheckBoxesMode: 'selectAll',
      onSelectionChanged: this.onSelectionChanged.bind(this),
    });

    effect(() => {
      this.treeView.option('items', this.items.value);
    });
  }
}
