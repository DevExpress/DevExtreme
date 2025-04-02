import localizationMessage from '@js/common/core/localization/message';
import $ from '@js/core/renderer';
import { extend } from '@js/core/utils/extend';
import type { ToolbarItem } from '@js/ui/popup';
import SelectBox from '@js/ui/select_box';
import TextArea from '@js/ui/text_area';

import type { CommandDefinition, CommandsMap } from '../utils/m_ai';
import DialogBase from './m_baseDialog';

const AI_DIALOG_COMMANDS_WITH_OPTIONS = ['translate', 'changeStyle', 'changeTone'];

export interface AIDialogShowPayload {
  currentCommand: string;
  currentOption?: string;
  text?: string;
  commandsMap: CommandsMap;
}

const AI_DIALOG_CONTROLS_CLASS = 'dx-aidialog-controls';
const AI_DIALOG_CONTENT_CLASS = 'dx-aidialog-content';

export default class AIDialog extends DialogBase {
  private _loading = false;

  private readonly _serviceAI;

  private _commandsMap: CommandsMap = {};

  private _currentCommand?: string;

  private _currentOption?: string;

  private _optionsList?: string[];

  private _resultText = '';

  private _commandBoxInstance?: SelectBox;

  private _optionBoxInstance?: SelectBox;

  private _textAreaInstance?: TextArea;

  // eslint-disable-next-line spellcheck/spell-checker
  constructor(editorInstance, popupConfig?, aiService?) {
    super(editorInstance, popupConfig);

    // eslint-disable-next-line spellcheck/spell-checker
    this._serviceAI = aiService;
  }

  protected _getPopupConfig() {
    const baseConfig = super._getPopupConfig();

    return extend(true, {}, baseConfig, {
      title: localizationMessage.format('dxHtmlEditor-aiDialogTitle'),
      width: 460,
      shading: false,
      dragEnabled: true,
      dragAndResizeArea: this._editorInstance?.$element(),
      toolbarItems: this._getToolbarItems(),
    });
  }

  protected _renderContent($container): void {
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
          text: 'Replace',
          stylingMode: 'contained',
          type: 'default',
          items: [
            { id: 'replace', text: 'Replace' },
            { id: 'replaceAbove', text: 'Insert Above' },
            { id: 'replaceBelow', text: 'Insert Below' },
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
          text: 'Copy',
          onClick: () => navigator?.clipboard?.writeText(this._resultText),
        },
      },
      {
        toolbar: 'bottom',
        location: 'after',
        widget: 'dxButton',
        options: {
          text: 'Try again',
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
    currentCommand, currentOption, commandsMap, text,
  }: AIDialogShowPayload): Promise<unknown> | undefined {
    this._commandsMap = commandsMap;
    this._currentCommand = currentCommand;
    this._resultText = text ?? '';
    this._optionsList = commandsMap[currentCommand]?.options ?? [];
    this._currentOption = currentOption;

    this._updateUI();

    return super.show();
  }
}
