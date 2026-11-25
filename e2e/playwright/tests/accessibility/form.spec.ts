import type { Properties } from 'devextreme/ui/form';
import { testAccessibility, type Configuration } from '../../helpers/accessibility/test';
import type { Options } from '../../helpers/generateOptionMatrix';

const formData = {
  ID: 1,
  FirstName: 'John',
  LastName: 'Heart',
  Position: 'CEO',
  Active: true,
};

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
  alignItemLabels: [true, false],
  showOptionalMark: [true, false],
  formData: [formData],
};

const requiredFieldsOptions: Options<Properties> = {
  height: [200],
  showRequiredMark: [true, false],
  showValidationSummary: [true, false],
  items: [items],
};

const a11yCheckConfig = {};

const configuration: Configuration<Properties> = {
  component: 'dxForm',
  a11yCheckConfig,
  options,
};

testAccessibility(configuration);

const requiredFieldsConfiguration: Configuration<Properties> = {
  component: 'dxForm',
  name: 'required fields',
  a11yCheckConfig,
  options: requiredFieldsOptions,
};

testAccessibility(requiredFieldsConfiguration);
