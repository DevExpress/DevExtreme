import { render } from 'inferno';
import { createElement } from 'inferno-create-element';
import type { dxElementWrapper } from '../../core/renderer';

export function renderTemplate(
  template: string,
  props: Record<string, unknown>,
  container: dxElementWrapper,
): void {
  setTimeout(() => {
    render(
      createElement(template, props), container?.get(0),
    );
  }, 0);
}
