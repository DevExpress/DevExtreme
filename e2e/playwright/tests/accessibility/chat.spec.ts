import { expect, type Page } from '@playwright/test';
import type { Message, User, Properties } from 'devextreme/ui/chat';
import { testAccessibility, type Configuration } from '../../helpers/accessibility/test';
import type { Options } from '../../helpers/generateOptionMatrix';
import { avatarUrl } from '../editors/chat/data';

const userWithAvatar: User = {
  id: 1,
  name: 'User With Avatar',
  avatarUrl,
};

const userWithoutAvatar: User = {
  id: 2,
  name: 'User Without Avatar',
};

const items: Message[] = [
  {
    timestamp: new Date(),
    text: 'Message text',
    author: userWithAvatar,
  },
  {
    timestamp: new Date(),
    text: 'Message text',
    author: userWithoutAvatar,
  },
];

const options: Options<Properties> = {
  items: [[], items],
  user: [userWithAvatar, userWithoutAvatar],
  typingUsers: [[], [userWithAvatar]],
};

const created = async (page: Page): Promise<void> => {
  await page.keyboard.press('Tab');
};

const a11yCheckConfig = {};

const configuration: Configuration<Properties> = {
  component: 'dxChat',
  a11yCheckConfig,
  options,
  created,
};

testAccessibility(configuration);

const toolCallsMessage: Message = {
  timestamp: new Date(),
  text: 'Message text',
  author: userWithoutAvatar,
  toolCalls: [
    {
      name: 'getWeather',
      arguments: { city: 'London' },
      result: '15°C',
    },
    {
      name: 'getExchangeRate',
      arguments: { fromCurrency: 'USD', toCurrency: 'XYZ' },
      result: 'Failed to execute the tool',
      status: 'error',
    },
  ],
};

const toolCallsOptions: Options<Properties> = {
  items: [[toolCallsMessage]],
  user: [userWithAvatar],
};

const toolCallsCreated = async (
  page: Page,
  optionConfiguration?: Properties,
): Promise<void> => {
  const expectedFieldCount = optionConfiguration?.toolCallOptions?.expandAll ? 4 : 0;

  await expect(page.locator('.dx-chat-tool-call-view').first()).toBeAttached();
  await expect(page.locator('.dx-chat-tool-call-field')).toHaveCount(expectedFieldCount);
};

const toolCallsA11yCheckConfig = {
  rules: {
    'nested-interactive': { enabled: false },
  },
};

const collapsedToolCallsConfiguration: Configuration<Properties> = {
  component: 'dxChat',
  name: 'collapsed tool calls',
  a11yCheckConfig,
  options: { ...toolCallsOptions, toolCallOptions: [{ expandAll: false }] },
  created: toolCallsCreated,
};

testAccessibility(collapsedToolCallsConfiguration);

const expandedToolCallsConfiguration: Configuration<Properties> = {
  component: 'dxChat',
  name: 'expanded tool calls',
  a11yCheckConfig: toolCallsA11yCheckConfig,
  options: { ...toolCallsOptions, toolCallOptions: [{ expandAll: true }] },
  created: toolCallsCreated,
};

testAccessibility(expandedToolCallsConfiguration);
