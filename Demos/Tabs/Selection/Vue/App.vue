<template>
  <div id="center-content">
    <div id="demo-items-container">
      <div class="content dx-fieldset">
        <div class="dx-field">
          <DxTabs
            v-model:selected-item="selectedItem"
            :data-source="employees"
          />
        </div>

        <div class="dx-field select-box-container">
          <div class="dx-field-label">Selected user:</div>
          <div class="dx-field-value">
            <DxSelectBox
              display-expr="text"
              v-model:selected-item="selectedItem"
              :data-source="employees"
              :value="selectedItem"
              :input-attr="{ 'aria-label': 'Select Employee' }"
            />
          </div>
        </div>

        <div class="dx-field multiview-container">
          <DxMultiView
            v-model:selected-item="selectedItem"
            :height="112"
            :data-source="employees"
            :loop="false"
            :animation-enabled="true"
          >
            <template #item="{ data }">
              <div class="employee-info">
                <img
                  class="employee-photo dx-theme-border-color"
                  :alt="data.text"
                  :src="data.picture"
                >
                <p class="employee-notes">
                  <b>Position: {{ data.position }}</b><br>
                  {{ data.notes }}
                </p>
              </div>
            </template>
          </DxMultiView>
        </div>

        <div class="icon-container">
          <span class="dx-icon dx-icon-info"/>
          <span class="demo-info">You can swipe this area.</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import DxSelectBox from 'devextreme-vue/select-box';
import DxTabs from 'devextreme-vue/tabs';
import DxMultiView from 'devextreme-vue/multi-view';

import { employees } from './data.js';

export default {
  components: {
    DxSelectBox,
    DxTabs,
    DxMultiView,
  },
  data() {
    return {
      selectedItem: employees[0],
      employees,
    };
  },
};
</script>
<style>
  #center-content {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .select-box-container,
  .multiview-container {
    padding: 16px;
  }

  #demo-items-container {
    width: 680px;
  }

  .employee-photo {
    height: 80px;
    width: 80px;
    border-radius: 50%;
    border-width: 1px;
    border-style: solid;
    flex-shrink: 0;
    object-fit: contain;
    margin-right: 24px;
  }

  .employee-info {
    display: flex;
    align-items: center;
  }

  .employee-notes b {
    display: inline-block;
    margin-bottom: 8px;
  }

  .dx-field-label {
    font-size: 16px;
  }

  #multiview {
    cursor: move;
  }

  .demo-info {
    padding-left: 8px;
    opacity: 0.6;
  }

  .icon-container {
    padding-left: 16px;
    display: flex;
    align-items: center;
  }

  .dx-icon {
    font-size: 18px;
  }

</style>
