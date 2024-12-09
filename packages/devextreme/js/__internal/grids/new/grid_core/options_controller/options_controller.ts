/* eslint-disable @typescript-eslint/ban-types */
import type { defaultOptions, Options } from '../options';
import { OptionsController as OptionsControllerBase } from './options_controller_base';

class GridCoreOptionsController extends OptionsControllerBase<Options, typeof defaultOptions> {}

export { GridCoreOptionsController as OptionsController };
