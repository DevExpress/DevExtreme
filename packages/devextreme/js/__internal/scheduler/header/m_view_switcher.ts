import { isFluent } from '@js/ui/themes';
import type { Item as ToolbarItem } from '@js/ui/toolbar';

import type { NormalizedView } from '../utils/options/types';
import { getViewDisplayName } from '../utils/options/utils';
import type { SchedulerHeader } from './m_header';
import {
  getViewName,
  isOneView,
} from './m_utils';

const ClASS = {
  container: 'dx-scheduler-view-switcher',
  dropDownButton: 'dx-scheduler-view-switcher-dropdown-button',
  dropDownButtonContent: 'dx-scheduler-view-switcher-dropdown-button-content',
};

const getViewsAndSelectedView = (header: SchedulerHeader): {
  selectedView: string | undefined;
  views: NormalizedView[];
} => {
  const views = header.option('views');
  const currentView = header.option('currentView');
  const selectedView = getViewName(currentView);
  const isSelectedViewInViews = views.some((view) => {
    const viewName = getViewName(view);
    return viewName === selectedView;
  });

  return {
    selectedView: isSelectedViewInViews ? selectedView : undefined,
    views,
  };
};

export const getTabViewSwitcher = (
  header: SchedulerHeader,
  item: ToolbarItem,
): ToolbarItem => {
  const { selectedView, views } = getViewsAndSelectedView(header);

  // @ts-expect-error
  const stylingMode = isFluent() ? 'outlined' : 'contained';
  const items = views.map((view) => ({
    ...view,
    text: getViewDisplayName(view),
  }));

  return {
    widget: 'dxButtonGroup',
    locateInMenu: 'auto',
    location: 'after',
    cssClass: ClASS.container,
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
          const viewName = getViewName(view);
          viewSwitcher.option('selectedItemKeys', [viewName]);
        });
      },
    },
    ...item,
  };
};

export const getDropDownViewSwitcher = (
  header: SchedulerHeader,
  item: ToolbarItem,
): ToolbarItem => {
  const { selectedView, views } = getViewsAndSelectedView(header);
  const currentView = header.option('currentView');
  const isOnlyOneView = isOneView(views, currentView);

  const items = views.map((view) => ({
    ...view,
    text: getViewDisplayName(view),
  }));

  return {
    widget: 'dxDropDownButton',
    locateInMenu: 'never',
    location: 'after',
    cssClass: ClASS.container,
    options: {
      items,
      useSelectMode: true,
      keyExpr: 'name',
      selectedItemKey: selectedView,
      displayExpr: (viewItem: NormalizedView | null) => {
        if (!viewItem) return '';
        return getViewDisplayName(viewItem);
      },
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
          const viewName = getViewName(view);

          viewSwitcher.option('showArrowIcon', !isOneView(currentViews, view));
          viewSwitcher.option('selectedItemKey', viewName);
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
  };
};
