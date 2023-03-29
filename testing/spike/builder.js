const Builder = require('systemjs-builder');

const builder = new Builder();

builder
    .buildStatic(`${__dirname}/module-a.js`, `${__dirname}/result.js`)
    .then((...args) => {
        console.log('built',args);
    }) ;

