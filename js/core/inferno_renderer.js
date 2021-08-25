import { render } from 'inferno';
import { InfernoEffectHost, hydrate } from '@devextreme/vdom';
import { createElement } from 'inferno-create-element';
import domAdapter from './dom_adapter';
import { cleanDataRecursive } from './element_data';
import injector from './utils/dependency_injector';

export default injector({
    createElement: (component, props) => createElement(component, props),

    remove: (element) => {
        const { parentNode } = element;

        if(parentNode) {
            cleanDataRecursive(element);
            parentNode.$V = element.$V;
            render(null, parentNode);
            parentNode.appendChild(element);
            element.innerHTML = '';
            delete parentNode.$V;
        }

        delete element.$V;
    },

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

