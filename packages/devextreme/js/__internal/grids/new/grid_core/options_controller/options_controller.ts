/* eslint-disable @typescript-eslint/ban-types */
import type { Options } from '../options';
import { OptionsController as OptionsControllerBase } from './options_controller_base';

class GridCoreOptionsController extends OptionsControllerBase<Options, {}> {}

export type OptionsControllerType = {
  [P in keyof GridCoreOptionsController]: GridCoreOptionsController[P]
};

export { GridCoreOptionsController as OptionsController };
