/* eslint-disable spellcheck/spell-checker */
import { computed, state } from '@ts/core/reactive';

import { ColumnsController } from '../columns_controller/columns_controller';
import { View } from '../core/view';
import { HeaderPanelController } from '../header_panel/controller';
import { Popup } from '../inferno_wrappers/popup';
import { Sortable } from '../inferno_wrappers/sortable';
import { TreeView } from '../inferno_wrappers/tree_view';

export class ColumnsChooserView extends View {
  private readonly visible = state(false);

  private readonly items = computed(
    (columns) => columns.map((c) => ({
      text: c.name,
    })),
    [this.columns.nonVisibleColumns],
  );

  public vdom = computed(
    (visible, items) => visible && (
      <Popup
        visible={visible}
        shading={false}
        dragEnabled={true}
        resizeEnabled={true}
        width={250}
        height={260}
      >
        <Sortable
          group='cardview'
        >
          <TreeView
            items={items}
          />
        </Sortable>
      </Popup>
    ),
    [this.visible, this.items],
  );

  public static dependencies = [HeaderPanelController, ColumnsController] as const;

  constructor(
    private readonly headerPanel: HeaderPanelController,
    private readonly columns: ColumnsController,
  ) {
    super();
    this.headerPanel.addDefaultItem({
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
}
