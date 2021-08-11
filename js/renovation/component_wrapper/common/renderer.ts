import { render, Component, VNode } from 'inferno';
import { InfernoEffectHost, hydrate } from '@devextreme/vdom';
import { createElement } from 'inferno-create-element';
import domAdapter from '../../../core/dom_adapter';
import { cleanDataRecursive } from '../../../core/element_data';
import injector from '../../../core/utils/dependency_injector';

interface InfernoRenderer {
  createElement: (
    component: typeof Component,
    props: Record<string, unknown>,
  ) => VNode;
  remove: (element: HTMLElement) => void;
  onPreRender: () => void;
  onAfterRender: () => void;
  render: (
    component: typeof Component,
    props: Record<string, unknown>,
    container: HTMLElement,
    replace: boolean,
  ) => void;
}

const renderer: InfernoRenderer = {
  createElement: (
    component: typeof Component,
    props: Record<string, unknown>,
  ): VNode => createElement(component, props),

  remove: (element: HTMLElement): void => {
    const { parentNode } = element;

    if (parentNode) {
      cleanDataRecursive(element);
      // eslint-disable-next-line
    (parentNode as any).$V = (element as any).$V;
      render(null, parentNode);
      parentNode.appendChild(element);
      // eslint-disable-next-line no-param-reassign
      element.innerHTML = '';

      // eslint-disable-next-line
    delete (parentNode as any).$V;
    }

    // eslint-disable-next-line
  delete (element as any).$V;
  },

  onAfterRender: (): void => {
    InfernoEffectHost.callEffects();
  },

  onPreRender: (): void => {
    InfernoEffectHost.lock();
  },

  render: (
    component: typeof Component,
    props: Record<string, unknown>,
    container: HTMLElement,
    replace: boolean,
  ): void => {
    if (!replace) {
      const { parentNode } = container;
      const nextNode = container?.nextSibling;
      const rootNode = domAdapter.createElement('div');
      rootNode.appendChild(container);
      const mountNode = domAdapter.createDocumentFragment().appendChild(rootNode);

      hydrate(
        createElement(component, props),
        mountNode,
      );
      // eslint-disable-next-line
    (container as any).$V = (mountNode as any).$V;
      if (parentNode) {
        parentNode.insertBefore(container, nextNode);
      }
    } else {
      render(
        createElement(component, props), container,
      );
    }
  },
};

export default injector(renderer) as InfernoRenderer;
