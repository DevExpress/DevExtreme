import { isFluent } from '@js/ui/themes';
import type { Item as ToolbarItem } from '@js/ui/toolbar';

import type { NormalizedView } from '../utils/options/types';
import type { SchedulerHeader } from './m_header';
import {
  getViewName,
} from './m_utils';

const ClASS = {
  container: 'dx-scheduler-view-switcher',
  dropDownButton: 'dx-scheduler-view-switcher-dropdown-button',
  dropDownButtonContent: 'dx-scheduler-view-switcher-dropdown-button-content',
};

const getViewsAndSelectedView = (header: SchedulerHeader) => {
  const views = header.option('views');
  const selectedView = header.option('currentView').name;
  const isSelectedViewInViews = views.some((view) => view.name === selectedView);

  return {
    selectedView: isSelectedViewInViews ? selectedView : undefined,
    views,
  };
};

const isViewSwitcherVisible = (views: NormalizedView[]): boolean => views.length > 1;

export const getTabViewSwitcher = (header: SchedulerHeader, item): ToolbarItem => {
  const { selectedView, views } = getViewsAndSelectedView(header);
  const isVisible = isViewSwitcherVisible(views);

  // @ts-expect-error
  const stylingMode = isFluent() ? 'outlined' : 'contained';
  const items = views.map((view) => ({ ...view, text: view.name }));

  return {
    widget: 'dxButtonGroup',
    locateInMenu: 'auto',
    location: 'after',
    name: 'viewSwitcher',
    cssClass: ClASS.container,
    visible: isVisible,
    options: {
      items,
      keyExpr: 'name',
      selectedItemKeys: [selectedView],
      stylingMode,
      onItemClick: (e) => {
        header._updateCurrentView(e.itemData);
      },
      onContentReady: (e) => {
        const viewSwitcher = e.component;

        header._addEvent('currentView', (view) => {
          viewSwitcher.option('selectedItemKeys', [getViewName(view)]);
        });
      },
    },
    ...item,
  } as ToolbarItem;
};

export const getDropDownViewSwitcher = (header: SchedulerHeader, item): ToolbarItem => {
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
      displayExpr: 'name',
      showArrowIcon: true,
      elementAttr: {
        class: ClASS.dropDownButton,
      },
      onItemClick: (e) => {
        header._updateCurrentView(e.itemData);
      },
      onContentReady: (e) => {
        const viewSwitcher = e.component;

        header._addEvent('currentView', (view: NormalizedView) => {
          viewSwitcher.option('selectedItemKey', getViewName(view));
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
