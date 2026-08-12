import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';
import type { Properties as DataGridProperties } from '@js/ui/data_grid';
import {
  afterTest,
  beforeTest,
  createDataGrid,
} from '@ts/grids/grid_core/__tests__/__mock__/helpers/utils';
import { AIAssistantDataGridModel } from '@ts/grids/grid_core/__tests__/__mock__/model/ai_assistant';

const LOCAL_DATA = [
  { id: 1, name: 'Alpha' },
  { id: 2, name: 'Beta' },
];

const DEFAULT_COLUMNS = [
  { dataField: 'id', caption: 'ID', dataType: 'number' as const },
  { dataField: 'name', caption: 'Name', dataType: 'string' as const },
];

const createDataGridWithAIAndPopup = async (
  aiAssistantOptions: DataGridProperties['aiAssistant'] = {},
): Promise<AIAssistantDataGridModel> => {
  await createDataGrid({
    dataSource: LOCAL_DATA,
    columns: DEFAULT_COLUMNS,
    aiAssistant: { enabled: true, title: 'AI Assistant', ...aiAssistantOptions },
  });

  const model = new AIAssistantDataGridModel(
    document.getElementById('gridContainer') as HTMLElement,
  );

  await model.togglePopup();
  jest.runAllTimers();

  return model;
};

describe('AIAssistantView', () => {
  beforeEach(beforeTest);
  afterEach(afterTest);

  describe('popup height', () => {
    it('should render popup with 560px height by default', async () => {
      const model = await createDataGridWithAIAndPopup();

      expect(model.getAiChatModel().getPopupHeight()).toBe('560px');
    });

    it('should render popup with custom height set via aiAssistant.popup.height option', async () => {
      const model = await createDataGridWithAIAndPopup({ popup: { height: 600 } });

      expect(model.getAiChatModel().getPopupHeight()).toBe('600px');
    });
  });
});
