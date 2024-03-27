import url from '../../helpers/getPageUrl';
import { clearTestPage } from '../../helpers/clearPage';
import { testAccessibility, Configuration } from '../../helpers/accessibility/test';
import { Options } from '../../helpers/generateOptionMatrix';
import { Item, Properties } from '../../../../js/ui/splitter.d';

fixture.disablePageReloads`Accessibility`
  .page(url(__dirname, '../container.html'))
  .afterEach(async () => clearTestPage());

const items: Item[] = [
  {
    resizable: true,
    minSize: '70px',
    size: '140px',
    text: 'Left Pane',
  }, {
    splitter: {
      orientation: 'vertical',
      items: [
        {
          resizable: true,
          collapsible: true,
          maxSize: '75%',
          text: 'Central Top Pane',
        }, {
          collapsible: true,
          splitter: {
            orientation: 'horizontal',
            items: [
              {
                resizable: false,
                collapsible: true,
                size: '30%',
                minSize: '5%',
                text: 'Nested Left Pane',
              }, {
                collapsible: true,
                resizable: true,
                text: 'Nested Central Pane',
              }, {
                resizable: true,
                collapsible: true,
                collapsed: true,
                size: '30%',
                minSize: '5%',
                text: 'Nested Right Pane',
              },
            ],
          },
        },
      ],
    },
  }, {
    size: '140px',
    resizable: false,
    collapsible: false,
    text: 'Right Pane',
  },
];

const options: Options<Properties> = {
  dataSource: [items],
  allowKeyboardNavigation: [true, false],
  disabled: [true, false],
  width: [450, 'auto', '100%'],
  height: [400],
  separatorSize: [8, 5],
};

const a11yCheckConfig = {
  rules: {
    'scrollable-region-focusable': { enabled: false },
    'aria-allowed-attr': { enabled: false },
  },
};

const configuration: Configuration = {
  component: 'dxSplitter',
  a11yCheckConfig,
  options,
};

testAccessibility(configuration);
