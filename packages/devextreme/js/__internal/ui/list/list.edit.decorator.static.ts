import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import type { ClickEvent, Properties as ButtonProperties } from '@js/ui/button';
import Button from '@ts/ui/button/wrapper';
import type { BagConfig } from '@ts/ui/list/list.edit.decorator';
import EditDecorator from '@ts/ui/list/list.edit.decorator';
import { register as registerDecorator } from '@ts/ui/list/list.edit.decorator_registry';

const STATIC_DELETE_BUTTON_CONTAINER_CLASS = 'dx-list-static-delete-button-container';
const STATIC_DELETE_BUTTON_CLASS = 'dx-list-static-delete-button';

class EditDecoratorStatic extends EditDecorator {
  afterBag(config: BagConfig): void {
    const { $itemElement, $container } = config;

    const $button = $('<div>').addClass(STATIC_DELETE_BUTTON_CLASS);

    this._list._createComponent<Button, ButtonProperties>($button, Button, {
      icon: 'remove',
      onClick: (args: ClickEvent): void => {
        const { event } = args;

        event?.stopPropagation();
        this._deleteItem($itemElement);
      },
      // @ts-expect-error
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
  }

  _deleteItem($itemElement: dxElementWrapper): void {
    if ($itemElement.is('.dx-state-disabled, .dx-state-disabled *')) {
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this._list.deleteItem($itemElement.get(0));
  }
}

registerDecorator(
  'delete',
  'static',
  EditDecoratorStatic,
);
