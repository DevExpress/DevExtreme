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
<script>
import DxDataGrid, { DxPaging, DxScrolling, DxColumn } from 'devextreme-vue/data-grid';
import DxResizable from 'devextreme-vue/resizable';
import DxTagBox from 'devextreme-vue/tag-box';
import DxCheckBox from 'devextreme-vue/check-box';

import service from './data.js';

const handleValues = ['left', 'top', 'right', 'bottom'];

export default {
  components: {
    DxDataGrid,
    DxResizable,
    DxTagBox,
    DxCheckBox,
    DxPaging,
    DxScrolling,
    DxColumn,
  },
  data() {
    return {
      handleValues,
      handles: handleValues,
      keepAspectRatio: true,
      orders: service.getOrders(),
    };
  },
  computed: {
    resizableClasses() {
      return {
        'dx-resizable': true,
        'no-left-handle': !this.handles.includes('left'),
        'no-right-handle': !this.handles.includes('right'),
        'no-top-handle': !this.handles.includes('top'),
        'no-bottom-handle': !this.handles.includes('bottom'),
      };
    },
  },
};
</script>
<style src="./styles.css"></style>
