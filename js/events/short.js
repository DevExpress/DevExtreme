import domAdapter from '../core/dom_adapter';
import eventsEngine from './core/events_engine';
import KeyboardProcessor from './core/keyboard_processor';
import { addNamespace as pureAddNamespace } from './utils/index';
import pointerEvents from './pointer';

function addNamespace(event, namespace) {
    return namespace ? pureAddNamespace(event, namespace) : event;
}

function executeAction(action, args) {
    return typeof action === 'function' ? action(args) : action.execute(args);
}

export const active = {
    on: ($el, active, inactive, opts) => {
        const { selector, showTimeout, hideTimeout, namespace } = opts;

        eventsEngine.on($el, addNamespace('dxactive', namespace), selector, { timeout: showTimeout },
            event => executeAction(active, { event, element: event.currentTarget })
        );
        eventsEngine.on($el, addNamespace('dxinactive', namespace), selector, { timeout: hideTimeout },
            event => executeAction(inactive, { event, element: event.currentTarget })
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
        eventsEngine.on($el, addNamespace('dxhoverend', namespace), selector,
            event => executeAction(end, { element: event.target, event }));
        eventsEngine.on($el, addNamespace('dxhoverstart', namespace), selector,
            event => executeAction(start, { element: event.target, event }));
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
                e => isFocusable(null, e.target) || e.preventDefault()
            );
        }
    },

    off: ($el, { namespace }) => {
        eventsEngine.off($el, addNamespace('focusin', namespace));
        eventsEngine.off($el, addNamespace('focusout', namespace));

        if(domAdapter.hasDocumentProperty('onbeforeactivate')) {
            eventsEngine.off($el, addNamespace('beforeactivate', namespace));
        }
    },

    trigger: $el => eventsEngine.trigger($el, 'focus')
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

export const dxScrollInit = {
    on: ($el, onInit, eventData, { namespace } = {}) => {
        eventsEngine.on($el, addNamespace('dxscrollinit', namespace), eventData, onInit);
    },
    off: ($el, { namespace } = {}) => {
        eventsEngine.off($el, addNamespace('dxscrollinit', namespace));
    }
};
export const dxScrollStart = {
    on: ($el, onStart, { namespace } = {}) => {
        eventsEngine.on($el, addNamespace('dxscrollstart', namespace), onStart);
    },
    off: ($el, { namespace } = {}) => {
        eventsEngine.off($el, addNamespace('dxscrollstart', namespace));
    }
};
export const dxScrollMove = {
    on: ($el, onScroll, { namespace } = {}) => {
        eventsEngine.on($el, addNamespace('dxscroll', namespace), onScroll);
    },
    off: ($el, { namespace } = {}) => {
        eventsEngine.off($el, addNamespace('dxscroll', namespace));
    }
};
export const dxScrollEnd = {
    on: ($el, onEnd, { namespace } = {}) => {
        eventsEngine.on($el, addNamespace('dxscrollend', namespace), onEnd);
    },
    off: ($el, { namespace } = {}) => {
        eventsEngine.off($el, addNamespace('dxscrollend', namespace));
    }
};
export const dxScrollStop = {
    on: ($el, onStop, { namespace } = {}) => {
        eventsEngine.on($el, addNamespace('dxscrollstop', namespace), onStop);
    },
    off: ($el, { namespace } = {}) => {
        eventsEngine.off($el, addNamespace('dxscrollstop', namespace));
    }
};
export const dxScrollCancel = {
    on: ($el, onCancel, { namespace } = {}) => {
        eventsEngine.on($el, addNamespace('dxscrollcancel', namespace), onCancel);
    },
    off: ($el, { namespace } = {}) => {
        eventsEngine.off($el, addNamespace('dxscrollcancel', namespace));
    }
};
export const keyDown = {
    on: ($el, onKeyDown, { namespace } = {}) => {
        eventsEngine.on($el, addNamespace('keydown', namespace), onKeyDown);
    },
    off: ($el, { namespace } = {}) => {
        eventsEngine.off($el, addNamespace('keydown', namespace));
    }
};

export const dxPointerDown = {
    on: ($el, onPointerDown, { namespace } = {}) => {
        eventsEngine.on($el, addNamespace(pointerEvents.down, namespace), onPointerDown);
    },
    off: ($el, { namespace } = {}) => {
        eventsEngine.off($el, addNamespace(pointerEvents.down, namespace));
    }
};

export const dxPointerUp = {
    on: ($el, onPointerUp, { namespace } = {}) => {
        eventsEngine.on($el, addNamespace(pointerEvents.up, namespace), onPointerUp);
    },
    off: ($el, { namespace } = {}) => {
        eventsEngine.off($el, addNamespace(pointerEvents.up, namespace));
    }
};


let index = 0;
const keyboardProcessors = {};
const generateListenerId = () => `keyboardProcessorId${index++}`;

export const keyboard = {
    on: (element, focusTarget, handler) => {
        const listenerId = generateListenerId();

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
