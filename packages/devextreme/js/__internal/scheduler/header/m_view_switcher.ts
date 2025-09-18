import { isFluent } from '@js/ui/themes';
import type { Item as ToolbarItem } from '@js/ui/toolbar';

import type { NormalizedView } from '../utils/options/types';
import type { SchedulerHeader } from './m_header';
import {
  formatViews,
  getViewName,
  isOneView,
} from './m_utils';

const ClASS = {
  container: 'dx-scheduler-view-switcher',
  dropDownButton: 'dx-scheduler-view-switcher-dropdown-button',
  dropDownButtonContent: 'dx-scheduler-view-switcher-dropdown-button-content',
};

const getViewsAndSelectedView = (header: SchedulerHeader) => {
  const views = formatViews(header.option('views'));
  const selectedView = header.option('currentView').name;
  const isSelectedViewInViews = views.some((view) => view.name === selectedView);

  return {
    selectedView: isSelectedViewInViews ? selectedView : undefined,
    views,
  };
};

export const getTabViewSwitcher = (header: SchedulerHeader, item): ToolbarItem => {
  const { selectedView, views } = getViewsAndSelectedView(header);

  // @ts-expect-error
  const stylingMode = isFluent() ? 'outlined' : 'contained';

  return {
    widget: 'dxButtonGroup',
    locateInMenu: 'auto',
    location: 'after',
    name: 'viewSwitcher',
    cssClass: ClASS.container,
    options: {
      items: views,
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
  const isOnlyOneView = isOneView(views, selectedView);

  return {
    widget: 'dxDropDownButton',
    locateInMenu: 'never',
    location: 'after',
    name: 'viewSwitcher',
    cssClass: ClASS.container,
    options: {
      items: views,
      useSelectMode: true,
      keyExpr: 'name',
      selectedItemKey: selectedView,
      displayExpr: 'text',
      showArrowIcon: !isOnlyOneView,
      elementAttr: {
        class: ClASS.dropDownButton,
      },
      onItemClick: (e) => {
        header._updateCurrentView(e.itemData);
      },
      onContentReady: (e) => {
        const viewSwitcher = e.component;

        header._addEvent('currentView', (view: NormalizedView) => {
          const currentViews = header.option('views');

          viewSwitcher.option('showArrowIcon', !isOneView(currentViews, view.name));
          viewSwitcher.option('selectedItemKey', getViewName(view));
        });
      },
      dropDownOptions: {
        onShowing: (e) => {
          if (isOnlyOneView) {
            e.cancel = true;
          }
        },
        width: 'max-content',
        _wrapperClassExternal: ClASS.dropDownButtonContent,
      },
    },
    ...item,
  } as ToolbarItem;
};
