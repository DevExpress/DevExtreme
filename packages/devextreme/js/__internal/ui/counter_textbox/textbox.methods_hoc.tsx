import { BaseInfernoComponent } from '@ts/core/r1/runtime/inferno';
import type { TextBoxProps, TextBoxState } from '@ts/ui/counter_textbox/textbox.types';

// eslint-disable-next-line @stylistic/max-len
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type,@typescript-eslint/explicit-module-boundary-types
function withMethods(WrappedComponent: BaseInfernoComponent<TextBoxProps>) {
  return class WithMethodsComponent extends BaseInfernoComponent<TextBoxProps, TextBoxState> {
    constructor(props) {
      super(props);

      this.state = {
        value: props.value ?? '',
      };
    }

    reset = (): void => {
      this.onValueChange('');
    };

    onValueChange = (value: string): void => {
      this.setState({ value });
      this.props?.onValueChange?.(value);
    };

    onInput = (e): void => {
      const { value } = e.target as HTMLInputElement;
      this.onValueChange?.(value);
      this.props?.onInput?.(value);
    };

    onChange = (e): void => {
      this.props?.onChange?.(e);
    };

    render(): JSX.Element {
      return (
        // @ts-ignore
        <WrappedComponent
          {...this.props}
          value={this.state?.value}
          onInput={this.onInput}
          onChange={this.onChange}
        />
      );
    }
  };
}

export default withMethods;
