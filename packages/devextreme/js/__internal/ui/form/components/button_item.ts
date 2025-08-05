import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { extend } from '@js/core/utils/extend';
import { isDefined } from '@js/core/utils/type';
import type { Properties } from '@js/ui/button';
import type { HorizontalAlignment, VerticalAlignment } from '@js/ui/form';
import type Button from '@ts/ui/button/wrapper';
import type { TemplatesInfo } from '@ts/ui/form/form.layout_manager';

const FIELD_BUTTON_ITEM_CLASS = 'dx-field-button-item';

type ButtonItemRenderInfo = TemplatesInfo & {
  validationGroup?: string;
  createComponentCallback: (
    $element: dxElementWrapper,
    options: Properties,
  ) => Button;
};

function convertAlignmentToTextAlign(
  horizontalAlignment: HorizontalAlignment | undefined,
): HorizontalAlignment {
  return isDefined(horizontalAlignment) ? horizontalAlignment : 'right';
}

function convertAlignmentToJustifyContent(
  verticalAlignment: VerticalAlignment | undefined,
): string {
  switch (verticalAlignment) {
    case 'center':
      return 'center';
    case 'bottom':
      return 'flex-end';
    default:
      return 'flex-start';
  }
}

export function renderButtonItem({
  item,
  $parent,
  rootElementCssClassList,
  validationGroup,
  createComponentCallback,
}: ButtonItemRenderInfo): {
    $rootElement: dxElementWrapper;
    buttonInstance: Button;
  } {
  const $rootElement = $('<div>')
    .appendTo($parent)
    .addClass(rootElementCssClassList.join(' '))
    .addClass(FIELD_BUTTON_ITEM_CLASS)
    .css('textAlign', convertAlignmentToTextAlign(item.horizontalAlignment));

  // TODO: try to avoid changes in $container.parent() and adjust the created $elements only
  $parent.css('justifyContent', convertAlignmentToJustifyContent(item.verticalAlignment));

  const $button = $('<div>')
    .appendTo($rootElement);

  return {
    $rootElement,
    buttonInstance: createComponentCallback(
      $button,
      extend({ validationGroup }, item.buttonOptions),
    ),
  };
}
