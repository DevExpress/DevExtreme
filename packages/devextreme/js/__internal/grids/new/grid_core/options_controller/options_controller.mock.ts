import type { Options } from '../options';
import { defaultOptions } from '../options';
import { OptionsControllerMock as OptionsControllerBaseMock } from './options_controller_base.mock';

export class OptionsControllerMock extends OptionsControllerBaseMock<
Options, typeof defaultOptions
> {
  constructor(options: Options) {
    super(options, defaultOptions);
  }
}
