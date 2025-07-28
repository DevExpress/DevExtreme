self.addEventListener('fetch', (event) => {
    const url = event.request.url;

    if(url.includes('events/visibility_change') &&
       !url.includes('__internal') &&
       !url.includes('m_visibility_change')) {

        event.respondWith(
            fetch(event.request)
                .then(response => response.text())
                .then(originalCode => {
                    if(!originalCode.includes('triggerResizeEvent')) {
                        return new Response(originalCode, {
                            headers: { 'Content-Type': 'text/javascript' }
                        });
                    }

                    const mockCode = `

// Create function to generate spies with full Sinon API and nested spy support
const createSpy = (originalFunc, name) => {
    let callCount = 0;
    let calls = []; // Array of call objects
    let isRestored = false;
    let originalFunction = originalFunc;
    
    const spy = function(...args) {
        callCount++;
        
        // Create call object in Sinon style
        const callInfo = {
            args: args,
            thisValue: this,
            returnValue: undefined,
            calledWithExactly: function(...expectedArgs) {
                return args.length === expectedArgs.length && 
                       args.every((arg, index) => arg === expectedArgs[index]);
            }
        };
        
        calls.push(callInfo);
        
        const result = originalFunction.apply(this, args);
        callInfo.returnValue = result;
        
        return result;
    };
    
    // Add full Sinon API
    Object.defineProperties(spy, {
        callCount: {
            get: () => callCount,
            configurable: true
        },
        calledWith: {
            get: () => calls.map(call => call.args),
            configurable: true
        },
        getCalls: {
            value: function() {
                return calls.slice(); // Return copy of array
            },
            configurable: true
        },
        getCall: {
            value: function(index) {
                return calls[index] || null;
            },
            configurable: true
        },
        firstCall: {
            get: () => calls[0] || null,
            configurable: true
        },
        lastCall: {
            get: () => calls[calls.length - 1] || null,
            configurable: true
        },
        called: {
            get: () => callCount > 0,
            configurable: true
        },
        calledOnce: {
            get: () => callCount === 1,
            configurable: true
        },
        calledTwice: {
            get: () => callCount === 2,
            configurable: true
        },
        resetHistory: {
            value: function() {
                callCount = 0;
                calls = [];
            },
            configurable: true
        },
        restore: {
            value: function() {
                if (!isRestored) {
                    isRestored = true;
                    // In our case "restoration" just resets counters
                    this.resetHistory();
                }
            },
            configurable: true
        },
        calledWith: {
            value: function(...args) {
                return calls.some(call => 
                    call.args.length >= args.length &&
                    args.every((arg, index) => call.args[index] === arg)
                );
            },
            configurable: true
        },
        // Support for nested spying
        isSinonProxy: {
            get: () => true,
            configurable: true
        }
    });
    
    spy._original = originalFunction;
    spy._isStub = false;
    spy._isMockFunction = false;
    
    return spy;
};

// Import ONLY internal module directly
import InternalModule from "/js/__internal/events/m_visibility_change.ts";


// Create spies for each function
export const triggerShownEvent = createSpy(
    InternalModule.triggerShownEvent, 
    'triggerShownEvent'
);

export const triggerHidingEvent = createSpy(
    InternalModule.triggerHidingEvent, 
    'triggerHidingEvent'
);

export const triggerResizeEvent = createSpy(
    InternalModule.triggerResizeEvent, 
    'triggerResizeEvent'
);

// Create default object
const defaultExport = {
    triggerShownEvent,
    triggerHidingEvent,
    triggerResizeEvent,
    ...InternalModule
};

export default defaultExport;

// Global access for debugging
if (typeof window !== 'undefined') {
    window.__mockedVisibilityModule = {
        triggerShownEvent,
        triggerHidingEvent,
        triggerResizeEvent
    };
}

`;


                    return new Response(mockCode, {
                        headers: {
                            'Content-Type': 'text/javascript',
                            'X-Mocked': 'true'
                        }
                    });
                })
                .catch(error => {
                    return fetch(event.request); // Fallback to original
                })
        );
    }
});

self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(clients.claim());
});
