/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/ban-types */
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { Component, createRef } from 'inferno';

interface TemplateType<T> {
  render: (args: { model: T; container: dxElementWrapper }) => void;
}

// eslint-disable-next-line max-len
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types
export function TemplateWrapper<TProps = {}>(template: TemplateType<TProps>) {
  return class Template extends Component<TProps> {
    private readonly ref = createRef<HTMLDivElement>();

    private renderTemplate(): void {
      $(this.ref.current!).empty();
      template.render({
        container: $(this.ref.current!),
        model: this.props,
      });
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
  };
}
