/* eslint-disable spellcheck/spell-checker */
import { DIContext } from '@ts/core/di';
import { OptionsController as GridCoreOptionsController } from '@ts/grids/new/grid_core/options_controller/options_controller';

import { register } from './di';
import type { Options } from './options';
import { OptionsController } from './options_controller';
import { OptionsControllerMock } from './options_controller.mock';

export function getContext(config: Options): DIContext {
  const diContext = new DIContext();
  register(diContext);

  const options = new OptionsControllerMock(config);
  diContext.registerInstance(OptionsController, options);
  diContext.registerInstance(OptionsControllerMock, options);
  diContext.registerInstance(GridCoreOptionsController, options);

  return diContext;
}
