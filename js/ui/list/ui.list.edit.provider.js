const $ = require('../../core/renderer');
const noop = require('../../core/utils/common').noop;
const Class = require('../../core/class');
const extend = require('../../core/utils/extend').extend;
const each = require('../../core/utils/iterator').each;
const errors = require('../widget/ui.errors');
const decoratorRegistry = require('./ui.list.edit.decorator_registry');

require('./ui.list.edit.decorator.static');
require('./ui.list.edit.decorator.switchable.button');
require('./ui.list.edit.decorator.switchable.slide');
require('./ui.list.edit.decorator.swipe');
require('./ui.list.edit.decorator.context');
require('./ui.list.edit.decorator.selection');
require('./ui.list.edit.decorator.reorder');


const editOptionsRegistry = [];

const registerOption = function(enabledFunc, decoratorTypeFunc, decoratorSubTypeFunc) {
    editOptionsRegistry.push({
        enabled: enabledFunc,
        decoratorType: decoratorTypeFunc,
        decoratorSubType: decoratorSubTypeFunc
    });
};

// NOTE: option registration order does matter
registerOption(
    function() {
        return this.option('menuItems').length;
    },
    function() {
        return 'menu';
    },
    function() {
        return this.option('menuMode');
    }
);
registerOption(
    function() {
        return !this.option('menuItems').length && this.option('allowItemDeleting');
    },
    function() {
        const mode = this.option('itemDeleteMode');

        return mode === 'toggle' || mode === 'slideButton' || mode === 'swipe' || mode === 'static' ? 'delete' : 'menu';
    },
    function() {
        let mode = this.option('itemDeleteMode');

        if(mode === 'slideItem') {
            mode = 'slide';
        }

        if(mode === 'hold') {
            mode = 'context';
        }

        return mode;
    }
);
registerOption(
    function() {
        return this.option('selectionMode') !== 'none' && this.option('showSelectionControls');
    },
    function() {
        return 'selection';
    },
    function() {
        return 'default';
    }
);
registerOption(
    function() {
        return this.option('itemDragging.allowReordering') || this.option('itemDragging.allowDropInsideItem') || this.option('itemDragging.group');
    },
    function() {
        return 'reorder';
    },
    function() {
        return 'default';
    }
);


const LIST_ITEM_BEFORE_BAG_CLASS = 'dx-list-item-before-bag';
const LIST_ITEM_AFTER_BAG_CLASS = 'dx-list-item-after-bag';

const DECORATOR_BEFORE_BAG_CREATE_METHOD = 'beforeBag';
const DECORATOR_AFTER_BAG_CREATE_METHOD = 'afterBag';
const DECORATOR_MODIFY_ELEMENT_METHOD = 'modifyElement';
const DECORATOR_AFTER_RENDER_METHOD = 'afterRender';
const DECORATOR_GET_EXCLUDED_SELECTORS_METHOD = 'getExcludedSelectors';

const EditProvider = Class.inherit({

    ctor: function(list) {
        this._list = list;
        this._fetchRequiredDecorators();
    },

    dispose: function() {
        if(this._decorators && this._decorators.length) {
            each(this._decorators, function(_, decorator) {
                decorator.dispose();
            });
        }
    },

    _fetchRequiredDecorators: function() {
        this._decorators = [];

        each(editOptionsRegistry, (function(_, option) {
            const optionEnabled = option.enabled.call(this._list);
            if(optionEnabled) {
                const decoratorType = option.decoratorType.call(this._list);
                const decoratorSubType = option.decoratorSubType.call(this._list);

                const decorator = this._createDecorator(decoratorType, decoratorSubType);

                this._decorators.push(decorator);
            }
        }).bind(this));
    },

    _createDecorator: function(type, subType) {
        const decoratorClass = this._findDecorator(type, subType);

        return new decoratorClass(this._list);
    },

    _findDecorator: function(type, subType) {
        const foundDecorator = decoratorRegistry.registry[type][subType];

        if(!foundDecorator) {
            throw errors.Error('E1012', type, subType);
        }

        return foundDecorator;
    },

    modifyItemElement: function(args) {
        const $itemElement = $(args.itemElement);

        const config = {
            $itemElement: $itemElement
        };

        this._prependBeforeBags($itemElement, config);
        this._appendAfterBags($itemElement, config);
        this._applyDecorators(DECORATOR_MODIFY_ELEMENT_METHOD, config);
    },

    afterItemsRendered: function() {
        this._applyDecorators(DECORATOR_AFTER_RENDER_METHOD);
    },

    _prependBeforeBags: function($itemElement, config) {
        const $beforeBags = this._collectDecoratorsMarkup(DECORATOR_BEFORE_BAG_CREATE_METHOD, config, LIST_ITEM_BEFORE_BAG_CLASS);
        $itemElement.prepend($beforeBags);
    },

    _appendAfterBags: function($itemElement, config) {
        const $afterBags = this._collectDecoratorsMarkup(DECORATOR_AFTER_BAG_CREATE_METHOD, config, LIST_ITEM_AFTER_BAG_CLASS);
        $itemElement.append($afterBags);
    },

    _collectDecoratorsMarkup: function(method, config, containerClass) {
        const $collector = $('<div>');

        each(this._decorators, function() {
            const $container = $('<div>').addClass(containerClass);
            this[method](extend({
                $container: $container
            }, config));
            if($container.children().length) {
                $collector.append($container);
            }
        });

        return $collector.children();
    },

    _applyDecorators: function(method, config) {
        each(this._decorators, function() {
            this[method](config);
        });
    },

    _handlerExists: function(name) {
        if(!this._decorators) {
            return false;
        }

        const decorators = this._decorators;
        const length = decorators.length;
        for(let i = 0; i < length; i++) {
            if(decorators[i][name] !== noop) {
                return true;
            }
        }

        return false;
    },

    _eventHandler: function(name, $itemElement, e) {
        if(!this._decorators) {
            return false;
        }

        let response = false;
        const decorators = this._decorators;
        const length = decorators.length;
        for(let i = 0; i < length; i++) {
            response = decorators[i][name]($itemElement, e);
            if(response) {
                break;
            }
        }

        return response;
    },

    handleClick: function($itemElement, e) {
        return this._eventHandler('handleClick', $itemElement, e);
    },

    handleKeyboardEvents: function(currentFocusedIndex, moveFocusUp) {
        return this._eventHandler('handleKeyboardEvents', currentFocusedIndex, moveFocusUp);
    },

    handleEnterPressing: function(e) {
        return this._eventHandler('handleEnterPressing', e);
    },

    contextMenuHandlerExists: function() {
        return this._handlerExists('handleContextMenu');
    },

    handleContextMenu: function($itemElement, e) {
        return this._eventHandler('handleContextMenu', $itemElement, e);
    },

    getExcludedItemSelectors: function() {
        const excludedSelectors = [];

        this._applyDecorators(DECORATOR_GET_EXCLUDED_SELECTORS_METHOD, excludedSelectors);

        return excludedSelectors.join(',');
    }
});

module.exports = EditProvider;
