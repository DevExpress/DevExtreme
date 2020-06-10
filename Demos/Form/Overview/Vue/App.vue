<template>
  <div id="form-demo">
    <div class="widget-container">
      <div>Select company:</div>
      <DxSelectBox
        :data-source="companies"
        v-model="company"
        display-expr="Name"
      />
      <DxForm
        id="form"
        :form-data="company"
        :read-only="readOnly"
        :show-colon-after-label="showColon"
        :label-location="labelLocation"
        :min-col-width="minColWidth"
        :col-count="colCount"
        :width="width"
      />
    </div>
    <div class="options">
      <div class="caption">Options</div>
      <div class="option">
        <span>Label location:</span>
        <DxSelectBox
          :items="['left', 'top']"
          v-model="labelLocation"
        />
      </div>
      <div class="option">
        <span>Columns count:</span>
        <DxSelectBox
          :items="['auto', 1, 2, 3]"
          v-model="colCount"
        />
      </div>
      <div class="option">
        <span>Min column width:</span>
        <DxSelectBox
          :items="[150, 200, 300]"
          v-model="minColWidth"
        />
      </div>
      <div class="option">
        <span>Form width:</span>
        <DxNumberBox
          :max="550"
          v-model="width"
        />
      </div>
      <div class="option">
        <DxCheckBox
          v-model="readOnly"
          text="readOnly"
        />
      </div>
      <div class="option">
        <DxCheckBox
          v-model="showColon"
          text="showColonAfterLabel"
        />
      </div>
    </div>
  </div>
</template>
<script>
import { DxCheckBox, DxSelectBox, DxNumberBox, DxForm } from 'devextreme-vue';
import service from './data.js';

export default {
  components: {
    DxCheckBox,
    DxSelectBox,
    DxNumberBox,
    DxForm
  },
  data() {
    const companies = service.getCompanies();
    return {
      labelLocation: 'top',
      readOnly: false,
      showColon: true,
      minColWidth: 300,
      colCount: 2,
      companies: companies,
      company: companies[0],
      width: null
    };
  }
};
</script>
<style scoped>
.widget-container {
    margin-right: 320px;
    padding: 20px;
    max-width: 550px;
    min-width: 300px;
}
#form {
    margin-top: 25px;
}
.options {
    padding: 20px;
    position: absolute;
    bottom: 0;
    right: 0;
    width: 260px;
    top: 0;
    background-color: rgba(191, 191, 191, 0.15);
}
.caption {
    font-size: 18px;
    font-weight: 500;
}
.option {
    margin-top: 10px;
}
</style>
