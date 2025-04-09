import type { Meta, StoryObj } from "@storybook/react";

import dxCardView from "devextreme/ui/card_view";
import { wrapDxWithReact } from "../utils";
import { store } from "./data";
import { generatedData } from "./generatedData";

const CardView = wrapDxWithReact(dxCardView);

const dataSources = {
  empty: [],
  local: generatedData,
  remote: store,
}

const columns = {
  remote: [
    {
      dataField: "OrderNumber",
      alignment: 'right',
      dataType: "number",
    },
    {
      dataField: "OrderDate",
      visible: false,
    },
    "StoreCity",
    "StoreState",
    "Employee",
    {
      dataField: "SaleAmount",
      dataType: "number",
    },
  ],
  local: [
      'firstName',
      'lastName',
      'gender',
      'birthDate'
  ],
  sortedRemote: [
    {
      dataField: "OrderNumber",
      alignment: 'right',
      dataType: "number",
      sortOrder: 'asc',
      sortIndex: 1,
    },
    {
      dataField: "OrderDate",
      visible: false,
    },
    {
      dataField: "StoreCity",
      sortOrder: 'desc',
      sortIndex: 0,
    },
    "StoreState",
    "Employee",
    "SaleAmount",
  ],
  localHeaderFilter: [
    {
      dataField: 'firstName',
      headerFilter: {
        allowSelectAll: false,
        search: {
          enabled: true,
        },
        values: ['Anet', 'Annabela'],
      },
    },
    {
        dataField: 'lastName',
        headerFilter: {
          filterType: 'exclude',
          values: ['Abbey'],
        }
    },
    {
      dataField: 'gender',
      allowHeaderFiltering: false,
    },
    {
      dataField: 'birthDate',
      dataType: 'date',
      calculateCellValue: (data) => {
        return new Date(data.birthDate);
      },
      calculateDisplayValue: (data) => {
        return new Date(data.birthDate).toDateString();
      }
    },
  ]
}

const meta: Meta<typeof CardView> = {
  title: "Grids/CardView",
  component: CardView,
  argTypes: {
    dataSource: {
      options: Object.keys(dataSources),
      mapping: dataSources,
      control: { type: 'radio' },
    },
    width: {
      control: 'text',
    },
    height: {
      control: 'text',
    },
    keyExpr: {
      control: 'text',
    },
    cardsPerRow: {
      options: ['auto', 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      control: { type: 'select' },
    },
    paging: {
      pageSize: 12,
    },
    // cardMinWidth: 250,
    // cardMaxWidth: 350,
    // filterPanel: { visible: true },
    columns: {
      options: Object.keys(columns),
      mapping: columns,
      control: { type: 'radio' },
    },
    headerFilter: {
      control: 'object',
    },
    searchPanel: {
      control: 'object',
    },
  }
};

export default meta;

type Story = StoryObj<typeof CardView>;

export const DefaultMode: Story = {
  args: {
    dataSource: 'local',
    width: "100%",
    // TODO: Fix height limit
    // height: '500px',
    keyExpr: "OrderNumber",
    cardsPerRow: "auto",
    paging: {
      pageSize: 12,
    },
    cardMinWidth: 250,
    cardMaxWidth: 350,
    columns: 'local',
    filterPanel: { visible: true },
  },
};

export const RawControls: Story = {
  ...DefaultMode,
  argTypes: {
    ...meta.argTypes,
    dataSource: {
      control: 'object',
      mapping: null,
    },
    columns: {
      control: 'object',
      mapping: null,
    },
  },
  args: {
    ...DefaultMode.args,
    dataSource: dataSources.local.slice(0, 10),
    columns: columns.local,
  }
};

export const FixatedCardsPerRow: Story = {
  ...DefaultMode,
  args: {
    ...DefaultMode.args,
    cardsPerRow: 3
  },
};

export const EmptyCardView: Story = {
  ...DefaultMode,
  args: {
    ...DefaultMode.args,
    dataSource: 'empty',
  },
};

export const CardViewWithCover  : Story = {
  ...DefaultMode,
  args: {
    ...DefaultMode.args,
    cardCover: {
      imageExpr: (data) => `https://js.devexpress.com/jQuery/Demos/WidgetsGallery/JSDemos/${data.picture}`,
      altExpr: 'FirstName',
      // ratio: '2 / 1',
    },
  },
};

export const SortedCardView: Story = {
  ...DefaultMode,
  args: {
    ...DefaultMode.args,
    dataSource: 'remote',
    columns: 'sortedRemote',
  },
};

export const SearchCardView: Story = {
  ...DefaultMode,
  args: {
    ...DefaultMode.args,
    dataSource: 'local',
    columns: 'local',
    searchPanel: {
      highlightCaseSensitive: false,
      highlightSearchText: true,
      text: '',
    }
  }
}

export const HeaderFilterStory: Story = {
  ...DefaultMode,
  args: {
    ...DefaultMode.args,
    headerFilter: {
      visible: true,
      width: 252,
      height: 325,
      allowSelectAll: true,
      search: {
        enabled: false,
        timeout: 500,
        mode: 'contains',
        editorOptions: {},
      },
      texts: {
        emptyValue: 'empty',
        ok: 'ok',
        cancel: 'cancel',
      },
    }
  }
}

export const SelectionStory: Story = {
  ...DefaultMode,
  args: {
    ...DefaultMode.args,
    keyExpr: 'id',
    selection: {
      mode: 'multiple',
      showCheckBoxesMode: 'onClick',
      allowSelectAll: true,
      selectAllMode: 'allPages',
    }
  }
}

export const ContextMenuStory: Story = {
  ...DefaultMode,
  args: {
    ...DefaultMode.args,
    onContextMenuPreparing: (e) => {
      e.items = e.items ?? [];

      if(e.target === 'toolbar') {
        e.items.push({
          text: 'show column chooser',
          onItemClick: () => e.component.showColumnChooser()
        });
      }
      else if(e.target === 'headerPanel' && e.column) {
        e.items.push({
          text: `hide ${e.column.caption}`,
          disabled: !e.column.visible,
          icon: 'eyeclose',
          onItemClick: () => e.component.columnOption(e.columnIndex, 'visible', false)
        });
      }
      else if(e.target === 'content' && e.card) {
        e.items.push({
          text: 'do something with card'
        });
      }
    }
  }
}
