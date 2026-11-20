import type { Properties } from 'devextreme/ui/text_area';
import { testAccessibility, type Configuration } from '../../helpers/accessibility/test';
import type { Options } from '../../helpers/generateOptionMatrix';

const longText = 'Prepare 2013 Marketing Plan: We need to double revenues in 2013 and our marketing strategy is going to be key here. R&D is improving existing products and creating new products so we can deliver great AV equipment to our customers.Robert, please make certain to create a PowerPoint presentation for the members of the executive team.';

const options: Options<Properties> = {
  value: [undefined, longText],
  placeholder: [undefined, 'placeholder'],
  inputAttr: [{ 'aria-label': 'aria-label' }],
};

const a11yCheckConfig = {};

const availabilityConfiguration: Configuration<Properties> = {
  component: 'dxTextArea',
  a11yCheckConfig,
  options: {
    ...options,
    disabled: [true, false],
    readOnly: [true, false],
  },
};

testAccessibility(availabilityConfiguration);

const infoConfiguration: Configuration<Properties> = {
  component: 'dxTextArea',
  name: 'info',
  a11yCheckConfig,
  options: {
    ...options,
    label: ['', 'label'],
    name: ['', 'name'],
  },
};

testAccessibility(infoConfiguration);

const spellcheckConfiguration: Configuration<Properties> = {
  component: 'dxTextArea',
  name: 'spellcheck',
  a11yCheckConfig,
  options: {
    ...options,
    spellcheck: [true],
  },
};

testAccessibility(spellcheckConfiguration);
