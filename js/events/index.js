import domAdapter from '../core/dom_adapter';
import eventsEngine from './core/events_engine';
import KeyboardProcessor from './core/keyboard_processor';
import { addNamespace as pureAddNamespace } from './utils';

function addNamespace(event, namespace) {
    return namespace ? pureAddNamespace(event, namespace) : event;
}

export const active = {
    on: ($el, active, inactive, opts) => {
        const { selector, showTimeout, hideTimeout, namespace } = opts;

        eventsEngine.on($el, addNamespace('dxactive', namespace), selector, { timeout: showTimeout },
            event => active.execute({ event, element: event.currentTarget })
        );
        eventsEngine.on($el, addNamespace('dxinactive', namespace), selector, { timeout: hideTimeout },
            event => inactive.execute({ event, element: event.currentTarget })
        );
    },

    off: ($el, { namespace, selector }) => {
        eventsEngine.off($el, addNamespace('dxactive', namespace), selector);
        eventsEngine.off($el, addNamespace('dxinactive', namespace), selector);
    }
};

export const resize = {
    on: ($el, resize, { namespace } = {}) => {
        eventsEngine.on($el, addNamespace('dxresize', namespace), resize);
    },
    off: ($el, { namespace } = {}) => {
        eventsEngine.off($el, addNamespace('dxresize', namespace));
    }
};

export const hover = {
    on: ($el, start, end, { selector, namespace }) => {
        eventsEngine.on($el, addNamespace('dxhoverend', namespace), selector, event => end(event));
        eventsEngine.on($el, addNamespace('dxhoverstart', namespace), selector, event => {
            start.execute({ element: event.target, event });
        });
    },

    off: ($el, { selector, namespace }) => {
        eventsEngine.off($el, addNamespace('dxhoverstart', namespace), selector);
        eventsEngine.off($el, addNamespace('dxhoverend', namespace), selector);
    }
};

export const visibility = {
    on: ($el, shown, hiding, { namespace }) => {
        eventsEngine.on($el, addNamespace('dxhiding', namespace), hiding);
        eventsEngine.on($el, addNamespace('dxshown', namespace), shown);
    },

    off: ($el, { namespace }) => {
        eventsEngine.off($el, addNamespace('dxhiding', namespace));
        eventsEngine.off($el, addNamespace('dxshown', namespace));
    }
};

export const focus = {
    on: ($el, focusIn, focusOut, { namespace, isFocusable }) => {
        eventsEngine.on($el, addNamespace('focusin', namespace), focusIn);
        eventsEngine.on($el, addNamespace('focusout', namespace), focusOut);

        if(domAdapter.hasDocumentProperty('onbeforeactivate')) {
            eventsEngine.on($el, addNamespace('beforeactivate', namespace),
                e => isFocusable(e.target) || e.preventDefault()
            );
        }
    },

    off: ($el, { namespace }) => {
        eventsEngine.off($el, addNamespace('focusin', namespace));
        eventsEngine.off($el, addNamespace('focusout', namespace));

        if(domAdapter.hasDocumentProperty('onbeforeactivate')) {
            eventsEngine.off($el, addNamespace('beforeactivate', namespace));
        }
    }
};

export const dxClick = {
    on: ($el, click, { namespace } = {}) => {
        eventsEngine.on($el, addNamespace('dxclick', namespace), click);
    },
    off: ($el, { namespace } = {}) => {
        eventsEngine.off($el, addNamespace('dxclick', namespace));
    }
};

export const click = {
    on: ($el, click, { namespace } = {}) => {
        eventsEngine.on($el, addNamespace('click', namespace), click);
    },
    off: ($el, { namespace } = {}) => {
        eventsEngine.off($el, addNamespace('click', namespace));
    }
};

let index = 0;
const keyboardProcessors = {};
const getKeyboardProcessorId = () => `keyboardProcessorId${index++}`;

export const keyboard = {
    on: (element, focusTarget, handler) => {
        const listenerId = getKeyboardProcessorId();

        keyboardProcessors[listenerId] = new KeyboardProcessor({ element, focusTarget, handler });

        return listenerId;
    },

    off: listenerId => {
        if(listenerId && keyboardProcessors[listenerId]) {
            keyboardProcessors[listenerId].dispose();
            delete keyboardProcessors[listenerId];
        }
    },

    // NOTE: For tests
    _getProcessor: listenerId => keyboardProcessors[listenerId]
};
