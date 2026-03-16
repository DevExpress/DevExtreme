import { Properties } from 'devextreme/ui/radio_group.d';
import url from '../../helpers/getPageUrl';
import { testAccessibility, Configuration } from '../../helpers/accessibility/test';
import { Options } from '../../helpers/generateOptionMatrix';

fixture.disablePageReloads`Accessibility`
  .page(url(__dirname, '../container.html'));

const items = ['Item_1', 'Item_2', 'Item_3'];

const options: Options<Properties> = {
  items: [items],
  disabled: [true, false],
  readOnly: [true, false],
  layout: ['horizontal', 'vertical'],
};

const a11yCheckConfig = {};

const configuration: Configuration = {
  component: 'dxRadioGroup',
  a11yCheckConfig,
  options,
};

testAccessibility(configuration);

const buttons = [
  {
    text: 'custom 1',
  },
  {
    text: 'custom 2',
  },
];

const interactiveItemsConfiguration: Configuration = {
  component: 'dxRadioGroup',
  a11yCheckConfig,
  options: {
    items: [buttons],
    itemTemplate: [
      (itemData, _, itemElement) => {
        const $button = $('<button>').text(itemData.text);

        itemElement.append($button);
      },
      (itemData, _, itemElement) => {
        itemElement.text(itemData.text);
      },
    ],
  },
};

testAccessibility(interactiveItemsConfiguration);
