<template>
  <div>
    <DxFilterBuilder
      :fields="fields"
      :value="filter"
      :group-operations="groupOperations"
      @initialized="updateTexts"
      @value-changed="updateTexts"
    >
      <DxCustomOperation
        :calculate-filter-expression="calculateFilterExpression"
        name="anyof"
        caption="Is any of"
        icon="check"
        editor-template="editorComponentTemplate"
      />
      <template #editorComponentTemplate="{ data: conditionInfo }">
        <EditorComponent :condition-info="conditionInfo"/>
      </template>
    </DxFilterBuilder>
    <div class="results">
      <div>
        <b>Value</b>
        <pre>{{ filterText }}</pre>
      </div>
      <div>
        <b>DataSource&apos;s filter expression</b>
        <pre>{{ dataSourceText }}</pre>
      </div>
    </div>
  </div>
</template>
<script>
import DxFilterBuilder, { DxCustomOperation } from 'devextreme-vue/filter-builder';
import { filter, fields } from './data.js';
import { formatValue } from './helpers.js';
import EditorComponent from './EditorComponent.vue';

export default {
  components: {
    DxFilterBuilder,
    DxCustomOperation,
    EditorComponent
  },
  data() {
    return {
      fields,
      filter,
      filterText: '',
      groupOperations: ['and', 'or'],
      dataSourceText: ''
    };
  },
  methods: {
    updateTexts(e) {
      this.filterText = formatValue(e.component.option('value'));
      this.dataSourceText = formatValue(e.component.getFilterExpression());
    },
    calculateFilterExpression(filterValue, field) {
      return filterValue && filterValue.length
        && Array.prototype.concat.apply([], filterValue.map(function(value) {
          return [[field.dataField, '=', value], 'or'];
        })).slice(0, -1);
    }
  }
};
</script>
<style scoped>
.results {
    margin-top: 50px;
    display: flex;
    justify-content: space-between;
}

.results > div {
    flex-basis: 49%;
    max-width: 50%;
    background-color: rgba(191, 191, 191, 0.15);
    position: relative;
}

.results b {
    position: absolute;
    top: -25px;
}

.results pre {
    padding: 10px 20px;
    height: 100%;
    font-size: 13px;
    overflow: auto;
    box-sizing: border-box;
}

.dx-tagbox {
    min-width: 150px;
}

.dx-filterbuilder .dx-numberbox {
    width: 80px;
}
</style>
