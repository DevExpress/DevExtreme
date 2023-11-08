<template>
  <div id="content-wrapper">
    <div class="options">
      <div class="caption">Options</div>
      <div className="editors-modes">
        <div class="option">
          <DxSelectBox
            :input-attr="{ 'aria-label': 'Styling Mode' }"
            :items="[ 'outlined', 'filled', 'underlined' ]"
            styling-mode="outlined"
            label="Styling Mode"
            label-mode="outside"
            v-model:value="stylingMode"
          />
        </div>
        <div class="option">
          <DxSelectBox
            :input-attr="{ 'aria-label': 'Label Mode' }"
            :items="[ 'static', 'floating', 'hidden', 'outside' ]"
            styling-mode="outlined"
            label="Label Mode"
            label-mode="outside"
            v-model:value="labelMode"
          />
        </div>
      </div>
    </div>
    <div className="widgets-container">
      <div class="title">Edit Profile</div>
      <DxTextBox
        :styling-mode="stylingMode"
        :label-mode="labelMode"
        :input-attr="{ 'aria-label': 'Name' }"
        value="Olivia Peyton"
        id="name"
        placeholder="Type..."
        label="Name"
      >
        <DxValidator>
          <DxRequiredRule/>
        </DxValidator>
      </DxTextBox>
      <DxTextBox
        :styling-mode="stylingMode"
        :label-mode="labelMode"
        :input-attr="{ 'aria-label': 'Address' }"
        placeholder="Type..."
        label="Address"
        id="address"
      >
        <DxValidator>
          <DxRequiredRule/>
        </DxValidator>
      </DxTextBox>
      <DxDateBox
        :styling-mode="stylingMode"
        :label-mode="labelMode"
        :input-attr="{ 'aria-label': 'Hire Date' }"
        id="hire-date"
        placeholder="Select..."
        label="Hire Date"
      >
        <DxValidator>
          <DxRequiredRule/>
        </DxValidator>
      </DxDateBox>
      <DxDateBox
        :styling-mode="stylingMode"
        :label-mode="labelMode"
        :input-attr="{ 'aria-label': 'Birth Date' }"
        :value="birthDate"
        id="birth-date"
        placeholder="Select..."
        label="Birth Date"
      >
        <DxValidator>
          <DxRequiredRule/>
        </DxValidator>
      </DxDateBox>
      <DxSelectBox
        :items="states"
        :input-attr="{ 'aria-label': 'State' }"
        :styling-mode="stylingMode"
        :label-mode="labelMode"
        id="state"
        placeholder="Select..."
        label="State"
        validation-message-position="left"
      >
        <DxValidator>
          <DxRequiredRule/>
        </DxValidator>
      </DxSelectBox>
      <DxTextBox
        :styling-mode="stylingMode"
        :label-mode="labelMode"
        :mask-rules="phoneRules"
        :input-attr="{ 'aria-label': 'Phone' }"
        id="phone"
        mask="+1 (000) 000-0000"
        label="Phone"
      >
        <DxValidator>
          <DxRequiredRule/>
        </DxValidator>
      </DxTextBox>
      <DxDateRangeBox
        :styling-mode="stylingMode"
        :label-mode="labelMode"
        id="vacation-dates"
        start-date="6/3/2023"
        start-date-label="Start Vacation Date"
        end-date="12/3/2023"
        end-date-label="End Vacation Date"
      />
      <DxTextArea
        :styling-mode="stylingMode"
        :label-mode="labelMode"
        :value="text"
        :input-attr="{ 'aria-label': 'Notes' }"
        id="notes"
        placeholder="Type..."
        label="Notes"
      />
    </div>
    <DxButton
      @click="validateClick"
      text="Save"
      icon="save"
      type="default"
      id="validate"
      class="validate"
    />
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import DxSelectBox from 'devextreme-vue/select-box';
import DxTextBox from 'devextreme-vue/text-box';
import DxTextArea from 'devextreme-vue/text-area';
import DxDateBox from 'devextreme-vue/date-box';
import DxButton from 'devextreme-vue/button';
import DxDateRangeBox from 'devextreme-vue/date-range-box';
import {
  DxValidator,
  DxRequiredRule,
} from 'devextreme-vue/validator';
import notify from 'devextreme/ui/notify';
import { states } from './data.js';

const birthDate = ref(new Date(1981, 5, 3));
const stylingMode = ref('outlined');
const labelMode = ref('static');
const text = ref('Olivia loves to sell. She has been selling DevAV products since 2012.');
const phoneRules = {
  X: /[02-9]/,
};

function validateClick({ validationGroup }) {
  const result = validationGroup.validate();
  if (result.isValid) {
    notify('The task was saved successfully.', 'success');
  } else {
    notify('The task was not saved. Please check if all fields are valid.', 'error');
  }
}
</script>
<style>
#content-wrapper {
  height: 680px;
}

.widgets-container {
  display: grid;
  grid-template-areas:
    'title title title title'
    'name name birthDate birthDate '
    'address address state phone'
    'hireDate hireDate range range'
    'notes notes notes notes';
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 20px;
  padding-left: 20px;
  padding-right: 20px;
}

.title {
  grid-area: title;
  font-size: 18px;
  font-weight: 500;
}

#name {
  grid-area: name;
}

#address {
  grid-area: address;
}

#birth-date {
  grid-area: birthDate;
}

#state {
  grid-area: state;
}

#phone {
  grid-area: phone;
}

#hire-date {
  grid-area: hireDate;
}

#notes {
  grid-area: notes;
}

#vacation-dates {
  grid-area: range;
}

#validate {
  float: right;
  margin-top: 20px;
  margin-right: 20px;
  width: 100px;
}

.options {
  grid-area: options;
  padding: 20px;
  margin-bottom: 40px;
  background-color: rgba(191, 191, 191, 0.15);
}

.caption {
  font-size: 18px;
  font-weight: 500;
}

.editors-modes {
  display: flex;
}

.option {
  padding-right: 20px;
  margin-top: 20px;
}

</style>
