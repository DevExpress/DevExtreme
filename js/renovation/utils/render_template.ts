import * as Preact from 'preact';

export function renderTemplate(template: string, props, container): void {
  setTimeout(() => {
    Preact.render(
      Preact.h(template, props), container?.get(0),
    );
  }, 0);
}
