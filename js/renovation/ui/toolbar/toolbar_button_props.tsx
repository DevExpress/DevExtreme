// TODO: it is not a 'native' way
import { ComponentBindings, Event, OneWay } from '@devextreme-generator/declarations';

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
export class ToolbarButtonProps {
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
