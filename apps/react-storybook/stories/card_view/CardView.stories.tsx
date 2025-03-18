import type { Meta, StoryObj } from "@storybook/react";

import dxCardView from "devextreme/ui/card_view";
import { wrapDxWithReact } from "../utils";
import { items, store } from "./data";

const CardView = wrapDxWithReact(dxCardView);

const dataSources = {
  empty: [],
  local: items,
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
    "SaleAmount",
  ],
  local: [
    {
      dataField: 'column1'
    }, {
      dataField: 'column2'
    }
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
    }
  }
};

export default meta;

type Story = StoryObj<typeof CardView>;

export const DefaultMode: Story = {
  args: {
    dataSource: 'local',
    width: "100%",
    height: '500px',
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

export const SortedCardView: Story = {
  ...DefaultMode,
  args: {
    ...DefaultMode.args,
    dataSource: 'remote',
    columns: 'sortedRemote',
  },
};

