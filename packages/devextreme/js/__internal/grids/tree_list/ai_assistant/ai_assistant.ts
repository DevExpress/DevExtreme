import messageLocalization from '@js/common/core/localization/message';
import { AIAssistantController } from '@ts/grids/grid_core/ai_assistant/ai_assistant_controller';
import { AIAssistantView } from '@ts/grids/grid_core/ai_assistant/ai_assistant_view';
import { AIAssistantViewController } from '@ts/grids/grid_core/ai_assistant/ai_assistant_view_controller';

import gridCore from '../m_core';

gridCore.registerModule('aiAssistant', {
  defaultOptions() {
    return {
      aiAssistant: {
        enabled: false,
        title: messageLocalization.format('dxDataGrid-aiAssistantTitle'),
      },
    };
  },
  controllers: {
    aiAssistant: AIAssistantController,
    aiAssistantViewController: AIAssistantViewController,
  },
  views: {
    aiAssistantView: AIAssistantView,
  },
});
