import { AIAssistantView } from '@ts/grids/grid_core/ai_assistant/m_ai_assistant_view';
import { AIAssistantViewController } from '@ts/grids/grid_core/ai_assistant/m_ai_assistant_view_controller';

import gridCore from '../m_core';

gridCore.registerModule('aiAssistant', {
  controllers: {
    aiAssistant: AIAssistantViewController,
  },
  views: {
    aiAssistantView: AIAssistantView,
  },
});
