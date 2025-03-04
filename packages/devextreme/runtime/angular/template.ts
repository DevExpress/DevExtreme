import { ViewContainerRef } from '@angular/core';

interface IModel {
  item: HTMLElement & { get: (index: number) => HTMLElement } | any,
  index: number,
  container: HTMLElement & { get?: (index: number) => HTMLElement }
}

const getContainer = (props: IModel): HTMLElement => {
  const container = props.container || props.item;
  return container?.get ? container?.get(0) : container;
};

export const renderTemplate = (
  template: any,
  model: IModel,
  component?: any,
): void => {
  const childView = (component.viewContainerRef as ViewContainerRef).createEmbeddedView(template, {
    $implicit: model.item,
    index: model.index,
  });
  const container = getContainer(model);
  if (container) {
    childView.rootNodes.forEach((element) => {
      component.renderer.appendChild(container, element);
    });
  }
};
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const hasTemplate = (
  name: string,
  props: Record<string, unknown>,
  _component?: any,
): boolean => {
  const value = props[name];
  return !!value && typeof value !== 'string';
};
