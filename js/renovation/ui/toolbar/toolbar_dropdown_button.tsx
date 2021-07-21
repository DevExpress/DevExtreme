// TODO: it is not a 'native' way
import { ComponentBindings, Event, OneWay } from '@devextreme-generator/declarations';
import { CollectionWidgetItem } from './toolbar_props';

// eslint-disable-next-line import/named
import { ItemClickEvent, SelectionChangedEvent } from '../../../ui/button_group';
// eslint-disable-next-line import/named
import { ButtonClickEvent } from '../../../ui/drop_down_button';
import { ToolbarButtonStylingMode } from './toolbar_button_props';

// TODO: it is not a 'native' way
@ComponentBindings()
export class ToolbarDropDownButtonItemProps extends CollectionWidgetItem {
  @OneWay()
  badge?: string;

  @OneWay()
  icon?: string;

  @OneWay()
  key?: string;

  @OneWay()
  showChevron?: boolean;

  @Event()
  onClick?: (() => void);

  // TODO: other props
}

// eslint-disable-next-line
export type ToolbarDropDownButtonItemPropsType = ToolbarDropDownButtonItemProps;

/*
*   const toolbarItems = [
  { widget: 'dxButtonGroup' as ToolbarWidgetType, locateInMenu: 'always' as ToolbarLocateInMenuType,
      options: {
        onItemClick: (e) => {alert(e)},
        items: [
          {
            icon: "alignleft",
            alignment: "left",
            hint: "Align left"
          },
          {
            icon: "aligncenter",
            alignment: "center",
            hint: "Center"
          },
          {
            icon: "alignright",
            alignment: "right",
            hint: "Align right"
          },
          {
            icon: "alignjustify",
            alignment: "justify",
            hint: "Justify"
          }
        ],
        keyExpr: "alignment",
        stylingMode: "text" as ToolbarButtonStylingMode,
        selectedItemKeys: ["left"]
      }
    }
  ];
* <Toolbar items={toolbarItems}></Toolbar>
*/
@ComponentBindings()
export class ToolbarDropDownButtonProps {
  @OneWay()
  dataSource?: (string | ToolbarDropDownButtonItemPropsType)[];

  @OneWay()
  items?: (string | ToolbarDropDownButtonItemPropsType)[];

  @OneWay()
  displayExpr?: string;

  @OneWay()
  // eslint-disable-next-line
  dropDownOptions?: any;

  @OneWay()
  icon?: string;

  @OneWay()
  keyExpr?: string;

  @OneWay()
  noDataText?: string;

  @OneWay()
  onButtonClick?: ((e: ButtonClickEvent) => void) | string;

  @OneWay()
  onItemClick?: ((e: ItemClickEvent) => void) | string;

  @OneWay()
  onSelectionChanged?: ((e: SelectionChangedEvent) => void) | string;

  @OneWay()
  opened?: boolean;

  @OneWay()
  // eslint-disable-next-line
  selectedItem?: string | number | any;

  @OneWay()
  selectedItemKey?: string | number;

  @OneWay()
  showArrowIcon?: boolean;

  @OneWay()
  splitButton?: boolean;

  @OneWay()
  stylingMode?: ToolbarButtonStylingMode;

  @OneWay()
  text?: string;

  @OneWay()
  useSelectMode?: boolean;

  @OneWay()
  wrapItemText?: boolean;
}
