import type { ReadonlySignal } from '@ts/core/state_manager/index';
import { computed } from '@ts/core/state_manager/index';
import type { ButtonGroupProps } from '@ts/ui/button_group_inferno/button_group.component';
import { ButtonGroupComponent } from '@ts/ui/button_group_inferno/button_group.component';
import { InfernoWidget } from '@ts/ui/button_group_inferno/inferno_widget';
import type { ComponentType } from 'inferno';

export class ButtonGroup extends InfernoWidget<ButtonGroupProps> {
  protected override getComponent(): ComponentType<ButtonGroupProps> {
    return ButtonGroupComponent;
  }

  protected override getProps(): ReadonlySignal<ButtonGroupProps> {
    const options = this.option();

    return computed(() => ({
      ...options,
    }));
  }
}
