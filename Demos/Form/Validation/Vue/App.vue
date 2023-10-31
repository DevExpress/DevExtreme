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
<script>
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
import DxAutocomplete from 'devextreme-vue/autocomplete';
import 'devextreme-vue/date-range-box';

import notify from 'devextreme/ui/notify';
import Validator from 'devextreme/ui/validator';

import service from './data.js';

const sendRequest = function(value) {
  const invalidEmail = 'test@dx-email.com';
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(value !== invalidEmail);
    }, 1000);
  });
};

export default {
  components: {
    DxGroupItem,
    DxSimpleItem,
    DxButtonItem,
    DxLabel,
    DxRequiredRule,
    DxCompareRule,
    DxPatternRule,
    DxRangeRule,
    DxEmailRule,
    DxStringLengthRule,
    DxForm,
    DxAutocomplete,
    DxAsyncRule,
    DxCustomRule,
    notify,
  },
  data() {
    return {
      formInstance: null,
      customer: service.getCustomer(),
      registerButtonOptions: {
        text: 'Register',
        type: 'default',
        width: '120px',
        useSubmitBehavior: true,
      },
      resetButtonOptions: {
        icon: 'refresh',
        text: 'Reset',
        disabled: true,
        width: '120px',
        onClick: () => {
          this.formInstance.reset();
        },
      },
      colCountByScreen: {
        xs: 2,
        sm: 2,
        md: 2,
        lg: 2,
      },
      passwordEditorOptions: {
        mode: 'password',
        valueChangeEvent: 'keyup',
        onValueChanged: () => {
          const editor = this.formInstance.getEditor('ConfirmPassword');
          if (editor.option('value')) {
            const instance = Validator.getInstance(editor.element());
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
              onClick: () => this.changePasswordMode('Password'),
            },
          },
        ],
      },
      confirmPasswordEditorOptions: {
        mode: 'password',
        valueChangeEvent: 'keyup',
        buttons: [
          {
            name: 'password',
            location: 'after',
            options: {
              icon: 'eyeopen',
              stylingMode: 'text',
              onClick: () => this.changePasswordMode('ConfirmPassword'),
            },
          },
        ],
      },
      emailEditorOptions: {
        valueChangeEvent: 'keyup',
      },
      nameEditorOptions: {
        valueChangeEvent: 'keyup',
      },
      addressEditorOptions: {
        valueChangeEvent: 'keyup',
      },
      dateBoxOptions: {
        placeholder: 'Birth Date',
        acceptCustomValue: false,
        openOnFieldClick: true,
      },
      dateRangeBoxOptions: {
        endDatePlaceholder: 'End Date',
        startDatePlaceholder: 'Start Date',
        acceptCustomValue: false,
      },
      checkBoxOptions: {
        text: 'I agree to the Terms and Conditions',
        width: 270,
        value: false,
      },
      phoneEditorOptions: {
        mask: '+1 (X00) 000-0000',
        valueChangeEvent: 'keyup',
        maskRules: {
          X: /[02-9]/,
        },
        maskInvalidMessage: 'The phone must have a correct USA phone format',
      },
      cityEditorOptions: {
        dataSource: service.getCities(),
        valueChangeEvent: 'keyup',
        minSearchLength: 2,
      },
      countryEditorOptions: {
        dataSource: service.getCountries(),
      },
      maxDate: new Date().setFullYear(new Date().getFullYear() - 21),
      namePattern: /^[^0-9]+$/,
      cityPattern: /^[^0-9]+$/,
      phonePattern: /^[02-9]\d{9}$/,
    };
  },
  methods: {
    onOptionChanged(e) {
      if (e.name === 'isDirty') {
        const resetButton = this.formInstance.getButton('Reset');
        resetButton.option('disabled', !e.value);
      }
    },
    saveFormInstance(e) {
      this.formInstance = e.component;
    },
    changePasswordMode(name) {
      const editor = this.formInstance.getEditor(name);
      editor.option(
        'mode',
        editor.option('mode') === 'text' ? 'password' : 'text',
      );
    },
    passwordComparison() {
      return this.customer.Password;
    },
    checkComparison() {
      return true;
    },
    asyncValidation(params) {
      return sendRequest(params.value);
    },
    validateVacationDatesRange({ value }) {
      const [startDate, endDate] = value;

      if (startDate === null || endDate === null) {
        return true;
      }

      const millisecondsPerDay = 24 * 60 * 60 * 1000;
      const daysDifference = Math.abs((endDate - startDate) / millisecondsPerDay);

      return daysDifference < 25;
    },
    validateVacationDatesPresence({ value }) {
      const [startDate, endDate] = value;

      if (startDate === null && endDate === null) {
        return true;
      }

      return startDate !== null && endDate !== null;
    },
    handleSubmit(e) {
      notify({
        message: 'You have submitted the form',
        position: {
          my: 'center top',
          at: 'center top',
        },
      }, 'success', 3000);
      e.preventDefault();
    },
  },
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

.last-group .dx-box-item-content {
  justify-content: center !important;
}

.buttons-group .dx-box-flex {
  align-items: flex-end !important;
}

.buttons-group .dx-box-flex .dx-field-button-item {
  padding: 5px;
}
</style>
