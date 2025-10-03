import { AiColumnController } from '@ts/grids/grid_core/ai_column/m_ai_column_controller';
import { AiColumnView } from '@ts/grids/grid_core/ai_column/m_ai_column_view';

import gridCore from '../m_core';

gridCore.registerModule('aiColumn', {
  controllers: {
    aiColumn: AiColumnController,
  },
  views: {
    aiColumnView: AiColumnView,
  },
});
