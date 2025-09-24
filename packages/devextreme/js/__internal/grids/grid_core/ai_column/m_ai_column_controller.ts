import type { ColumnsController } from '../columns_controller/m_columns_controller';
import { Controller } from '../m_modules';
import { getAiCommandColumnOptions } from './m_ai_column_controller_utils';

export class AiColumnController extends Controller {
  private columnsController!: ColumnsController;

  public init(): void {
    this.columnsController = this.getController('columns');
    this.addAiCommandColumn();
  }

  private addAiCommandColumn(): void {
    const aiColumnOptions = getAiCommandColumnOptions();
    this.columnsController.addCommandColumn(aiColumnOptions);
  }
}

export const aiColumnControllerModule = {
  controllers: {
    aiColumn: AiColumnController,
  },
};
