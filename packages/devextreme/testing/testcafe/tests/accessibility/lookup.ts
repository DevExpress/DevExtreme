import url from '../../helpers/getPageUrl';
import { clearTestPage } from '../../helpers/clearPage';
import { testAccessibility, Configuration } from '../../helpers/accessibility/test';
import { Options } from '../../helpers/generateOptionMatrix';
import { Properties } from '../../../../js/ui/lookup.d';
import { isMaterial } from '../../helpers/themeUtils';

fixture.disablePageReloads`Accessibility`
  .page(url(__dirname, '../container.html'))
  .afterEach(async () => clearTestPage());

const items = ['John Heart', 'Samantha Bright'];

const options: Options<Properties> = {
  dataSource: [[], items],
  disabled: [true, false],
  readOnly: [true, false],
  placeholder: [undefined, 'placeholder'],
  applyValueMode: ['instantly', 'useButtons'],
  inputAttr: [{ 'aria-label': 'aria-label' }],
  opened: [true, false],
  deferRendering: [true, false],
  buttons: [
    undefined,
    [
      {
        name: 'today',
        location: 'before',
        options: {
          text: 'Today',
          stylingMode: 'text',
          onClick: () => {},
        },
      },
    ],
  ],
};

const a11yCheckConfig = {
  rules: {
    // NOTE: color-contrast issues
    'color-contrast': { enabled: false },
    // NOTE: aria-dialog-name issue in Material
    'aria-dialog-name': { enabled: !isMaterial() },
  },
};

const configuration: Configuration = {
  component: 'dxLookup',
  a11yCheckConfig,
  options,
};

testAccessibility(configuration);
