import messageLocalization from '@js/common/core/localization/message';
import { camelize } from '@js/core/utils/inflector';
import { isFluent } from '@js/ui/themes';
import type { Item as ToolbarItem } from '@js/ui/toolbar';

import type { NormalizedView } from '../utils/options/types';
import type { SchedulerHeader } from './m_header';
import {
  isOneView,
} from './m_utils';

const ClASS = {
  container: 'dx-scheduler-view-switcher',
  dropDownButton: 'dx-scheduler-view-switcher-dropdown-button',
  dropDownButtonContent: 'dx-scheduler-view-switcher-dropdown-button-content',
};

const getViewsAndSelectedView = (header: SchedulerHeader) => {
  const views = header.option('views');
  const currentView = header.option('currentView');
  const selectedView = typeof currentView === 'string' ? currentView : currentView.name;
  const isSelectedViewInViews = views.some((view) => {
    const viewName = typeof view === 'string' ? view : view.name;
    return viewName === selectedView;
  });

  return {
    selectedView: isSelectedViewInViews ? selectedView : undefined,
    views,
  };
};

export const getTabViewSwitcher = (header: SchedulerHeader, item): ToolbarItem => {
  const { selectedView, views } = getViewsAndSelectedView(header);

  // @ts-expect-error
  const stylingMode = isFluent() ? 'outlined' : 'contained';
  const items = views.map((v) => {
    const def = messageLocalization.format(`dxScheduler-switcher${camelize(v.type, true)}`);
    const text = v.name && v.name !== def ? v.name : def;
    return { ...v, text, name: v.name };
  });

  return {
    widget: 'dxButtonGroup',
    locateInMenu: 'auto',
    location: 'after',
    name: 'viewSwitcher',
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
          const viewName = typeof view === 'string' ? view : view.name;
          viewSwitcher.option('selectedItemKeys', [viewName]);
        });
      },
    },
    ...item,
  };
};

export const getDropDownViewSwitcher = (header: SchedulerHeader, item): ToolbarItem => {
  const { selectedView, views } = getViewsAndSelectedView(header);
  const currentView = header.option('currentView');
  const selectedType = typeof currentView === 'string' ? currentView : currentView.type;
  const isOnlyOneView = isOneView(views, selectedType);

  const items = views.map((v) => {
    const def = messageLocalization.format(`dxScheduler-switcher${camelize(v.type, true)}`);
    const text = v.name && v.name !== def ? v.name : def;
    return { ...v, text, name: v.name };
  });

  return {
    widget: 'dxDropDownButton',
    locateInMenu: 'never',
    location: 'after',
    name: 'viewSwitcher',
    cssClass: ClASS.container,
    options: {
      items,
      useSelectMode: true,
      keyExpr: 'name',
      selectedItemKey: selectedView,
      displayExpr: (item: NormalizedView | null) => {
        if (!item) return '';
        const defaultText = messageLocalization.format(`dxScheduler-switcher${camelize(item.type, true)}`);
        const isCustomName = item.name !== defaultText;
        return isCustomName ? item.name : defaultText;
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
          const viewName = typeof view === 'string' ? view : view.name;

          viewSwitcher.option('showArrowIcon', !isOneView(currentViews, viewName));
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
