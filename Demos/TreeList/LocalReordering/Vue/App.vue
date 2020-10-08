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
</template>
<script>
import { DxTreeList, DxColumn, DxRowDragging } from 'devextreme-vue/tree-list';
import DxCheckBox from 'devextreme-vue/check-box';
import { employees } from './data.js';

export default {
  components: {
    DxTreeList,
    DxColumn,
    DxRowDragging,
    DxCheckBox
  },
  data() {
    return {
      employees,
      allowDropInsideItem: true,
      allowReordering: true,
      showDragIcons: true,
      expandedRowKeys: [1]
    };
  },
  methods: {
    onDragChange(e) {
      let visibleRows = e.component.getVisibleRows(),
        sourceNode = e.component.getNodeByKey(e.itemData.ID),
        targetNode = visibleRows[e.toIndex].node;

      while (targetNode && targetNode.data) {
        if (targetNode.data.ID === sourceNode.data.ID) {
          e.cancel = true;
          break;
        }
        targetNode = targetNode.parent;
      }
    },
    onReorder(e) {
      let visibleRows = e.component.getVisibleRows(),
        sourceData = e.itemData,
        targetData = visibleRows[e.toIndex].data;

      if (e.dropInsideItem) {
        e.itemData.Head_ID = targetData.ID;
        e.component.refresh();
      } else {
        let sourceIndex = employees.indexOf(sourceData),
          targetIndex = employees.indexOf(targetData);

        if (sourceData.Head_ID !== targetData.Head_ID) {
          sourceData.Head_ID = targetData.Head_ID;
          if (e.toIndex > e.fromIndex) {
            targetIndex++;
          }
        }

        employees.splice(sourceIndex, 1);
        employees.splice(targetIndex, 0, sourceData);
      }
    }
  },
};
</script>

<style>
#employees {
    max-height: 440px;
}

.dx-sortable-dragging {
    opacity: 0.9
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
   margin-right: 44px;
   display: inline-block;
}

.option:last-child {
    margin-right: 0;
}
</style>
