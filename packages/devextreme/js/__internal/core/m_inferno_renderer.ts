import { render } from 'inferno';
import { InfernoEffectHost, hydrate } from '@devextreme/runtime/inferno';
import { createElement } from 'inferno-create-element';
import domAdapter from './dom_adapter';
import { cleanDataRecursive } from './element_data';
import injector from './utils/dependency_injector';

const remove = (element) => {
    const { parentNode } = element;

    if(parentNode) {
        const nextSibling = element.nextSibling;
        cleanDataRecursive(element);
        parentNode.$V = element.$V;
        render(null, parentNode);
        parentNode.insertBefore(element, nextSibling);
        element.innerHTML = '';
        delete parentNode.$V;
    }

    delete element.$V;
};

export default injector({
    createElement: (component, props) => createElement(component, props),

    remove,

    onAfterRender: () => {
        InfernoEffectHost.callEffects();
    },

    onPreRender: () => {
        InfernoEffectHost.lock();
    },

    render: (component, props, container, replace) => {
        if(!replace) {
            const { parentNode } = container;
            const nextNode = container?.nextSibling;
            const rootNode = domAdapter.createElement('div');
            rootNode.appendChild(container);
            const mountNode = domAdapter.createDocumentFragment().appendChild(rootNode);
            const vNodeAlreadyExists = !!container.$V;

            vNodeAlreadyExists && remove(container);

            hydrate(
                createElement(component, props),
                mountNode,
            );
            container.$V = mountNode.$V;
            if(parentNode) {
                parentNode.insertBefore(container, nextNode);
            }
        } else {
            render(
                createElement(component, props), container,
            );
        }
    },
});

