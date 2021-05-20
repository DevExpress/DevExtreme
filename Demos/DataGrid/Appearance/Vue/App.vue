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
      <div class="option">
        <DxCheckBox
          v-model:value="showColumnLines"
          text="Show Column Lines"
        />
      </div>
      <div class="option">
        <DxCheckBox
          v-model:value="showRowLines"
          text="Show Row Lines"
        />
      </div>
      <div class="option">
        <DxCheckBox
          v-model:value="showBorders"
          text="Show Borders"
        />
      </div>
      <div class="option">
        <DxCheckBox
          v-model:value="rowAlternationEnabled"
          text="Alternating Row Color"
        />
      </div>
    </div>
  </div>
</template>
<script>
import { DxDataGrid, DxColumn } from 'devextreme-vue/data-grid';
import { DxCheckBox } from 'devextreme-vue/check-box';
import service from './data.js';

export default {
  components: {
    DxDataGrid,
    DxColumn,
    DxCheckBox
  },
  data() {
    return {
      employees: service.getEmployees(),
      showColumnLines: false,
      showRowLines: true,
      showBorders: true,
      rowAlternationEnabled: true
    };
  }
};
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
  margin-right: 4px;
}
</style>
