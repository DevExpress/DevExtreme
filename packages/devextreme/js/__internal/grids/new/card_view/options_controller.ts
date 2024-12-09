import { OptionsController } from '@ts/grids/new/grid_core/options_controller/options_controller_base';

import type { defaultOptions, Options } from './options';

class CardViewOptionsController extends OptionsController<Options, typeof defaultOptions> {}

export { CardViewOptionsController as OptionsController };
