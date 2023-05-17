<template>
  <div>
    <div class="dx-fieldset">
      <div class="dx-field">
        <div class="dx-field-label">Integer format</div>
        <div class="dx-field-value">
          <DxNumberBox
            :value="14500"
            format="#"
            :input-attr="{ 'aria-label': 'Integer Format' }"
          />
        </div>
      </div>
      <div class="dx-field">
        <div class="dx-field-label">Currency format</div>
        <div class="dx-field-value">
          <DxNumberBox
            :value="14500.55"
            format="$ #,##0.##"
            :input-attr="{ 'aria-label': 'Currency Format' }"
          />
        </div>
      </div>
      <div class="dx-field">
        <div class="dx-field-label">Accounting format</div>
        <div class="dx-field-value">
          <DxNumberBox
            :value="-2314.12"
            format="$ #,##0.##;($ #,##0.##)"
            :input-attr="{ 'aria-label': 'Accounting Format' }"
          />
        </div>
      </div>
      <div class="dx-field">
        <div class="dx-field-label">Percent format</div>
        <div class="dx-field-value">
          <DxNumberBox
            :value="0.15"
            :step="0.01"
            format="#0%"
            :input-attr="{ 'aria-label': 'Percent Format' }"
          />
        </div>
      </div>
      <div class="dx-field">
        <div class="dx-field-label">Fixed point format</div>
        <div class="dx-field-value">
          <DxNumberBox
            :value="13415.24"
            format="#,##0.00"
            :input-attr="{ 'aria-label': 'Fixed Point Format' }"
          />
        </div>
      </div>
      <div class="dx-field">
        <div class="dx-field-label">Weight format</div>
        <div class="dx-field-value">
          <DxNumberBox
            :value="3.14"
            format="#0.## kg"
            :input-attr="{ 'aria-label': 'Weight Format' }"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import DxNumberBox from 'devextreme-vue/number-box';

export default {
  components: {
    DxNumberBox,
  },
};
</script>
<style scoped>
  .dx-field {
    margin-bottom: 20px;
  }
</style>
