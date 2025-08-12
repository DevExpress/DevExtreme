<template>
  <div>
    <DxForm 
      :validation-group="groupName"
      :form-data="formData">
      <DxSimpleItem>
        <DxSelectBox
          :value="formData.type"
          @value-changed="valueChanged"
          :items="items"
          :show-clear-button="true"
          value-expr="id"
          display-expr="description">
          <DxValidator :validation-group="groupName">
            <DxRequiredRule message="Type is required" />
          </DxValidator>
        </DxSelectBox>
      </DxSimpleItem>
    </DxForm>
    <DxValidationSummary :validation-group="groupName" />
    <DxButton 
      :validation-group="groupName"
      text="Validate"
      @click="onClick">
    </DxButton>
  </div>
</template>

<script>
import { reactive } from 'vue';
import { DxSelectBox } from 'devextreme-vue/select-box';
import { DxForm, DxSimpleItem } from 'devextreme-vue/form';
import DxButton from 'devextreme-vue/button';
import { DxValidator, DxRequiredRule } from 'devextreme-vue/validator';
import DxValidationSummary from 'devextreme-vue/validation-summary';

const groupName = "sharedGroup";

const items = [
  {
    id: 1,
    description: "One",
  },
];

export default {
  name: 'SelectBoxNestedValidator',
  components: {
    DxSelectBox,
    DxForm,
    DxSimpleItem,
    DxButton,
    DxValidator,
    DxRequiredRule,
    DxValidationSummary
  },
  setup() {
    const formData = reactive({ code: null, type: null });

    const valueChanged = (e) => {
      formData.type = e.value;
    };

    const onClick = (e) => {
      return e.validationGroup?.validate();
    };

    return {
      groupName,
      formData,
      items,
      valueChanged,
      onClick
    };
  }
};
</script>
