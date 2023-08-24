<template>
  <div>
    <DxDataGrid
      id="gridContainer"
      :data-source="europeanUnion"
      key-expr="nameEn"
      :rtl-enabled="rtlEnabled"
      :show-borders="true"
    >
      <DxPaging :page-size="15"/>
      <DxSearchPanel
        :visible="true"
        :placeholder="placeholder"
      />
      <DxColumn
        :data-field="rtlEnabled ? 'nameAr' : 'nameEn'"
        :caption="rtlEnabled ? 'الدولة' : 'Name'"
      />
      <DxColumn
        :data-field="rtlEnabled ? 'capitalAr' : 'capitalEn'"
        :caption="rtlEnabled ? 'عاصمة' : 'Capital'"
      />
      <DxColumn
        :caption="rtlEnabled ? 'عدد السكان (نسمة) 2013' : 'Population'"
        :format="{ type: 'fixedPoint', precision: 0 }"
        data-field="population"
      />
      <DxColumn
        :header-cell-template="rtlEnabled ? 'arabicTemplate' : 'englishTemplate'"
        :format="{ type: 'fixedPoint', precision: 0 }"
        data-field="area"
      />
      <DxColumn
        :visible="false"
        data-field="accession"
      />
      <template #englishTemplate="{ data }">
        <div>Area (km<sup>2</sup>)</div>
      </template>
      <template #arabicTemplate="{ data }">
        <div>المساحة (كم<sup>2</sup>)</div>
      </template>
    </DxDataGrid>
    <div class="options">
      <div class="caption">Options</div>
      <div class="option">
        <span>Language: </span>
        <DxSelectBox
          id="select-language"
          :items="languages"
          :input-attr="{ 'aria-label': 'Language' }"
          :value="languages[1]"
          :width="250"
          @valueChanged="onSelectLanguage($event)"
        />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import {
  DxDataGrid,
  DxColumn,
  DxPaging,
  DxSearchPanel,
} from 'devextreme-vue/data-grid';
import DxSelectBox from 'devextreme-vue/select-box';

import { ValueChangedEvent } from 'devextreme/ui/select_box';

import { europeanUnion } from './data.ts';

const languages = ['Arabic (Right-to-Left direction)', 'English (Left-to-Right direction)'];

const placeholder = ref('Search...');
const rtlEnabled = ref(false);

const onSelectLanguage = (e: ValueChangedEvent) => {
  rtlEnabled.value = e.value === languages[0];
  placeholder.value = rtlEnabled.value ? 'بحث' : 'Search...';
};
</script>
<style scoped>
#gridContainer {
  height: 440px;
}

#gridContainer sup {
  font-size: 0.8em;
  vertical-align: super;
  line-height: 0;
}

.options {
  padding: 20px;
  margin-top: 20px;
  background-color: rgba(191, 191, 191, 0.15);
}

.caption {
  font-size: 18px;
  font-weight: 500;
}

.option {
  margin-top: 10px;
}

.option > span {
  margin-right: 10px;
}

.option > .dx-widget {
  display: inline-block;
  vertical-align: middle;
}
</style>
