import browser from '@js/core/utils/browser';
import { isMaterialBased } from '@js/ui/themes';
import type { WidgetOptions } from '@js/ui/widget/ui.widget';

import * as columnChooser from './column_chooser/index';
import * as columnsController from './columns_controller/index';
import * as contentView from './content_view/index';
import * as dataController from './data_controller/index';
import * as editing from './editing/index';
import * as filterSync from './filtering/filter_sync/index';
import * as headerFilter from './filtering/header_filter/index';
import * as filterController from './filtering/index';
import { filterPanel } from './filtering/index';
import * as keyboardNavigation from './keyboard_navigation/index';
import * as pager from './pager/index';
import * as searchPanel from './search/index';
import * as selection from './selection/index';
import * as sortingController from './sorting_controller/index';
import * as toolbar from './toolbar/index';
import type { GridCoreNew } from './widget';

/**
 * @interface
 */
export type Options = & WidgetOptions<GridCoreNew>
  & dataController.Options
  & sortingController.Options
  & pager.Options
  & columnsController.Options
  & filterController.Options
  & filterPanel.Options
  & headerFilter.Options
  & filterSync.Options
  & contentView.Options
  & searchPanel.Options
  & selection.Options
  & columnChooser.Options
  & editing.Options
  & toolbar.Options
  & keyboardNavigation.Options;

export const defaultOptions = {
  ...dataController.defaultOptions,
  ...sortingController.defaultOptions,
  ...columnsController.defaultOptions,
  ...pager.defaultOptions,
  ...filterPanel.defaultOptions,
  ...filterController.defaultOptions,
  ...headerFilter.defaultOptions,
  ...filterSync.defaultOptions,
  ...contentView.defaultOptions,
  ...searchPanel.defaultOptions,
  ...columnChooser.defaultOptions,
  ...selection.defaultOptions,
  ...toolbar.defaultOptions,
  ...editing.defaultOptions,
  ...keyboardNavigation.defaultOptions,
} satisfies Options;

// TODO: separate by modules
// TODO: add typing for defaultOptionRules
export const defaultOptionsRules = [
  {
    device(): boolean {
      // @ts-expect-error
      return isMaterialBased();
    },
    options: {
      headerFilter: {
        height: 315,
      },
      editing: {
        useIcons: true,
      },
      selection: {
        showCheckBoxesMode: 'always',
      },
    },
  },
  {
    device(): boolean | undefined {
      return browser.webkit;
    },
    options: {
      loadingTimeout: 30, // T344031
      loadPanel: {
        animation: {
          show: {
            easing: 'cubic-bezier(1, 0, 1, 0)',
            duration: 500,
            from: { opacity: 0 },
            to: { opacity: 1 },
          },
        },
      },
    },
  },
];
