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
  const selectedType = header.option('currentView').type;
  const isSelectedViewInViews = views.some((view) => view.type === selectedType);

  return {
    selectedType: isSelectedViewInViews ? selectedType : undefined,
    views,
  };
};

export const getTabViewSwitcher = (header: SchedulerHeader, item): ToolbarItem => {
  const { selectedType, views } = getViewsAndSelectedView(header);

  // @ts-expect-error
  const stylingMode = isFluent() ? 'outlined' : 'contained';
  const items = views.map((view) => ({ ...view }));

  return {
    widget: 'dxButtonGroup',
    locateInMenu: 'auto',
    location: 'after',
    name: 'viewSwitcher',
    cssClass: ClASS.container,
    options: {
      items,
      keyExpr: 'type',
      selectedItemKeys: [selectedType],
      stylingMode,
      buttonTemplate: (buttonData: NormalizedView, buttonContent) => {
        const defaultText = messageLocalization.format(`dxScheduler-switcher${camelize(buttonData.type, true)}`);
        const isCustomName = buttonData.name !== defaultText;
        const text = isCustomName ? buttonData.name : defaultText;

        buttonContent.text(text);
        buttonContent.closest('.dx-button').addClass('dx-button-has-text');

        return buttonContent;
      },
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
  const { selectedType, views } = getViewsAndSelectedView(header);
  const isOnlyOneView = isOneView(views, selectedType);

  const items = views.map((view) => ({ ...view }));

  return {
    widget: 'dxDropDownButton',
    locateInMenu: 'never',
    location: 'after',
    name: 'viewSwitcher',
    cssClass: ClASS.container,
    options: {
      items,
      useSelectMode: true,
      keyExpr: 'type',
      selectedItemKey: selectedType,
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
