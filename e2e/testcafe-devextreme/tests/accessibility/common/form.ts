import { Properties } from 'devextreme/ui/form.d';
import url from '../../helpers/getPageUrl';
import { testAccessibility, Configuration } from '../../helpers/accessibility/test';
import { Options } from '../../helpers/generateOptionMatrix';

fixture.disablePageReloads`Accessibility`
  .page(url(__dirname, '../container.html'));

const formData = {
  ID: 1,
  FirstName: 'John',
  LastName: 'Heart',
  Position: 'CEO',
};

const options: Options<Properties> = {
  height: [200],
  hint: [undefined, 'hint'],
  requiredMark: [undefined, '#'],
  alignItemLabels: [true, false],
  showRequiredMark: [true, false],
  showOptionalMark: [true, false],
  showValidationSummary: [true, false],
  showColonAfterLabel: [true, false],
  formData: [undefined, formData],
};

const a11yCheckConfig = {
  // NOTE: color-contrast issues
  rules: { 'color-contrast': { enabled: false } },
};

const configuration: Configuration = {
  component: 'dxForm',
  a11yCheckConfig,
  options,
};

testAccessibility(configuration);
