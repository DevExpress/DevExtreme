import type { SubsGets } from '@ts/core/reactive/index';
import { combined, state } from '@ts/core/reactive/index';

import { ColumnsController } from '../columns_controller/columns_controller';
import type { Column } from '../columns_controller/types';
import { View } from '../core/view';
import { ToolbarController } from '../toolbar/controller';
import type { ColumnChooserProps } from './column_chooser';
import { ColumnChooser } from './column_chooser';

export class ColumnsChooserView extends View<ColumnChooserProps> {
  protected override component = ColumnChooser;

  private readonly visible = state(false);

  public static dependencies = [ToolbarController, ColumnsController] as const;

  constructor(
    private readonly headerPanel: ToolbarController,
    private readonly columns: ColumnsController,
  ) {
    super();
    this.headerPanel.addDefaultItem({
      // @ts-expect-error
      name: 'columnsChooserButton',
      widget: 'dxButton',
      options: {
        icon: 'column-chooser',
        onClick: () => { this.visible.updateFunc((value) => !value); },
        elementAttr: { 'aria-haspopup': 'dialog' },
      },
      showText: 'inMenu',
      location: 'after',
      locateInMenu: 'auto',
    });
  }

  private onMove(column: Column): void {
    this.columns.columnOption(column, 'visible', false);
  }

  protected override getProps(): SubsGets<ColumnChooserProps> {
    return combined({
      visible: this.visible,
      columns: this.columns.nonVisibleColumns,
      onMove: this.onMove.bind(this),
    });
  }
}
