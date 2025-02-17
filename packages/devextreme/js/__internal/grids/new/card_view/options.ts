import * as GridCore from '@ts/grids/new/grid_core/options';

import * as HeaderPanel from './header_panel/index';

/**
 * @interface
 */
export type Options =
  & GridCore.Options
  & HeaderPanel.Options;

export const defaultOptions = {
  ...GridCore.defaultOptions,
  ...HeaderPanel.defaultOptions,
} satisfies Options;
