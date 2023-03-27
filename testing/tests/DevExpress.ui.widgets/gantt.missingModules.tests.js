/* global System */
System.addImportMap({
    imports: {
        'devexpress-gantt': '/testing/helpers/noGantt.js'
    }
});

System.register(['./ganttParts/importGantt.tests.js'], function() {
    return {
        setters: [function() {}],
        execute: function() {}
    };
});
