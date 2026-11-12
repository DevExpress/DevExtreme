import type { Page } from '@playwright/test';
import { expect, test } from '../../../fixtures';
import { createWidget } from '../../../helpers/createWidget';
import { testScreenshot } from '../../../helpers/screenshots';

test.use({ browserSize: [700, 1200] });

const TOOL_CALL_VIEW = '.dx-chat-tool-call-view';

const START = Date.UTC(2026, 0, 1, 10, 0, 0);
const USER = { id: 'user' };
const ASSISTANT = { id: 'assistant', name: 'AI Assistant' };
const LONG_RESULT = Array.from({ length: 30 }, (_, i) => `Line ${i + 1}: the forecast is stable`).join('\n');

interface ChatCase {
  expandAll?: boolean;
  disabled?: boolean;
  height?: number;
  weatherResult?: string;
  rtlEnabled?: boolean;
}

const createChat = async (
  page: Page,
  {
    expandAll = false, disabled = false, height = 360, weatherResult = '15°C (59°F)', rtlEnabled = false,
  }: ChatCase = {},
): Promise<void> => {
  await createWidget(page, 'dxChat', {
    user: USER,
    width: 560,
    height,
    showAvatar: false,
    showDayHeaders: false,
    disabled,
    rtlEnabled,
    toolCallOptions: { expandAll },
    items: [
      {
        id: 1,
        author: USER,
        timestamp: START,
        text: 'What is the weather in London and the exchange rate?',
      },
      {
        id: 2,
        author: ASSISTANT,
        timestamp: START + 60000,
        text: 'The exchange rate is not available.',
        toolCalls: [
          {
            name: 'getWeather',
            arguments: { country: 'UK', city: 'London' },
            status: 'success',
            result: weatherResult,
          },
          {
            name: 'getExchangeRate',
            arguments: { fromCurrency: 'USD', toCurrency: 'XYZ' },
            status: 'error',
            result: 'Failed to execute the tool',
          },
        ],
      },
    ],
  });

  await expect(page.locator(TOOL_CALL_VIEW)).toBeVisible();
};

test('Chat tool calls: collapsed', async ({ page }) => {
  await createChat(page);

  await testScreenshot(page, 'Chat tool calls collapsed.png', { element: '#container' });
});

test('Chat tool calls: expanded', async ({ page }) => {
  await createChat(page, { expandAll: true, height: 900 });

  await testScreenshot(page, 'Chat tool calls expanded.png', { element: '#container' });
});

test('Chat tool calls: long result is limited in height', async ({ page }) => {
  await createChat(page, { expandAll: true, height: 1080, weatherResult: LONG_RESULT });

  await testScreenshot(page, 'Chat tool calls long result.png', { element: '#container' });
});

test('Chat tool calls: disabled', async ({ page }) => {
  await createChat(page, { expandAll: true, disabled: true, height: 900 });

  await testScreenshot(page, 'Chat tool calls disabled.png', { element: '#container' });
});

test('Chat tool calls: expanded in a right-to-left chat', async ({ page }) => {
  await createChat(page, {
    expandAll: true, height: 900, rtlEnabled: true, weatherResult: 'Cloudy, 15°C (59°F).',
  });

  await testScreenshot(page, 'Chat tool calls expanded rtl.png', { element: '#container' });
});
