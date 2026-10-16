import { name as clickEventName } from '@js/common/core/events/click';
import eventsEngine from '@js/common/core/events/core/events_engine';
import { addNamespace } from '@js/common/core/events/utils';
import messageLocalization from '@js/common/core/localization/message';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { noop } from '@js/core/utils/common';
import { isString } from '@js/core/utils/type';
import type { Item as AccordionItem } from '@js/ui/accordion';
import type { ButtonType } from '@js/ui/button';
import type { ToolCall } from '@js/ui/chat';
import { ICON_CLASS } from '@ts/core/utils/icon';
import type { DOMComponentProperties } from '@ts/core/widget/dom_component';
import DOMComponent from '@ts/core/widget/dom_component';
import type { OptionChanged } from '@ts/core/widget/types';
import Accordion from '@ts/ui/accordion';
import TextArea from '@ts/ui/text_area';

export interface ToolCallViewProperties extends DOMComponentProperties<ToolCallView> {
  toolCalls?: ToolCall[];
}

interface FieldConfig {
  label: string;
  value: string;
  maxHeight: number;
  isError?: boolean;
}

interface CopyButtonState {
  icon: string;
  hint: string;
  type: ButtonType;
}

export const CHAT_TOOL_CALL_VIEW_CLASS = 'dx-chat-tool-call-view';
export const CHAT_TOOL_CALL_TITLE_CLASS = 'dx-chat-tool-call-title';
export const CHAT_TOOL_CALL_ICON_CLASS = `${ICON_CLASS}-toolbox`;
export const CHAT_TOOL_CALL_NAME_CLASS = 'dx-chat-tool-call-name';
export const CHAT_TOOL_CALL_ERROR_BADGE_CLASS = 'dx-chat-tool-call-error-badge';
export const CHAT_TOOL_CALL_CONTENT_CLASS = 'dx-chat-tool-call-content';
export const CHAT_TOOL_CALL_FIELD_CLASS = 'dx-chat-tool-call-field';
export const CHAT_TOOL_CALL_FIELD_LABEL_CLASS = 'dx-chat-tool-call-field-label';
export const CHAT_TOOL_CALL_FIELD_ERROR_CLASS = 'dx-chat-tool-call-field-error';

export const COPY_BUTTON_NAME = 'copy';
export const COPIED_STATE_DURATION = 2000;
const ARGUMENTS_MAX_HEIGHT = 320;
const RESULT_MAX_HEIGHT = 240;
const FIELD_CLICK_EVENT_NAME = addNamespace(clickEventName, 'dxChatToolCallView');

const formatValue = (value: unknown): string => (Array.isArray(value)
  ? `[${value.map(formatValue).join(', ')}]`
  : JSON.stringify(value));

const formatArguments = (args: ToolCall['arguments'] = {}): string => Object.entries(args)
  .map(([key, value]) => `${key}: ${formatValue(value)}`)
  .join(', ');

const formatResult = (result: unknown): string => {
  if (result === undefined) {
    return '';
  }

  return isString(result) ? result : JSON.stringify(result, null, 2);
};

class ToolCallView extends DOMComponent<ToolCallView, ToolCallViewProperties> {
  _getDefaultOptions(): ToolCallViewProperties {
    return {
      ...super._getDefaultOptions(),
      toolCalls: [],
    };
  }

  _initMarkup(): void {
    this.$element().addClass(CHAT_TOOL_CALL_VIEW_CLASS);

    super._initMarkup();

    this._renderToolCalls();
  }

  _renderToolCalls(): void {
    const { toolCalls = [] } = this.option();

    if (toolCalls.length < 2) {
      this._renderToolCallList(this.$element(), toolCalls);

      return;
    }

    // @ts-expect-error
    const groupTitle = messageLocalization.format('dxChat-toolCallsGroupTitle', toolCalls.length);

    this._renderAccordion(this.$element(), [{
      titleTemplate: (): Element => this._createTitle(groupTitle, false),
      template: (_data, _index, element): Element => {
        const $content = this._createContent(element);

        this._renderToolCallList($content, toolCalls);

        return $content.get(0);
      },
    }]);
  }

  _renderToolCallList($container: dxElementWrapper, toolCalls: ToolCall[]): void {
    const items = toolCalls.map((toolCall): AccordionItem => ({
      titleTemplate: (): Element => this._createTitle(toolCall.name, toolCall.status === 'error'),
      template: (_data, _index, element): Element => {
        const $content = this._createContent(element);

        this._renderToolCallFields($content, toolCall);

        return $content.get(0);
      },
    }));

    this._renderAccordion($container, items);
  }

  _renderAccordion($container: dxElementWrapper, items: AccordionItem[]): void {
    if (!items.length) {
      return;
    }

    const $accordion = $('<div>').appendTo($container);

    this._createComponent($accordion, Accordion, {
      items,
      collapsible: true,
      multiple: true,
      selectedIndex: -1,
    });
  }

  _createTitle(text: string, isError: boolean): Element {
    const $title = $('<div>').addClass(CHAT_TOOL_CALL_TITLE_CLASS);

    $('<div>')
      .addClass(ICON_CLASS)
      .addClass(CHAT_TOOL_CALL_ICON_CLASS)
      .appendTo($title);

    $('<div>')
      .addClass(CHAT_TOOL_CALL_NAME_CLASS)
      .text(text)
      .attr('title', text)
      .appendTo($title);

    if (isError) {
      $('<div>')
        .addClass(CHAT_TOOL_CALL_ERROR_BADGE_CLASS)
        .text(messageLocalization.format('dxChat-toolCallErrorText'))
        .appendTo($title);
    }

    return $title.get(0);
  }

  _createContent(container: Element): dxElementWrapper {
    return $('<div>')
      .addClass(CHAT_TOOL_CALL_CONTENT_CLASS)
      .appendTo(container);
  }

  _renderToolCallFields($container: dxElementWrapper, toolCall: ToolCall): void {
    const argumentsText = formatArguments(toolCall.arguments);
    const resultText = formatResult(toolCall.result);

    if (argumentsText) {
      this._renderField($container, {
        label: messageLocalization.format('dxChat-toolCallArgumentsLabel'),
        value: argumentsText,
        maxHeight: ARGUMENTS_MAX_HEIGHT,
      });
    }

    if (resultText) {
      this._renderField($container, {
        label: messageLocalization.format('dxChat-toolCallResultLabel'),
        value: resultText,
        maxHeight: RESULT_MAX_HEIGHT,
        isError: toolCall.status === 'error',
      });
    }
  }

  _renderField($container: dxElementWrapper, config: FieldConfig): void {
    const {
      label, value, maxHeight, isError = false,
    } = config;

    const $field = $('<div>')
      .addClass(CHAT_TOOL_CALL_FIELD_CLASS)
      .toggleClass(CHAT_TOOL_CALL_FIELD_ERROR_CLASS, isError)
      .appendTo($container);

    $('<div>')
      .addClass(CHAT_TOOL_CALL_FIELD_LABEL_CLASS)
      .text(label)
      .appendTo($field);

    const $editor = $('<div>').appendTo($field);

    const copyState: CopyButtonState = {
      icon: 'copy',
      hint: messageLocalization.format('dxChat-copyButtonLabel'),
      type: 'normal',
    };
    const copiedState: CopyButtonState = {
      icon: 'check',
      hint: messageLocalization.format('dxChat-copiedButtonLabel'),
      type: 'success',
    };

    const textArea = this._createComponent($editor, TextArea, {
      value,
      readOnly: true,
      stylingMode: 'outlined',
      autoResizeEnabled: true,
      maxHeight,
      hoverStateEnabled: false,
      focusStateEnabled: false,
      inputAttr: { 'aria-label': label },
      buttons: [{
        name: COPY_BUTTON_NAME,
        location: 'after',
        options: {
          ...copyState,
          elementAttr: { 'aria-label': copyState.hint },
          stylingMode: 'text',
          disabled: false,
        },
      }],
    });
    const copyButton = textArea.getButton(COPY_BUTTON_NAME);
    const copiedStateTimer: { id?: ReturnType<typeof setTimeout> } = {};

    const setCopyButtonState = (state: CopyButtonState): void => {
      copyButton?.option({
        ...state,
        elementAttr: { 'aria-label': state.hint },
      });
    };

    const copyValue = (): void => {
      navigator.clipboard?.writeText(value)
        .then(() => {
          setCopyButtonState(copiedState);

          clearTimeout(copiedStateTimer.id);
          // eslint-disable-next-line no-restricted-globals
          copiedStateTimer.id = setTimeout(() => {
            setCopyButtonState(copyState);
          }, COPIED_STATE_DURATION);
        })
        .catch(noop);
    };

    copyButton?.option('onClick', copyValue);

    textArea.on('disposing', () => {
      clearTimeout(copiedStateTimer.id);
    });

    eventsEngine.on($editor, FIELD_CLICK_EVENT_NAME, copyValue);
  }

  _clean(): void {
    this.$element().empty();

    super._clean();
  }

  _optionChanged(args: OptionChanged<ToolCallViewProperties>): void {
    const { name } = args;

    switch (name) {
      case 'toolCalls':
        this._invalidate();
        break;
      default:
        super._optionChanged(args);
    }
  }
}

export default ToolCallView;
