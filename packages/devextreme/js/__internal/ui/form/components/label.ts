import { getPublicElement } from '@js/core/element';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import type { FunctionTemplate } from '@js/core/templates/function_template';
import { isDefined } from '@js/core/utils/type';
import type { SimpleItem } from '@js/ui/form';
import {
  FIELD_ITEM_LABEL_CLASS,
  FIELD_ITEM_LABEL_CONTENT_CLASS,
} from '@ts/ui/form/constants';
import type Form from '@ts/ui/form/form';
import type LayoutManager from '@ts/ui/form/form.layout_manager';
import type { LabelMarkOptions } from '@ts/ui/form/form.layout_manager.utils';
import { getLabelMarkText } from '@ts/ui/form/form.layout_manager.utils';

// TODO: exported for tests only
export const GET_LABEL_WIDTH_BY_TEXT_CLASS = 'dx-layout-manager-hidden-label';
export const FIELD_ITEM_REQUIRED_MARK_CLASS = 'dx-field-item-required-mark';
export const FIELD_ITEM_LABEL_LOCATION_CLASS = 'dx-field-item-label-location-';
export const FIELD_ITEM_OPTIONAL_MARK_CLASS = 'dx-field-item-optional-mark';
export const FIELD_ITEM_LABEL_TEXT_CLASS = 'dx-field-item-label-text';

export interface SimpleItemLabelTemplateData {
  component: Form | LayoutManager;
  dataField?: string;
  editorOptions?: SimpleItem['editorOptions'];
  editorType?: string;
  name?: string;
  text?: string;
}

export type LabelOptions = SimpleItem['label'] & {
  id: string;
  isRequired: boolean;

  markOptions: LabelMarkOptions;
  labelTemplate: FunctionTemplate;
  labelTemplateData: SimpleItemLabelTemplateData;
  onLabelTemplateRendered: () => void;

  labelID?: string | null;
  textWithoutColon?: string;
  showColon?: boolean;
  visible?: boolean;
};

function renderLabelMark(
  markOptions: LabelMarkOptions,
): dxElementWrapper {
  const markText = getLabelMarkText(markOptions);
  if (markText === '') {
    return $();
  }

  const markClass = markOptions.showRequiredMark
    ? FIELD_ITEM_REQUIRED_MARK_CLASS
    : FIELD_ITEM_OPTIONAL_MARK_CLASS;

  return $('<span>')
    .addClass(markClass)
    .text(markText);
}

export function renderLabel({
  text,
  id,
  location,
  alignment,
  labelID = null,
  markOptions = {},
  labelTemplate,
  labelTemplateData,
  onLabelTemplateRendered,
}: LabelOptions): dxElementWrapper | null {
  if ((!isDefined(text) || text.length <= 0) && !isDefined(labelTemplate)) {
    return null;
  }

  const $label = $('<label>')
    .addClass(`${FIELD_ITEM_LABEL_CLASS} ${FIELD_ITEM_LABEL_LOCATION_CLASS}${location}`)
    .attr('for', id)
    .attr('id', labelID)
    // @ts-expect-error ts-error
    .css('textAlign', alignment);

  const $labelContainer = $('<span>')
    .addClass(FIELD_ITEM_LABEL_CONTENT_CLASS);
  let $labelContent = $('<span>')
    .addClass(FIELD_ITEM_LABEL_TEXT_CLASS);
  // @ts-expect-error ts-error
  $labelContent.text(text);

  if (labelTemplate) {
    $labelContent = $('<div>')
      .addClass('dx-field-item-custom-label-content');

    labelTemplateData.text = text;

    labelTemplate.render({
      container: getPublicElement($labelContent),
      model: labelTemplateData,
      // @ts-expect-error ts-error
      onRendered() {
        onLabelTemplateRendered?.();
      },
    });
  }

  return $label
    .append(
      $labelContainer
        .append($labelContent)
        .append(renderLabelMark(markOptions)),
    );
}

function getLabelWidthByHTML(labelContent: dxElementWrapper): number {
  let result = 0;
  const itemsCount = labelContent.children.length;

  for (let i = 0; i < itemsCount; i += 1) {
    const child = labelContent.children[i];
    result += child.offsetWidth;
  }

  return result;
}

export function setLabelWidthByMaxLabelWidth(
  $targetContainer: dxElementWrapper,
  labelsSelector: string,
): void {
  const labelContentItemsSelector = `${labelsSelector} > .${FIELD_ITEM_LABEL_CLASS}:not(.${FIELD_ITEM_LABEL_LOCATION_CLASS}top) > .${FIELD_ITEM_LABEL_CONTENT_CLASS}`;

  const $labelContentItems = $targetContainer.find(labelContentItemsSelector);
  const labelContentItemCount = $labelContentItems.length;
  let labelWidth = 0;
  let maxWidth = 0;

  for (let i = 0; i < labelContentItemCount; i += 1) {
    labelWidth = getLabelWidthByHTML($labelContentItems[i]);
    if (labelWidth > maxWidth) {
      maxWidth = labelWidth;
    }
  }
  for (let i = 0; i < labelContentItemCount; i += 1) {
    $labelContentItems[i].style.width = `${maxWidth}px`;
  }
}
