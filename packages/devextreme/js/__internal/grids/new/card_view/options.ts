import * as GridCore from '@ts/grids/new/grid_core/options';

import * as ContentView from './content_view/index';
import * as HeaderPanel from './header_panel/index';

/**
 * @interface
 */
export type Options =
  & GridCore.Options
  & HeaderPanel.Options
  & ContentView.Options;

export const defaultOptions = {
  ...GridCore.defaultOptions,
  ...ContentView.defaultOptions,
  ...HeaderPanel.defaultOptions,
} satisfies Options;
