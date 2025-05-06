/* eslint-disable spellcheck/spell-checker */
import { DIContext } from '@ts/core/di';

import { BaseContextMenuController } from './context_menu/controller';
import { ContextMenuControllerMock } from './context_menu/controller.mock';
import { register } from './di';
import type { Options } from './options';
import { OptionsController } from './options_controller/options_controller';
import { OptionsControllerMock } from './options_controller/options_controller.mock';

export function getContext(config: Options): DIContext {
  const diContext = new DIContext();
  register(diContext);

  const options = new OptionsControllerMock(config);
  diContext.registerInstance(OptionsController, options);
  diContext.registerInstance(OptionsControllerMock, options);

  diContext.register(BaseContextMenuController, ContextMenuControllerMock);

  return diContext;
}
