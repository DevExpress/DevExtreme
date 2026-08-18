<template>
  <div>
    <div class="widget-container">
      <div class="dx-fieldset">
        <div class="dx-fieldset-header">Resizable DataGrid</div>
        <div class="dx-field">
          <DxResizable
            :class="resizableClasses"
            id="gridContainer"
            :min-width="400"
            :min-height="150"
            :max-height="370"
            :keep-aspect-ratio="keepAspectRatio"
            :handles="handles.join(' ')"
            area=".widget-container .dx-field"
          >
            <DxDataGrid
              id="grid"
              :data-source="orders"
              key-expr="ID"
              :show-borders="true"
              height="100%"
            >
              <DxPaging :page-size="8"/>
              <DxScrolling mode="virtual"/>
              <DxColumn
                :allow-grouping="false"
                data-field="OrderNumber"
                :width="130"
                caption="Invoice Number"
              />
              <DxColumn
                data-field="CustomerStoreCity"
                caption="City"
              />
              <DxColumn
                data-field="CustomerStoreState"
                caption="State"
              />
              <DxColumn data-field="Employee"/>
              <DxColumn
                data-field="OrderDate"
                data-type="date"
              />
              <DxColumn
                data-field="SaleAmount"
                format="currency"
              />
            </DxDataGrid>
          </DxResizable>
        </div>
      </div>
    </div>
    <div class="options">
      <div class="caption">Resizable Options</div>
      <div class="option">
        <div>Handles</div>
        <DxTagBox
          :items="handleValues"
          :input-attr="{ 'aria-label': 'Handle' }"
          v-model:value="handles"
        />
      </div>
      <div class="option">
        <DxCheckBox
          text="Keep aspect ratio"
          v-model:value="keepAspectRatio"
        />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue';
import DxDataGrid, { DxPaging, DxScrolling, DxColumn } from 'devextreme-vue/data-grid';
import DxResizable from 'devextreme-vue/resizable';
import DxTagBox from 'devextreme-vue/tag-box';
import DxCheckBox from 'devextreme-vue/check-box';
import service from './data.ts';

const handleValues = ['left', 'top', 'right', 'bottom'];
const handles = ref(handleValues);
const keepAspectRatio = ref(true);
const orders = ref(service.getOrders());

const resizableClasses = computed(() => ({
  'dx-resizable': true,
  'no-left-handle': !handles.value.includes('left'),
  'no-right-handle': !handles.value.includes('right'),
  'no-top-handle': !handles.value.includes('top'),
  'no-bottom-handle': !handles.value.includes('bottom'),
}));
</script>
<style>
.widget-container {
  width: calc(100% - 360px);
  height: 100%;
  margin-right: 320px;
  position: absolute;
  z-index: 1501;
}

.dx-fieldset,
.dx-field {
  width: 100%;
  height: calc(100% - 60px);
}

.options {
  padding: 20px;
  background-color: var(--dx-color-options-panel-bg);
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 260px;
}

.caption {
  font-weight: 500;
  font-size: 18px;
}

.option {
  margin-top: 10px;
}

#gridContainer {
  padding: 10px;
  height: 300px;
}

#grid {
  border: 1px solid var(--dxds-color-border-neutral-default-static-dark-rest, #000);
}

.no-left-handle .dx-resizable-handle-top,
.no-left-handle .dx-resizable-handle-bottom {
  left: 10px;
  width: calc(100% - 10px);
}

.no-right-handle .dx-resizable-handle-top,
.no-right-handle .dx-resizable-handle-bottom {
  right: 10px;
  width: calc(100% - 10px);
}

.no-right-handle.no-left-handle .dx-resizable-handle-top,
.no-right-handle.no-left-handle .dx-resizable-handle-bottom {
  left: 10px;
  width: calc(100% - 20px);
}

.no-top-handle .dx-resizable-handle-right,
.no-top-handle .dx-resizable-handle-left {
  top: 10px;
  height: calc(100% - 10px);
}

.no-bottom-handle .dx-resizable-handle-right,
.no-bottom-handle .dx-resizable-handle-left {
  bottom: 10px;
  height: calc(100% - 10px);
}

.no-top-handle.no-bottom-handle .dx-resizable-handle-left,
.no-top-handle.no-bottom-handle .dx-resizable-handle-right {
  top: 10px;
  height: calc(100% - 20px);
}

.dx-resizable-handle-right {
  border-right: 1px dotted var(--dxds-color-border-neutral-default-rest, #999);
}

.dx-resizable-handle-top {
  border-top: 1px dotted var(--dxds-color-border-neutral-default-rest, #999);
}

.dx-resizable-handle-left {
  border-left: 1px dotted var(--dxds-color-border-neutral-default-rest, #999);
}

.dx-resizable-handle-bottom {
  border-bottom: 1px dotted var(--dxds-color-border-neutral-default-rest, #999);
}

.dx-resizable-handle::after {
  content: "";
  position: absolute;
  width: 9px;
  height: 9px;
  border: none;
  border-radius: 50%;
  background-color: var(--dxds-color-surface-neutral-default-static-light-rest, #fff);
  box-shadow: var(--dxds-box-shadow-sm, 0 2px 6px 0 rgba(0, 0, 0, 0.24));
}

.dx-resizable-handle-right::after {
  top: 50%;
  right: -5px;
  transform: translateY(-50%);
}

.dx-resizable-handle-left::after {
  top: 50%;
  left: -5px;
  transform: translateY(-50%);
}

.dx-resizable-handle-corner-top-left::after {
  top: -4px;
  left: -4px;
}

.dx-resizable-handle-corner-top-right::after {
  top: -4px;
  right: -4px;
}

.dx-resizable-handle-corner-bottom-left::after {
  bottom: -4px;
  left: -4px;
}

.dx-resizable-handle-corner-bottom-right::after {
  bottom: -4px;
  right: -4px;
}

.dx-resizable-handle-top::after {
  top: -5px;
  left: 50%;
  transform: translateX(-50%);
}

.dx-resizable-handle-bottom::after {
  bottom: -5px;
  left: 50%;
  transform: translateX(-50%);
}
</style>
