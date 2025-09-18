// eslint-disable-next-line max-classes-per-file
import type { ReadonlySignal } from '@ts/core/state_manager/index';
import { computed } from '@ts/core/state_manager/index';
import type { ButtonGroupProps } from '@ts/ui/button_group_inferno/button_group.component';
import { ButtonGroupComponent } from '@ts/ui/button_group_inferno/button_group.component';
import * as FunctionalityControllerModule from '@ts/ui/button_group_inferno/functionality/index';
import { InfernoWidget } from '@ts/ui/button_group_inferno/inferno_widget';
import type { ComponentType } from 'inferno';

export class ButtonGroupBase extends InfernoWidget<ButtonGroupProps> {
  protected functionalityController!: FunctionalityControllerModule.Controller;

  public override _init(): void {
    this.functionalityController = new FunctionalityControllerModule.Controller(this);
    super._init();
  }

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

export class ButtonGroup extends FunctionalityControllerModule.PublicMethods(
  ButtonGroupBase,
) {}
