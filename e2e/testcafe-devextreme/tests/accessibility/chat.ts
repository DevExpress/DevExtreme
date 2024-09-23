import { Message, User, Properties } from 'devextreme/ui/chat.d';
import url from '../../helpers/getPageUrl';
import { testAccessibility, Configuration } from '../../helpers/accessibility/test';
import { Options } from '../../helpers/generateOptionMatrix';
import { isMaterial, isMaterialBased } from '../../helpers/themeUtils';
import { avatarUrl } from '../chat/data';

fixture.disablePageReloads`Accessibility`
  .page(url(__dirname, '../container.html'));

const getUsers = (length: number, useUrlAvatar: boolean): User[] => {
  const users = Array.from({ length }, (_, i) => {
    const user: User = {
      id: i,
      name: `User name ${i}`,
      avatarUrl: useUrlAvatar ? avatarUrl : '',
    };

    return user;
  });

  return users;
};

const getItems = (useUrlAvatar: boolean): Message[] => {
  const [userFirst, userSecond] = getUsers(2, useUrlAvatar);

  const items: Message[] = [
    {
      timestamp: new Date(),
      text: 'Message text',
      author: userFirst,
    },
    {
      timestamp: new Date(),
      text: 'Message text',
      author: userSecond,
    },
  ];

  return items;
};

const items = [[], getItems(true), getItems(false)];
const currentUser = items[2][1].author;

const options: Options<Properties> = {
  items,
  user: [currentUser],
};

const created = async (t: TestController): Promise<void> => {
  await t.pressKey('tab');
};

const a11yCheckConfig = isMaterialBased() ? {
  // NOTE: color-contrast issues in Material
  runOnly: isMaterial() ? '' : 'color-contrast',
  rules: { 'color-contrast': { enabled: !isMaterial() } },
} : {};

const configuration: Configuration = {
  component: 'dxChat',
  a11yCheckConfig,
  options,
  created,
};

testAccessibility(configuration);
