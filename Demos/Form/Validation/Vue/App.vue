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
          :show-colon-after-label="true"
          :show-validation-summary="true"
          validation-group="customerData"
        >
          <DxGroupItem caption="Credentials">
            <DxSimpleItem data-field="Email">
              <DxRequiredRule message="Email is required"/>
              <DxEmailRule message="Email is invalid"/>
              <DxAsyncRule
                :validation-callback="asyncValidation"
                message="Email is already registered"
              />
            </DxSimpleItem>
            <DxSimpleItem
              :editor-options="passwordOptions"
              data-field="Password"
            >
              <DxRequiredRule message="Password is required"/>
            </DxSimpleItem>
            <DxSimpleItem
              :editor-options="passwordOptions"
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
            <DxSimpleItem data-field="Name">
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
            <DxSimpleItem data-field="Address">
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
          </DxGroupItem>
          <DxButtonItem
            :button-options="buttonOptions"
            horizontal-alignment="left"
          />
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
  DxAsyncRule
} from 'devextreme-vue/form';
import DxAutocomplete from 'devextreme-vue/autocomplete';

import notify from 'devextreme/ui/notify';

import service from './data.js';

const sendRequest = function(value) {
  const validEmail = 'test@dx-email.com';
  return new Promise((resolve) => {
    setTimeout(function() {
      resolve(value === validEmail);
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
    notify
  },
  data() {
    return {
      customer: service.getCustomer(),
      buttonOptions: {
        text: 'Register',
        type: 'success',
        useSubmitBehavior: true
      },
      passwordOptions: {
        mode: 'password'
      },
      dateBoxOptions: {
        invalidDateMessage:
          'The date must have the following format: MM/dd/yyyy'
      },
      checkBoxOptions: {
        text: 'I agree to the Terms and Conditions',
        value: false
      },
      phoneEditorOptions: {
        mask: '+1 (X00) 000-0000',
        maskRules: {
          X: /[02-9]/
        },
        useMaskedValue: true,
        maskInvalidMessage: 'The phone must have a correct USA phone format'
      },
      cityEditorOptions:{
        dataSource: service.getCities(),
        minSearchLength: 2
      },
      countryEditorOptions: {
        dataSource: service.getCountries()
      },
      maxDate: new Date().setFullYear(new Date().getFullYear() - 21),
      namePattern: /^[^0-9]+$/,
      cityPattern: /^[^0-9]+$/,
      phonePattern:  /^\+\s*1\s*\(\s*[02-9]\d{2}\)\s*\d{3}\s*-\s*\d{4}$/
    };
  },
  methods: {
    passwordComparison() {
      return this.customer.Password;
    },
    checkComparison() {
      return true;
    },
    asyncValidation(params) {
      return sendRequest(params.value);
    },
    handleSubmit(e) {
      notify({
        message: 'You have submitted the form',
        position: {
          my: 'center top',
          at: 'center top'
        }
      }, 'success', 3000);
      e.preventDefault();
    }
  }
};
</script>
<style scoped>
form {
  margin: 10px;
}
</style>
