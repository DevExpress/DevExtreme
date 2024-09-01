import type { Properties } from '../types';
import { OptionsController as OptionsControllerBase } from './options_controller_base';

class GridCoreOptionsController extends OptionsControllerBase<Properties, {}> {}

export { GridCoreOptionsController as OptionsController };
