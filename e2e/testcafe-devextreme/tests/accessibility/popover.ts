import { Properties } from 'devextreme/ui/popover.d';
import url from '../../helpers/getPageUrl';
import { defaultSelector, testAccessibility, Configuration } from '../../helpers/accessibility/test';
import { Options } from '../../helpers/generateOptionMatrix';

fixture.disablePageReloads`Accessibility`
  .page(url(__dirname, '../container.html'));

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

const configuration: Configuration = {
  component: 'dxPopover',
  options,
};

testAccessibility(configuration);
