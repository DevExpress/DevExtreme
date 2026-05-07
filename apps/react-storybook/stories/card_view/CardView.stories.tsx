import type { Meta, StoryObj } from "@storybook/react-webpack5";

import dxCardView from "devextreme/ui/card_view";
import { wrapDxWithReact } from "../utils";
import { store } from "./data";
import { generatedData } from "./generatedData";
import { renderFooter } from "./templates";
import { fn } from 'storybook/test';

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
      calculateDisplayValue: (data) => {
        return new Date(data.birthDate).toDateString();
      }
    },
  ],
  remoteHeaderFilter: [
    {
      dataField: "OrderNumber",
      alignment: 'right',
      dataType: "number",
    },
    {
      dataField: "OrderDate", 
      dataType: 'date',
      calculateDisplayValue: (data) => {
        return new Date(data.OrderDate).toDateString();
      }
    },
    "StoreCity",
    "StoreState",
    "Employee",
    {
      dataField: "SaleAmount",
      dataType: "number",
      headerFilter: {
        groupInterval: 1000,
      }
    },
  ],
  columnChooser: [
    {
      dataField: 'id',
      allowReordering: false,
    },
    'firstName',
    'lastName',
    'gender',
    'birthDate',
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
    columns: {
      options: Object.keys(columns),
      mapping: columns,
      control: { type: 'radio' },
    },
    allowColumnReordering: {
      control: 'boolean',
    },
    'paging.enabled': {
      control: 'boolean',
    },
    'paging.pageIndex': {
      control: 'number',
    },
    'paging.pageSize': {
      control: 'number', 
    },
    'sorting.mode': {
      control: 'radio',
      options: ['none', 'single', 'multiple'],
      additionalProps: {
        default: 'none'
      }
    },
    'filterValue': {
      control: 'object',
    },
    'filterSyncEnabled': {
      control: 'radio',
      options: ['auto', true, false]
    },
    'filterPanel.visible': {
      control: 'boolean'
    },
    'filterPanel.filterEnabled': {
      control: 'boolean'
    },
    'headerFilter.visible': {
      control: 'boolean'
    },
    'noDataText': {
      control: 'text'
    },
    'searchPanel.highlightCaseSensitive': {
      control: 'boolean'
    },
    'searchPanel.highlightSearchText': {
      control: 'boolean'
    },
    'searchPanel.placeholder': {
      control: 'text'
    },
    'searchPanel.searchVisibleColumnsOnly': {
      control: 'boolean'
    },
    'searchPanel.text': {
      control: 'text'
    },
    'searchPanel.visible': {
      control: 'boolean'
    },
    'selection.mode': {
      control: 'radio',
      options: ['none', 'single', 'multiple']
    },
    'selection.showCheckBoxesMode': {
      control: 'radio',
      options: ['always', 'none', 'onClick', 'onLongTap']
    },
    'selection.allowSelectAll': {
      control: 'boolean',
    },
    'selection.selectAllMode': {
      control: 'radio',
      options: ['allPages', 'page']
    },
    'toolbar.visible': {
      control: 'boolean',
    },
    'toolbar.disabled': {
      control: 'boolean',
    },
    'headerPanel.visible': {
      control: 'boolean',
    },
    'cardsPerRow': {
      options: ['auto', 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      control: { type: 'select' },
    },
    cardMinWidth: {
      control: 'number'
    },
    cardMaxWidth: {
      control: 'number'
    },
    wordWrapEnabled: {
      control: 'boolean'
    },
    'cardCover.imageExpr': {
      control: 'radio',
      options: ['picture', 'none'],
      mapping: {
        picture: 'picture',
        none: undefined
      }
    },
    'cardCover.maxHeight': {
      control: 'number',
    },
    'cardCover.ratio': {
      control: 'text'
    },
    'cardFooterTemplate': {
      control: 'radio',
      options: ['yes', 'no'],
      mapping: {
        yes: renderFooter,
        no: undefined,
      }
    },  
    'editing.allowAdding': {
      control: 'boolean',
    },
    'editing.allowUpdating': {
      control: 'boolean',
    },
    'editing.allowDeleting': {
      control: 'boolean',
    },
    'keyboardNavigation.enabled': {
      control: 'boolean',
    },
    onKeyDown: {
      control: 'radio',
      options: ['on', 'off'],
      mapping: {
        on: fn(),
        off: undefined,
      },
    },
    onFocusedCardChanged: {
      control: 'radio',
      options: ['on', 'off'],
      mapping: {
        on: fn(),
        off: undefined,
      },
    },
    'columnChooser.allowSearch': {
      control: 'boolean',
    },
    'columnChooser.enabled': {
      control: 'boolean',
    },
    'columnChooser.mode': {
      control: 'radio',
      options: ['select', 'dragAndDrop']
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
    'paging.pageSize': 12,
    cardMinWidth: 250,
    cardMaxWidth: 350,
    columns: 'local',
    'filterPanel.visible': true,
    cardFooterTemplate: undefined,
    'keyboardNavigation.enabled': true,
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
    'cardCover.imageExpr': 'image',
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
    'searchPanel.highlightCaseSensitive': false,
    'searchPanel.highlightSearchText': true,
    'searchPanel.text': '',
    'searchPanel.visible': true,
    'searchPanel.placeholder': 'Search...',
    'searchPanel.searchVisibleColumnsOnly': false,
    'searchPanel.width': 160,
  }
}

export const FilterSyncStory: Story = {
  ...SearchCardView,
  args: {
    ...SearchCardView.args,
    dataSource: 'local',
    columns: 'local',
    'searchPanel.highlightCaseSensitive': false,
    'searchPanel.highlightSearchText': true,
    'searchPanel.text': '',
    'searchPanel.visible': true,
    'searchPanel.placeholder': 'Search...',
    'searchPanel.searchVisibleColumnsOnly': false,
    'searchPanel.width': 160,
    'headerFilter.visible': true,
    'paging.pageSize': 6,
    headerFilter: {
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

export const HeaderFilterStory: Story = {
  ...DefaultMode,
  args: {
    ...DefaultMode.args,
    'headerFilter.visible': true,
    headerFilter: {
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
    'selection.mode': 'multiple',
    'selection.showCheckBoxesMode': 'always',
    'selection.allowSelectAll': true,
    'selection.selectAllMode': 'allPages',
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
export const ColumnChooserSelectModeStory: Story = {
  ...DefaultMode,
  name: 'Column chooser \'select\' mode',
  args: {
    ...DefaultMode.args,
    'columnChooser.enabled': true,
    'columnChooser.mode': 'select',
    'columnChooser.title': 'Column chooser',
    'columnChooser.sortOrder': undefined,
    'columnChooser.selection': {
      allowSelectAll: true,
      selectByClick: true,
    },
    'columnChooser.search': {
      enabled: true,
      timeout: 0,
      editorOptions: {
        placeholder: 'search columns',
      }
    },
    'columnChooser.height': 300,
    'columnChooser.width': 250,
  },
}

export const ColumnChooserDragAndDropModeStory: Story = {
  ...DefaultMode,
  name: 'Column chooser \'dragAndDrop\' mode',
  args: {
    ...DefaultMode.args,
    allowColumnReordering: true,
    'columnChooser.enabled': true,
    'columnChooser.mode': 'dragAndDrop',
    'columnChooser.title': 'Column chooser',
    'columnChooser.sortOrder': undefined,
    'columnChooser.search': {
      enabled: true,
      timeout: 0,
      editorOptions: {
        placeholder: 'search columns',
      }
    },
    'columnChooser.height': 300,
    'columnChooser.width': 250,
    'columnChooser.emptyPanelText': 'Drag a column here to hide it',
  }
}

export const AccessibilityStory: Story = {
  ...DefaultMode,
  args: {
    ...DefaultMode.args,

    // Sorting
    'sorting.mode': 'multiple',

    // Selection
    keyExpr: 'id',
    'selection.mode': 'multiple',
    'selection.showCheckBoxesMode': 'always',
    'selection.allowSelectAll': false,

    // Search
    'searchPanel.highlightCaseSensitive': false,
    'searchPanel.highlightSearchText': true,
    'searchPanel.text': '',
    'searchPanel.visible': true,
    'searchPanel.placeholder': 'Search...',
    'searchPanel.searchVisibleColumnsOnly': false,
    'searchPanel.width': 160,

    // HeaderFilter
    'headerFilter.visible': true,
    headerFilter: {
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
    },

    // Editing
    editing: {
      allowAdding: true,
      allowEditing: true,
      allowUpdating: true,
      allowDeleting: true,
      popup: {
        title: 'Employee Info',
        showTitle: true,
      },
    },
  }
}
