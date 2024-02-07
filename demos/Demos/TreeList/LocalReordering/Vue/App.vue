<template>
  <div>
    <DxTreeList
      id="employees"
      :data-source="employees"
      :root-value="-1"
      :show-row-lines="true"
      :show-borders="true"
      :expanded-row-keys="expandedRowKeys"
      :column-auto-width="true"
      key-expr="ID"
      parent-id-expr="Head_ID"
    >
      <DxRowDragging
        :on-drag-change="onDragChange"
        :on-reorder="onReorder"
        :allow-drop-inside-item="allowDropInsideItem"
        :allow-reordering="allowReordering"
        :show-drag-icons="showDragIcons"
      />
      <DxColumn
        data-field="Title"
        caption="Position"
      />
      <DxColumn data-field="Full_Name"/>
      <DxColumn data-field="City"/>
      <DxColumn data-field="State"/>
      <DxColumn data-field="Mobile_Phone"/>
      <DxColumn
        data-field="Hire_Date"
        data-type="date"
      />
    </DxTreeList>

    <div class="options">
      <div class="caption">Options</div>
      <div class="options-container">
        <div class="option">
          <DxCheckBox
            v-model:value="allowDropInsideItem"
            text="Allow Drop Inside Item"
          />
        </div>
        <div class="option">
          <DxCheckBox
            v-model:value="allowReordering"
            text="Allow Reordering"
          />
        </div>
        <div class="option">
          <DxCheckBox
            v-model:value="showDragIcons"
            text="Show Drag Icons"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { DxTreeList, DxColumn, DxRowDragging } from 'devextreme-vue/tree-list';
import DxCheckBox from 'devextreme-vue/check-box';
import { employees as employeesData } from './data.ts';

const allowDropInsideItem = ref(true);
const allowReordering = ref(true);
const showDragIcons = ref(true);
const expandedRowKeys = [1];

const employees = ref(employeesData);

function onDragChange(e) {
  const visibleRows = e.component.getVisibleRows();
  const sourceNode = e.component.getNodeByKey(e.itemData.ID);
  let targetNode = visibleRows[e.toIndex].node;

  while (targetNode && targetNode.data) {
    if (targetNode.data.ID === sourceNode.data.ID) {
      e.cancel = true;
      break;
    }
    targetNode = targetNode.parent;
  }
}
function onReorder(e) {
  const visibleRows = e.component.getVisibleRows();

  if (e.dropInsideItem) {
    e.itemData.Head_ID = visibleRows[e.toIndex].key;

    e.component.refresh();
  } else {
    const employeeList = employees.value.slice();
    const sourceData = e.itemData;
    const toIndex = e.fromIndex > e.toIndex ? e.toIndex - 1 : e.toIndex;
    let targetData = toIndex >= 0 ? visibleRows[toIndex].node.data : null;

    if (targetData && e.component.isRowExpanded(targetData.ID)) {
      sourceData.Head_ID = targetData.ID;
      targetData = null;
    } else {
      sourceData.Head_ID = targetData ? targetData.Head_ID : -1;
    }

    const sourceIndex = employees.value.indexOf(sourceData);
    employeeList.splice(sourceIndex, 1);

    const targetIndex = employees.value.indexOf(targetData) + 1;
    employeeList.splice(targetIndex, 0, sourceData);
    employees.value = employeeList;
  }
}
</script>

<style>
#employees {
  max-height: 440px;
}

.dx-sortable-dragging {
  opacity: 0.9;
}

.options {
  margin-top: 20px;
  padding: 20px;
  background-color: rgba(191, 191, 191, 0.15);
  position: relative;
}

.caption {
  font-size: 18px;
  font-weight: 500;
}

.option {
  margin-top: 10px;
  margin-right: 40px;
  display: inline-block;
}

.option:last-child {
  margin-right: 0;
}

.options-container {
  display: flex;
  align-items: center;
}
</style>
