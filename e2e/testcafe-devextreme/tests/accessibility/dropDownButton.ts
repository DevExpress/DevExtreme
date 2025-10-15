import { Properties } from 'devextreme/ui/drop_down_button.d';
import url from '../../helpers/getPageUrl';
import { testAccessibility, Configuration } from '../../helpers/accessibility/test';
import { Options } from '../../helpers/generateOptionMatrix';

fixture.disablePageReloads`Accessibility`
  .page(url(__dirname, '../container.html'));

const items = ['Download Trial For Visual Studio', 'Download Trial For All Platforms', 'Package Managers'];

const options: Options<Properties> = {
  dataSource: [[], items],
  // NOTE: Doesn't matter if there are contrast issues
  // stylingMode: ['contained', 'outlined', 'text'],
  // type: ['normal', 'success', 'danger', 'default'],
  text: [undefined, 'Download Trial'],
  icon: [undefined, 'save'],
  disabled: [true, false],
};

const a11yCheckConfig = {
  rules: {
    // NOTE: color-contrast issues
    'color-contrast': { enabled: false },
  },
};

const noSplitButtonConfiguration: Configuration = {
  component: 'dxDropDownButton',
  a11yCheckConfig,
  options: {
    ...options,
    splitButton: [false],
    showArrowIcon: [true, false],
  },
};
testAccessibility(noSplitButtonConfiguration);

const deferredConfiguration: Configuration = {
  component: 'dxDropDownButton',
  a11yCheckConfig,
  options: {
    ...options,
    splitButton: [true],
    useSelectMode: [true, false],
    opened: [true, false],
    deferRendering: [true],
  },
};

testAccessibility(deferredConfiguration);

const noDeferredConfiguration: Configuration = {
  component: 'dxDropDownButton',
  a11yCheckConfig,
  options: {
    ...options,
    splitButton: [true],
    useSelectMode: [true, false],
    opened: [false],
    deferRendering: [false],
  },
};

testAccessibility(noDeferredConfiguration);
