import { DIContext } from "@ts/core/di";
import { DataController } from "./data_controller/data_controller";
import { ColumnsController } from "./columns_controller/columns_controller";
import { OptionsController } from "./options_controller/options_controller";
import { HeaderPanelController } from "./header_panel/controller";
import { HeaderPanelView } from "./header_panel/view";
import { EditingController } from "./editing/controller";

export class CardView {
  diContext = new DIContext();

  constructor() {
    this.diContext.register(DataController);
    this.diContext.register(ColumnsController);  
    this.diContext.register(OptionsController);
    this.diContext.register(HeaderPanelController);
    this.diContext.register(HeaderPanelView);
    this.diContext.register(EditingController);
  }
}