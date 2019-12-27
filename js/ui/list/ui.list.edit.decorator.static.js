const $ = require('../../core/renderer');
const Button = require('../button');
const registerDecorator = require('./ui.list.edit.decorator_registry').register;
const EditDecorator = require('./ui.list.edit.decorator');

const STATIC_DELETE_BUTTON_CONTAINER_CLASS = 'dx-list-static-delete-button-container';
const STATIC_DELETE_BUTTON_CLASS = 'dx-list-static-delete-button';

registerDecorator(
    'delete',
    'static',
    EditDecorator.inherit({
        afterBag: function(config) {
            const $itemElement = config.$itemElement;
            const $container = config.$container;

            const $button = $('<div>').addClass(STATIC_DELETE_BUTTON_CLASS);

            this._list._createComponent($button, Button, {
                icon: 'remove',
                onClick: (function(args) {
                    args.event.stopPropagation();
                    this._deleteItem($itemElement);
                }).bind(this),
                integrationOptions: {}
            });

            $container
                .addClass(STATIC_DELETE_BUTTON_CONTAINER_CLASS)
                .append($button);
        },

        _deleteItem: function($itemElement) {
            if($itemElement.is('.dx-state-disabled, .dx-state-disabled *')) {
                return;
            }

            this._list.deleteItem($itemElement);
        }
    })
);
