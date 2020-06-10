<template>
  <DxDataGrid
    :data-source="dataSource"
    :height="600"
    :show-borders="true"
    :repaint-changes-only="true"
    :highlight-changes="true"
  >
    <DxPaging
      :enabled="false"
    />

    <DxEditing
      :allow-deleting="true"
      :allow-updating="true"
      :allow-adding="true"
      :use-icons="true"
      mode="cell"
      refresh-mode="reshape"
    />

    <DxColumn
      :width="50"
      data-field="Prefix"
      caption="Title"
    >
      <DxRequiredRule/>
    </DxColumn>

    <DxColumn
      data-field="FirstName"
    >
      <DxRequiredRule/>
    </DxColumn>

    <DxColumn
      :lookup="lookup"
      data-field="StateID"
      caption="State"
    >
      <DxRequiredRule/>
    </DxColumn>

    <DxColumn
      data-field="BirthDate"
      data-type="date"
    >
      <DxRangeRule
        :max="maxDate"
        message="Date can not be greater than 01/01/3000"
      />
    </DxColumn>
  </DxDataGrid>
</template>

<script>
import { DxDataGrid, DxColumn, DxPaging, DxEditing, DxRequiredRule, DxRangeRule } from 'devextreme-vue/data-grid';
import * as AspNetData from 'devextreme-aspnet-data-nojquery';

const statesStore = AspNetData.createStore({
  key: 'ID',
  loadUrl: 'https://js.devexpress.com/Demos/NetCore/api/DataGridStatesLookup'
});

export default {
  components: {
    DxDataGrid,
    DxColumn,
    DxPaging,
    DxEditing,
    DxRequiredRule,
    DxRangeRule
  },
  props: {
    dataSource: {
      type: Object,
      default: ()=>({})
    }
  },
  data() {
    return {
      maxDate: new Date(3000, 0),
      lookup: {
        dataSource: statesStore,
        displayExpr: 'Name',
        valueExpr: 'ID'
      }
    };
  }
};
</script>
