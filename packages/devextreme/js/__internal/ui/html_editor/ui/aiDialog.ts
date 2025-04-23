import '@js/ui/drop_down_button';

import type { AIIntegration } from '@js/common/ai-integration';
import localizationMessage from '@js/common/core/localization/message';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { extend } from '@js/core/utils/extend';
import type { ButtonClickEvent, ItemClickEvent } from '@js/ui/drop_down_button_types';
import type { AICustomCommand } from '@js/ui/html_editor';
import type { Properties as PopupProperties, ToolbarItem } from '@js/ui/popup';
import type dxSelectBox from '@js/ui/select_box';
import type { Properties as SelectBoxProperties } from '@js/ui/select_box';
import SelectBox from '@js/ui/select_box';
import TextArea from '@js/ui/text_area';

import type { CommandDefinition, CommandsMap } from '../utils/ai';
import BaseDialog from './m_baseDialog';

const AI_DIALOG_COMMANDS_WITH_OPTIONS = ['translate', 'changeStyle', 'changeTone', 'custom'];

export const AI_DIALOG_CLASS = 'dx-aidialog';
export const AI_DIALOG_CONTROLS_CLASS = 'dx-aidialog-controls';
export const AI_DIALOG_CONTENT_CLASS = 'dx-aidialog-content';
const AI_DIALOG_TITLE_CLASS = 'dx-aidialog-title';
const AI_DIALOG_TITLE_TEXT_CLASS = 'dx-aidialog-title-text';
const ICON_CLASS = 'dx-icon';
const ICON_SPARKLE_CLASS = 'dx-icon-sparkle';
const COPY_BUTTON_ICON = 'copy';
const TRY_AGAIN_BUTTON_ICON = 'redo';

const POPUP_MIN_WIDTH = 288;
const POPUP_MAX_WIDTH = 460;
const REPLACE_DROPDOWN_WIDTH = 150;
const TEXT_AREA_MIN_HEIGHT = 64;
const TEXT_AREA_MAX_HEIGHT = 128;
const BUTTON_WIDTH = 100;

enum DialogState {
  Initial = 'initial',
  Asking = 'asking',
  Generating = 'generating',
  ResultReady = 'resultReady',
  Error = 'error',
}

enum ReplaceButtonActions {
  Replace = 'replace',
  InsertAbove = 'insertAbove',
  InsertBelow = 'insertBelow',
}

export interface AIDialogShowPayload {
  currentCommand: string;
  currentCommandOption?: string;
  text?: string;
  commandsMap: CommandsMap;
  prompt?: AICustomCommand['prompt'];
}

export interface AIDialogResult {
  resultText: string;
  event: ItemClickEvent | ButtonClickEvent & ItemClickEvent['itemData'];
}

export default class AIDialog extends BaseDialog<AIDialogResult> {
  private _dialogState: DialogState = DialogState.Initial;

  private _isAskAICommandSelected = false;

  private _aiIntegration: AIIntegration;

  private _commandsMap: CommandsMap = {};

  private _currentCommand?: string;

  private _currentOption?: string;

  private _commandOptionsList?: string[];

  private _resultText = '';

  private _askAIPrompt = '';

  private _getCustomCommandPrompt?: AICustomCommand['prompt'];

  private _commandSelectBox!: dxSelectBox;

  private _optionSelectBox!: SelectBox;

  private _resultTextArea!: TextArea;

  private _promptTextArea!: TextArea;

  private _commandChangeSuppressed = false;

  constructor(
    $container: dxElementWrapper,
    aiIntegration: AIIntegration,
    popupConfig?: PopupProperties,
  ) {
    super($container, popupConfig);

    this._aiIntegration = aiIntegration;
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

        this._isAskAICommandSelected = e.value === 'askAI';
        this._askAIPrompt = '';

        this._setDialogState(this._getInitialDialogState());
      },
    } as SelectBoxProperties);
  }

  protected _renderOptionSelectBox($container: dxElementWrapper): void {
    const $optionSelectBox = $('<div>').appendTo($container);
    this._optionSelectBox = new SelectBox($optionSelectBox.get(0), {
      items: this._commandOptionsList,
      value: this._currentOption ?? this._commandOptionsList?.[0],
      visible: this._isCommandWithOptionsSelected(),
      onValueChanged: (e): void => {
        this._currentOption = e.value;
      },
    } as SelectBoxProperties);
  }

  protected _renderPromptTextArea($container: dxElementWrapper): void {
    const $textArea = $('<div>').appendTo($container);
    this._promptTextArea = new TextArea($textArea.get(0), {
      value: this._askAIPrompt,
      minHeight: TEXT_AREA_MIN_HEIGHT,
      maxHeight: TEXT_AREA_MAX_HEIGHT,
      autoResizeEnabled: true,
      width: '100%',
      placeholder: localizationMessage.format('dxHtmlEditor-aiAskPlaceholder'),
      onValueChanged: (e): void => {
        this._askAIPrompt = e.value;
      },
    });
  }

  protected _renderResultTextArea($container: dxElementWrapper): void {
    const $textArea = $('<div>').appendTo($container);
    this._resultTextArea = new TextArea($textArea.get(0), {
      value: this._resultText,
      minHeight: TEXT_AREA_MIN_HEIGHT,
      maxHeight: TEXT_AREA_MAX_HEIGHT,
      autoResizeEnabled: true,
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
    this._renderPromptTextArea($contentElem);
    this._renderResultTextArea($contentElem);
  }

  protected _getPopupClass(): string {
    return AI_DIALOG_CLASS;
  }

  protected _getTitleItem(): ToolbarItem {
    return {
      toolbar: 'top',
      location: 'before',
      template: (data, index, titleElement): void => {
        const $titleContainer = $('<div>').addClass(AI_DIALOG_TITLE_CLASS);
        const $icon = $('<i>').addClass(`${ICON_CLASS} ${ICON_SPARKLE_CLASS}`);
        const $text = $('<span>')
          .addClass(AI_DIALOG_TITLE_TEXT_CLASS)
          .text(localizationMessage.format('dxHtmlEditor-aiDialogTitle'));
        $titleContainer
          .append($icon)
          .append($text);
        $(titleElement).append($titleContainer);
      },
    };
  }

  protected _getReplaceButtonItem(config?: ToolbarItem): ToolbarItem {
    return {
      toolbar: 'bottom',
      location: 'after',
      widget: 'dxDropDownButton',
      options: {
        text: localizationMessage.format('dxHtmlEditor-aiReplace'),
        stylingMode: 'contained',
        type: 'default',
        splitButton: true,
        useSelectMode: false,
        items: [
          { id: ReplaceButtonActions.InsertAbove, text: localizationMessage.format('dxHtmlEditor-aiInsertAbove') },
          { id: ReplaceButtonActions.InsertBelow, text: localizationMessage.format('dxHtmlEditor-aiInsertBelow') },
        ],
        dropDownOptions: {
          width: REPLACE_DROPDOWN_WIDTH,
        },
        onButtonClick: (e: ButtonClickEvent): void => {
          this.replaceButtonAction({ ...e, itemData: { id: ReplaceButtonActions.Replace } });
        },
        onItemClick: (e: ItemClickEvent) => this.replaceButtonAction(e),
      },
      ...config,
    };
  }

  protected _getCopyButtonItem(config?: ToolbarItem): ToolbarItem {
    return {
      toolbar: 'bottom',
      location: 'after',
      widget: 'dxButton',
      options: {
        stylingMode: 'outlined',
        icon: COPY_BUTTON_ICON,
        text: localizationMessage.format('dxHtmlEditor-aiCopy'),
        onClick: async (): Promise<void> => {
          await navigator?.clipboard?.writeText(this._resultText);
        },
      },
      ...config,
    };
  }

  protected _getTryAgainButtonItem(): ToolbarItem {
    return {
      toolbar: 'bottom',
      location: 'before',
      widget: 'dxButton',
      options: {
        stylingMode: 'outlined',
        icon: TRY_AGAIN_BUTTON_ICON,
        text: localizationMessage.format('dxHtmlEditor-aiTryAgain'),
        onClick: () => this._retryAIRequest(),
      },
    };
  }

  protected _getGenerateButtonItem(config?: ToolbarItem): ToolbarItem {
    return {
      toolbar: 'bottom',
      location: 'after',
      widget: 'dxButton',
      options: {
        width: BUTTON_WIDTH,
        type: 'default',
        text: localizationMessage.format('dxHtmlEditor-aiGenerate'),
        stylingMode: 'contained',
        onClick: () => this._generateAIResponse(),
      },
      ...config,
    };
  }

  protected _getStopButtonItem(config?: ToolbarItem): ToolbarItem {
    return {
      toolbar: 'bottom',
      location: 'after',
      widget: 'dxButton',
      options: {
        width: BUTTON_WIDTH,
        type: 'default',
        stylingMode: 'contained',
        text: localizationMessage.format('dxHtmlEditor-aiStop'),
        onClick: () => this._stopGeneration(),
      },
      ...config,
    };
  }

  protected _getToolbarItems(): ToolbarItem[] {
    const items: ToolbarItem[] = [this._getTitleItem()];

    switch (this._dialogState) {
      case DialogState.Initial:
      case DialogState.ResultReady:
        items.push(
          this._getTryAgainButtonItem(),
          this._getCopyButtonItem(),
          this._getReplaceButtonItem(),
        );
        break;
      case DialogState.Asking:
        items.push(this._getGenerateButtonItem());
        break;
      case DialogState.Generating:
        items.push(
          this._getStopButtonItem(),
        );
        break;
      case DialogState.Error:
        break;
      default:
        break;
    }

    return items;
  }

  private _setDialogState(newState: DialogState): void {
    this._dialogState = newState;
    this._syncDialogWithState();
  }

  private _syncDialogWithState(): void {
    this._refreshCommandSelectBox();
    this._refreshOptionSelectBox();
    this._refreshTextAreas();
    this._refreshToolbarItems();
  }

  private _refreshToolbarItems(): void {
    this._popup.option('toolbarItems', this._getToolbarItems());
  }

  private _retryAIRequest(): void {
    this._generateAIResponse();
  }

  private _generateAIResponse(): void {
    // TODO: implement with AI integration
    this._setDialogState(DialogState.Generating);
    this._setDialogState(DialogState.ResultReady);
  }

  private _stopGeneration(): void {
    // TODO: implement actual cancellation of AI request
    this._setDialogState(this._getInitialDialogState());
  }

  private _isCommandWithOptionsSelected(): boolean {
    return AI_DIALOG_COMMANDS_WITH_OPTIONS.includes(this._currentCommand ?? '');
  }

  private _refreshCommandSelectBox(): void {
    const commandsList = Object.entries(this._commandsMap).map(
      ([name, config]: [string, CommandDefinition]) => ({ name, text: config.text }),
    );

    this._commandChangeSuppressed = true;
    this._commandSelectBox.option({
      dataSource: commandsList,
      value: this._currentCommand,
    });
    this._commandChangeSuppressed = false;
  }

  private _refreshOptionSelectBox(): void {
    const hasOptions = this._isCommandWithOptionsSelected();

    this._optionSelectBox.option({
      visible: hasOptions,
      items: this._commandOptionsList ?? [],
      value: this._currentOption ?? this._commandOptionsList?.[0],
    });
  }

  private _refreshTextAreas(): void {
    switch (this._dialogState) {
      case DialogState.Initial:
        this._promptTextArea.option({ visible: false });
        this._resultTextArea.option({
          visible: true,
          value: this._resultText,
        });
        break;
      case DialogState.Asking:
        this._promptTextArea.option({
          visible: true,
          value: this._askAIPrompt,
          readOnly: false,
        });
        this._resultTextArea.option({ visible: false });
        break;
      case DialogState.Generating:
        this._promptTextArea.option({ readOnly: true });
        this._resultTextArea.option({
          visible: true,
          value: this._resultText,
        });
        break;
      case DialogState.ResultReady:
        this._resultTextArea.option({
          visible: true,
          value: this._resultText,
        });
        break;
      case DialogState.Error:
        // TODO Implement with adding errors UI
        break;
      default:
        break;
    }
  }

  private _getInitialDialogState(): DialogState {
    return this._isAskAICommandSelected ? DialogState.Asking : DialogState.Initial;
  }

  updateAIIntegration(aiIntegration: AIIntegration): void {
    this._aiIntegration = aiIntegration;
  }

  replaceButtonAction(event: AIDialogResult['event']): void {
    this.hide(this._resultText, event);
  }

  show({
    currentCommand, currentCommandOption, commandsMap, text, prompt,
  }: AIDialogShowPayload): Promise<AIDialogResult> | undefined {
    this._commandsMap = commandsMap;
    this._currentCommand = currentCommand;
    this._resultText = text ?? '';
    this._commandOptionsList = commandsMap[currentCommand]?.options ?? [];
    this._currentOption = currentCommandOption;
    this._getCustomCommandPrompt = prompt;

    this._isAskAICommandSelected = currentCommand === 'askAI';
    this._askAIPrompt = '';

    this._setDialogState(this._getInitialDialogState());

    return super.show();
  }

  hide(resultText: string, event: AIDialogResult['event']): void {
    this.deferred?.resolve({ resultText, event });

    super.hide();
  }
}
