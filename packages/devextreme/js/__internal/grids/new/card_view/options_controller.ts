import { OptionsController } from '@ts/grids/new/grid_core/options_controller/options_controller_base';

import type { Options } from './types';
import type { CardView } from './widget_base';

class CardViewOptionsController extends OptionsController<Options, ReturnType<CardView['_getDefaultOptions']>> {}

export { CardViewOptionsController as OptionsController };
