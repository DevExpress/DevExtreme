/* eslint-disable spellcheck/spell-checker */
import { computed } from '@ts/core/reactive/index';

import { View } from '../core/view';
import { Toolbar } from '../inferno_wrappers/toolbar';
import { OptionsController } from '../options_controller/options_controller';
import { HeaderPanelController } from './controller';

export class HeaderPanelView extends View {
  public vdom = computed(
    (items, visible, disabled) => (
      <Toolbar
        items={items}
        visible={visible}
        disabled={disabled}
      />
    ),
    [
      this.controller.items,
      this.options.oneWay('toolbar.visible'),
      this.options.oneWay('toolbar.disabled'),
    ],
  );
  public static dependencies = [HeaderPanelController, OptionsController] as const;

  constructor(
    private readonly controller: HeaderPanelController,
    private readonly options: OptionsController,
  ) {
    super();
  }
}
