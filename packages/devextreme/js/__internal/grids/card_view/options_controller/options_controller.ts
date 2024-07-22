import type { Properties } from '@js/ui/card_view';

import type CardView from '../widget_base';
import { OptionsController } from './options_controller_base';

class CardViewOptionsController extends OptionsController<Properties, ReturnType<CardView['_getDefaultOptions']>> {}

export { CardViewOptionsController as OptionsController };
