<template>
  <DxDataGrid
    id="gridContainer"
    :dataSource="sales"
    :showBorders="true"
    keyExpr="Id"
    :filterSyncEnabled="true"
    :allowColumnResizing="true"
    :allowColumnReordering="true"
    :focusedRowEnabled="true"
  >
    <DxSearchPanel
      :visible="true"
      :width="240"
      placeholder="Search..."
    />
    <DxGroupPanel :visible="true"/>
    <DxHeaderFilter :visible="true"/>
    <DxFilterRow :visible="true"/>
    <DxSelection mode="multiple"/>
    <DxSorting mode="multiple"/>
    <DxPaging :pageSize="10"/>
    <DxPager
      :visible="true"
      :allowedPageSizes="[10, 25, 50, 100]"
      :showPageSizeSelector="true"
    />

    <DxAIAssistant
      :enabled="true"
      :aiIntegration="aiIntegration"
      :chat="chatOptions"
    />

    <DxColumn
      dataField="Product"
    />
    <DxColumn
      dataField="Amount"
      caption="Sale Amount"
      dataType="number"
      format="currency"
    />
    <DxColumn
      dataField="Region"
      dataType="string"
    />
    <DxColumn
      dataField="Sector"
      dataType="string"
    />
    <DxColumn
      dataField="SaleDate"
      dataType="date"
    />
    <DxColumn
      dataField="Customer"
      dataType="string"
    />
  </DxDataGrid>
</template>

<script setup lang="ts">
import {
  DxDataGrid,
  DxColumn,
  DxSearchPanel,
  DxGroupPanel,
  DxHeaderFilter,
  DxFilterRow,
  DxPaging,
  DxPager,
  DxSelection,
  DxSorting,
  DxAIAssistant,
} from 'devextreme-vue/data-grid';
import type dxChat from 'devextreme/ui/chat';
import { type DxChatTypes } from 'devextreme-vue/chat';
import type { DxButtonGroupTypes } from 'devextreme-vue/button-group';
import { sales } from './data.ts';
import { aiIntegration } from './service.ts';

let chatInstance: dxChat | undefined;

const suggestionItems = [
  {
    text: '💡 Help',
    prompt: `💡 The DataGrid AI Assistant allows you to control the component using natural language. You can execute commands such as the following:
• Sort records
• Apply a filter
• Search for a specific value
• Group records by a field
• Focus and select rows
• Modify paging settings
• Pin, resize, and reorder columns
• Configure data summaries
• Pick a suggestion or enter a custom request to get started.`,
  },
  {
    text: '🔍 Filter Sector by Health',
    prompt: 'Filter Sector by Health',
  },
  {
    text: '↕️ Sort by Region',
    prompt: 'Sort by Region',
  },
  {
    text: '🧩 Group by Product',
    prompt: 'Group by Product',
    width: 170,
  },
];

interface SuggestionItem extends DxButtonGroupTypes.Item {
  prompt: string;
}

const onSuggestionItemClick = (e: DxButtonGroupTypes.ItemClickEvent) => {
  const { prompt, text } = e.itemData as SuggestionItem;
  const userId = text === '💡 Help' ? 'help' : 'user';

  const message = {
    id: Date.now(),
    timestamp: new Date(),
    author: { id: userId },
    text: prompt,
  };

  chatInstance?.getDataSource().store().push([{
    type: 'insert',
    data: message,
  }]);
};

const chatOptions = {
  user: { id: 'user' },
  onInitialized(e: DxChatTypes.InitializedEvent) {
    chatInstance = e.component;
  },
  suggestions: {
    items: suggestionItems,
    onItemClick: onSuggestionItemClick,
  },
};
</script>

<style scoped>
#gridContainer {
  max-height: 800px;
}
</style>
