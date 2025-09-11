import type { ClickEvent } from '@js/ui/button';
import { BaseInfernoComponent } from '@ts/core/r1/runtime/inferno';

import type { CheckboxProps } from './types';

export class CheckboxProvider extends BaseInfernoComponent<
  Partial<CheckboxProps>,
  { value: boolean }
> {
  constructor(props: CheckboxProps) {
    super(props);
    this.state = {
      value: !!props.value,
    };
  }

  toggle = (): void => {
    this.setState((prevState) => ({
      value: !prevState.value,
    }));
  };

  onClick = (e: ClickEvent): void => {
    this.toggle();

    this.props.onClick?.(e);
  };

  render(): JSX.Element {
    // @ts-expect-error ts
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.props.children?.({
      ...this.props,
      value: this.state?.value ?? false,
      toggle: this.toggle,
      onClick: this.onClick,
    });
  }
}
