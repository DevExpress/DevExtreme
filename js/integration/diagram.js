const Diagram = require('devexpress-diagram');
const addLibrary = require('../core/registry').addLibrary;

Diagram && addLibrary('gantt', Diagram);
