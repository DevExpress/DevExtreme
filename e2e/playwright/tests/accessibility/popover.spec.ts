import type { Properties } from 'devextreme/ui/popover';
import { defaultSelector, testAccessibility, type Configuration } from '../../helpers/accessibility/test';
import type { Options } from '../../helpers/generateOptionMatrix';

const options: Options<Properties> = {
  visible: [true],
  target: [defaultSelector],
  width: [300],
  height: [280],
  showTitle: [true, false],
  title: [undefined, 'title'],
  showCloseButton: [true, false],
  toolbarItems: [
    undefined,
    [
      {
        location: 'before',
        widget: 'dxButton',
        options: {
          icon: 'back',
        },
      },
    ],
  ],
};

const configuration: Configuration<Properties> = {
  component: 'dxPopover',
  options,
};

testAccessibility(configuration);
