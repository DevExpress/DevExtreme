import type { Module } from '@ts/grids/grid_core/m_types';

import { FilterController } from './filter_controller';

export const filterModule: Module = {
  controllers: {
    filter: FilterController,
  },
};
