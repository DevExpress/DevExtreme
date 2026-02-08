import type { Meta, StoryObj } from "@storybook/react-webpack5";

import dxCardView from "devextreme/ui/card_view";
import { wrapDxWithReact } from "../../utils";
import {generatedData} from "../generatedData";
import Button from "devextreme/ui/button";

const CardView = wrapDxWithReact(dxCardView);

interface HumanReadableProps {
  showToolbar: boolean;
  disableToolbar: boolean;
  multilineToolbar: boolean;
  showCustomToolbarButton: boolean;
  showSelectionButtons: boolean;
  showSearch: boolean;
  showColumnChooser: boolean;
  showAddCardButton: boolean;
}

const DEFAULT_PROPS = {
  keyExpr: 'id',
  dataSource: generatedData,
}

const TOOLBAR_CUSTOM_BUTTON_TEMPLATE = () => {
  const button = document.createElement('div');
  new Button(button, {text: 'Custom button', icon: 'edit' });

  return button;
}

const TOOLBAR_CUSTOM_BUTTON_ITEM = {
  location: 'before',
  template: TOOLBAR_CUSTOM_BUTTON_TEMPLATE,
}

const setToolbarProps = (
  props: Record<string, any>,
  humanReadableProps: HumanReadableProps,
): void => {
  const {
    showToolbar,
    disableToolbar,
    multilineToolbar,
    showCustomToolbarButton,
    showSelectionButtons,
    showSearch,
    showColumnChooser,
    showAddCardButton,
  } = humanReadableProps;

  props.toolbar = {
    visible: showToolbar,
    disabled: disableToolbar,
    multiline: multilineToolbar,
    items: null,
  };

  if (showCustomToolbarButton) {
    const customItems: any[] = [];

    showSelectionButtons
      && customItems.push('selectAllButton')
      && customItems.push('clearSelectionButton');
      showAddCardButton && customItems.push('addCardButton');
      showColumnChooser && customItems.push('columnChooserButton');
    showSearch && customItems.push('searchPanel');
    showCustomToolbarButton && customItems.push(TOOLBAR_CUSTOM_BUTTON_ITEM);

    props.toolbar.items = customItems;
  }
}

const mergeProps = (
  humanReadableProps: HumanReadableProps,
  defaultProps: Record<PropertyKey, any>,
): Record<PropertyKey, any> => {
  const result = {...defaultProps};
  const {
    showSelectionButtons,
    showSearch,
    showColumnChooser,
    showAddCardButton,
  } = humanReadableProps;

  setToolbarProps(result, humanReadableProps);

  result.selection = showSelectionButtons
    ? { mode: 'multiple' }
    : undefined;

  result.searchPanel = showSearch
    ? { visible: true }
    : undefined;

  result.columnChooser = showColumnChooser
    ? { enabled: true }
    : undefined;

  result.editing = showAddCardButton
    ? { allowAdding: true }
    : undefined;

  return result;
}

const CardViewHumanReadableWrapper = (
  humanReadableProps: HumanReadableProps,
) => {
  const props = mergeProps(humanReadableProps, DEFAULT_PROPS);
  return CardView(props);
}

const meta: Meta<typeof CardView> = {
  title: "Grids/CardView/Parts",
  component: CardViewHumanReadableWrapper,
  argTypes: {
    showToolbar: {
      control: 'boolean',
    },
    disableToolbar: {
      control: 'boolean',
    },
    multilineToolbar: {
      control: 'boolean',
    },
    // TODO Toolbar: Custom items bug -> uncomment after fix
    showCustomToolbarButton: {
      control: 'boolean',
    },
    showSelectionButtons: {
      control: 'boolean',
    },
    showSearch: {
      control: 'boolean',
    },
    showColumnChooser: {
      control: 'boolean',
    },
    showAddCardButton: {
      control: 'boolean',
    }
  }
};

export default meta;

type Story = StoryObj<typeof CardView>;

export const Toolbar: Story = {
  args: {
    showToolbar: true,
    disableToolbar: false,
    multilineToolbar: false,
    showCustomToolbarButton: false,
    showSelectionButtons: true,
    showSearch: true,
    showColumnChooser: false,
    showAddCardButton: true,
  }
}

