import { HeaderPanelController } from '../header_panel/controller';

export class ColumnsChooser {
  public static dependencies = [HeaderPanelController] as const;

  constructor(
    private readonly headerPanel: HeaderPanelController,
  ) {
    this.headerPanel.addDefaultItem({
      name: 'columnsChooserButton',
      widget: 'dxButton',
      options: {
        icon: 'column-chooser',
        onClick: () => { console.log('clicked'); },
        elementAttr: { 'aria-haspopup': 'dialog' },
      },
      showText: 'inMenu',
      location: 'after',
      locateInMenu: 'auto',
    });
  }
}
