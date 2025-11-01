import { AIColumnController } from '@ts/grids/grid_core/ai_column/m_ai_column_controller';
import { columnHeadersViewExtender } from '@ts/grids/grid_core/ai_column/m_ai_column_view';
import { AIPromptEditorView } from '@ts/grids/grid_core/ai_column/m_ai_prompt_editor_view';

import gridCore from '../m_core';

gridCore.registerModule('aiColumn', {
  controllers: {
    aiColumn: AIColumnController,
  },
  views: {
    aiPromptEditorView: AIPromptEditorView,
  },
  extenders: {
    views: {
      columnHeadersView: columnHeadersViewExtender,
    },
  },
});
