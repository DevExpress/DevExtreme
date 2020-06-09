/* eslint-disable spellcheck/spell-checker */
import { options } from 'preact';

let requestAnimationFrame = 0;
let debounceRenderingCount = 0;

// Vitik: may be it's needed for full replacement of original preact implementation
// options.requestAnimationFrame = (done) => {
//     requestAnimationFrame++;
//     setTimeout(() =>{
//         const id = window.requestAnimationFrame(() => {
//             window.cancelAnimationFrame(id);
//             done();
//             requestAnimationFrame--;
//         });
//     });
// };

export const patchOptions = () => {
    options.requestAnimationFrame = (done) => {
        requestAnimationFrame++;
        setTimeout(() => {
            requestAnimationFrame--;
            done();
        });
    };

    // Vitik: Replacement of preact
    // const defer = typeof Promise === 'function' ? Promise.prototype.then.bind(Promise.resolve()) : setTimeout;

    options.debounceRendering = (done) => {
        debounceRenderingCount++;
        setTimeout(() => {
            debounceRenderingCount--;
            done();
        });
    };
};

export const restoreOptions = () => {
    options.debounceRendering = options.requestAnimationFrame = null;
    checkCounters();
};


export function checkCounters(fixCB) {
    if(requestAnimationFrame !== 0 || debounceRenderingCount !== 0) {
        // eslint-disable-next-line no-console
        console.error(`Preact render is not completed. Call this.clock.tick() to resolve. Detected in test '${QUnit.config.current.testName}', requestAnimationFrame: ${requestAnimationFrame}, debounceRenderingCount: ${debounceRenderingCount}`);
        fixCB && fixCB();
    }
    if(requestAnimationFrame !== 0) {
        throw new Error(`requestAnimationFrame: ${requestAnimationFrame}`);
    }
    if(debounceRenderingCount !== 0) {
        throw new Error(`debounceRenderingCount: ${debounceRenderingCount}`);
    }
}
