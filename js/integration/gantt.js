const Gantt = require('devexpress-gantt');
const addLibrary = require('../core/library_registry').addLibrary;

Gantt && addLibrary('gantt', Gantt);
