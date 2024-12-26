import {
  OptionsControllerMock as OptionsControllerBaseMock,
} from '@ts/grids/new/grid_core/options_controller/options_controller_base.mock';

import type { Options } from './options';
import { defaultOptions } from './options';

export class OptionsControllerMock extends OptionsControllerBaseMock<
Options, typeof defaultOptions
> {
  constructor(options: Options) {
    super(options, defaultOptions);
  }
}
