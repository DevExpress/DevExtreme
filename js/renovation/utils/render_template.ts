import { render } from 'inferno';
import { createElement } from 'inferno-create-element';

export function renderTemplate(template: string, props, container): void {
  setTimeout(() => {
    render(
      createElement(template, props), container?.get(0),
    );
  }, 0);
}
