import { Properties } from 'devextreme/ui/popover.d';
import { ToolbarItem } from 'devextreme/ui/popup.d';
import url from '../../helpers/getPageUrl';
import { testAccessibility, Configuration } from '../../helpers/accessibility/test';
import { Options } from '../../helpers/generateOptionMatrix';

fixture.disablePageReloads`Accessibility`
  .page(url(__dirname, '../container.html'));

const toolbarItems: ToolbarItem[] = [
  {
    locateInMenu: 'always',
    widget: 'dxButton',
    toolbar: 'top',
    options: { text: 'More info' },
  }, {
    widget: 'dxButton',
    toolbar: 'bottom',
    location: 'before',
    options: { icon: 'email', text: 'Send' },
  }, {
    widget: 'dxButton',
    toolbar: 'bottom',
    location: 'after',
    options: { text: 'Close' },
  },
];

const options: Options<Properties> = {
  width: [300],
  visible: [true, false],
  shading: [true, false],
  disabled: [true, false],
  showTitle: [true, false],
  title: [undefined, 'title'],
  hint: [undefined, 'hint'],
  enableBodyScroll: [true, false],
  deferRendering: [true, false],
  elementAttr: [{ 'aria-label': 'aria-label' }],
  toolbarItems: [undefined, toolbarItems],
  animation: [
    undefined,
    {
      show: {
        type: 'fade',
        duration: 600,
        from: 0,
        to: 1,
      },
      hide: {
        type: 'fade',
        duration: 600,
        from: 1,
        to: 0,
      },
    },
  ],
};

const a11yCheckConfig = {
  // NOTE: color-contrast issues
  rules: { 'color-contrast': { enabled: false } },
};

const configuration: Configuration = {
  component: 'dxPopover',
  a11yCheckConfig,
  options,
};

testAccessibility(configuration);
