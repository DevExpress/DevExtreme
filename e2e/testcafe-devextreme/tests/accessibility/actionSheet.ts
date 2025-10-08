import { Properties } from 'devextreme/ui/action_sheet.d';
import url from '../../helpers/getPageUrl';
import { testAccessibility, Configuration } from '../../helpers/accessibility/test';
import { Options } from '../../helpers/generateOptionMatrix';
import { isMaterial, isMaterialBased } from '../../helpers/themeUtils';

fixture.disablePageReloads`Accessibility`
  .page(url(__dirname, '../container.html'));

const items = [
  { text: 'Call' },
  { text: 'Send message' },
  { text: 'Edit' },
  { text: 'Delete' },
];

const options: Options<Properties> = {
  dataSource: [[], items],
  hint: [undefined, 'hint'],
  title: [undefined, 'title'],
  cancelText: [undefined, 'Cancel'],
  showTitle: [true, false],
  showCancelButton: [true, false],
};

const a11yCheckConfig = isMaterialBased() ? {
  // NOTE: color-contrast issues in Material
  runOnly: isMaterial() ? '' : 'color-contrast',
  rules: { 'color-contrast': { enabled: !isMaterial() } },
} : {};

const configuration: Configuration = {
  component: 'dxActionSheet',
  a11yCheckConfig,
  options,
};

testAccessibility(configuration);
