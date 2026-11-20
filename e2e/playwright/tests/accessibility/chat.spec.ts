import type { Page } from '@playwright/test';
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
