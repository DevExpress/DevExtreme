import { Properties } from 'devextreme/ui/text_area.d';
import url from '../../helpers/getPageUrl';
import { testAccessibility, Configuration } from '../../helpers/accessibility/test';
import { Options } from '../../helpers/generateOptionMatrix';

fixture.disablePageReloads`Accessibility`
  .page(url(__dirname, '../container.html'));

const longText = 'Prepare 2013 Marketing Plan: We need to double revenues in 2013 and our marketing strategy is going to be key here. R&D is improving existing products and creating new products so we can deliver great AV equipment to our customers.Robert, please make certain to create a PowerPoint presentation for the members of the executive team.';

const options: Options<Properties> = {
  value: [undefined, longText],
  placeholder: [undefined, 'placeholder'],
  inputAttr: [{ 'aria-label': 'aria-label' }],
};

const a11yCheckConfig = {};

const availabilityConfiguration: Configuration = {
  component: 'dxTextArea',
  a11yCheckConfig,
  options: {
    ...options,
    disabled: [true, false],
    readOnly: [true, false],
  },
};

testAccessibility(availabilityConfiguration);

const infoConfiguration: Configuration = {
  component: 'dxTextArea',
  a11yCheckConfig,
  options: {
    ...options,
    label: ['', 'label'],
    name: ['', 'name'],
  },
};

testAccessibility(infoConfiguration);

const spellcheckConfiguration: Configuration = {
  component: 'dxTextArea',
  a11yCheckConfig,
  options: {
    ...options,
    spellcheck: [true],
  },
};

testAccessibility(spellcheckConfiguration);
