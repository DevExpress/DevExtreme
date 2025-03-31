/* eslint-disable spellcheck/spell-checker */
import type { SubsGets } from '@ts/core/reactive/index';
import { combined, computed } from '@ts/core/reactive/index';

import { View } from '../core/view';
import { OptionsController } from '../options_controller/options_controller';
import { ToolbarController } from './controller';
import { ToolbarView as Toolbar } from './toolbar';
import type { ToolbarProps } from './types';
import { isVisible } from './utils';

export class ToolbarView extends View<ToolbarProps> {
  protected override component = Toolbar;

  private readonly visibleConfig = this.options.oneWay('toolbar.visible');

  private readonly visible = computed(
    (visibleConfig, items) => isVisible(visibleConfig, items),
    [this.visibleConfig, this.controller.items],
  );

  public static dependencies = [ToolbarController, OptionsController] as const;

  constructor(
    private readonly controller: ToolbarController,
    private readonly options: OptionsController,
  ) {
    super();
  }

  protected override getProps(): SubsGets<ToolbarProps> {
    return combined({
      visible: this.visible,
      items: this.controller.items,
      disabled: this.options.oneWay('toolbar.disabled'),
    });
  }
}
