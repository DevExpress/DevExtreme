window.require = System.amdRequire;

System.register([], function() {
    return {
        setters: [],
        execute: function() {
            const moduleB = require('module-b').exec;

            console.log('Hello, module A!');
            moduleB();
        }
    };
});
