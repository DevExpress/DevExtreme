const Gantt = require('devexpress-gantt');
const addLibrary = require('../core/registry').addLibrary;

Gantt && addLibrary('gantt', Gantt);
