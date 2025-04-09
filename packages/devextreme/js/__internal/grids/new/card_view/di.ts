/* eslint-disable spellcheck/spell-checker */
import type { DIContext } from '@ts/core/di';

import { register as gridCoreDIRegister } from '../grid_core/di';
import * as ContentViewModule from './content_view/index';
import { HeaderPanelView } from './header_panel/view';

export function register(diContext: DIContext): void {
  gridCoreDIRegister(diContext);

  diContext.register(ContentViewModule.View);
  diContext.register(HeaderPanelView);
}
