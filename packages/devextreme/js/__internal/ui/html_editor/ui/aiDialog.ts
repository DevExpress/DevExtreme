import localizationMessage from '@js/common/core/localization/message';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { extend } from '@js/core/utils/extend';
import type { HtmlEditorAICustomCommand } from '@js/ui/html_editor';
import type HtmlEditor from '@js/ui/html_editor';
import type { Properties as PopupProperties, ToolbarItem } from '@js/ui/popup';
import SelectBox from '@js/ui/select_box';
import TextArea from '@js/ui/text_area';

import type { CommandDefinition, CommandsMap } from '../utils/ai';
import DialogBase from './m_baseDialog';

const AI_DIALOG_COMMANDS_WITH_OPTIONS = ['translate', 'changeStyle', 'changeTone', 'custom'];

const AI_DIALOG_CONTROLS_CLASS = 'dx-aidialog-controls';
const AI_DIALOG_CONTENT_CLASS = 'dx-aidialog-content';
const AI_DIALOG_TITLE_CLASS = 'dx-aidialog-title';
const AI_DIALOG_TITLE_TEXT_CLASS = 'dx-aidialog-title-text';

const POPUP_MIN_WIDTH = 288;
const POPUP_MAX_WIDTH = 460;
const REPLACE_DROPDOWN_WIDTH = 150;

export interface AiDialogShowPayload {
  currentCommand: string;
  currentCommandOption?: string;
  text?: string;
  commandsMap: CommandsMap;
  prompt?: HtmlEditorAICustomCommand['prompt'];
}

export default class AiDialog extends DialogBase {
  private _isLoading = false;

  private readonly _aiService;

  private _commandsMap: CommandsMap = {};

  private _currentCommand?: string;

  private _currentOption?: string;

  private _commandOptionsList?: string[];

  private _resultText = '';

  private _prompt?: HtmlEditorAICustomCommand['prompt'];

  private _commandSelectBox?: SelectBox;

  private _optionSelectBox?: SelectBox;

  private _resultTextArea?: TextArea;

  private _commandChangeSuppressed = false;

  constructor(editorInstance: HtmlEditor, aiService?: unknown, popupConfig?: PopupProperties) {
    super(editorInstance, popupConfig);

    this._aiService = aiService;
  }

  protected _getPopupConfig(): PopupProperties {
    const baseConfig = super._getPopupConfig();

    return extend(true, {}, baseConfig, {
      minWidth: POPUP_MIN_WIDTH,
      maxWidth: POPUP_MAX_WIDTH,
      height: 'auto',
      shading: true,
      shadingColor: 'transparent',
      dragEnabled: true,
      dragAndResizeArea: this._editorInstance.$element(),
      toolbarItems: this._getToolbarItems(),
      hideOnOutsideClick: true,
      focusStateEnabled: true,
      showCloseButton: true,
      position: {
        my: 'center',
        at: 'center',
        of: this._editorInstance.$element(),
      },
    }) as PopupProperties;
  }

  protected _renderContent($contentElem: dxElementWrapper): void {
    $contentElem.addClass(AI_DIALOG_CONTENT_CLASS);

    const $controls = $('<div>')
      .addClass(AI_DIALOG_CONTROLS_CLASS)
      .appendTo($contentElem);

    const $commandSelectBox = $('<div>').appendTo($controls);
    this._commandSelectBox = this._editorInstance._createComponent($commandSelectBox, SelectBox, {
      width: '100%',
      value: this._currentCommand,
      displayExpr: 'text',
      valueExpr: 'name',
      onValueChanged: (e) => {
        if (this._commandChangeSuppressed) {
          return;
        }

        this._currentCommand = e.value;
        this._commandOptionsList = this._commandsMap[e.value]?.options ?? [];
        this._currentOption = this._commandOptionsList?.[0];

        this._syncDialogWithState();
      },
    });

    const $optionSelectBox = $('<div>').appendTo($controls);
    this._optionSelectBox = this._editorInstance._createComponent($optionSelectBox, SelectBox, {
      width: '100%',
      items: this._commandOptionsList,
      value: this._currentOption ?? this._commandOptionsList?.[0],
      visible: this._isCommandWithOptionsSelected(),
      onValueChanged: (e) => {
        this._currentOption = e.value;
      },
    });

    const $textArea = $('<div>').appendTo($contentElem);
    this._resultTextArea = this._editorInstance._createComponent($textArea, TextArea, {
      value: this._resultText,
      height: 100,
      width: '100%',
      readOnly: true,
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
            width: REPLACE_DROPDOWN_WIDTH,
          },
          onItemClick: (e) => this.replaceButtonAction(e),
        },
      },
      {
        toolbar: 'bottom',
        location: 'after',
        widget: 'dxButton',
        options: {
          text: localizationMessage.format('dxHtmlEditor-aiCopy'),
          onClick: async (): Promise<void> => {
            await navigator?.clipboard?.writeText(this._resultText);
          },
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
      {
        toolbar: 'top',
        location: 'before',
        template: (data, index, titleElement): void => {
          const $titleContainer = $('<div>').addClass(AI_DIALOG_TITLE_CLASS);
          const $icon = $('<i>').addClass('dx-icon dx-icon-sparkle');
          const $text = $('<span>')
            .addClass(AI_DIALOG_TITLE_TEXT_CLASS)
            .text(localizationMessage.format('dxHtmlEditor-aiDialogTitle'));
          $titleContainer
            .append($icon)
            .append($text);
          $(titleElement).append($titleContainer);
        },
      },
    ];
  }

  private _retryAIRequest(): void {
    // TODO: implement with integration
  }

  private _isCommandWithOptionsSelected(): boolean {
    return AI_DIALOG_COMMANDS_WITH_OPTIONS.includes(this._currentCommand ?? '');
  }

  private _refreshCommandSelectBox(): void {
    const commandsList = Object.entries(this._commandsMap).map(
      ([name, config]: [string, CommandDefinition]) => ({ name, text: config.text }),
    );

    this._commandChangeSuppressed = true;
    this._commandSelectBox?.option({
      dataSource: commandsList,
      value: this._currentCommand,
    });
    this._commandChangeSuppressed = false;
  }

  private _refreshOptionSelectBox(): void {
    const hasOptions = this._isCommandWithOptionsSelected();

    this._optionSelectBox?.option({
      visible: hasOptions,
      items: this._commandOptionsList ?? [],
      value: this._currentOption ?? this._commandOptionsList?.[0],
    });
  }

  private _refreshResultText(): void {
    this._resultTextArea?.option('value', this._resultText);
  }

  private _syncDialogWithState(): void {
    this._refreshCommandSelectBox();
    this._refreshOptionSelectBox();
    this._refreshResultText();
  }

  private _setLoadingState(isLoading: boolean): void {
    this._isLoading = isLoading;
  }

  replaceButtonAction(event?: unknown): void {
    // TODO: implement with integration so that the result text is updated
    this.hide(this._resultText, event);
  }

  show({
    currentCommand, currentCommandOption, commandsMap, text, prompt,
  }: AiDialogShowPayload): Promise<unknown> | undefined {
    this._commandsMap = commandsMap;
    this._currentCommand = currentCommand;
    this._resultText = text ?? '';
    this._commandOptionsList = commandsMap[currentCommand]?.options ?? [];
    this._currentOption = currentCommandOption;
    this._prompt = prompt;

    this._syncDialogWithState();

    return super.show();
  }

  hide(resultText: string, event: unknown): void {
    this.deferred?.resolve(resultText, event);

    super.hide();
  }
}
