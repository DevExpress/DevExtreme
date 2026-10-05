import { InternalElement } from '../element';

export interface TemplateRenderOptions {
  container?: unknown;
  model?: unknown;
  index?: number;
  transclude?: boolean;
  renovated?: boolean;
  onRendered?: () => void;
}

export class FunctionTemplate<TOptions extends TemplateRenderOptions = TemplateRenderOptions> {
  constructor(render: (options: TOptions) => unknown);

  render(options: TOptions): InternalElement<HTMLElement>;
}
