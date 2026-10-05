import gridCoreUtils from '@ts/grids/grid_core/m_utils';
import modules from '@ts/grids/grid_core/modules/modules';
import type { Module } from '@ts/grids/grid_core/types';

export default {
  ...modules,
  ...gridCoreUtils,
  modules: [] as Module[],
};
