import type { Properties } from '@js/ui/card_view';
import { OptionsController } from '@ts/grids/grid_core_new/options_controller/options_controller_base';

import type CardView from './widget_base';

class CardViewOptionsController extends OptionsController<Properties, ReturnType<CardView['_getDefaultOptions']>> {}

export { CardViewOptionsController as OptionsController };
