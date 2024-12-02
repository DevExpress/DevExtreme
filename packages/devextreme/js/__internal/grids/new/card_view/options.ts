import * as GridCore from '@ts/grids/new/grid_core/options';

/**
 * @interface
 */
export type Options =
  & GridCore.Options;

export const defaultOptions = {
  ...GridCore.defaultOptions,
} satisfies Options;
