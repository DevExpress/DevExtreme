<template>
  <div id="accordion">
    <DxAccordion
      :data-source="companies"
      :collapsible="collapsible"
      :multiple="multiple"
      :animation-duration="animationDuration"
      v-model:selected-items="selectedCompanies"
      id="accordion-container"
      item-title-template="itemTitle"
      :height="height"
    >
      <template #itemTitle="{ data }">
        <CustomTitle :item-data="data"/>
      </template>
      <template #item="{ data }">
        <CustomItem :item-data="data"/>
      </template>
    </DxAccordion>

    <div class="options">
      <div class="caption">Options</div>
      <div class="option">
        <DxButton
          text="Reset height"
          @click="onResetClick"
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
          v-model:value="selectedCompaniesIds"
          :input-attr="{ 'aria-label': 'Company' }"
          :disabled="!multiple"
          display-expr="CompanyName"
          value-expr="ID"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import DxAccordion, { type DxAccordionTypes } from 'devextreme-vue/accordion';
import DxButton from 'devextreme-vue/button';
import DxTagBox from 'devextreme-vue/tag-box';
import DxCheckBox from 'devextreme-vue/check-box';
import DxSlider, { DxTooltip, DxLabel } from 'devextreme-vue/slider';
import CustomTitle from './CustomTitle.vue';
import CustomItem from './CustomItem.vue';
import { type CompanyData } from './data.ts';
import service from './data.ts';

const multiple = ref(false);
const collapsible = ref(false);
const animationDuration = ref(300);
const height = ref<DxAccordionTypes.Properties['height']>(500);
const companies = service.getCompanies();
const selectedCompaniesIds = ref([companies[0].ID]);

const getCompaniesBySelectedIds = () => {
  const selectedIds = new Set(selectedCompaniesIds.value);
  return companies.filter((company: CompanyData) => selectedIds.has(company.ID));
};
const setSelectedCompanies = (companies: CompanyData[]) => {
  selectedCompaniesIds.value = companies.map((item) => item.ID);
};
const selectedCompanies = computed({
  get: getCompaniesBySelectedIds,
  set: setSelectedCompanies,
});

const onResetClick = () => {
  height.value = undefined;
};

</script>
<style scoped>
#accordion {
  height: 700px;
}

#accordion .header {
  font-size: 20px;
}

#accordion .header,
#accordion p {
  margin: 0;
}

#accordion-container {
  margin-right: 400px;
}

.dx-theme-material #accordion .dx-accordion-item-title {
  display: flex;
}

.dx-theme-material #accordion .header {
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
