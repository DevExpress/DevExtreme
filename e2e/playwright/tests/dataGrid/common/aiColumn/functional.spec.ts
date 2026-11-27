import type { Properties } from 'devextreme/ui/data_grid';
import { expect, test } from '../../../../fixtures';
import { AI_INTEGRATION_PAGE_URL, DEFAULT_SELECTOR } from '../../../../helpers/const';
import { createWidget } from '../../../../helpers/createWidget';
import Button from '../../../../models/button';
import DataGrid from '../../../../models/dataGrid';
import { typeText } from '../../helpers/typeText';

test.use({ containerUrl: AI_INTEGRATION_PAGE_URL });

const EMPTY_CELL_TEXT = ' ';
const DROPDOWNMENU_PROMPT_EDITOR_INDEX = 0;
const DROPDOWNMENU_REGENERATE_INDEX = 1;
const DROPDOWNMENU_CLEAR_DATA_INDEX = 2;

const dataSource = [
  { id: 1, name: 'Name 1', value: 10 },
  { id: 2, name: 'Name 2', value: 20 },
  { id: 3, name: 'Name 3', value: 30 },
];

interface AIColumnConfig {
  caption: string;
  prompt: string;
  mode?: 'manual';
}

interface AIColumnsGridConfig {
  data: typeof dataSource;
  aiColumns: AIColumnConfig[];
  responseDelay?: number;
}

// Runs in the page. Each AI column answers every row with "Response <name> for <prompt>".
const aiColumnsGrid = ({ data, aiColumns, responseDelay }: AIColumnsGridConfig): Properties => ({
  dataSource: data,
  keyExpr: 'id',
  columns: [
    { dataField: 'id', caption: 'ID' },
    { dataField: 'name', caption: 'Name' },
    { dataField: 'value', caption: 'Value' },
    ...aiColumns.map(({ caption, prompt, mode }) => ({
      type: 'ai' as const,
      caption,
      name: caption,
      ai: {
        ...mode && { mode },
        prompt,
        aiIntegration: new (window as any).DevExpress.aiIntegration.AIIntegration({
          sendRequest(request) {
            return {
              promise: new Promise<string>((resolve) => {
                const result: Record<string, string> = {};

                Object.entries(request.data?.data).forEach(([key, value]) => {
                  result[key] = `Response ${(value as any).name} for ${request.data?.text}`;
                });

                const respond = (): void => resolve(JSON.stringify(result));

                if (responseDelay === undefined) {
                  respond();
                } else {
                  // The AI answers late, so the test can stop the request first.
                  // eslint-disable-next-line no-restricted-syntax
                  setTimeout(() => {
                    respond();
                    (window as any).aiResponded = true;
                  }, responseDelay);
                }
              }),
              abort: (): void => {},
            };
          },
        }),
      },
    })),
  ],
});

const FIRST_AI_COLUMN = { caption: 'AI Column', prompt: 'first AI column' };

test.describe('Ai Column.Common', () => {
  test('The AI column with a given width', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource,
      keyExpr: 'id',
      columns: [
        { dataField: 'id', caption: 'ID' },
        { dataField: 'name', caption: 'Name' },
        { dataField: 'value', caption: 'Value' },
        {
          type: 'ai',
          caption: 'AI Column',
          width: 175,
        },
      ],
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await expect.poll(
      () => dataGrid.getDataCell(0, 3).element.evaluate((cell) => cell.clientWidth),
    ).toBe(175);
  });

  test('The AI column with a given min-width', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource,
      keyExpr: 'id',
      width: 300,
      columns: [
        { dataField: 'id', caption: 'ID' },
        { dataField: 'name', caption: 'Name' },
        { dataField: 'value', caption: 'Value', width: 100 },
        {
          type: 'ai',
          caption: 'AI Column',
          minWidth: 175,
        },
      ],
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await expect.poll(
      () => dataGrid.getDataCell(0, 3).element.evaluate((cell) => cell.clientWidth),
    ).toBe(175);
  });

  test('Get result from AI and display it in the AI column', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', aiColumnsGrid, DEFAULT_SELECTOR, {
      arg: { data: dataSource, aiColumns: [FIRST_AI_COLUMN] },
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await expect(dataGrid.getDataCell(0, 3).element).toHaveText('Response Name 1 for first AI column');
    await expect(dataGrid.getDataCell(1, 3).element).toHaveText('Response Name 2 for first AI column');
    await expect(dataGrid.getDataCell(2, 3).element).toHaveText('Response Name 3 for first AI column');
  });

  test('Get result from AI and display it in two AI columns', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', aiColumnsGrid, DEFAULT_SELECTOR, {
      arg: {
        data: dataSource,
        aiColumns: [FIRST_AI_COLUMN, { caption: 'AI Column2', prompt: 'second AI column' }],
      },
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await expect(dataGrid.getDataCell(0, 3).element).toHaveText('Response Name 1 for first AI column');
    await expect(dataGrid.getDataCell(1, 3).element).toHaveText('Response Name 2 for first AI column');
    await expect(dataGrid.getDataCell(2, 3).element).toHaveText('Response Name 3 for first AI column');
    await expect(dataGrid.getDataCell(0, 4).element).toHaveText('Response Name 1 for second AI column');
    await expect(dataGrid.getDataCell(1, 4).element).toHaveText('Response Name 2 for second AI column');
    await expect(dataGrid.getDataCell(2, 4).element).toHaveText('Response Name 3 for second AI column');
  });

  test('Regenerate the AI request from DropDownButton menu', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', aiColumnsGrid, DEFAULT_SELECTOR, {
      arg: { data: dataSource, aiColumns: [{ ...FIRST_AI_COLUMN, mode: 'manual' }] },
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await expect(dataGrid.getDataCell(0, 3).element).toHaveJSProperty('innerText', EMPTY_CELL_TEXT);
    await expect(dataGrid.getDataCell(1, 3).element).toHaveJSProperty('innerText', EMPTY_CELL_TEXT);
    await expect(dataGrid.getDataCell(2, 3).element).toHaveJSProperty('innerText', EMPTY_CELL_TEXT);

    const aiColumnHeaderCell = dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(3);

    await aiColumnHeaderCell.getAIHeaderButton().element.click();
    const dropDownList = await aiColumnHeaderCell.getAIHeaderButton().getList();
    await dropDownList.getItem(DROPDOWNMENU_REGENERATE_INDEX).element.click();

    await expect(dataGrid.getDataCell(0, 3).element).toHaveText('Response Name 1 for first AI column');
    await expect(dataGrid.getDataCell(1, 3).element).toHaveText('Response Name 2 for first AI column');
    await expect(dataGrid.getDataCell(2, 3).element).toHaveText('Response Name 3 for first AI column');
  });

  test('Regenerate the AI request from Prompt Editor', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', aiColumnsGrid, DEFAULT_SELECTOR, {
      arg: { data: dataSource, aiColumns: [{ ...FIRST_AI_COLUMN, mode: 'manual' }] },
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await expect(dataGrid.getDataCell(0, 3).element).toHaveJSProperty('innerText', EMPTY_CELL_TEXT);
    await expect(dataGrid.getDataCell(1, 3).element).toHaveJSProperty('innerText', EMPTY_CELL_TEXT);
    await expect(dataGrid.getDataCell(2, 3).element).toHaveJSProperty('innerText', EMPTY_CELL_TEXT);

    const aiColumnHeaderCell = dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(3);

    await aiColumnHeaderCell.getAIHeaderButton().element.click();
    const dropDownList = await aiColumnHeaderCell.getAIHeaderButton().getList();
    await dropDownList.getItem(DROPDOWNMENU_PROMPT_EDITOR_INDEX).element.click();

    const promptEditor = dataGrid.getAIPromptEditor();

    await promptEditor.getRegenerateButton().element.click();

    await expect(dataGrid.getDataCell(0, 3).element).toHaveText('Response Name 1 for first AI column');
    await expect(dataGrid.getDataCell(1, 3).element).toHaveText('Response Name 2 for first AI column');
    await expect(dataGrid.getDataCell(2, 3).element).toHaveText('Response Name 3 for first AI column');
  });

  test('Clear Data from AI column by DropDownButton menu', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', aiColumnsGrid, DEFAULT_SELECTOR, {
      arg: { data: dataSource, aiColumns: [FIRST_AI_COLUMN] },
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await expect(dataGrid.getDataCell(0, 3).element).toHaveText('Response Name 1 for first AI column');
    await expect(dataGrid.getDataCell(1, 3).element).toHaveText('Response Name 2 for first AI column');
    await expect(dataGrid.getDataCell(2, 3).element).toHaveText('Response Name 3 for first AI column');

    const aiColumnHeaderCell = dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(3);

    await aiColumnHeaderCell.getAIHeaderButton().element.click();
    const dropDownList = await aiColumnHeaderCell.getAIHeaderButton().getList();
    await dropDownList.getItem(DROPDOWNMENU_CLEAR_DATA_INDEX).element.click();

    await expect(dataGrid.getDataCell(0, 3).element).toHaveJSProperty('innerText', EMPTY_CELL_TEXT);
    await expect(dataGrid.getDataCell(1, 3).element).toHaveJSProperty('innerText', EMPTY_CELL_TEXT);
    await expect(dataGrid.getDataCell(2, 3).element).toHaveJSProperty('innerText', EMPTY_CELL_TEXT);
  });

  test('Abort the AI request from Prompt Editor', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', aiColumnsGrid, DEFAULT_SELECTOR, {
      arg: {
        data: dataSource,
        aiColumns: [{ ...FIRST_AI_COLUMN, mode: 'manual' }],
        responseDelay: 3000,
      },
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await expect(dataGrid.getDataCell(0, 3).element).toHaveJSProperty('innerText', EMPTY_CELL_TEXT);
    await expect(dataGrid.getDataCell(1, 3).element).toHaveJSProperty('innerText', EMPTY_CELL_TEXT);
    await expect(dataGrid.getDataCell(2, 3).element).toHaveJSProperty('innerText', EMPTY_CELL_TEXT);

    const aiColumnHeaderCell = dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(3);

    await aiColumnHeaderCell.getAIHeaderButton().element.click();
    const dropDownList = await aiColumnHeaderCell.getAIHeaderButton().getList();
    await dropDownList.getItem(DROPDOWNMENU_PROMPT_EDITOR_INDEX).element.click();

    const promptEditor = dataGrid.getAIPromptEditor();

    await promptEditor.getRegenerateButton().element.click();
    await promptEditor.getStopButton().element.click();

    // The cells are empty until the answer comes too: wait for it, then check that it is dropped.
    await page.waitForFunction(() => (window as any).aiResponded === true);

    await expect(dataGrid.getDataCell(0, 3).element).toHaveJSProperty('innerText', EMPTY_CELL_TEXT);
    await expect(dataGrid.getDataCell(1, 3).element).toHaveJSProperty('innerText', EMPTY_CELL_TEXT);
    await expect(dataGrid.getDataCell(2, 3).element).toHaveJSProperty('innerText', EMPTY_CELL_TEXT);
  });

  test('Change the prompt in the AI Prompt Editor', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', aiColumnsGrid, DEFAULT_SELECTOR, {
      arg: { data: dataSource, aiColumns: [FIRST_AI_COLUMN] },
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);
    await expect(dataGrid.getDataCell(0, 3).element).toHaveText('Response Name 1 for first AI column');
    await expect(dataGrid.getDataCell(1, 3).element).toHaveText('Response Name 2 for first AI column');
    await expect(dataGrid.getDataCell(2, 3).element).toHaveText('Response Name 3 for first AI column');

    const aiColumnHeaderCell = dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(3);

    await aiColumnHeaderCell.getAIHeaderButton().element.click();
    const dropDownList = await aiColumnHeaderCell.getAIHeaderButton().getList();
    await dropDownList.getItem(DROPDOWNMENU_PROMPT_EDITOR_INDEX).element.click();

    const promptEditor = dataGrid.getAIPromptEditor();

    await typeText(promptEditor.getTextArea().input, 'changed prompt', { replace: true });
    await promptEditor.getApplyButton().element.click();

    await expect(dataGrid.getDataCell(0, 3).element).toHaveText('Response Name 1 for changed prompt');
    await expect(dataGrid.getDataCell(1, 3).element).toHaveText('Response Name 2 for changed prompt');
    await expect(dataGrid.getDataCell(2, 3).element).toHaveText('Response Name 3 for changed prompt');
  });

  test('The scroll position should not reset when the ai.prompt changes at runtime', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', () => ({
      dataSource: [{ id: 1, name: 'Name 1', value: 1 }],
      keyExpr: 'id',
      width: 200,
      columns: [
        { dataField: 'id', caption: 'ID', width: 100 },
        { dataField: 'name', caption: 'Name', width: 200 },
        { dataField: 'value', caption: 'Value', width: 100 },
        {
          type: 'ai',
          caption: 'AI Column',
          name: 'aiColumn',
          ai: {
            aiIntegration: new (window as any).DevExpress.aiIntegration.AIIntegration({
              sendRequest() {
                return {
                  // Never answers: the request stays pending.
                  promise: new Promise<string>(() => {}),
                  abort: (): void => {},
                };
              },
            }),
          },
          width: 300,
        },
      ],
    }));

    await createWidget(page, 'dxButton', () => ({
      text: 'Change prompt',
      onClick() {
        const grid = ($ as any)('#container').dxDataGrid('instance');
        grid.columnOption('aiColumn', 'ai.prompt', 'Updated prompt');
      },
    }), '#otherContainer');

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const changePromptButton = new Button(page, '#otherContainer');
    const scrollContainer = dataGrid.getHeadersScrollContainer();
    const getScrollLeft = (): Promise<number> => scrollContainer.evaluate((el) => el.scrollLeft);
    const scrollX = 200;

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await dataGrid.scrollTo({ left: scrollX });

    await expect.poll(getScrollLeft).toBe(scrollX);

    await changePromptButton.element.click();

    await expect(dataGrid.getLoadPanel().element).toBeAttached();

    await expect.poll(getScrollLeft).toBe(scrollX);
  });
});
