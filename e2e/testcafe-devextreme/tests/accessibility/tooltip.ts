import { Properties } from 'devextreme/ui/tooltip.d';
import url from '../../helpers/getPageUrl';
import { testAccessibility, Configuration } from '../../helpers/accessibility/test';
import { Options } from '../../helpers/generateOptionMatrix';

fixture.disablePageReloads`Accessibility`
  .page(url(__dirname, '../container.html'));

const options: Options<Properties> = {
  visible: [true, false],
  disabled: [true, false],
  shading: [true, false],
  hint: [undefined, 'hint'],
  hideOnOutsideClick: [true, false],
  hideOnParentScroll: [true, false],
  deferRendering: [true, false],
  wrapperAttr: [{ 'aria-label': 'Tooltip' }],
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
  component: 'dxTooltip',
  a11yCheckConfig,
  options,
};

testAccessibility(configuration);
