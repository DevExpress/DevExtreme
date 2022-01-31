import { ItemView } from './types';
import { ToolbarItem } from '../../toolbar/toolbar_props';
import { isOneView } from '../../../../ui/scheduler/header/utils';

const VIEW_SWITCHER_CLASS = 'dx-scheduler-view-switcher';
const VIEW_SWITCHER_DROP_DOWN_BUTTON_CLASS = 'dx-scheduler-view-switcher-dropdown-button';
const VIEW_SWITCHER_DROP_DOWN_BUTTON_CONTENT_CLASS = 'dx-scheduler-view-switcher-dropdown-button-content';

export const getViewSwitcher = (
  item: ToolbarItem,
  selectedView: string,
  views: ItemView[],
  setCurrentView: (view: ItemView) => void,
): ToolbarItem => ({
  widget: 'dxButtonGroup',
  locateInMenu: 'auto',
  cssClass: VIEW_SWITCHER_CLASS,
  options: {
    items: views,
    keyExpr: 'name',
    selectedItemKeys: [selectedView],
    stylingMode: 'contained',
    onItemClick: (e) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      setCurrentView(e.itemData);
    },
  },
  ...item,
} as ToolbarItem);

export const getDropDownViewSwitcher = (
  item: ToolbarItem,
  selectedView: string,
  views: ItemView[],
  setCurrentView: (view: ItemView) => void,
): ToolbarItem => {
  const oneView = isOneView(views, selectedView);

  return {
    widget: 'dxDropDownButton',
    locateInMenu: 'never',
    cssClass: VIEW_SWITCHER_CLASS,
    options: {
      items: views,
      useSelectMode: true,
      keyExpr: 'name',
      selectedItemKey: selectedView,
      displayExpr: 'text',
      showArrowIcon: !oneView,
      elementAttr: {
        class: VIEW_SWITCHER_DROP_DOWN_BUTTON_CLASS,
      },
      onItemClick: (e) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        setCurrentView(e.itemData);
      },
      dropDownOptions: {
        onShowing: (e) => {
          if (oneView) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            e.cancel = true;
          }
        },
        width: 'max-content',
        wrapperAttr: {
          class: VIEW_SWITCHER_DROP_DOWN_BUTTON_CONTENT_CLASS,
        },
      },
    },
    ...item,
  } as ToolbarItem;
};
