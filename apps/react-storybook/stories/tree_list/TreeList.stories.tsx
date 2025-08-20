import type { Meta, StoryObj } from "@storybook/react";

import dxTreeList from 'devextreme/ui/tree_list';
import { wrapDxWithReact } from '../utils';
import { TREE_LIST_DATA } from './data';

const TreeList = wrapDxWithReact(dxTreeList);

const firstCellTypes = ['default', 'multi-line'] as const;
type FirstCellType = typeof firstCellTypes[number];

const fixedType = ['none', 'left', 'right'] as const;
type FixedType = typeof fixedType[number];

const editingModes = ['none', 'batch' ,'cell' ,'row' ,'form' ,'popup'];
type EditingMode = typeof editingModes[number];

interface HumanReadableProps {
  showSelectCheckboxes: boolean;
  showRowLines: boolean;
  rtlEnabled: boolean;
  editingMode: EditingMode;
  firstColumnContentType: FirstCellType;
  firstColumnFixed: FixedType;
}

const DEFAULT_PROPS = {
  dataSource: TREE_LIST_DATA,
  rootValue: -1,
  keyExpr: 'ID',
  parentIdExpr: 'Head_ID',
  expandedRowKeys: [1],
  columns: [
    {
      dataField: 'Full_Name',
      width: 250,
    },
    'Title',
    'City',
    'State',
    'Email',
    'Skype',
    'Mobile_Phone',
    'Birth_Date',
    'Hire_Date',
  ],
  allowColumnResizing: true,
  allowColumnReordering: true,
  columnAutoWidth: true,
  scrolling: {
    mode: 'standard'
  },
  showBorders: true,
  height: '75vh'
}

const MULTI_LINE_CELL_TEMPLATE = () => {
  const container = document.createElement('div');

  container.innerText = 'Long text that should wrap into multiple lines. This is a test to ensure that the text wraps correctly within the cell of the TreeList component.';
  container.style.whiteSpace = 'break-spaces';

  return container;
}


const mergeProps = (
  humanReadableProps: HumanReadableProps,
  defaultProps: Record<PropertyKey, any>,
): Record<PropertyKey, any> => {
  const result = { ...defaultProps };
  const {
    showSelectCheckboxes,
    firstColumnContentType,
    showRowLines,
    rtlEnabled,
    firstColumnFixed,
    editingMode,
  } = humanReadableProps;

  result.selection = { mode: showSelectCheckboxes ? 'multiple' : 'none' };

  result.columns[0] = {
    ...result.columns[0],
    cellTemplate: firstColumnContentType === 'multi-line' ? MULTI_LINE_CELL_TEMPLATE : undefined,
    fixed: firstColumnFixed !== 'none',
    fixedPosition: firstColumnFixed === 'left' ? 'left' : 'right',
  }

  result.showRowLines = showRowLines;
  result.rtlEnabled = rtlEnabled;

  result.editing = editingMode === 'none'
    ? {}
    : {
      mode: editingMode,
      allowUpdating: true,
      allowDeleting: true,
      allowAdding: true,
    };

  return result;
}

const TreeListWrapper = (
  humanReadableProps: HumanReadableProps,
) => {
  const props = mergeProps(humanReadableProps, DEFAULT_PROPS);
  return TreeList(props);
}

const meta: Meta<typeof TreeList> = {
  title: "Grids/TreeList",
  component: TreeListWrapper,
  argTypes: {
    showSelectCheckboxes: {
      control: 'boolean',
    },
    showRowLines: {
      control: 'boolean',
    },
    rtlEnabled: {
      control: 'boolean',
    },
    editingMode: {
      control: 'select',
      options: editingModes,
    },
    firstColumnContentType: {
      control: 'select',
      options: firstCellTypes,
    },
    firstColumnFixed: {
      control: 'select',
      options: fixedType
    }
  },
};

export default meta;

type Story = StoryObj<typeof TreeList>;

export const Overview: Story = {
  args: {
    showSelectCheckboxes: false,
    showRowLines: false,
    rtlEnabled: false,
    editingMode: 'none',
    firstColumnContentType: 'default',
    firstColumnFixed: 'none',
  },
};
