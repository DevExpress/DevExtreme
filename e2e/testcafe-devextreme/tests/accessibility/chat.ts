import { Message, User, Properties } from 'devextreme/ui/chat.d';
import { Selector } from 'testcafe';
import url from '../../helpers/getPageUrl';
import { testAccessibility, Configuration } from '../../helpers/accessibility/test';
import { Options } from '../../helpers/generateOptionMatrix';
import { avatarUrl } from '../editors/chat/data';

fixture.disablePageReloads`Accessibility`
  .page(url(__dirname, '../container.html'));

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

const created = async (t: TestController): Promise<void> => {
  await t.pressKey('tab');
};

const a11yCheckConfig = {};

const configuration: Configuration = {
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
  toolCallOptions: [{ expandAll: false }, { expandAll: true }],
};

const toolCallsCreated = async (
  t: TestController,
  optionConfiguration?: Properties,
): Promise<void> => {
  const expectedFieldCount = optionConfiguration?.toolCallOptions?.expandAll ? 4 : 0;

  await t
    .expect(Selector('.dx-chat-tool-call-view').exists)
    .ok()
    .expect(Selector('.dx-chat-tool-call-field').count)
    .eql(expectedFieldCount);
};

const toolCallsA11yCheckConfig = {
  rules: {
    'nested-interactive': { enabled: false },
  },
};

const toolCallsConfiguration: Configuration<Properties> = {
  component: 'dxChat',
  a11yCheckConfig: toolCallsA11yCheckConfig,
  options: toolCallsOptions,
  created: toolCallsCreated,
};

testAccessibility(toolCallsConfiguration);
