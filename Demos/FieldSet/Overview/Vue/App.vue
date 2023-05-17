<template>
  <div class="form">
    <div class="dx-fieldset">
      <div class="dx-fieldset-header">Simple Field Set</div>
      <div class="dx-field">
        <div class="dx-field-label">Full Name</div>
        <div class="dx-field-value-static">Kevin Carter</div>
      </div>
      <div class="dx-field">
        <div class="dx-field-label">Position</div>
        <div class="dx-field-value-static">Shipping Manager</div>
      </div>
    </div>
    <div class="dx-fieldset">
      <div class="dx-fieldset-header">Field Set with DevExtreme Widgets</div>
      <div class="dx-field">
        <div class="dx-field-label">Address</div>
        <DxTextBox
          class="dx-field-value"
          :input-attr="{ 'aria-label': 'Address' }"
          value="424 N Main St."
        />
      </div>
      <div class="dx-field">
        <div class="dx-field-label">City</div>
        <DxTextBox
          class="dx-field-value"
          :input-attr="{ 'aria-label': 'City' }"
          value="San Diego"
        />
      </div>
    </div>
    <div
      class="dx-fieldset"
      id="notes-container"
    >
      <div class="dx-fieldset-header">Field Set with Custom Value Width</div>
      <div class="dx-field">
        <div class="dx-field-label">Notes</div>
        <DxTextArea
          class="dx-field-value"
          :height="80"
          :value="text"
          :input-attr="{ 'aria-label': 'Notes' }"
        />
      </div>
    </div>
  </div>
</template>
<script>
import DxTextBox from 'devextreme-vue/text-box';
import DxTextArea from 'devextreme-vue/text-area';

export default {
  components: {
    DxTextBox, DxTextArea,
  },
  data() {
    return {
      text: 'Kevin is our hard-working shipping manager and has been helping that department work like clockwork for 18 months. When not in the office, he is usually on the basketball court playing pick-up games.',
    };
  },
};
</script>
<style scoped>
.dx-fieldset:first-child > h4:first-child {
  margin-top: 0;
}

#notes-container > .dx-field > .dx-field-label {
  width: 20%;
}

#notes-container > .dx-field > .dx-field-value {
  width: 80%;
}
</style>
