<template>
  <DxDataGrid
    :data-source="dataSource"
    :height="440"
    :show-borders="true"
    :filter-value="filterExpr"
  >
    <DxRowDragging
      :data="status"
      :on-add="onAdd"
      group="tasksGroup"
    />
    <DxScrolling mode="virtual"/>
    <DxColumn
      data-field="Subject"
      data-type="string"
    />
    <DxColumn
      :width="80"
      data-field="Priority"
      data-type="number"
    >
      <DxLookup
        :data-source="priorities"
        value-expr="id"
        display-expr="text"
      />
    </DxColumn>
    <DxColumn
      :visible="false"
      data-field="Status"
      data-type="number"
    />

  </DxDataGrid>
</template>

<script>
import { DxDataGrid, DxColumn, DxRowDragging, DxScrolling, DxLookup } from 'devextreme-vue/data-grid';

const priorities = [{
  id: 1, text: 'Low'
}, {
  id: 2, text: 'Normal'
}, {
  id: 3, text: 'High'
}, {
  id: 4, text: 'Urgent'
}];

export default {
  components: {
    DxDataGrid,
    DxColumn,
    DxRowDragging,
    DxScrolling,
    DxLookup
  },
  props: {
    tasksStore: {
      type: Object,
      default: ()=>({})
    },
    status: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      dataSource: {
        store: this.tasksStore,
        reshapeOnPush: true
      },
      priorities,
      filterExpr: ['Status', '=', this.status],
    };
  },
  methods: {
    onAdd(e) {
      var key = e.itemData.ID,
        values = { Status: e.toData };

      this.tasksStore.update(key, values).then(() => {
        // eslint-disable-next-line vue/no-mutating-props
        this.tasksStore.push([{
          type: 'update', key: key, data: values
        }]);
      });
    }
  }
};
</script>
