import { render } from 'inferno';
import { createElement } from 'inferno-create-element';

interface IProps {
  item: HTMLElement & { get: (index: number) => HTMLElement } | any,
  index: number,
  container: HTMLElement & { get: (index: number) => HTMLElement }
}

const getContainer = (props: IProps): HTMLElement => props.container?.get(0) || props.item?.get(0);

export function renderTemplate(
  template: string,
  props: IProps,
  _component?: unknown,
): void {
  setTimeout(() => {
    render(
      createElement(template, props), getContainer(props),
    );
  }, 0);
}

export const hasTemplate = (
  name: string,
  properties: Record<string, unknown>,
  _component: unknown,
): boolean => {
  const value = properties[name];
  return !!value && typeof value !== 'string';
};
