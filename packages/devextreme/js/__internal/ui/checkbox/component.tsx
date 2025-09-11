import { BaseInfernoComponent } from '@ts/core/r1/runtime/inferno';
import { Widget } from '@ts/core/r1/widget';
import { createRef } from 'inferno';

import { CheckboxProvider } from './provider';
import type { CheckboxProps } from './types';

export class CheckboxComponentWithProvider extends BaseInfernoComponent<CheckboxProps> {
  private readonly inputRef = createRef<HTMLInputElement>();

  constructor(props: CheckboxProps) {
    super(props);

    this.focus = this.focus.bind(this);
  }

  focus(): void {
    this.inputRef.current?.focus();
  }

  render(): JSX.Element {
    return (
        <CheckboxProvider value={this.props.value} onClick={this.props.onClick}>
            {({ onClick, toggle, value }) => (
                <Widget
                    className="counter"
                >
                    <label>
                        <input
                            type="checkbox"
                            disabled={this.props.disabled}
                            onClick={toggle}
                            ref={this.inputRef}
                            value={value}>
                        </input>
                        {this.props.text}
                    </label>
                    <button onClick={onClick}>TOGGLE: {value ? 'true' : 'false'}</button>
                </Widget>
            )}
        </CheckboxProvider>
    );
  }
}
