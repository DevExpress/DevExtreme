import { Properties } from 'devextreme/ui/list.d';
import { Options } from '../../../../helpers/generateOptionMatrix';
import url from '../../../../helpers/getPageUrl';
import { Configuration, testAccessibility } from '../../../../helpers/accessibility/test';

fixture.disablePageReloads`Accessibility`
  .page(url(__dirname, '../../../container.html'));

const simpleItems = ['Item_1', 'Item_2', 'Item_3'];

const optionsWithSimpleItems: Options<Properties> = {
  dataSource: [simpleItems],
  height: [400],
  grouped: [false],
  searchEnabled: [true],
  allowItemDeleting: [true, false],
  itemDeleteMode: ['toggle', 'context', 'slideButton', 'slideItem', 'static', 'swipe'],
};

const a11yCheckConfig = {
  rules: {
    // NOTE: color-contrast issues
    'color-contrast': { enabled: false },
  },
};

const configurationWithSimpleItems: Configuration = {
  component: 'dxList',
  a11yCheckConfig,
  options: optionsWithSimpleItems,
};

testAccessibility(configurationWithSimpleItems);
