<template>
  <div id="form-demo">
    <div class="widget-container">
      <form
        action="your-action"
        @submit="handleSubmit"
      >
        <DxForm
          v-model:form-data="customer"
          :read-only="false"
          @initialized="saveFormInstance"
          @optionChanged="onOptionChanged"
          :show-colon-after-label="true"
          :show-validation-summary="true"
          validation-group="customerData"
        >
          <DxGroupItem caption="Credentials">
            <DxSimpleItem
              data-field="Email"
              :editor-options="emailEditorOptions"
            >
              <DxRequiredRule message="Email is required"/>
              <DxEmailRule message="Email is invalid"/>
              <DxAsyncRule
                :validation-callback="asyncValidation"
                message="Email is already registered"
              />
            </DxSimpleItem>
            <DxSimpleItem
              :editor-options="passwordEditorOptions"
              data-field="Password"
            >
              <DxRequiredRule message="Password is required"/>
            </DxSimpleItem>
            <DxSimpleItem
              name="ConfirmPassword"
              data-field="ConfirmPassword"
              :editor-options="confirmPasswordEditorOptions"
              editor-type="dxTextBox"
            >
              <DxLabel text="Confirm Password"/>
              <DxRequiredRule message="Confirm Password is required"/>
              <DxCompareRule
                :comparison-target="passwordComparison"
                message="Password and Confirm Password do not match"
              />
            </DxSimpleItem>
          </DxGroupItem>
          <DxGroupItem caption="Personal Data">
            <DxSimpleItem
              data-field="Name"
              :editor-options="nameEditorOptions"
            >
              <DxRequiredRule message="Name is required"/>
              <DxPatternRule
                :pattern="namePattern"
                message="Do not use digits in the Name"
              />
            </DxSimpleItem>
            <DxSimpleItem
              :editor-options="dateBoxOptions"
              data-field="Date"
              editor-type="dxDateBox"
            >
              <DxLabel text="Date of birth"/>
              <DxRequiredRule message="Date of birth is required"/>
              <DxRangeRule
                :max="maxDate"
                message="You must be at least 21 years old"
              />
            </DxSimpleItem>
            <DxSimpleItem
              :editor-options="dateRangeBoxOptions"
              data-field="VacationDates"
              editor-type="dxDateRangeBox"
            >
              <DxLabel text="Vacation Dates"/>
              <DxCustomRule
                :validation-callback="validateVacationDatesRange"
                message="The vacation period must not exceed 25 days"
              />
              <DxCustomRule
                :validation-callback="validateVacationDatesPresence"
                message="Both start and end dates must be selected"
              />
            </DxSimpleItem>
          </DxGroupItem>
          <DxGroupItem caption="Billing address">
            <DxSimpleItem
              :editor-options="countryEditorOptions"
              data-field="Country"
              editor-type="dxSelectBox"
            >
              <DxRequiredRule message="Country is required"/>
            </DxSimpleItem>
            <DxSimpleItem
              :editor-options="cityEditorOptions"
              data-field="City"
              editor-type="dxAutocomplete"
            >
              <DxPatternRule
                :pattern="cityPattern"
                message="Do not use digits in the City name"
              />

              <DxStringLengthRule
                :min="2"
                message="City must have at least 2 symbols"
              />
              <DxRequiredRule message="City is required"/>
            </DxSimpleItem>
            <DxSimpleItem
              data-field="Address"
              :editor-options="addressEditorOptions"
            >
              <DxRequiredRule message="Address is required"/>
            </DxSimpleItem>
            <DxSimpleItem
              :editor-options="phoneEditorOptions"
              data-field="Phone"
              help-text="Enter the phone number in USA phone format"
            >
              <DxPatternRule
                :pattern="phonePattern"
                message="The phone must have a correct USA phone format"
              />
            </DxSimpleItem>
          </DxGroupItem>

          <DxGroupItem
            css-class="last-group"
            :col-count-by-screen="colCountByScreen"
          >
            <DxSimpleItem
              :editor-options="checkBoxOptions"
              data-field="Accepted"
              editor-type="dxCheckBox"
            >
              <DxLabel :visible="false"/>
              <DxCompareRule
                :comparison-target="checkComparison"
                type="compare"
                message="You must agree to the Terms and Conditions"
              />
            </DxSimpleItem>

            <DxGroupItem
              css-class="buttons-group"
              :col-count-by-screen="colCountByScreen"
            >
              <DxButtonItem
                :button-options="resetButtonOptions"
                name="Reset"
              />
              <DxButtonItem
                :button-options="registerButtonOptions"
              />
            </DxGroupItem>
          </DxGroupItem>
        </DxForm>
      </form>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import DxForm, {
  DxGroupItem,
  DxSimpleItem,
  DxButtonItem,
  DxLabel,
  DxRequiredRule,
  DxCompareRule,
  DxRangeRule,
  DxStringLengthRule,
  DxPatternRule,
  DxEmailRule,
  DxAsyncRule,
  DxCustomRule,
} from 'devextreme-vue/form';
// eslint-disable-next-line
import DxAutocomplete from 'devextreme-vue/autocomplete'; // for editor-type=dxAutocomplete
import 'devextreme-vue/date-range-box';
import notify from 'devextreme/ui/notify';
import Validator from 'devextreme/ui/validator';
import service from './data.ts';

const formInstance = ref(null);
const customer = ref(service.getCustomer());
const registerButtonOptions = ref({
  text: 'Register',
  type: 'default',
  width: '120px',
  useSubmitBehavior: true,
});
const resetButtonOptions = ref({
  icon: 'refresh',
  text: 'Reset',
  disabled: true,
  width: '120px',
  onClick: () => {
    formInstance.value.reset();
  },
});
const colCountByScreen = ref({
  xs: 2,
  sm: 2,
  md: 2,
  lg: 2,
});
const passwordEditorOptions = ref({
  mode: 'password',
  valueChangeEvent: 'keyup',
  onValueChanged: () => {
    const editor = formInstance.value.getEditor('ConfirmPassword');
    if (editor.option('value')) {
      const instance = Validator.getInstance(editor.element()) as Validator;
      instance.validate();
    }
  },
  buttons: [
    {
      name: 'password',
      location: 'after',
      options: {
        icon: 'eyeopen',
        stylingMode: 'text',
        onClick: () => changePasswordMode('Password'),
      },
    },
  ],
});
const confirmPasswordEditorOptions = ref({
  mode: 'password',
  valueChangeEvent: 'keyup',
  buttons: [
    {
      name: 'password',
      location: 'after',
      options: {
        icon: 'eyeopen',
        stylingMode: 'text',
        onClick: () => changePasswordMode('ConfirmPassword'),
      },
    },
  ],
});
const emailEditorOptions = ref({
  valueChangeEvent: 'keyup',
});
const nameEditorOptions = ref({
  valueChangeEvent: 'keyup',
});
const addressEditorOptions = ref({
  valueChangeEvent: 'keyup',
});
const dateBoxOptions = ref({
  placeholder: 'Birth Date',
  acceptCustomValue: false,
  openOnFieldClick: true,
});
const dateRangeBoxOptions = ref({
  endDatePlaceholder: 'End Date',
  startDatePlaceholder: 'Start Date',
  acceptCustomValue: false,
});
const checkBoxOptions = ref({
  text: 'I agree to the Terms and Conditions',
  width: 270,
  value: false,
});
const phoneEditorOptions = ref({
  mask: '+1 (X00) 000-0000',
  valueChangeEvent: 'keyup',
  maskRules: {
    X: /[02-9]/,
  },
  maskInvalidMessage: 'The phone must have a correct USA phone format',
});
const cityEditorOptions = ref({
  dataSource: service.getCities(),
  valueChangeEvent: 'keyup',
  minSearchLength: 2,
});
const countryEditorOptions = ref({
  dataSource: service.getCountries(),
});
const maxDate = ref(new Date().setFullYear(new Date().getFullYear() - 21));
const namePattern = ref(/^[^0-9]+$/);
const cityPattern = ref(/^[^0-9]+$/);
const phonePattern = ref(/^[02-9]\d{9}$/);

function onOptionChanged(e) {
  if (e.name === 'isDirty') {
    const resetButton = formInstance.value.getButton('Reset');
    resetButton.option('disabled', !e.value);
  }
}
function saveFormInstance(e) {
  formInstance.value = e.component;
}
function changePasswordMode(name) {
  const editor = formInstance.value.getEditor(name);
  editor.option(
    'mode',
    editor.option('mode') === 'text' ? 'password' : 'text',
  );
}
function passwordComparison() {
  return customer.value.Password;
}
function checkComparison() {
  return true;
}
function asyncValidation(params) {
  return sendRequest(params.value);
}
function validateVacationDatesRange({ value }) {
  const [startDate, endDate] = value;

  if (startDate === null || endDate === null) {
    return true;
  }

  const millisecondsPerDay = 24 * 60 * 60 * 1000;
  const daysDifference = Math.abs((endDate - startDate) / millisecondsPerDay);

  return daysDifference < 25;
}
function validateVacationDatesPresence({ value }) {
  const [startDate, endDate] = value;

  if (startDate === null && endDate === null) {
    return true;
  }

  return startDate !== null && endDate !== null;
}
function handleSubmit(e) {
  notify({
    message: 'You have submitted the form',
    position: {
      my: 'center top',
      at: 'center top',
    },
  }, 'success', 3000);
  e.preventDefault();
}
const sendRequest = function(value) {
  const invalidEmail = 'test@dx-email.com';
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(value !== invalidEmail);
    }, 1000);
  });
};
</script>
<style scoped>
form {
  margin: 10px 10px 15px;
}

.last-group {
  margin-top: 30px;
  margin-bottom: 10px;
}

.last-group .dx-item-content {
  align-items: start;
  justify-content: center;
}

.last-group .dx-field-item {
  padding: 0 !important;
}

.buttons-group {
  display: flex;
  width: 100%;
  justify-content: end;
}

.buttons-group .dx-item-content {
  gap: 10px;
}
</style>
