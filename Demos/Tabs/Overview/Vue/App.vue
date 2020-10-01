<template>
  <div>
    <div id="longtabs">
      <div class="caption">Tabs</div>
      <DxTabs :data-source="longtabs"/>
    </div>
    <div id="scrolledtabs">
      <div class="caption">Tabs with Overflow</div>
      <DxTabs
        :data-source="longtabs"
        :width="300"
        :scroll-by-content="true"
        :show-nav-buttons="true"
      />
    </div>
    <div id="tabs">
      <div class="caption">API</div>
      <DxTabs
        :data-source="tabs"
        v-model:selected-index="selectedIndex"
      />
      <div class="content dx-fieldset">
        <div class="dx-field">
          <div class="dx-field-label">Selected index:</div>
          <div class="dx-field-value">
            <DxSelectBox
              v-model:value="selectedIndex"
              :data-source="tabs"
              display-expr="text"
              value-expr="id"
            />
          </div>
        </div>
        <div class="dx-field">
          <div class="dx-field-label">Selected content:</div>
          <div class="dx-field-value-static left-aligned">
            {{ tabs[selectedIndex].content }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>

import DxSelectBox from 'devextreme-vue/select-box';
import DxTabs from 'devextreme-vue/tabs';

import { tabs, longtabs } from './data.js';

export default {
  components: {
    DxSelectBox,
    DxTabs
  },
  data() {
    return {
      selectedIndex: 0,
      tabs,
      longtabs
    };
  }
};
</script>
<style>
.content{
    text-align: justify;
    margin-top: 25px;
}

#longtabs{
    margin-top: 20px;
}

#scrolledtabs {
    margin-top: 20px;
}

#tabs {
    margin-top: 60px;
}

.caption{
    font-size: 16px;
    padding-bottom: 3px;
    padding-left: 10px;
}

.left-aligned {
    text-align: left;
}
</style>
