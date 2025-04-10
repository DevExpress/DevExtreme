/* eslint-disable spellcheck/spell-checker */
import type { DIContext } from '@ts/core/di';

import { register as gridCoreDIRegister } from '../grid_core/di';
import * as ContentViewModule from './content_view/index';
import { ContextMenuController } from './context_menu/controller';
import { ContextMenuView } from './context_menu/view';
import { HeaderPanelView } from './header_panel/view';

export function register(diContext: DIContext): void {
  gridCoreDIRegister(diContext);

  diContext.register(ContentViewModule.View);
  diContext.register(HeaderPanelView);
  diContext.register(ContextMenuView);
  diContext.register(ContextMenuController);
}
