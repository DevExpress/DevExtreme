import type { AIIntegration } from '@js/common/ai-integration';
import localizationMessage from '@js/common/core/localization/message';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { extend } from '@js/core/utils/extend';
import type { ItemClickEvent } from '@js/ui/drop_down_button_types';
import type { AICustomCommand } from '@js/ui/html_editor';
import type { Properties as PopupProperties, ToolbarItem } from '@js/ui/popup';
import type dxSelectBox from '@js/ui/select_box';
import SelectBox from '@js/ui/select_box';
import TextArea from '@js/ui/text_area';

import type { CommandDefinition, CommandsMap } from '../utils/ai';
import BaseDialog from './m_baseDialog';

const AI_DIALOG_COMMANDS_WITH_OPTIONS = ['translate', 'changeStyle', 'changeTone', 'custom'];

const AI_DIALOG_CLASS = 'dx-aidialog';
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
  prompt?: AICustomCommand['prompt'];
}

export interface AiDialogResult {
  resultText: string;
  event: ItemClickEvent;
}

export default class AiDialog extends BaseDialog<AiDialogResult> {
  private _isLoading = false;

  private readonly _aiIntegration?: AIIntegration;

  private _commandsMap: CommandsMap = {};

  private _currentCommand?: string;

  private _currentOption?: string;

  private _commandOptionsList?: string[];

  private _resultText = '';

  private _prompt?: AICustomCommand['prompt'];

  private _commandSelectBox?: dxSelectBox;

  private _optionSelectBox?: SelectBox;

  private _resultTextArea?: TextArea;

  private _commandChangeSuppressed = false;

  constructor(
    $container: dxElementWrapper,
    aiService?: AIIntegration,
    popupConfig?: PopupProperties,
  ) {
    super($container, popupConfig);

    this._aiIntegration = aiService;
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
      dragAndResizeArea: this._$container,
      toolbarItems: this._getToolbarItems(),
      hideOnOutsideClick: true,
      focusStateEnabled: true,
      showCloseButton: true,
      position: {
        my: 'center',
        at: 'center',
        of: this._$container,
      },
      ...this._popupUserConfig,
    }) as PopupProperties;
  }

  protected _renderCommandSelectBox($container: dxElementWrapper): void {
    const $commandSelectBox = $('<div>').appendTo($container);
    // @ts-expect-error
    this._commandSelectBox = new SelectBox($commandSelectBox.get(0), {
      value: this._currentCommand,
      displayExpr: 'text',
      valueExpr: 'name',
      onValueChanged: (e): void => {
        if (this._commandChangeSuppressed) {
          return;
        }

        this._currentCommand = e.value;
        this._commandOptionsList = this._commandsMap[e.value]?.options ?? [];
        this._currentOption = this._commandOptionsList?.[0];

        this._syncDialogWithState();
      },
    });
  }

  protected _renderOptionSelectBox($container: dxElementWrapper): void {
    const $optionSelectBox = $('<div>').appendTo($container);
    // @ts-expect-error
    this._optionSelectBox = new SelectBox($optionSelectBox.get(0), {
      items: this._commandOptionsList,
      value: this._currentOption ?? this._commandOptionsList?.[0],
      visible: this._isCommandWithOptionsSelected(),
      onValueChanged: (e): void => {
        this._currentOption = e.value;
      },
    });
  }

  protected _renderResultTextArea($container: dxElementWrapper): void {
    const $textArea = $('<div>').appendTo($container);
    this._resultTextArea = new TextArea($textArea.get(0), {
      value: this._resultText,
      height: 100,
      width: '100%',
      readOnly: true,
      onValueChanged: (e): void => {
        this._resultText = e.value;
      },
    });
  }

  protected _renderContent($contentElem: dxElementWrapper): void {
    $contentElem.addClass(AI_DIALOG_CONTENT_CLASS);

    const $controls = $('<div>')
      .addClass(AI_DIALOG_CONTROLS_CLASS)
      .appendTo($contentElem);

    this._renderCommandSelectBox($controls);
    this._renderOptionSelectBox($controls);
    this._renderResultTextArea($contentElem);
  }

  protected _getPopupClass(): string {
    return AI_DIALOG_CLASS;
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
          onClick: () => this._retryAiRequest(),
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

  private _retryAiRequest(): void {
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

  replaceButtonAction(event: ItemClickEvent): void {
    // TODO: implement with integration so that the result text is updated
    this.hide(this._resultText, event);
  }

  show({
    currentCommand, currentCommandOption, commandsMap, text, prompt,
  }: AiDialogShowPayload): Promise<AiDialogResult> | undefined {
    this._commandsMap = commandsMap;
    this._currentCommand = currentCommand;
    this._resultText = text ?? '';
    this._commandOptionsList = commandsMap[currentCommand]?.options ?? [];
    this._currentOption = currentCommandOption;
    this._prompt = prompt;

    this._syncDialogWithState();

    return super.show();
  }

  hide(resultText: string, event: ItemClickEvent): void {
    this.deferred?.resolve({ resultText, event });

    super.hide();
  }
}
