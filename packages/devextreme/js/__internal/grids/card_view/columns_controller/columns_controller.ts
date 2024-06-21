import { OptionsController } from "../options_controller/options_controller";

declare const computed: any;

function liftObservable() {
  
}

export class ColumnsController {
  columnsConfiguration = this.options.oneWay('columns');

  columns = computed((columnsConfiguration) => {
    
  }, [this.columnsConfiguration])

  static deps = [OptionsController]

  constructor(
    private options: OptionsController
  ) {}

  
}