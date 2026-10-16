import modules from '@ts/grids/grid_core/modules/modules';
import type { Module } from '@ts/grids/grid_core/types';
import gridCoreUtils from '@ts/grids/grid_core/utils';

export default {
  ...modules,
  ...gridCoreUtils,
  modules: [] as Module[],
};
