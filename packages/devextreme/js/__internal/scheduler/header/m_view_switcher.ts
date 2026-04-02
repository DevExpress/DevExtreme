import { current, isFluent } from '@js/ui/themes';
import type { Item as ToolbarItem } from '@js/ui/toolbar';

import type { NormalizedView } from '../utils/options/types';
import type { SchedulerHeader } from './m_header';
import {
  formatViews,
  getViewName,
} from './m_utils';

const ClASS = {
  container: 'dx-scheduler-view-switcher',
  dropDownButton: 'dx-scheduler-view-switcher-dropdown-button',
  dropDownButtonContent: 'dx-scheduler-view-switcher-dropdown-button-content',
};

const getViewsAndSelectedView = (header: SchedulerHeader):
{
  selectedView: string | undefined;
  views: NormalizedView[];
} => {
  const { views, currentView } = header.option();
  const formattedViews = formatViews(views);
  const selectedView = getViewName(currentView);
  const isSelectedViewInViews = formattedViews.some((view) => view.name === selectedView);

  return {
    selectedView: isSelectedViewInViews ? selectedView : undefined,
    views: formattedViews,
  };
};

const isViewSwitcherVisible = (views: NormalizedView[]): boolean => views.length > 1;

export const getTabViewSwitcher = (
  header: SchedulerHeader,
  item: ToolbarItem,
): ToolbarItem => {
  const { selectedView, views } = getViewsAndSelectedView(header);
  const isVisible = isViewSwitcherVisible(views);

  const stylingMode = isFluent(current()) ? 'outlined' : 'contained';

  return {
    widget: 'dxButtonGroup',
    locateInMenu: 'auto',
    location: 'after',
    name: 'viewSwitcher',
    cssClass: ClASS.container,
    visible: isVisible,
    options: {
      items: views,
      keyExpr: 'name',
      selectedItemKeys: [selectedView],
      stylingMode,
      onItemClick: (e) => {
        header.updateCurrentView(e.itemData);
      },
      onContentReady: (e) => {
        const viewSwitcher = e.component;

        header.addEvent('currentView', (view) => {
          viewSwitcher.option('selectedItemKeys', [getViewName(view as NormalizedView)]);
        });
      },
    },
    ...item,
  } as ToolbarItem;
};

export const getDropDownViewSwitcher = (
  header: SchedulerHeader,
  item: ToolbarItem,
): ToolbarItem => {
  const { selectedView, views } = getViewsAndSelectedView(header);
  const isVisible = isViewSwitcherVisible(views);

  return {
    widget: 'dxDropDownButton',
    locateInMenu: 'never',
    location: 'after',
    name: 'viewSwitcher',
    cssClass: ClASS.container,
    visible: isVisible,
    options: {
      items: views,
      useSelectMode: true,
      keyExpr: 'name',
      selectedItemKey: selectedView,
      displayExpr: 'text',
      showArrowIcon: true,
      elementAttr: {
        class: ClASS.dropDownButton,
      },
      onItemClick: (e) => {
        header.updateCurrentView(e.itemData);
      },
      onContentReady: (e) => {
        const viewSwitcher = e.component;

        header.addEvent('currentView', (view) => {
          viewSwitcher.option('selectedItemKey', getViewName(view as NormalizedView));
        });
      },
      dropDownOptions: {
        width: 'max-content',
        _wrapperClassExternal: ClASS.dropDownButtonContent,
      },
    },
    ...item,
  } as ToolbarItem;
};
