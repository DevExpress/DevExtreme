import { Properties } from 'devextreme/ui/form';
import url from '../../../../helpers/getPageUrl';
import { testAccessibility, Configuration } from '../../../../helpers/accessibility/test';
import { Options } from '../../../../helpers/generateOptionMatrix';

fixture.disablePageReloads`Accessibility`
  .page(url(__dirname, '../../../container.html'));

const items: Properties['items'] = [{
  itemType: 'simple',
  dataField: 'Email',
  validationRules: [{
    type: 'required',
    message: 'Email is required',
  }],
}];

const options: Options<Properties> = {
  height: [200],
  requiredMark: [undefined, '#'],
  showRequiredMark: [true, false],
  showValidationSummary: [true, false],
  items: [items],
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
