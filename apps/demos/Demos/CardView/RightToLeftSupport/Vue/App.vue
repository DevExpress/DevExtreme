<template>
  <div class="demo-container">
    <DxCardView
      id="cardViewContainer"
      :data-source="unions"
      :columns="columns"
      :cards-per-row="3"
      :rtl-enabled="rtlEnabled"
    />

    <div class="options">
      <div class="caption">Options</div>
      <div class="option">
        <span>Language:</span>
        <DxSelectBox
          :items="languages"
          v-model:value="selectedLanguage"
          :width="250"
          :input-attr="{ 'aria-label': 'Language' }"
          @value-changed="onValueChanged"
        />
      </div>
    </div>
  </div>
</template>

<script>
import DxCardView from "devextreme-vue/card-view";
import DxSelectBox from "devextreme-vue/select-box";
import { getEuropeanUnion, getLanguages, getDefaultLanguage, getColumns } from "./data";

export default {
  components: {
    DxCardView,
    DxSelectBox,
  },
  data() {
    return {
      unions: getEuropeanUnion(),
      languages: getLanguages(),
      selectedLanguage: getDefaultLanguage(),
      rtlEnabled: false,
      columns: [],
    };
  },
  created() {
    this.rtlEnabled = this.selectedLanguage === this.languages[0];
    this.columns = getColumns(this.rtlEnabled);
  },
  methods: {
    onValueChanged(event) {
      this.selectedLanguage = event.value;
      this.rtlEnabled = this.selectedLanguage === this.languages[0];
      this.columns = getColumns(this.rtlEnabled);
    },
  },
};
</script>

<style scoped>

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
