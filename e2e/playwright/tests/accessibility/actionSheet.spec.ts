import type { Properties } from 'devextreme/ui/action_sheet';
import { testAccessibility, type Configuration } from '../../helpers/accessibility/test';
import type { Options } from '../../helpers/generateOptionMatrix';

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

const configuration: Configuration<Properties> = {
  component: 'dxActionSheet',
  options,
};

testAccessibility(configuration);
