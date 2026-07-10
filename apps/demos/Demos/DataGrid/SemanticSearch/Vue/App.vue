<template>
  <DxDataGrid
    :data-source="dataSource"
    :show-borders="true"
    :remote-operations="true"
    :height="600"
    @editor-preparing="onEditorPreparing"
  >
    <DxScrolling mode="virtual"/>
    <DxSearchPanel :visible="true"/>
    <DxToolbar>
      <DxItem
        location="before"
        template="similarityFactorTemplate"
      />
      <DxItem
        name="searchPanel"
      />
    </DxToolbar>
    <DxColumn
      data-field="ID"
      :width="50"
    />
    <DxColumn data-field="Name"/>
    <DxColumn data-field="Description"/>
    <template #similarityFactorTemplate>
      <div style="display: flex; align-items: center;">
        <span style="margin-right: 8px">Similarity Factor:</span>
        <DxNumberBox
          :value="similarityFactor"
          :min="0"
          :max="1"
          format="0.00"
          :step="0.05"
          :show-spin-buttons="true"
          input-attr="{ 'aria-label': 'Similarity Factor' }"
          @value-changed="onSimilarityFactorChanged"
        />
      </div>
    </template>
  </DxDataGrid>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import {
  DxDataGrid,
  DxColumn,
  DxScrolling,
  DxSearchPanel,
  DxToolbar,
  DxItem,
  type DxDataGridTypes,
} from 'devextreme-vue/data-grid';
import DxNumberBox, { type DxNumberBoxTypes } from 'devextreme-vue/number-box';
import DataSource from 'devextreme/data/data_source';
import { createStore } from 'devextreme-aspnet-data-nojquery';

const url = 'https://js.devexpress.com/Demos/NetCore/api/DataGridSemanticSearch';

const searchValue = ref('');
const similarityFactor = ref(0.31);

const dataSource = new DataSource({
  store: createStore({
    key: 'ID',
    loadUrl: `${url}/Get`,
    loadParams: {
      searchValue: () => searchValue.value,
      similarityFactor: () => similarityFactor.value,
    },
    onBeforeSend(method, ajaxOptions) {
      ajaxOptions.xhrFields = { withCredentials: true };
    },
  }),
});

const onSimilarityFactorChanged = (e: DxNumberBoxTypes.ValueChangedEvent) => {
  similarityFactor.value = e.value;
  if (searchValue.value !== '') {
    dataSource.reload();
  }
};

const onEditorPreparing = (e: DxDataGridTypes.EditorPreparingEvent) => {
  if (e.parentType === 'searchPanel') {
    let searchTimeout: ReturnType<typeof setTimeout> | undefined;
    e.editorOptions.onValueChanged = (args: { value: string }) => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        searchValue.value = args.value;
        e.component.getDataSource().reload();
      }, e.updateValueTimeout);
    };
    e.editorOptions.placeholder = 'Try: clothing';
  }
};
</script>
