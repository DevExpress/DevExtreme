import { DxElement } from '../element';

export interface TemplateRenderOptions {
  container?: unknown;
  model?: unknown;
  index?: number;
  transclude?: boolean;
  renovated?: boolean;
  onRendered?: () => void;
}

export class FunctionTemplate {
  constructor(render?: (options: Omit<TemplateRenderOptions, 'onRendered'>) => unknown);

  render(options?: TemplateRenderOptions): DxElement;
}
