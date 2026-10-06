import { InternalElement } from '../element';

export interface TemplateRenderOptions {
  container?: unknown;
  model?: unknown;
  index?: number;
  transclude?: boolean;
  renovated?: boolean;
  onRendered?: () => void;
}

export class FunctionTemplate {
  constructor(render: (options: TemplateRenderOptions) => unknown);

  render(options: TemplateRenderOptions): InternalElement<HTMLElement>;
}
