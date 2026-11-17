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
const ENGLISH_TEXTS = {
  question: 'What is the weather in London and the exchange rate?',
  answer: 'The exchange rate is not available.',
  weatherTool: 'getWeather',
  exchangeTool: 'getExchangeRate',
  weatherResult: '15°C (59°F)',
  errorResult: 'Failed to execute the tool',
};
const ARABIC_TEXTS = {
  question: 'ما حالة الطقس في لندن وسعر الصرف؟',
  answer: 'سعر الصرف غير متاح.',
  weatherTool: 'الحصول_على_الطقس',
  exchangeTool: 'الحصول_على_سعر_الصرف',
  weatherResult: 'غائم، 15 درجة مئوية.',
  errorResult: 'تعذّر تنفيذ الأداة.',
};
const ARABIC_MESSAGES = {
  'dxChat-toolCallArgumentsLabel': 'الوسائط',
  'dxChat-toolCallResultLabel': 'النتيجة',
  'dxChat-toolCallsTitle': 'الأدوات: {0}',
  'dxChat-toolCallError': 'خطأ',
};

interface ChatCase {
  expandAll?: boolean;
  disabled?: boolean;
  height?: number;
  rtlEnabled?: boolean;
  texts?: typeof ENGLISH_TEXTS;
}

const createChat = async (
  page: Page,
  {
    expandAll = false, disabled = false, height = 360, rtlEnabled = false, texts = ENGLISH_TEXTS,
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
        text: texts.question,
      },
      {
        id: 2,
        author: ASSISTANT,
        timestamp: START + 60000,
        text: texts.answer,
        toolCalls: [
          {
            name: texts.weatherTool,
            arguments: { country: 'UK', city: 'London' },
            status: 'success',
            result: texts.weatherResult,
          },
          {
            name: texts.exchangeTool,
            arguments: { fromCurrency: 'USD', toCurrency: 'XYZ' },
            status: 'error',
            result: texts.errorResult,
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
  await createChat(page, {
    expandAll: true, height: 1080, texts: { ...ENGLISH_TEXTS, weatherResult: LONG_RESULT },
  });

  await testScreenshot(page, 'Chat tool calls long result.png', { element: '#container' });
});

test('Chat tool calls: disabled', async ({ page }) => {
  await createChat(page, { expandAll: true, disabled: true, height: 900 });

  await testScreenshot(page, 'Chat tool calls disabled.png', { element: '#container' });
});

test('Chat tool calls: expanded in an Arabic right-to-left chat', async ({ page }) => {
  await page.evaluate((messages) => {
    const { localization } = (window as any).DevExpress;

    localization.loadMessages({ ar: messages });
    localization.locale('ar');
  }, ARABIC_MESSAGES);

  await createChat(page, {
    expandAll: true, height: 900, rtlEnabled: true, texts: ARABIC_TEXTS,
  });

  await testScreenshot(page, 'Chat tool calls expanded rtl.png', { element: '#container' });
});
