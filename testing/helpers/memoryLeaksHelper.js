(function(root, factory) {
    /* global jQuery */
    if(typeof define === 'function' && define.amd) {
        define(function(require, exports, module) {
            root.memoryLeaksHelper = module.exports = factory(
                require('jquery')
            );
        });
    } else {
        jQuery.extend(window, factory(
            jQuery
        ));
    }
}(window, function($) {

    const exports = {};

    exports.createTestNode = function() {
        // NOTE: workaround for inferno
        // component can not be rendered as body first-level child
        const $container = $('<div />').appendTo('body');
        const testNode = $('<div />').appendTo($container);
        return testNode;
    };

    exports.destroyTestNode = function(testNode) {
        testNode.parent().remove();
    };

    exports.getAllPossibleEventTargets = function() {
        return $(document).find('*').addBack().add(window);
    };

    exports.getAllEventSubscriptions = function() {
        const eventSubscriptions = {};
        let anEvent;
        exports.getAllPossibleEventTargets().each(function() {
            for(anEvent in $._data(this, 'events')) {
                eventSubscriptions[anEvent] = $._data(this, 'events')[anEvent].length;
            }
        });
        return eventSubscriptions;
    };

    exports.compareDomElements = function(originalDomElements, newDomElements, ignorePatterns) {
        let errorMessage = '';
        const addedElements = {};
        let isIgnored;

        if(ignorePatterns) {
            isIgnored = function(element) {
                let result = false;
                $.each(ignorePatterns, function(tagName, pattern) {
                    result = result || ((element.tagName || '').toLowerCase() === tagName.toLowerCase() && pattern.test(element.innerHTML));
                });
                return result;
            };
        }

        const diffElement = function(element, diff) {
            if(isIgnored && isIgnored(element)) {
                return;
            }
            const id = element.tagName + ' ' + element.className;
            addedElements[id] = (addedElements[id] || 0) + diff;
        };
        $.each(newDomElements, function() { diffElement(this, +1); });
        $.each(originalDomElements, function() { diffElement(this, -1); });
        $.each(addedElements, function(index, value) {
            if(value) {
                errorMessage += (value > 0 ? '+' : '') + value + ' ' + index + '\n';
            }
        });
        return errorMessage;
    };

    exports.componentCanBeTriviallyInstantiated = function(componentName) {
        return $.inArray(componentName, ['dxDashboardViewer']) === -1;
    };

    exports.getComponentOptions = function(componentName) {
        switch(componentName) {
            case 'dxDataGrid':
                return {
                    dataSource: {
                        group: 'name',
                        store: [{ name: 'Alex', birthDate: new Date() }, { name: 'Dan', birthDate: new Date() }]
                    },
                    allowColumnResizing: true,
                    columnChooser: {
                        enabled: true
                    },
                    pager: {
                        visible: true,
                        showPageSizeSelector: true
                    },
                    groupPanel: {
                        visible: true
                    },
                    allowColumnReordering: true,
                    editing: {
                        allowUpdating: true,
                        allowDeleting: true,
                        allowAdding: true
                    },
                    hoverStateEnabled: true,
                    searchPanel: {
                        visible: true
                    },
                    filterRow: {
                        visible: true
                    }
                };
            case 'dxValidator':
                return {
                    adapter: {

                    }
                };
            case 'dxFileManager':
                return {
                    fileSystemProvider: [{
                        name: 'Folder 1',
                        isDirectory: true,
                        hasSubDirectories: false,
                        items: []
                    }]
                };
            default:
                break;
        }
    };

    return exports;
}));
