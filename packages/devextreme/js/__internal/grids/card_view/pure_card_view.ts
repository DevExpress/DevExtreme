import { DIContext } from "@ts/core/di";
import { DataController } from "./data_controller/data_controller";
import { ColumnsController } from "./columns_controller/columns_controller";
import { OptionsController } from "./options_controller/options_controller";

export class CardView {
  diContext = new DIContext();

  constructor() {
    this.diContext.register(DataController);
    this.diContext.register(ColumnsController);  
    this.diContext.register(OptionsController);
  }
}