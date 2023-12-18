import { Options, Configuration } from '../../../helpers/testAccessibility';
import { Item } from '../../../../../js/ui/tabs.d';

const items = [
  { text: 'John Heart' },
  { text: 'Marina Thomas', disabled: true },
  { text: 'Robert Reagan' },
  { text: 'Greta Sims' },
  { text: 'Olivia Peyton' },
  { text: 'Ed Holmes' },
  { text: 'Wally Hobbs' },
  { text: 'Brad Jameson' },
] as Item[];

const options: Options = {
  dataSource: [items],
  rtlEnabled: [true, false],
  orientation: ['horizontal', 'vertical'],
  selectOnFocus: [true, false],
  showNavButtons: [true, false],
  width: [450],
  height: [250],
  itemHoldTimeout: [5000],
  useInkRipple: [false],

};

// eslint-disable-next-line max-len
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/return-await
const created = async (t: any): Promise<void> => await t.pressKey('tab');

export const configuration: Configuration = {
  component: 'dxTabs',
  options,
  created,
};
