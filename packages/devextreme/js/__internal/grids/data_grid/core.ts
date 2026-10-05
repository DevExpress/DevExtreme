import type { Module } from '@ts/grids/grid_core/m_types';
import gridCoreUtils from '@ts/grids/grid_core/m_utils';
import modules from '@ts/grids/grid_core/modules/modules';

export default {
  ...modules,
  ...gridCoreUtils,
  modules: [] as Module[],
};
