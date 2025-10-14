import type { ColumnsController } from '../columns_controller/m_columns_controller';
import { View } from '../m_modules';
import type { AiColumnController } from './m_ai_column_controller';
import { getAiCommandColumnOptions } from './m_ai_column_controller_utils';

export class AiColumnView extends View {
  private columnsController!: ColumnsController;

  private aiColumnController!: AiColumnController;

  private addAiCommandColumn(): void {
    this.columnsController.addCommandColumn(getAiCommandColumnOptions());
  }

  public init(): void {
    this.columnsController = this.getController('columns');
    this.aiColumnController = this.getController('aiColumn');
    this.addAiCommandColumn();
  }
}
