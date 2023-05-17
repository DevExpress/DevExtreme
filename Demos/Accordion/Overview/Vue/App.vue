<template>
  <div id="accordion">
    <DxAccordion
      :data-source="companies"
      :collapsible="collapsible"
      :multiple="multiple"
      :animation-duration="animationDuration"
      v-model:selected-items="selectedItems"
      id="accordion-container"
    >
      <template #title="{ data }">
        <CustomTitle :item-data="data"/>
      </template>
      <template #item="{ data }">
        <CustomItem :item-data="data"/>
      </template>
    </DxAccordion>

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
      <div class="option">
        <span class="caption">Selected Items</span>
        <DxTagBox
          :data-source="companies"
          v-model:value="selectedItems"
          :input-attr="{ 'aria-label': 'Company' }"
          :disabled="!multiple"
          display-expr="CompanyName"
        />
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
    DxAccordion, DxTagBox, DxCheckBox, DxSlider, DxTooltip, DxLabel, CustomTitle, CustomItem,
  },
  data() {
    const companies = service.getCompanies();
    return {
      companies,
      selectedItems: [companies[0]],
      multiple: false,
      collapsible: false,
      animationDuration: 300,
    };
  },
};
</script>
<style scoped>
#accordion {
  height: 700px;
}

#accordion h1 {
  font-size: 20px;
}

#accordion h1,
#accordion p {
  margin: 0;
}

#accordion-container {
  margin-right: 400px;
}

.dx-theme-material #accordion .dx-accordion-item-title {
  display: flex;
}

.dx-theme-material #accordion h1 {
  align-self: center;
}

.options {
  padding: 20px;
  position: absolute;
  bottom: 0;
  right: 0;
  width: 340px;
  top: 0;
  background-color: rgba(191, 191, 191, 0.15);
}

.options > .caption {
  font-weight: 500;
  font-size: 18px;
}

.option {
  margin-top: 10px;
}

.option > .caption {
  margin-top: 10px;
  display: inline-block;
}

.option > .dx-tagbox {
  margin-top: 2px;
}
</style>
