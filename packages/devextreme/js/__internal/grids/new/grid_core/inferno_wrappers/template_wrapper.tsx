/* eslint-disable spellcheck/spell-checker */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { Component, createRef } from 'inferno';

import { templateContext } from '../core/template_context';

interface TemplateType<T> {
  render: (args: { model: T; container: dxElementWrapper; onRendered: () => void }) => void;
}

// eslint-disable-next-line @stylistic/max-len
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types
export function TemplateWrapper<TProps = {}>(template: TemplateType<TProps>) {
  return class Template extends Component<TProps> {
    private readonly ref = createRef<HTMLDivElement>();

    private renderTemplate(): void {
      const templateStore = templateContext.get(this.context);

      const $deattachedContainer = $('<div>');
      const $container = $(this.ref.current!);

      const $prevAttachedContainer = templateStore.nodes.shift();
      $prevAttachedContainer?.children().appendTo($container);

      template.render({
        container: $deattachedContainer,
        model: this.props,
        onRendered: (): void => {
          $container.empty();
          $deattachedContainer.children().appendTo($container);
        },
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

    public componentWillUnmount(): void {
      const $deattachedContainer = $('<div>');
      const $container = $(this.ref.current!);
      $container.children().appendTo($deattachedContainer);

      const templateStore = templateContext.get(this.context);
      templateStore.nodes.push($deattachedContainer);
    }
  };
}
