import browser from '@js/core/utils/browser';
import { isMaterialBased } from '@js/ui/themes';
import type { WidgetOptions } from '@js/ui/widget/ui.widget';

import * as columnsController from './columns_controller/index';
import * as contentView from './content_view/index';
import * as dataController from './data_controller/index';
import * as pager from './pager/index';
import * as searchPanel from './search/index';
import type { SearchProperties } from './search/types';
import * as sortingController from './sorting_controller/index';
import type * as toolbar from './toolbar/index';
import type { GridCoreNew } from './widget';

/**
 * @interface
 */
export type Options =
  & WidgetOptions<GridCoreNew>
  & dataController.Options
  & sortingController.Options
  & pager.Options
  & columnsController.Options
  & contentView.Options
  & searchPanel.Options
  // TODO: Remove this mock search options during search implementation
  & SearchProperties
  & toolbar.Options;

export const defaultOptions = {
  ...dataController.defaultOptions,
  ...sortingController.defaultOptions,
  ...columnsController.defaultOptions,
  ...pager.defaultOptions,
  ...contentView.defaultOptions,
  ...searchPanel.defaultOptions,
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
