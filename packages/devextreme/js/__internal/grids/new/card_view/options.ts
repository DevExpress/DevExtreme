import * as GridCore from '@ts/grids/new/grid_core/options';

import * as ContentView from './content_view/index';

/**
 * @interface
 */
export type Options =
  & GridCore.Options
  & ContentView.Options;

export const defaultOptions = {
  ...GridCore.defaultOptions,
  ...ContentView.defaultOptions,
} satisfies Options;
