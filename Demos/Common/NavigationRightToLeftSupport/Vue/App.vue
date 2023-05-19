<template>
  <div :class="{ 'dx-rtl': rtlEnabled }">
    <div class="options">
      <div class="caption">Options</div>
      <div class="dx-fieldset">
        <div class="dx-field">
          <div class="dx-field-label">Language</div>
          <div class="dx-field-value">
            <DxSelectBox
              :items="languages"
              :value="languages[1]"
              :input-attr="{ 'aria-label': 'Language' }"
              @valueChanged="selectLanguage($event)"
            />
          </div>
        </div>
      </div>
    </div>
    <div>
      <div class="dx-fieldset">
        <div class="dx-fieldset-header">
          <DxMenu
            :data-source="continents"
            :rtl-enabled="rtlEnabled"
            :display-expr="rtlEnabled ? 'textAr' : 'text'"
          />
        </div>
      </div>
      <div class="dx-fieldset">
        <div class="dx-field">
          <div class="dx-field-label">
            <DxTreeView
              :width="200"
              :data-source="continents"
              :display-expr="rtlEnabled ? 'textAr' : 'text'"
              :rtl-enabled="rtlEnabled"
            />
          </div>
          <div class="dx-field-value">
            <DxAccordion
              :data-source="europeCountries"
              :rtl-enabled="rtlEnabled"
              :item-title-template="rtlEnabled ? 'arabic-title' : 'english-title'"
              :item-template="rtlEnabled ? 'arabic' : 'english'"
            >
              <template #arabic-title="{ data }">
                {{ data.nameAr }}
              </template>
              <template #arabic="{ data }">
                <div>عاصمة: {{ data.capitalAr }} </div>
                <div>عدد السكان: {{ data.population }} نسمة</div>
                <div>المساحة: {{ data.area }} كم<sup>2</sup></div>
              </template><template #english-title="{ data }">
                {{ data.nameEn }}
              </template>
              <template #english="{ data }">
                <div>Capital: {{ data.capitalEn }} </div>
                <div>Population: {{ data.population }} people</div>
                <div>Area: {{ data.area }} km<sup>2</sup></div>
              </template>
            </DxAccordion>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>

import DxSelectBox from 'devextreme-vue/select-box';
import DxMenu from 'devextreme-vue/menu';
import DxTreeView from 'devextreme-vue/tree-view';
import DxAccordion from 'devextreme-vue/accordion';
import { continents, europeCountries } from './data.js';

export default {
  components: {
    DxSelectBox,
    DxMenu,
    DxTreeView,
    DxAccordion,
  },
  data() {
    return {
      continents,
      europeCountries,
      languages: [
        'Arabic: Right-to-Left direction',
        'English: Left-to-Right direction',
      ],
      rtlEnabled: false,

    };
  },
  methods: {
    selectLanguage(e) {
      this.rtlEnabled = e.value === this.languages[0];
    },
  },
};
</script>
<style scoped>
  sup {
    font-size: 0.8em;
    vertical-align: super;
    line-height: 0;
  }

  .options {
    padding: 20px;
    background-color: rgba(191, 191, 191, 0.15);
    margin-bottom: 20px;
  }

  .options .dx-fieldset {
    margin: 0;
  }

  .caption {
    font-size: 18px;
    font-weight: 500;
    padding-right: 15px;
  }

  .dx-theme-material .dx-accordion .dx-accordion-item-opened .dx-accordion-item-title {
    padding-top: 20px;
  }

</style>
