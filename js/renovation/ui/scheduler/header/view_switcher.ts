import {
  ToolbarItem,
} from '../../toolbar/toolbar_props';
import { ItemView } from './types';

const VIEW_SWITCHER_CLASS = 'dx-scheduler-view-switcher';
const VIEW_SWITCHER_DROP_DOWN_BUTTON_CLASS = 'dx-scheduler-view-switcher-dropdown-button';

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
      setCurrentView(e.itemData.view);
    },
  },
  ...item,
} as ToolbarItem);

export const getDropDownViewSwitcher = (
  item: ToolbarItem,
  selectedView: string,
  views: ItemView[],
  setCurrentView: (view: ItemView) => void,
): ToolbarItem => ({
  widget: 'dxDropDownButton',
  locateInMenu: 'never',
  cssClass: VIEW_SWITCHER_CLASS,
  options: {
    items: views,
    useSelectMode: true,
    keyExpr: 'name',
    selectedItemKey: selectedView,
    displayExpr: 'text',
    elementAttr: {
      class: VIEW_SWITCHER_DROP_DOWN_BUTTON_CLASS,
    },
    onItemClick: (e) => {
      setCurrentView(e.itemData.view);
    },
  },
  ...item,
} as ToolbarItem);
