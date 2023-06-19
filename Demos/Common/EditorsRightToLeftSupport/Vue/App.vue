<template>
  <div>
    <div
      :class="{ 'dx-rtl': rtlEnabled }"
    >
      <div class="options">
        <div class="caption">Options</div>
        <div class="dx-fieldset">
          <div class="dx-field">
            <div class="dx-field-label">Language</div>
            <div class="dx-field-value">
              <DxSelectBox
                :items="languages"
                :input-attr="{ 'aria-label': 'Language' }"
                :value="languages[1]"
                :rtl-enabled="rtlEnabled"
                @valueChanged="onLanguageChanged"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="dx-fieldset">
        <div class="dx-field">
          <div class="dx-field-label">Text Box</div>
          <div class="dx-field-value">
            <DxTextBox
              :show-clear-button="true"
              :value="textValue"
              :input-attr="{ 'aria-label': 'Text Box' }"
              :rtl-enabled="rtlEnabled"
            />
          </div>
        </div>
        <div class="dx-field">
          <div class="dx-field-label">Number Box</div>
          <div class="dx-field-value">
            <DxNumberBox
              :show-spin-buttons="true"
              :value="123"
              :rtl-enabled="rtlEnabled"
              :input-attr="{ 'aria-label': 'Number Box' }"
            />
          </div>
        </div>
        <div class="dx-field">
          <div class="dx-field-label">Select Box</div>
          <div class="dx-field-value">
            <DxSelectBox
              :items="europeanUnion"
              :value="europeanUnion[0]"
              :input-attr="{ 'aria-label': 'European Union Data' }"
              :rtl-enabled="rtlEnabled"
              :display-expr="displayExpr"
            />
          </div>
        </div>
        <div class="dx-field">
          <div class="dx-field-label">Tag Box</div>
          <div class="dx-field-value">
            <DxTagBox
              :items="europeanUnion"
              :value="[europeanUnion[0].id]"
              :input-attr="{ 'aria-label': 'Name' }"
              :rtl-enabled="rtlEnabled"
              :display-expr="displayExpr"
              placeholder="..."
              value-expr="id"
            />
          </div>
        </div>
        <div class="dx-field">
          <div class="dx-field-label">Text Area</div>
          <div class="dx-field-value">
            <DxTextArea
              :value="textValue"
              :rtl-enabled="rtlEnabled"
              :input-attr="{ 'aria-label': 'Notes' }"
            />
          </div>
        </div>
        <div class="dx-field">
          <div class="dx-field-label">Autocomplete</div>
          <div class="dx-field-value">
            <DxAutocomplete
              :items="europeanUnion"
              :rtl-enabled="rtlEnabled"
              :value-expr="displayExpr"
            />
          </div>
        </div>
        <div class="dx-field">
          <div class="dx-field-label">Check Box</div>
          <div class="dx-field-value">
            <DxCheckBox
              :value="true"
              :text="textValue"
              :rtl-enabled="rtlEnabled"
            />
          </div>
        </div>
        <div class="dx-field">
          <div class="dx-field-label">Switch</div>
          <div class="dx-field-value">
            <DxSwitch
              :rtl-enabled="rtlEnabled"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>

import DxSelectBox from 'devextreme-vue/select-box';
import DxAutocomplete from 'devextreme-vue/autocomplete';
import DxCheckBox from 'devextreme-vue/check-box';
import DxSwitch from 'devextreme-vue/switch';
import DxTextArea from 'devextreme-vue/text-area';
import DxTextBox from 'devextreme-vue/text-box';
import DxNumberBox from 'devextreme-vue/number-box';
import DxTagBox from 'devextreme-vue/tag-box';
import { europeanUnion } from './data.js';

export default {
  components: {
    DxSelectBox,
    DxAutocomplete,
    DxCheckBox,
    DxSwitch,
    DxTextArea,
    DxTextBox,
    DxNumberBox,
    DxTagBox,
  },
  data() {
    return {
      europeanUnion,
      languages: [
        'Arabic: Right-to-Left direction',
        'English: Left-to-Right direction',
      ],
      displayExpr: 'nameEn',
      rtlEnabled: false,
      textValue: 'text',
      onLanguageChanged: (args) => {
        const isRTL = args.value === this.languages[0];

        this.displayExpr = isRTL ? 'nameAr' : 'nameEn';
        this.rtlEnabled = isRTL;
        this.textValue = isRTL ? 'نص' : 'text';
      },
    };
  },
};
</script>
<style>
.options {
  padding: 20px;
  background-color: rgba(191, 191, 191, 0.15);
}

.options .dx-fieldset {
  margin: 0;
}

.option {
  margin-top: 10px;
}

.caption {
  font-size: 18px;
  font-weight: 500;
  padding-right: 15px;
}

.option > span {
  margin-right: 10px;
}

.option > .dx-widget {
  display: inline-block;
  vertical-align: middle;
}

</style>
