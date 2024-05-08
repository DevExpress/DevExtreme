import { Properties } from 'devextreme/ui/toast.d';
import url from '../../helpers/getPageUrl';
import { testAccessibility, Configuration } from '../../helpers/accessibility/test';
import { Options } from '../../helpers/generateOptionMatrix';

fixture.disablePageReloads`Accessibility`
  .page(url(__dirname, '../container.html'));

const options: Options<Properties> = {
  visible: [true, false],
  shading: [true, false],
  message: [undefined, 'message'],
  hint: [undefined, 'hint'],
  displayTime: [undefined, 3000],
  deferRendering: [true, false],
  type: ['custom', 'error', 'info', 'success', 'warning'],
  focusStateEnabled: [true],
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
  component: 'dxToast',
  a11yCheckConfig,
  options,
};

testAccessibility(configuration);
