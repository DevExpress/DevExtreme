import type { ColumnsController } from '../columns_controller/m_columns_controller';
import modules from '../m_modules';
import { getAiCommandColumnOptions } from './m_ai_column_controller_utils';

export class AiColumnController extends modules.Controller {
  private _columnsController!: ColumnsController;

  public init(): void {
    this._columnsController = this.getController('columns');
    this.addAiCommandColumn();
  }

  private addAiCommandColumn(): void {
    const aiColumnOptions = getAiCommandColumnOptions();
    this._columnsController.addCommandColumn(aiColumnOptions);
  }
}

export const aiColumnControllerModule = {
  controllers: {
    aiColumn: AiColumnController,
  },
};
