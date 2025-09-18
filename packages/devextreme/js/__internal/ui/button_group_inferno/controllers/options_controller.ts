import { Component } from '@js/core/component';
import { OptionsController } from '@ts/grids/new/grid_core/options_controller/options_controller_base';

import type { Options } from './options';
import { defaultOptions } from './options';

class ButtonGroupOptionsController extends OptionsController<Options, typeof defaultOptions> {
  public static dependencies = [Component];

  constructor(component: Component<Options>) {
    super(component);
    this.defaults = defaultOptions;
  }
}

export { ButtonGroupOptionsController as OptionsController };
