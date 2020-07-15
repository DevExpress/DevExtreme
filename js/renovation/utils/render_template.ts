import * as Preact from 'preact';

export default (template, props, container) => {
  setTimeout(() => {
    Preact.render(
      Preact.h(template, props), container?.get(0),
    );
  }, 0);
};
