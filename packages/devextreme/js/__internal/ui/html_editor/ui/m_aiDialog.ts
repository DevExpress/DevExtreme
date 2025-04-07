import localizationMessage from '@js/common/core/localization/message';
import $ from '@js/core/renderer';
import { extend } from '@js/core/utils/extend';
import type { HtmlEditorAICustomCommand } from '@js/ui/html_editor';
import type { Properties as PopupProperties, ToolbarItem } from '@js/ui/popup';
import SelectBox from '@js/ui/select_box';
import TextArea from '@js/ui/text_area';

import type { CommandDefinition, CommandsMap } from '../utils/m_ai';
import DialogBase from './m_baseDialog';

const AI_DIALOG_COMMANDS_WITH_OPTIONS = ['translate', 'changeStyle', 'changeTone', 'custom'];

export interface AIDialogShowPayload {
  currentCommand: string;
  currentOption?: string;
  text?: string;
  commandsMap: CommandsMap;
  prompt?: HtmlEditorAICustomCommand['prompt'];
}

const AI_DIALOG_CONTROLS_CLASS = 'dx-aidialog-controls';
const AI_DIALOG_CONTENT_CLASS = 'dx-aidialog-content';

export default class AIDialog extends DialogBase {
  private _loading = false;

  private readonly _aIService;

  private _commandsMap: CommandsMap = {};

  private _currentCommand?: string;

  private _currentOption?: string;

  private _optionsList?: string[];

  private _resultText = '';

  private _prompt?: HtmlEditorAICustomCommand['prompt'];

  private _commandBoxInstance?: SelectBox;

  private _optionBoxInstance?: SelectBox;

  private _textAreaInstance?: TextArea;

  constructor(editorInstance, popupConfig: PopupProperties, aIService?) {
    super(editorInstance, popupConfig);

    this._aIService = aIService;
  }

  protected _getPopupConfig(): PopupProperties {
    const baseConfig = super._getPopupConfig();

    return extend(true, {}, baseConfig, {
      titleTemplate: (titleElement) => {
        const $titleContainer = $('<div>').addClass('dx-aidialog-title');
        const $icon = $('<i>').addClass('dx-icon dx-icon-sparkle');
        const $text = $('<span>')
          .addClass('ai-dialog-title-text')
          .text(localizationMessage.format('dxHtmlEditor-aiDialogTitle'));
        $titleContainer
          .append($icon)
          .append($text);
        $(titleElement).append($titleContainer);
      },
      width: 460,
      shading: false,
      dragEnabled: true,
      dragAndResizeArea: this._editorInstance?.$element(),
      toolbarItems: this._getToolbarItems(),
      showCloseButton: true,
    }) as PopupProperties;
  }

  protected _renderContent(contentElem: HTMLElement): void {
    const $container = $(contentElem);
    $container.addClass(AI_DIALOG_CONTENT_CLASS);

    const $controls = $('<div>')
      .addClass(AI_DIALOG_CONTROLS_CLASS)
      .appendTo($container);

    const $commandSelectBox = $('<div>').appendTo($controls);
    this._commandBoxInstance = this._editorInstance._createComponent($commandSelectBox, SelectBox, {
      value: this._currentCommand,
      displayExpr: 'text',
      valueExpr: 'id',
      onValueChanged: (e) => {
        if (e.value === this._currentCommand) {
          return;
        }

        this._currentCommand = e.value;
        this._optionsList = this._commandsMap?.[e.value]?.options ?? [];
        this._currentOption = this._optionsList?.[0];

        this._updateUI();
      },
    });

    const $optionSelectBox = $('<div>').appendTo($controls);
    this._optionBoxInstance = this._editorInstance._createComponent($optionSelectBox, SelectBox, {
      width: 'auto',
      items: this._optionsList,
      value: this._currentOption ?? this._optionsList?.[0],
      visible: this._getHasOptions(),
      onValueChanged: (e) => {
        this._currentOption = e.value;
      },
    });

    const $textArea = $('<div>').appendTo($container);
    this._textAreaInstance = this._editorInstance._createComponent($textArea, TextArea, {
      value: this._resultText,
      height: 100,
      width: '100%',
      readOnly: true,
    });
  }

  private _updateOptionSelectBox(): void {
    const hasOptions = this._getHasOptions();

    this._optionBoxInstance?.option({
      visible: hasOptions,
      items: this._optionsList ?? [],
      value: this._currentOption ?? this._optionsList?.[0],
    });
  }

  protected _getToolbarItems(): ToolbarItem[] {
    return [
      {
        toolbar: 'bottom',
        location: 'before',
        widget: 'dxDropDownButton',
        options: {
          text: localizationMessage.format('dxHtmlEditor-aiReplace'),
          stylingMode: 'contained',
          type: 'default',
          items: [
            { id: 'replace', text: localizationMessage.format('dxHtmlEditor-aiReplace') },
            { id: 'insertAbove', text: localizationMessage.format('dxHtmlEditor-aiInsertAbove') },
            { id: 'insertBelow', text: localizationMessage.format('dxHtmlEditor-aiInsertBelow') },
          ],
          dropDownOptions: {
            width: 'auto',
          },
          onItemClick: this.replaceButtonAction,
        },
      },
      {
        toolbar: 'bottom',
        location: 'after',
        widget: 'dxButton',
        options: {
          text: localizationMessage.format('dxHtmlEditor-aiCopy'),
          onClick: () => navigator?.clipboard?.writeText(this._resultText),
        },
      },
      {
        toolbar: 'bottom',
        location: 'after',
        widget: 'dxButton',
        options: {
          text: localizationMessage.format('dxHtmlEditor-aiTryAgain'),
          onClick: () => this._retryAIRequest(),
        },
      },
    ];
  }

  private _retryAIRequest(): void {
    // TODO: implement with integration
  }

  private _getHasOptions(): boolean {
    return AI_DIALOG_COMMANDS_WITH_OPTIONS.includes(this._currentCommand ?? '');
  }

  private _updateUI(): void {
    const commandsList = Object.entries(this._commandsMap).map(
      ([id, config]: [string, CommandDefinition]) => ({ id, text: config.text }),
    );

    this._commandBoxInstance?.option({
      dataSource: commandsList,
      value: this._currentCommand,
    });

    this._updateOptionSelectBox();

    this._textAreaInstance?.option('value', this._resultText);
  }

  private _setLoadingState(isLoading: boolean) {
    this._loading = isLoading;
  }

  replaceButtonAction(event?): void {
    // TODO: implement with integration
    this.hide(this._resultText, event);
  }

  show({
    currentCommand, currentOption, commandsMap, text, prompt,
  }: AIDialogShowPayload): Promise<unknown> | undefined {
    this._commandsMap = commandsMap;
    this._currentCommand = currentCommand;
    this._resultText = text ?? '';
    this._optionsList = commandsMap[currentCommand]?.options ?? [];
    this._currentOption = currentOption;
    this._prompt = prompt;

    this._updateUI();

    return super.show();
  }
}
