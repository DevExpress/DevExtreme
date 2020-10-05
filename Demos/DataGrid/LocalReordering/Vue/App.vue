<template>
  <div>
    <DxDataGrid
      :data-source="tasks"
      :show-borders="true"
      :height="440"
    >
      <DxRowDragging
        :allow-reordering="true"
        :on-reorder="onReorder"
        :show-drag-icons="showDragIcons"
      />
      <DxSorting mode="none"/>
      <DxScrolling mode="virtual"/>
      <DxColumn
        :width="55"
        data-field="ID"
      />
      <DxColumn
        :width="150"
        data-field="Owner"
      >
        <DxLookup
          :data-source="employees"
          value-expr="ID"
          display-expr="FullName"
        />
      </DxColumn>
      <DxColumn
        :width="150"
        data-field="AssignedEmployee"
        caption="Assignee"
      >
        <DxLookup
          :data-source="employees"
          value-expr="ID"
          display-expr="FullName"
        />
      </DxColumn>
      <DxColumn data-field="Subject"/>
    </DxDataGrid>

    <div class="options">
      <div class="caption">Options</div>
      <div class="option">
        <DxCheckBox
          v-model:value="showDragIcons"
          text="Show Drag Icons"
        />
      </div>
    </div>
  </div>
</template>
<script>
import { DxDataGrid, DxColumn, DxLookup, DxScrolling, DxRowDragging, DxSorting } from 'devextreme-vue/data-grid';
import DxCheckBox from 'devextreme-vue/check-box';
import { tasks, employees, statuses } from './data.js';

export default {
  components: {
    DxDataGrid,
    DxColumn,
    DxLookup,
    DxScrolling,
    DxRowDragging,
    DxSorting,
    DxCheckBox
  },
  data() {
    return {
      tasks,
      employees,
      statuses,
      showDragIcons: true
    };
  },
  methods: {
    onReorder(e) {
      var visibleRows = e.component.getVisibleRows(),
        toIndex = this.tasks.indexOf(visibleRows[e.toIndex].data),
        fromIndex = this.tasks.indexOf(e.itemData);

      this.tasks.splice(fromIndex, 1);
      this.tasks.splice(toIndex, 0, e.itemData);
    }
  },
};
</script>
<style>
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
</style>
