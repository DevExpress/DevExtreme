import browser from '@js/core/utils/browser';
import { isMaterialBased } from '@js/ui/themes';
import type { WidgetOptions } from '@js/ui/widget/ui.widget';

import * as columnsController from './columns_controller';
import * as dataController from './data_controller';
import { filterPanel } from './filtering';
import * as pager from './pager';
import type { SearchProperties } from './search/types';
import * as toolbar from './toolbar';
import type { GridCoreNew } from './widget';

/**
 * @interface
 */
export type Options =
  & WidgetOptions<GridCoreNew>
  & dataController.Options
  & toolbar.Options
  & pager.Options
  & columnsController.Options
  & filterPanel.Options
  & SearchProperties
  & {
    noDataText?: string;
  };

export const defaultOptions = {
  ...dataController.defaultOptions,
  ...columnsController.defaultOptions,
  ...toolbar.defaultOptions,
  ...pager.defaultOptions,
  ...filterPanel.defaultOptions,
  searchText: '',
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
