import messageLocalization from '@js/common/core/localization/message';
import { isFluent } from '@js/ui/themes';
import type { Item as ToolbarItem } from '@js/ui/toolbar';
import { camelize } from '@ts/core/utils/m_inflector';

import type { NormalizedView } from '../utils/options/types';
import type { SchedulerHeader } from './m_header';
import { isOneView } from './m_utils';

const ClASS = {
  container: 'dx-scheduler-view-switcher',
  dropDownButton: 'dx-scheduler-view-switcher-dropdown-button',
  dropDownButtonContent: 'dx-scheduler-view-switcher-dropdown-button-content',
};

const viewDisplayExpr = (item: { type: string }) => messageLocalization.format(`dxScheduler-switcher${camelize(item.type, true)}`);

const getViewsAndSelectedView = (header: SchedulerHeader) => {
  const views = header.option('views');
  const selectedView = header.option('currentView').type;
  const isSelectedViewInViews = views.some((view) => view.type === selectedView);

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
      keyExpr: 'type',
      displayExpr: viewDisplayExpr,
      selectedItemKeys: [selectedView],
      stylingMode,
      onItemClick: (e) => {
        header._updateCurrentView(e.itemData);
      },
      onContentReady: (e) => {
        const viewSwitcher = e.component;

        header._addEvent('currentView', (view) => {
          viewSwitcher.option('selectedItemKeys', [view.type]);
        });
      },
    },
    ...item,
  };
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
      keyExpr: 'type',
      selectedItemKey: selectedView,
      displayExpr: viewDisplayExpr,
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
          viewSwitcher.option('showArrowIcon', !isOneView(currentViews, view.type));
          viewSwitcher.option('selectedItemKey', view.type);
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
