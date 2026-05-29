import React, { useCallback, useRef } from 'react';

import type dxChat from 'devextreme/ui/chat';
import type { InitializedEvent, Properties as ChatProperties } from 'devextreme/ui/chat';
import type { ItemClickEvent } from 'devextreme/ui/button_group';

import DataGrid, {
  Column,
  Paging,
  Pager,
  SearchPanel,
  GroupPanel,
  HeaderFilter,
  FilterRow,
  AIAssistant,
} from 'devextreme-react/data-grid';

import { sales } from './data.ts';
import { aiIntegration } from './service.ts';

const allowedPageSizes = [10, 25, 50, 100];

const suggestions = {
  items: [
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
  ],
};

export default function App() {
  const chatRef = useRef<dxChat | null>(null);

  const onChatInitialized = useCallback((e: InitializedEvent) => {
    chatRef.current = e.component ?? null;
  }, []);

  const onSuggestionItemClick = useCallback((e: ItemClickEvent) => {
    const { prompt, text } = e.itemData;
    const userId = text === '💡 Help' ? 'help' : 'user';

    const message = {
      id: Date.now(),
      timestamp: new Date(),
      author: { id: userId },
      text: prompt,
    };

    chatRef.current?.getDataSource().store().push([{
      type: 'insert',
      data: message,
    }]);
  }, []);

  const chatOptions: ChatProperties = {
    onInitialized: onChatInitialized,
    user: {
      id: 'user',
    },
    suggestions: {
      ...suggestions,
      onItemClick: onSuggestionItemClick,
    },
  };

  return (
    <DataGrid
      id="gridContainer"
      dataSource={sales}
      showBorders
      keyExpr="Id"
      filterSyncEnabled
    >
      <SearchPanel
        visible
        width={240}
        placeholder="Search..."
      />
      <GroupPanel visible />
      <HeaderFilter visible />
      <FilterRow visible />
      <Paging pageSize={10} />
      <Pager
        visible
        allowedPageSizes={allowedPageSizes}
        showPageSizeSelector
      />
      <AIAssistant
        enabled
        aiIntegration={aiIntegration}
        chat={chatOptions}
      />
      <Column dataField="Product" />
      <Column
        dataField="Amount"
        caption="Sale Amount"
        dataType="number"
        format="currency"
      />
      <Column
        dataField="Region"
        dataType="string"
      />
      <Column
        dataField="Sector"
        dataType="string"
      />
      <Column
        dataField="SaleDate"
        dataType="date"
      />
      <Column
        dataField="Customer"
        dataType="string"
      />
    </DataGrid>
  );
}
