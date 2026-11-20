import type { Properties } from 'devextreme/ui/radio_group';
import { testAccessibility, type Configuration } from '../../helpers/accessibility/test';
import type { Options } from '../../helpers/generateOptionMatrix';

const items = ['Item_1', 'Item_2', 'Item_3'];

const options: Options<Properties> = {
  items: [items],
  disabled: [true, false],
  readOnly: [true, false],
  layout: ['horizontal', 'vertical'],
};

const a11yCheckConfig = {};

const configuration: Configuration<Properties> = {
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

const interactiveItemsConfiguration: Configuration<Properties> = {
  component: 'dxRadioGroup',
  name: 'interactive items',
  a11yCheckConfig,
  options: {
    items: [buttons],
    itemTemplate: [
      (itemData, _, itemElement: any) => {
        const $button = $('<button>').text(itemData.text);

        itemElement.append($button);
      },
    ],
  },
};

testAccessibility(interactiveItemsConfiguration);
