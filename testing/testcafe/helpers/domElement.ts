import { ClientFunction } from 'testcafe';

export const setStyleAttribute = ClientFunction((
  selector: Selector,
  name: string,
  value: string,
) => {
  const element = selector();
  element.style[name] = value;
});

export const getStyleAttribute = ClientFunction((
  selector: Selector,
  name: string,
) => {
  const element = selector();
  return element.style[name];
});
