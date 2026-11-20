import type { Properties } from 'devextreme/ui/validation_summary';
import { testAccessibility, type Configuration } from '../../helpers/accessibility/test';
import type { Options } from '../../helpers/generateOptionMatrix';

const options: Options<Properties> = {
  validationGroup: [undefined, 'validationGroup'],
};

const a11yCheckConfig = {};

const configuration: Configuration<Properties> = {
  component: 'dxValidationSummary',
  a11yCheckConfig,
  options,
};

testAccessibility(configuration);
