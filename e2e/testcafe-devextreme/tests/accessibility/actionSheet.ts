import { Properties } from 'devextreme/ui/action_sheet.d';
import url from '../../helpers/getPageUrl';
import { testAccessibility, Configuration } from '../../helpers/accessibility/test';
import { Options } from '../../helpers/generateOptionMatrix';

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
  title: [undefined, 'title'],
  cancelText: [undefined, 'Cancel'],
  showTitle: [true, false],
  showCancelButton: [true, false],
};

const configuration: Configuration = {
  component: 'dxActionSheet',
  options,
};

testAccessibility(configuration);
