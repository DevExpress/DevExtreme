<template>
  <div>
    <DxDataGrid
      :data-source="employees"
      key-expr="ID"
      :show-column-lines="showColumnLines"
      :show-row-lines="showRowLines"
      :show-borders="showBorders"
      :row-alternation-enabled="rowAlternationEnabled"
    >
      <DxColumn
        :width="80"
        data-field="Prefix"
        caption="Title"
      />
      <DxColumn data-field="FirstName"/>
      <DxColumn data-field="LastName"/>
      <DxColumn data-field="City"/>
      <DxColumn data-field="State"/>
      <DxColumn
        :width="130"
        data-field="Position"
      />
      <DxColumn
        :width="100"
        data-field="BirthDate"
        data-type="date"
      />
      <DxColumn
        :width="100"
        data-field="HireDate"
        data-type="date"
      />
    </DxDataGrid>

    <div class="options">
      <div class="caption">Options</div>
      <div class="options-container">
        <div class="option">
          <DxCheckBox
            v-model:value="showColumnLines"
            text="Show Column Lines"
          />
        </div>
        &nbsp;
        <div class="option">
          <DxCheckBox
            v-model:value="showRowLines"
            text="Show Row Lines"
          />
        </div>
        &nbsp;
        <div class="option">
          <DxCheckBox
            v-model:value="showBorders"
            text="Show Borders"
          />
        </div>
        &nbsp;
        <div class="option">
          <DxCheckBox
            v-model:value="rowAlternationEnabled"
            text="Alternating Row Color"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { DxDataGrid, DxColumn } from 'devextreme-vue/data-grid';
import { DxCheckBox } from 'devextreme-vue/check-box';
import { employees } from './data.js';

const showColumnLines = ref(false);
const showRowLines = ref(true);
const showBorders = ref(true);
const rowAlternationEnabled = ref(true);
</script>
<style scoped>
.options {
  padding: 20px;
  background-color: rgba(191, 191, 191, 0.15);
  margin-top: 20px;
}

.caption {
  font-size: 18px;
  font-weight: 500;
}

.option {
  width: 24%;
  display: inline-block;
  margin-top: 10px;
}

.options-container {
  display: flex;
  align-items: center;
}
</style>
