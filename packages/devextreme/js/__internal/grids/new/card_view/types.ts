import type { Properties as BaseProperties } from '@ts/grids/new/grid_core/types';

import type { ContentViewProperties } from './content_view/types';

export type Properties =
  BaseProperties
  & ContentViewProperties;
