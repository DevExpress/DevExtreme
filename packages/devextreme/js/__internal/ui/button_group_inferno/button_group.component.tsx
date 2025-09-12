import type { Properties } from '@js/ui/button_group';
import { BaseInfernoComponent } from '@ts/core/r1/runtime/inferno';

export interface ButtonGroupProps extends Properties {}

export class ButtonGroupComponent extends BaseInfernoComponent<ButtonGroupProps> {
  render(): JSX.Element {
    return (
      <div>
        Button group placeholder
      </div>
    );
  }
}
