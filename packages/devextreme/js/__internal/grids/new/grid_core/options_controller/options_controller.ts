import type { Properties } from '../types';
import { OptionsController as OptionsControllerBase } from './options_controller_base';

class GridCoreOptionsController extends OptionsControllerBase<Properties, {}> {}

export type OptionsControllerType = {
  [P in keyof GridCoreOptionsController]: GridCoreOptionsController[P]
};

export { GridCoreOptionsController as OptionsController };
