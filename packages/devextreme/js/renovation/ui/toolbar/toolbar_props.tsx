/* eslint-disable max-classes-per-file */

import {
  ComponentBindings, OneWay, Event,
} from '@devextreme-generator/declarations';

import { BaseWidgetProps } from '../common/base_props';

// eslint-disable-next-line import/named
import { ItemClickEvent, SelectionChangedEvent } from '../../../ui/button_group';

// eslint-disable-next-line import/named
import { ButtonClickEvent } from '../../../ui/drop_down_button';
import { EventCallback } from '../common/event_callback';

@ComponentBindings()
export class CollectionWidgetItem {
  // js\ui\collection\ui.collection_widget.base.d.ts - export interface CollectionWidgetItem {

  //
  // Use cases:
  //
  // - in a RenoV component:
  // <Toolbar items={[{ text: 'item2' }]} />
  //
  // - react (for demo purposes only, will be available in future releases):
  // <Toolbar> <Item>text2</Item> </Toolbar>
  //
  // - TODO: prepare jquery, angular, vue code samples
  //
  @OneWay()
  text?: string;

  //
  // Use cases:
  //
  // - in a RenoV component:
  // <Toolbar items={[{ text: 'text4', disabled: true }]} />
  //
  // - react (for demo purposes only, will be available in future releases):
  // <Toolbar> <Item disabled>your markup</Item> </Toolbar>
  //
  // - TODO: prepare jquery, angular, vue code samples
  //
  @OneWay()
  disabled?: boolean;

  //
  // Use cases:
  //
  // - in a RenoV component:
  // <Toolbar items={[{ html: '<h1>text3<h1>' }]} />
  //
  // - react (for demo purposes only, will be available in future releases):
  // <Toolbar> <Item><h1>text3<h1></Item> </Toolbar>
  //
  // - TODO: prepare jquery, angular, vue code samples
  //
  @OneWay()
  html?: string;

  //
  // Use cases:
  //
  // - in a RenoV component:
  // <Toolbar items={[{ text: 'text5', visible: false }]} />
  //
  // - react (for demo purposes only, will be available in future releases):
  // <Toolbar> <Item visible={false}>your markup</Item> </Toolbar>
  //
  // - TODO: prepare jquery, angular, vue code samples
  //
  @OneWay()
  visible?: boolean;

  //
  // Use cases:
  //
  // - in a RenoV component (doesn't look as 'native'):
  // <Toolbar items={[{ text: 'text5', template: ???? }]} /> - how to use it?
  //
  // - react (for demo purposes only, will be available in future releases):
  // <Toolbar> <Item>put here your markup</Item> </Toolbar>
  //
  // - TODO: prepare jquery, angular, vue code samples
  //
  // @OneWay()
  // template?:
  // | template;
  // | ((
  //   itemData: any, // eslint-disable-line @typescript-eslint/no-explicit-any
  //   itemIndex: number,
  //   itemElement: DxElement
  // ) => string | UserDefinedElement);
}

/*
  const toolbarItems = [
    { widget: 'dxTextBox' as ToolbarWidgetType, locateInMenu: 'never' as ToolbarLocateInMenuType,
      options: {
        value: '123',
        onValueChanged: (e) => { alert(e); }
      }
    },
  ];
  <Toolbar items={toolbarItems}></Toolbar>
*/
@ComponentBindings()
export class BaseToolbarItemProps {
  @OneWay()
  rtlEnabled?: boolean | undefined;
}

// TODO: it is not a 'native' way
@ComponentBindings()
export class ToolbarTextBoxProps extends BaseToolbarItemProps {
  @OneWay() value: (string | null) = '';

  // TODO:  EventCallback<TextBoxValueChanged>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Event() onValueChanged?: EventCallback<any>;

  // TODO: other props
}

/*
  const toolbarItems = [
      { widget: 'dxCheckBox' as ToolbarWidgetType, locateInMenu: 'never' as ToolbarLocateInMenuType,
        options: {
          value: true,
          //onValueChanged: (e) => { alert(e); }
        }
      },
  ];
  <Toolbar items={toolbarItems}></Toolbar>
*/
// TODO: it is not a 'native' way
@ComponentBindings()
export class ToolbarCheckBoxProps extends BaseToolbarItemProps {
  @OneWay() value: (boolean | null) = false;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Event() onValueChanged?: EventCallback<any>;

  // TODO: other props
}

export type ToolbarWidgetType = 'dxButton' | 'dxCheckBox' | 'dxTextBox' | 'dxButtonGroup' | 'dxDropDownButton';

export type ToolbarShowTextType = 'always' | 'inMenu';

export type ToolbarLocateInMenuType = 'always' | 'auto' | 'never';

export type ToolbarLocationType = 'after' | 'before' | 'center';

export interface CollectionItemType {
  text?: string;

  disabled?: boolean;

  html?: string;

  visible?: boolean;
}

export interface ToolbarButtonGroupItemPropsType extends CollectionItemType {
  hint?: string;

  icon?: string;

  type?: ToolbarButtonType;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  elementAttr?: { [key: string]: any };
}

export type ToolbarButtonGroupSelectionMode = 'multiple' | 'single';

/*
*   const toolbarItems = [
    {
      widget: 'dxDropDownButton' as ToolbarWidgetType,
      locateInMenu: 'always' as ToolbarLocateInMenuType,
      options: {
        onItemClick: () => { alert(2) },
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
export class ToolbarButtonGroupProps extends BaseToolbarItemProps {
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

export type ToolbarButtonStylingMode = 'text' | 'outlined' | 'contained';
export type ToolbarButtonType = 'back' | 'danger' | 'default' | 'normal' | 'success';

/*
*   const toolbarItems = [
    { widget: 'dxButton' as ToolbarWidgetType, locateInMenu: 'always' as ToolbarLocateInMenuType,
      options: {
        type: 'back' as ToolbarButtonType,
        onClick: () => { alert(1) }
      }
    },
  ];
* <Toolbar items={toolbarItems}></Toolbar>
*/
@ComponentBindings()
export class ToolbarButtonProps extends BaseToolbarItemProps {
  //
  // Use cases:
  //
  // - in a RenoV component:
  // <Toolbar items={[{ widget: 'dxButton', options: { text: 'my button' } }]} />
  //
  @OneWay()
  text?: string;

  //
  // Use cases:
  //
  // - in a RenoV component:
  // <Toolbar items={[{ widget: 'dxButton', options: { type: 'danger' } }]} />
  //
  @OneWay()
  type?: ToolbarButtonType;

  //
  // Use cases:
  //
  // - in a RenoV component:
  // <Toolbar items={[
  //   { widget: 'dxButton', options: { text: 'my button', onClick: () => console.log('hi') } }
  // ]} />
  //
  // TODO: EventCallback<ButtonClick>
  // Looks like js\renovation\ui\button.tsx:
  // onClick?: (e: { event: Event; validationGroup?: string }) => void;
  //
  @Event() onClick?: (() => void);

  @OneWay()
  stylingMode?: ToolbarButtonStylingMode;

  // TODO: other props
}

// TODO: it is not a 'native' way
@ComponentBindings()
export class ToolbarDropDownButtonItemProps extends CollectionWidgetItem {
  @OneWay()
  badge?: string;

  @OneWay()
  icon?: string;

  // @OneWay()
  // TODO: suppress ComponentBindings has property with reserved name: key
  // key?: string;

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
            hint: "Align left",
            elementAttr: {
              foo1: 'attr1',
              class: 'some-class123'
            }
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
export class ToolbarDropDownButtonProps extends BaseToolbarItemProps {
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

@ComponentBindings()
export class ToolbarItem extends CollectionWidgetItem {
  // js\ui\toolbar.d.ts - export interface dxToolbarItem extends CollectionWidgetItem {

  //
  // Use cases:
  //
  // - in a RenoV component:
  // <Toolbar items={[{ cssClass: 'my_class' }]} />
  //
  // - react (for demo purposes only, will be available in future releases):
  // <Toolbar> <Item cssClass={'my_class'}>your markup</Item> </Toolbar>
  //
  // - TODO: prepare jquery, angular, vue code samples
  //
  @OneWay()
  cssClass?: string;

  //
  // Use cases:
  //
  // - in a RenoV component:
  // <Toolbar items={[{ text: 'text2', locateInMenu: 'always' }]} />
  //
  // - react (for demo purposes only, will be available in future releases):
  // <Toolbar> <Item locateInMenu={'always'}>your markup</Item> </Toolbar>
  //
  // - TODO: prepare jquery, angular, vue code samples
  //
  @OneWay()
  locateInMenu?: ToolbarLocateInMenuType;

  //
  // Use cases:
  //
  // - in a RenoV component:
  // <Toolbar items={[{ text: 'text4', location: 'before' }]} />
  //
  // - react (for demo purposes only, will be available in future releases):
  // <Toolbar> <Item location={'before'}>your markup</Item> </Toolbar>
  //
  // - TODO: prepare jquery, angular, vue code samples
  //
  @OneWay()
  location?: ToolbarLocationType;

  //
  // Use cases:
  //
  // - in a RenoV component (doesn't look as 'native'):
  // <Toolbar items={[{ widget: 'dxButton' as ToolbarWidgetType }]} />
  // TODO:
  // - Error if used in TestComponent in playground\react with dxAutocomplete | dxDateBox |
  //   dxMenu | dxSelectBox | dxTabs | dxButtonGroup | dxDropDownButton:
  //   TypeError: (0 , _renderer.default)(...)[component] is not a function
  //
  // - react (for demo purposes only, will be available in future releases):
  // <Toolbar> <Item><Button text="My Button" /></Item> </Toolbar>
  //
  // - TODO: prepare jquery, angular, vue code samples
  //
  @OneWay()
  widget?: ToolbarWidgetType;

  // Use cases:
  //
  // - in a RenoV component:
  // <Toolbar items={[{ widget: 'dxButton', options: { text: 'my button' } }]} />
  //
  // TODO: any
  // TODO: ToolbarTextBoxProps | ToolbarCheckBoxProps - errors in Angular
  // see https://github.com/DevExpress/devextreme-renovation/issues/724
  //
  // - react (for demo purposes only, will be available in future releases):
  // <Toolbar> <Item><Button text="My Button" /></Item> </Toolbar>
  //
  // - TODO: prepare jquery, angular, vue code samples
  //
  @OneWay()
  options?: (ToolbarButtonProps
  | ToolbarButtonGroupProps | ToolbarDropDownButtonProps
  | ToolbarTextBoxProps | ToolbarCheckBoxProps);

  //
  // Use cases:
  //
  // - in a RenoV component:
  // <Toolbar items={[{ text: 'text4', showText: 'inMenu' as ToolbarShowTextType }]} />
  //
  // - react (for demo purposes only, will be available in future releases):
  // <Toolbar> <Item><Button text={itemInMenu ? "My Button" : ""} /></Item> </Toolbar>
  //
  // - TODO: prepare jquery, angular, vue code samples
  //
  @OneWay()
  showText?: ToolbarShowTextType;

  /*
  TODO:
  menuItemTemplate?: template | (() => string | UserDefinedElement);
  */
}

// eslint-disable-next-line @typescript-eslint/no-type-alias
export type ToolbarItemType = ToolbarItem;

@ComponentBindings()
export class ToolbarProps extends BaseWidgetProps { // js\ui\toolbar.d.ts
  //
  // Use cases:
  //
  // - in a RenoV component (doesn't look as 'native'):
  // <Toolbar items={["text1"]}></Toolbar>
  // <Toolbar items={[{ text: 'item2' }]} />
  //
  // - react (for demo purposes only, will be available in future releases):
  // <Toolbar> <Item text={"text2"}/> </Toolbar>
  // <Toolbar>
  //   { myObjects.foreach(obj => { return (<Item text={ obj.text }/>); }) }
  // </Toolbar>
  //
  // - TODO: prepare jquery, angular, vue code samples
  //
  @OneWay() items?: (string | ToolbarItemType)[]; // TODO: any

  // TODO: write to us if you need this property
  // dataSource?: string | Array<string | dxToolbarItem | any> |
  // Store | DataSource | DataSourceOptions;
  // @OneWay() dataSource?:
  // | string - TODO: ds = 'a' - no DOM
  // | string[] - TODO: ds = ['a', 'b'] - no DOM
  // | ToolbarItemType[] - TODO: ds = [{ widget: 'dxButton', options: { text: '1'} }] - no DOM
  // | any[]
  // | Store - TODO: const ds = new DataSource(new ArrayStore({ data: ['a', 'b'] })); - no DOM
  // | DataSource
  // | DataSourceOptions;

  /*
    TODO

    itemTemplate?: template;

    menuItemTemplate?: template |
      ((itemData: any, itemIndex: number, itemElement: DxElement) => string | UserDefinedElement);

    CollectionWidgetOptions<dxToolbar> members

  */
}
