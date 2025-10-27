import { AIColumnController } from '@ts/grids/grid_core/ai_column/m_ai_column_controller';
import { AIColumnView } from '@ts/grids/grid_core/ai_column/m_ai_column_view';

import gridCore from '../m_core';

gridCore.registerModule('aiColumn', {
  controllers: {
    aiColumn: AIColumnController,
  },
  views: {
    aiColumnView: AIColumnView,
  },
});
