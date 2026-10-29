import messageLocalization from '@js/common/core/localization/message';
import Guid from '@js/core/guid';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import Accordion from '@js/ui/accordion';
import type { ToolCall } from '@js/ui/chat';
import TextArea from '@js/ui/text_area';
import { ICON_CLASS } from '@ts/core/utils/icon';
import type { DOMComponentProperties } from '@ts/core/widget/dom_component';
import DOMComponent from '@ts/core/widget/dom_component';
import type { OptionChanged } from '@ts/core/widget/types';

export interface ToolCallViewProperties extends DOMComponentProperties<ToolCallView> {
  toolCalls?: ToolCall[];
  expandAll?: boolean;
}

export const CHAT_TOOL_CALL_CLASSES = {
  view: 'dx-chat-tool-call-view',
  header: 'dx-chat-tool-call-header',
  icon: 'dx-chat-tool-call-icon',
  name: 'dx-chat-tool-call-name',
  errorTag: 'dx-chat-tool-call-error-tag',
  field: 'dx-chat-tool-call-field',
  fieldLabel: 'dx-chat-tool-call-field-label',
  arguments: 'dx-chat-tool-call-arguments',
  result: 'dx-chat-tool-call-result',
  error: 'dx-chat-tool-call-error',
};

const stringifyValue = (value: unknown): string => (typeof value === 'string'
  ? value
  : JSON.stringify(value, null, 2));

class ToolCallView extends DOMComponent<ToolCallView, ToolCallViewProperties> {
  _getDefaultOptions(): ToolCallViewProperties {
    return {
      ...super._getDefaultOptions(),
      toolCalls: [],
      expandAll: false,
    };
  }

  _initMarkup(): void {
    this.$element().addClass(CHAT_TOOL_CALL_CLASSES.view);

    super._initMarkup();

    this._renderToolCalls();
  }

  _renderToolCalls(): void {
    const { toolCalls = [], expandAll } = this.option();

    if (toolCalls.length > 1) {
      this._renderHeader(toolCalls);
    }

    const items = toolCalls.map((call) => ({ title: call.name, call }));

    this._createComponent($('<div>').appendTo(this.$element()), Accordion, {
      dataSource: items,
      collapsible: true,
      multiple: true,
      focusStateEnabled: false,
      selectedItems: items.filter(({ call }) => call.expanded ?? expandAll),
      itemTitleTemplate: ({ call }: { call: ToolCall }, _: number, element: Element): void => {
        this._renderTitle(call, element);
      },
      itemTemplate: ({ call }: { call: ToolCall }, _: number, element: Element): void => {
        this._renderBody(call, element);
      },
    });
  }

  _renderHeader(toolCalls: ToolCall[]): void {
    const errorCount = toolCalls.filter(({ status }) => status === 'error').length;
    const $header = $('<div>')
      .addClass(CHAT_TOOL_CALL_CLASSES.header)
      .appendTo(this.$element());

    $('<span>')
      .text(messageLocalization.format('dxChat-toolCallsTitle', toolCalls.length))
      .appendTo($header);

    if (errorCount) {
      const errorKey = errorCount === 1
        ? 'dxChat-toolCallsErrorSingle'
        : 'dxChat-toolCallsErrorMultiple';

      this._renderErrorTag(messageLocalization.format(errorKey, errorCount), $header);
    }
  }

  _renderTitle(call: ToolCall, container: Element): void {
    const $container = $(container);

    $('<span>')
      .addClass(ICON_CLASS)
      .addClass(`${ICON_CLASS}-wrench`)
      .addClass(CHAT_TOOL_CALL_CLASSES.icon)
      .appendTo($container);

    $('<span>')
      .addClass(CHAT_TOOL_CALL_CLASSES.name)
      .text(call.name)
      .appendTo($container);

    if (call.status === 'error') {
      this._renderErrorTag(messageLocalization.format('dxChat-toolCallError'), $container);
    }
  }

  _renderErrorTag(text: string, $container: dxElementWrapper): void {
    $('<span>')
      .addClass(CHAT_TOOL_CALL_CLASSES.errorTag)
      .text(text)
      .appendTo($container);
  }

  _renderBody(call: ToolCall, container: Element): void {
    const hasArguments = !!call.arguments && Object.keys(call.arguments).length > 0;
    const hasResult = call.result !== undefined && call.result !== '';

    if (hasArguments) {
      this._renderField(
        container,
        CHAT_TOOL_CALL_CLASSES.arguments,
        messageLocalization.format('dxChat-toolCallArgumentsLabel'),
        stringifyValue(call.arguments),
      );
    }

    if (hasResult) {
      this._renderField(
        container,
        CHAT_TOOL_CALL_CLASSES.result,
        messageLocalization.format('dxChat-toolCallResultLabel'),
        stringifyValue(call.result),
        call.status === 'error',
      );
    }
  }

  _renderField(
    container: Element,
    fieldClass: string,
    labelText: string,
    value: string,
    isError = false,
  ): void {
    const labelId = `dx-${new Guid()}`;
    const $field = $('<div>')
      .addClass(CHAT_TOOL_CALL_CLASSES.field)
      .addClass(fieldClass)
      .appendTo(container);

    $('<div>')
      .attr('id', labelId)
      .addClass(CHAT_TOOL_CALL_CLASSES.fieldLabel)
      .text(labelText)
      .appendTo($field);

    this._createComponent($('<div>').appendTo($field), TextArea, {
      value,
      readOnly: true,
      stylingMode: 'outlined',
      autoResizeEnabled: true,
      focusStateEnabled: false,
      hoverStateEnabled: false,
      inputAttr: { 'aria-labelledby': labelId },
      elementAttr: isError ? { class: CHAT_TOOL_CALL_CLASSES.error } : {},
    });
  }

  _clean(): void {
    this.$element().empty();

    super._clean();
  }

  _optionChanged(args: OptionChanged<ToolCallViewProperties>): void {
    const { name } = args;

    switch (name) {
      case 'toolCalls':
      case 'expandAll':
        this._invalidate();
        break;
      default:
        super._optionChanged(args);
    }
  }
}

export default ToolCallView;
