import type { Options as BaseOptions } from '@ts/grids/new/grid_core/options';

export type Options =
  BaseOptions & {
    cardsPerRow?: number | 'auto';
    cardMinWidth?: number;
  };
