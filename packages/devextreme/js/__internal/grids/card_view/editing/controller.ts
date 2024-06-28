import { HeaderPanelController } from "../header_panel/controller";

export class EditingController {
  static dependencies = [HeaderPanelController] as const;
  
  constructor(
    private headerPanel: HeaderPanelController
  ) {
    this.headerPanel.addDefaultItem({
      name: 'saveButton',
      template: () => {
        return 'asd'
      }
    })
  }
}