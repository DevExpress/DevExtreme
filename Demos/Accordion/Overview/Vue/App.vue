<template>
  <div id="accordion">
    <DxAccordion
      :data-source="companies"
      :collapsible="collapsible"
      :multiple="multiple"
      :animation-duration="animationDuration"
      v-model:selected-items="selectedItems"
    >
      <template #title="{ data }">
        <CustomTitle :item-data="data"/>
      </template>
      <template #item="{ data }">
        <CustomItem :item-data="data"/>
      </template>
    </DxAccordion>

    <div class="selected-data">
      <span class="caption">Selected Items</span>
      <DxTagBox
        :data-source="companies"
        v-model:value="selectedItems"
        :disabled="!multiple"
        display-expr="CompanyName"
      />
    </div>

    <div class="options">
      <div class="caption">Options</div>
      <div class="option">
        <DxCheckBox
          v-model:value="multiple"
          text="Multiple enabled"
        />
      </div>
      <div class="option">
        <DxCheckBox
          v-model:value="collapsible"
          text="Collapsible enabled"
        />
      </div>
      <div class="option">
        <span>Animation duration</span>
        <DxSlider
          :min="0"
          :max="1000"
          v-model:value="animationDuration"
        >
          <DxTooltip
            :enabled="true"
            position="bottom"
          />
          <DxLabel :visible="true"/>
        </DxSlider>
      </div>
    </div>
  </div>
</template>
<script>
import DxAccordion from 'devextreme-vue/accordion';
import DxTagBox from 'devextreme-vue/tag-box';
import DxCheckBox from 'devextreme-vue/check-box';
import DxSlider, { DxTooltip, DxLabel } from 'devextreme-vue/slider';
import CustomTitle from './CustomTitle.vue';
import CustomItem from './CustomItem.vue';

import service from './data.js';

export default {
  components: {
    DxAccordion, DxTagBox, DxCheckBox, DxSlider, DxTooltip, DxLabel, CustomTitle, CustomItem
  },
  data() {
    const companies = service.getCompanies();
    return {
      companies,
      selectedItems: [companies[0]],
      multiple: false,
      collapsible: false,
      animationDuration: 300
    };
  }
};
</script>
<style scoped>
#accordion h1 {
  font-size: 20px;
}

#accordion h1,
#accordion p {
  margin: 0;
}

.dx-theme-material #accordion .dx-accordion-item-opened .dx-accordion-item-title {
  display: flex;
}

.dx-theme-material #accordion .dx-accordion-item-opened h1 {
  align-self: center;
}

.options,
.selected-data {
  padding: 20px;
  background-color: rgba(191, 191, 191, 0.15);
  margin-top: 20px;
}

.selected-data {
  position: relative;
  height: 36px;
}

.selected-data > .caption {
  position: relative;
  top: 5px;
  margin-right: 10px;
  font-weight: bold;
  font-size: 115%;
}

.selected-data > .dx-widget {
  position: absolute;
  left: 140px;
  right: 20px;
  top: 20px;
}

.options > .caption {
  font-weight: 500;
  font-size: 18px;
}

.option {
  margin-top: 10px;
}
</style>
