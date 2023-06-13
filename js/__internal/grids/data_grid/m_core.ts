import modules from '@ts/grids/grid_core/m_modules';
import { Module } from '@ts/grids/grid_core/m_types';
import gridCoreUtils from '@ts/grids/grid_core/m_utils';

export default {
  ...modules,
  ...gridCoreUtils,
  modules: [] as Module[],
};
