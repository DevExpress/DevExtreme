import $ from '@js/core/renderer';
import Button from '@js/ui/button';

import EditDecorator from './m_list.edit.decorator';
import { register as registerDecorator } from './m_list.edit.decorator_registry';

const STATIC_DELETE_BUTTON_CONTAINER_CLASS = 'dx-list-static-delete-button-container';
const STATIC_DELETE_BUTTON_CLASS = 'dx-list-static-delete-button';

registerDecorator(
  'delete',
  'static',
  EditDecorator.inherit({
    afterBag(config) {
      const { $itemElement } = config;
      const { $container } = config;

      const $button = $('<div>').addClass(STATIC_DELETE_BUTTON_CLASS);

      this._list._createComponent($button, Button, {
        icon: 'remove',
        onClick: function (args) {
          args.event.stopPropagation();
          this._deleteItem($itemElement);
        }.bind(this),
        integrationOptions: {},
        elementAttr: {
          role: null,
          'aria-label': null,
        },
        tabIndex: -1,
      });

      $container
        .addClass(STATIC_DELETE_BUTTON_CONTAINER_CLASS)
        .append($button);
    },

    _deleteItem($itemElement) {
      if ($itemElement.is('.dx-state-disabled, .dx-state-disabled *')) {
        return;
      }

      this._list.deleteItem($itemElement);
    },
  }),
);
