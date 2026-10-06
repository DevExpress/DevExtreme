import { InternalElement, UserDefinedElement } from '../element';
import { dxElementWrapper } from '../renderer';

export interface TemplateRenderOptions {
  container?: string | UserDefinedElement | dxElementWrapper | null;
  model?: unknown;
  index?: number;
  transclude?: boolean;
  renovated?: boolean;
  onRendered?: () => void;
}

export class FunctionTemplate {
  constructor(render: (options: Omit<TemplateRenderOptions, 'onRendered'>) => unknown);

  render(options?: TemplateRenderOptions): InternalElement<HTMLElement>;
}
