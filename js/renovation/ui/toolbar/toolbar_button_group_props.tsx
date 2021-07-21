/* eslint-disable max-classes-per-file */
import {
  ComponentBindings, OneWay,
} from '@devextreme-generator/declarations';

// eslint-disable-next-line import/named
import { ItemClickEvent, SelectionChangedEvent } from '../../../ui/button_group';
import { CollectionWidgetItem } from './toolbar_props';
import { ToolbarButtonStylingMode, ToolbarButtonType } from './toolbar_button_props';

// TODO: it is not a 'native' way
@ComponentBindings()
export class ToolbarButtonGroupItemProps extends CollectionWidgetItem {
  @OneWay()
  hint?: string;

  @OneWay()
  icon?: string;

  @OneWay()
  type?: ToolbarButtonType;

  // TODO: other props
}

// eslint-disable-next-line
export type ToolbarButtonGroupItemPropsType = ToolbarButtonGroupItemProps;

export type ToolbarButtonGroupSelectionMode = 'multiple' | 'single';

/*
*   const toolbarItems = [
    {
      widget: 'dxDropDownButton' as ToolbarWidgetType,
      locateInMenu: 'always' as ToolbarLocateInMenuType,
      options: {
        items: [null, "#980000", "#ff0000", "#ff9900", "#ffff00", "#00ff00",
          "#00ffff", "#4a86e8", "#0000ff", "#9900ff", "#ff00ff", "#ff3466"],
        icon: "square",
        stylingMode: "text" as ToolbarButtonStylingMode,
        dropDownOptions: { width: "auto" },
      }
    },
  ];
* <Toolbar items={toolbarItems}></Toolbar>
*/
@ComponentBindings()
export class ToolbarButtonGroupProps {
  //
  // Use cases:
  //
  // - in a RenoV component:
  // <Toolbar items={[{ widget: 'dxButton', options: { text: 'my button' } }]} />
  //
  @OneWay()
  items?: (ToolbarButtonGroupItemPropsType)[];

  @OneWay()
  keyExpr?: string;

  @OneWay()
  onItemClick?: ((e: ItemClickEvent) => void);

  @OneWay()
  onSelectionChanged?: ((e: SelectionChangedEvent) => void);

  @OneWay()
  // eslint-disable-next-line
  selectedItemKeys?: (any)[];

  @OneWay()
  // eslint-disable-next-line
  selectedItems?: (any)[];

  @OneWay()
  selectionMode?: ToolbarButtonGroupSelectionMode;

  @OneWay()
  stylingMode?: ToolbarButtonStylingMode;

  // TODO: other props
}
