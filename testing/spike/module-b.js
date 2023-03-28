const moduleC = require('module-c');

exports.exec = function() {
    console.log('Hello, module B with require and named exports!');
    moduleC();
}
