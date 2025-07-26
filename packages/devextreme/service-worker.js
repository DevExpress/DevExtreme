self.addEventListener('fetch', (event) => {
    const url = event.request.url;

    if(url.includes('common/core/events/visibility_change')) {

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
// Import ONLY internal module directly
import InternalModule from "/js/__internal/events/m_visibility_change.ts";

// Get sinon from window (loaded in test-page.html)
const sinon = window.sinon;

let triggerShownEvent, triggerHidingEvent, triggerResizeEvent;

if (!sinon) {
    console.error('Sinon is not available in window. Make sure it is loaded in test-page.html');
    // Fallback to original functions if sinon is not available
    triggerShownEvent = InternalModule.triggerShownEvent;
    triggerHidingEvent = InternalModule.triggerHidingEvent;
    triggerResizeEvent = InternalModule.triggerResizeEvent;
} else {
    // Create sinon spies for each function
    triggerShownEvent = sinon.spy(InternalModule, 'triggerShownEvent');
    triggerHidingEvent = sinon.spy(InternalModule, 'triggerHidingEvent');  
    triggerResizeEvent = sinon.spy(InternalModule, 'triggerResizeEvent');
}

// Export the spied functions
export { triggerShownEvent, triggerHidingEvent, triggerResizeEvent };

// Create default export with spied functions
const defaultExport = {
    triggerShownEvent,
    triggerHidingEvent,
    triggerResizeEvent,
    ...InternalModule
};

export default defaultExport;
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
