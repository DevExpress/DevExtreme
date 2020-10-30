<template>
  <form
    action="your-action"
    @submit="onFormSubmit($event)"
  >
    <div class="dx-fieldset">
      <div class="dx-fieldset-header">Credentials</div>
      <div class="dx-field">
        <div class="dx-field-label">Email</div>
        <div class="dx-field-value">
          <DxTextBox>
            <DxValidator>
              <DxRequiredRule message="Email is required"/>
              <DxEmailRule message="Email is invalid"/>
              <DxAsyncRule
                :validation-callback="asyncValidation"
                message="Email is already registered"
              />
            </DxValidator>
          </DxTextBox>
        </div>
      </div>
      <div class="dx-field">
        <div class="dx-field-label">Password</div>
        <div class="dx-field-value">
          <DxTextBox
            v-model:value="password"
            mode="password"
          >
            <DxValidator>
              <DxRequiredRule message="Password is required"/>
            </DxValidator>
          </DxTextBox>
        </div>
      </div>
      <div class="dx-field">
        <div class="dx-field-label">Confirm Password</div>
        <div class="dx-field-value">
          <DxTextBox mode="password">
            <DxValidator>
              <DxRequiredRule message="Confirm Password is required"/>
              <DxCompareRule
                :comparison-target="passwordComparison"
                message="Password and Confirm Password do not match"
              />
            </DxValidator>
          </DxTextBox>
        </div>
      </div>
    </div>
    <div class="dx-fieldset">
      <div class="dx-fieldset-header">Personal Data</div>
      <div class="dx-field">
        <div class="dx-field-label">Name</div>
        <div class="dx-field-value">
          <DxTextBox value="Peter">
            <DxValidator>
              <DxRequiredRule message="Name is required"/>
              <DxPatternRule
                :pattern="namePattern"
                message="Do not use digits in the Name"
              />
              <DxStringLengthRule
                :min="2"
                message="Name must have at least 2 symbols"
              />
            </DxValidator>
          </DxTextBox>
        </div>
      </div>
      <div class="dx-field">
        <div class="dx-field-label">Date of birth</div>
        <div class="dx-field-value">
          <DxDateBox
            invalid-date-message="The date must have the following format: MM/dd/yyyy"
          >
            <DxValidator>
              <DxRequiredRule message="Date of birth is required"/>
              <DxRangeRule
                :max="maxDate"
                message="You must be at least 21 years old"
              />
            </DxValidator>
          </DxDateBox>
        </div>
      </div>
    </div>
    <div class="dx-fieldset">
      <div class="dx-fieldset-header">Billing address</div>
      <div class="dx-field">
        <div class="dx-field-label">Country</div>
        <div class="dx-field-value">
          <DxSelectBox :data-source="countries">
            <DxValidator>
              <DxRequiredRule message="Country is required"/>
            </DxValidator>
          </DxSelectBox>
        </div>
      </div>
      <div class="dx-field">
        <div class="dx-field-label">City</div>
        <div class="dx-field-value">
          <DxTextBox>
            <DxValidator>
              <DxRequiredRule message="City is required"/>
              <DxPatternRule
                :pattern="namePattern"
                message="Do not use digits in the City name"
              />
              <DxStringLengthRule
                :min="2"
                message="City must have at least 2 symbols"
              />
            </DxValidator>
          </DxTextBox>
        </div>
      </div>
      <div class="dx-field">
        <div class="dx-field-label">Address</div>
        <div class="dx-field-value">
          <DxTextBox>
            <DxValidator>
              <DxRequiredRule message="Address is required"/>
            </DxValidator>
          </DxTextBox>
        </div>
      </div>
      <div class="dx-field">
        <div class="dx-field-label">Phone <i>(optional)</i></div>
        <div class="dx-field-value">
          <DxTextBox
            :mask-rules="phoneRules"
            :use-masked-value="true"
            mask="+1 (X00) 000-0000"
            mask-invalid-message="The phone must have a correct USA phone format"
          >
            <DxValidator>
              <DxPatternRule
                :pattern="phonePattern"
                message="The phone must have a correct USA phone format"
              />
            </DxValidator>
          </DxTextBox>
        </div>
      </div>
      <div>
        <DxCheckBox
          id="check"
          :value="false"
          text="I agree to the Terms and Conditions"
        >
          <DxValidator>
            <DxCompareRule
              :comparison-target="checkComparison"
              message="You must agree to the Terms and Conditions"
            />
          </DxValidator>
        </DxCheckBox>
      </div>
    </div>

    <div class="dx-fieldset">
      <DxValidationSummary id="summary"/>
      <DxButton
        id="button"
        :use-submit-behavior="true"
        text="Register"
        type="success"
      />
    </div>
  </form>
</template>
<script>
import DxSelectBox from 'devextreme-vue/select-box';
import DxCheckBox from 'devextreme-vue/check-box';
import DxTextBox from 'devextreme-vue/text-box';
import DxDateBox from 'devextreme-vue/date-box';
import DxButton from 'devextreme-vue/button';
import DxValidationSummary from 'devextreme-vue/validation-summary';
import {
  DxValidator,
  DxRequiredRule,
  DxCompareRule,
  DxEmailRule,
  DxPatternRule,
  DxStringLengthRule,
  DxRangeRule,
  DxAsyncRule
} from 'devextreme-vue/validator';

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
    DxSelectBox,
    DxCheckBox,
    DxTextBox,
    DxDateBox,
    DxButton,
    DxValidator,
    DxRequiredRule,
    DxCompareRule,
    DxEmailRule,
    DxPatternRule,
    DxStringLengthRule,
    DxRangeRule,
    DxAsyncRule,
    DxValidationSummary
  },
  data() {
    const currentDate = new Date();
    return {
      countries: service.getCountries(),
      phoneRules: {
        X: /[02-9]/
      },
      password: '',
      namePattern: /^[^0-9]+$/,
      phonePattern: /^\+\s*1\s*\(\s*[02-9]\d{2}\)\s*\d{3}\s*-\s*\d{4}$/,
      maxDate: new Date(currentDate.setFullYear(currentDate.getFullYear() - 21)),
    };
  },
  methods: {
    passwordComparison() {
      return this.password;
    },
    checkComparison() {
      return true;
    },
    asyncValidation(params) {
      return sendRequest(params.value);
    },
    onFormSubmit(e) {
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
#summary {
    padding-left: 10px;
    margin-top: 20px;
    margin-bottom: 10px;
}

#button {
    display: block;
}
</style>
