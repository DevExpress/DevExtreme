import {
  AIColumnController,
  AIPromptEditorView,
  AIPromptEditorViewController,
  columnHeadersViewExtender,
} from '@ts/grids/grid_core/ai_column/index';

import gridCore from '../m_core';

gridCore.registerModule('aiColumn', {
  controllers: {
    aiColumn: AIColumnController,
    aiPromptEditor: AIPromptEditorViewController,
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
