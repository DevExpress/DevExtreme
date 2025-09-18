import type { Properties } from '@js/ui/button_group';
import { BaseInfernoComponent } from '@ts/core/r1/runtime/inferno';

export interface ButtonGroupProps extends Properties {}

export class ButtonGroupComponent extends BaseInfernoComponent<ButtonGroupProps> {
  render(): JSX.Element {
    const { items } = this.props;
    return (
      <div>
        {items?.map((item, index) => (
            <div key={index}>
              <div
                style={{
                  background: 'grey',
                  border: '1px solid black',
                }}
              >
                {item.text}
              </div>
            </div>
        ))}
      </div>
    );
  }
}
