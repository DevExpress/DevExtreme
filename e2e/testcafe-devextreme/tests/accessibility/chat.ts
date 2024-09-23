import { Message, User, Properties } from 'devextreme/ui/chat.d';
import url from '../../helpers/getPageUrl';
import { testAccessibility, Configuration } from '../../helpers/accessibility/test';
import { Options } from '../../helpers/generateOptionMatrix';
import { avatarUrl } from '../chat/data';

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
};

const created = async (t: TestController): Promise<void> => {
  await t.pressKey('tab');
};

const a11yCheckConfig = {
  // NOTE: color-contrast issues
  rules: { 'color-contrast': { enabled: false } },
};

const configuration: Configuration = {
  component: 'dxChat',
  a11yCheckConfig,
  options,
  created,
};

testAccessibility(configuration);
