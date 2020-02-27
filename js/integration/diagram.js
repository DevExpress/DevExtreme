const Diagram = require('devexpress-diagram');
const addLibrary = require('../core/library_registry').addLibrary;

Diagram && addLibrary('diagram', Diagram);
