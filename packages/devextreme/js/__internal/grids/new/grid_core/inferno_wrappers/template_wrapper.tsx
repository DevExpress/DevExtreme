import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { BaseInfernoComponent } from '@ts/core/r1/runtime/inferno/base_component';
import { shallowEquals } from '@ts/core/r1/utils/shallow_equals';
import { createRef } from 'inferno';

interface TemplateType<T> {
  render: (args: { model: T; container: dxElementWrapper }) => void;
}

// eslint-disable-next-line @stylistic/max-len
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types
export function TemplateWrapper<
  TProps extends Record<string, unknown> = Record<string, unknown>,
>(template: TemplateType<TProps>) {
  return class Template extends BaseInfernoComponent<TProps> {
    private readonly ref = createRef<HTMLDivElement>();

    private $container?: dxElementWrapper;

    private renderTemplate(): void {
      this.$container?.remove();
      this.$container = $('<div>').appendTo($(this.ref.current));

      template.render({
        container: this.$container,
        model: this.props,
      });
    }

    public shouldComponentUpdate(nextProps: TProps): boolean {
      return !shallowEquals(this.props, nextProps);
    }

    public render(): JSX.Element {
      return <div ref={this.ref}></div>;
    }

    public componentDidUpdate(): void {
      this.renderTemplate();
    }

    public componentDidMount(): void {
      this.renderTemplate();
    }

    public componentWillUnmount(): void {
      this.$container?.remove();
    }
  };
}
