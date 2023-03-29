import moduleC from './module-c.js';

export const exec = function() {
    console.log('Hello, module B with require and named exports!');
    moduleC();
}
