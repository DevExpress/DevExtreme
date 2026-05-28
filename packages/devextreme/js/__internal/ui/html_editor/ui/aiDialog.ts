import '@js/ui/drop_down_button';

import type { EditorStyle } from '@js/common';
import type { AIIntegration, RequestCallbacks } from '@js/common/ai-integration';
import localizationMessage from '@js/common/core/localization/message';
import Guid from '@js/core/guid';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { extend } from '@js/core/utils/extend';
import type { ButtonClickEvent, ItemClickEvent } from '@js/ui/drop_down_button_types';
import type { AICommandNameExtended, AICustomCommand } from '@js/ui/html_editor';
import Informer from '@js/ui/informer';
import LoadIndicator from '@js/ui/load_indicator';
import type { Properties as PopupProperties, ToolbarItem } from '@js/ui/popup';
import type dxSelectBox from '@js/ui/select_box';
import type { Properties as SelectBoxProperties } from '@js/ui/select_box';
import SelectBox from '@js/ui/select_box';
import TextArea from '@js/ui/text_area';
import { current, isCompact, isMaterial } from '@js/ui/themes';
import BaseDialog from '@ts/ui/html_editor/ui/m_baseDialog';
import type {
  AICommandExecutor,
  AICommandParamsMap,
  CommandDefinition,
  CommandsMap,
} from '@ts/ui/html_editor/utils/ai';
import {
  AI_DIALOG_ASKAI_COMMAND_NAME,
  AI_DIALOG_CUSTOM_COMMAND_NAME,
  buildAICommandParams,
  getAICommandName,
} from '@ts/ui/html_editor/utils/ai';
import { isSmallScreen } from '@ts/ui/html_editor/utils/small_screen';
import type { Properties as InformerProperties } from '@ts/ui/informer/informer';
import type { LoadIndicatorProperties } from '@ts/ui/load_indicator';
import { AnimationType } from '@ts/ui/load_indicator';
import { TEXTEDITOR_INPUT_CONTAINER_CLASS } from '@ts/ui/text_box/text_editor.base';

export const AI_DIALOG_CLASS = 'dx-aidialog';
export const AI_DIALOG_CONTROLS_CLASS = 'dx-aidialog-controls';
export const AI_DIALOG_CONTENT_CLASS = 'dx-aidialog-content';
export const AI_DIALOG_TITLE_CLASS = 'dx-aidialog-title';

const AI_DIALOG_LOAD_INDICATOR_CLASS = 'dx-pending-indicator';
const AI_DIALOG_TITLE_TEXT_CLASS = 'dx-aidialog-title-text';
const ICON_CLASS = 'dx-icon';
const ICON_SPARKLE_CLASS = 'dx-icon-sparkle';
const COPY_BUTTON_ICON = 'copy';
const REGENERATE_BUTTON_ICON = 'restore';

const AI_DIALOG_COMMANDS_WITH_OPTIONS = ['translate', 'changeStyle', 'changeTone'];

const POPUP_MIN_WIDTH = 288;
const POPUP_MAX_WIDTH = isMaterial(current()) ? 494 : 460;
const LOADINDICATOR_SIZE = 48;

const INPUT_EVENT = 'input';

export const TEXT_AREA_MIN_HEIGHT = 64;
export const TEXT_AREA_MAX_HEIGHT = 128;
export const REPLACE_DROPDOWN_WIDTH = 150;
export const ACTION_BUTTON_WIDTH = 110;
export const COMPACT_ACTION_BUTTON_WIDTH = 100;

function getActionButtonWidth(): number {
  return isCompact(current()) ? COMPACT_ACTION_BUTTON_WIDTH : ACTION_BUTTON_WIDTH;
}

enum DialogState {
  Initial = 'initial',
  Asking = 'asking',
  Generating = 'generating',
  ResultReady = 'resultReady',
  Error = 'error',
  InitialCanceled = 'initialCanceled',
  AskingCanceled = 'askingCanceled',
}

enum ReplaceButtonActions {
  Replace = 'replace',
  InsertAbove = 'insertAbove',
  InsertBelow = 'insertBelow',
}

type NamedToolbarItem = ToolbarItem & { name: string };

export interface AIDialogShowPayload {
  currentCommand: AICommandNameExtended;
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
  private _abort?: () => void;

  private _aiIntegration: AIIntegration;

  private _askAIPrompt = '';

  private _commandChangeSuppressed = false;

  private _commandOptionSuppressed = false;

  private _commandOptionsList?: string[];

  private _commandSelectBox!: dxSelectBox;

  private _commandsMap: CommandsMap = {};

  private _currentCommand?: AICommandNameExtended;

  private _currentOption?: string;

  private _dialogState: DialogState = DialogState.Initial;

  private _getCustomCommandPrompt?: AICustomCommand['prompt'];

  private _informer!: Informer;

  private _isAICommandExecuting = false;

  private _isAskAICommandSelected = false;

  private _loadIndicator?: LoadIndicator;

  private _optionSelectBox!: SelectBox;

  private _promptTextArea!: TextArea;

  private _resultTextArea!: TextArea;

  private _selectedText = '';

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
      onHiding: () => {
        this._processCommandCompletion();
      },
      ...this._popupConfig,
    }) as PopupProperties;
  }

  protected _renderCommandSelectBox($container: dxElementWrapper): void {
    const $commandSelectBox = $('<div>').appendTo($container);

    this._commandSelectBox = new SelectBox($commandSelectBox.get(0), {
      value: this._currentCommand,
      displayExpr: 'text',
      valueExpr: 'name',
      stylingMode: 'outlined',
      onInitialized: this._addEscapeHandler.bind(this),
      onValueChanged: (e): void => {
        if (this._commandChangeSuppressed) {
          return;
        }

        this._currentCommand = e.value;
        this._commandOptionsList = this._commandsMap[e.value]?.options ?? [];
        this._currentOption = this._commandOptionsList?.[0];
        this._isAskAICommandSelected = e.value === AI_DIALOG_ASKAI_COMMAND_NAME;
        this._askAIPrompt = '';
        this._getCustomCommandPrompt = this._commandsMap[e.value]?.prompt;

        this._setDialogState(this._getInitialDialogState());

        const shouldExecuteAICommand = !this._isAskAICommandSelected && this._isOpen();

        if (shouldExecuteAICommand) {
          this._executeAICommand();
        }
      },
    } as SelectBoxProperties);
  }

  protected _renderOptionSelectBox($container: dxElementWrapper): void {
    const $optionSelectBox = $('<div>').appendTo($container);

    this._optionSelectBox = new SelectBox($optionSelectBox.get(0), {
      items: this._commandOptionsList,
      value: this._currentOption ?? this._commandOptionsList?.[0],
      visible: this._isCommandWithOptionsSelected(),
      stylingMode: 'outlined',
      onInitialized: this._addEscapeHandler.bind(this),
      onValueChanged: ({ value }): void => {
        if (this._commandOptionSuppressed) {
          return;
        }

        this._currentOption = value;

        if (this._isOpen() && value) {
          this._executeAICommand();
        }
      },
    } as SelectBoxProperties);
  }

  protected _renderPromptTextArea($container: dxElementWrapper): void {
    const $textArea = $('<div>').appendTo($container);

    const options = {
      value: this._askAIPrompt,
      minHeight: TEXT_AREA_MIN_HEIGHT,
      maxHeight: TEXT_AREA_MAX_HEIGHT,
      autoResizeEnabled: true,
      width: '100%',
      placeholder: localizationMessage.format('dxHtmlEditor-aiAskPlaceholder'),
      _shouldAttachKeyboardEvents: true,
      stylingMode: 'outlined' as EditorStyle,
      onInitialized: this._addEscapeHandler.bind(this),
      valueChangeEvent: INPUT_EVENT,
      onValueChanged: (e): void => {
        this._askAIPrompt = e.value;

        if (this._isAskAICommandSelected) {
          const shouldRefreshToolbarItems = !e.value || !e.previousValue;

          if (shouldRefreshToolbarItems) {
            this._refreshToolbarItems();
          }
        }
      },
    };

    this._promptTextArea = new TextArea($textArea.get(0), options);
  }

  protected _renderResultTextArea($container: dxElementWrapper): void {
    const $textArea = $('<div>').appendTo($container);
    const screenSpecificOptions = isSmallScreen() ? {
      maxHeight: '100%',
      height: '100%',
      autoResizeEnabled: false,
    } : {
      maxHeight: TEXT_AREA_MAX_HEIGHT,
      autoResizeEnabled: true,
    };

    const options = {
      inputAttr: { 'aria-label': localizationMessage.format('dxHtmlEditor-aiResultTextAreaAriaLabel') },
      minHeight: TEXT_AREA_MIN_HEIGHT,
      width: '100%',
      readOnly: true,
      _shouldAttachKeyboardEvents: true,
      stylingMode: 'outlined' as EditorStyle,
      onInitialized: this._addEscapeHandler.bind(this),
      ...screenSpecificOptions,
    };

    this._resultTextArea = new TextArea($textArea.get(0), options);
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
    this._renderInformer($contentElem);
  }

  private _renderLoadIndicator(): void {
    if (this._loadIndicator) {
      return;
    }

    const $inputContainer = this._resultTextArea
      .$element()
      .find(`.${TEXTEDITOR_INPUT_CONTAINER_CLASS}`);

    const $indicatorElement = $('<div>')
      .addClass(AI_DIALOG_LOAD_INDICATOR_CLASS)
      .appendTo($inputContainer);

    const options: LoadIndicatorProperties = {
      animationType: AnimationType.Sparkle,
      width: LOADINDICATOR_SIZE,
      height: LOADINDICATOR_SIZE,
    };

    this._loadIndicator = new LoadIndicator($indicatorElement[0], options);
  }

  private _renderInformer($container: dxElementWrapper): void {
    const $informer = $('<div>').appendTo($container);

    const options: InformerProperties = {
      contentAlignment: 'center',
      showBackground: true,
    };
    // @ts-expect-error no .d.ts for private component
    this._informer = new Informer($informer.get(0), options);
  }

  protected _getPopupClass(): string {
    return AI_DIALOG_CLASS;
  }

  protected _getTitleItem(): NamedToolbarItem {
    return {
      name: 'title',
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

  protected _getReplaceButtonItem(): NamedToolbarItem {
    return {
      name: 'replace',
      toolbar: 'bottom',
      location: 'after',
      widget: 'dxDropDownButton',
      locateInMenu: 'auto',
      options: {
        displayExpr: 'text',
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
          this._replaceButtonAction({ ...e, itemData: { id: ReplaceButtonActions.Replace } });
        },
        onInitialized: this._addEscapeHandler.bind(this),
        onItemClick: (e: ItemClickEvent) => this._replaceButtonAction(e),
      },
    };
  }

  protected _getCopyButtonItem(): NamedToolbarItem {
    const text = isSmallScreen() ? undefined : localizationMessage.format('dxHtmlEditor-aiCopy');
    return {
      name: 'copy',
      toolbar: 'bottom',
      location: 'after',
      widget: 'dxButton',
      locateInMenu: 'auto',
      options: {
        stylingMode: 'outlined',
        icon: COPY_BUTTON_ICON,
        text,
        onClick: (): void => {
          const { value } = this._resultTextArea.option();
          // eslint-disable-next-line @typescript-eslint/no-floating-promises
          navigator?.clipboard?.writeText(value ?? '');
        },
        onInitialized: this._addEscapeHandler.bind(this),
      },
    };
  }

  protected _getRegenerateButtonItem(): NamedToolbarItem {
    const text = isSmallScreen() ? undefined : localizationMessage.format('dxHtmlEditor-aiRegenerate');

    return {
      name: 'regenerate',
      toolbar: 'bottom',
      location: 'before',
      widget: 'dxButton',
      options: {
        stylingMode: 'outlined',
        icon: REGENERATE_BUTTON_ICON,
        text,
        onClick: () => this._retryExecuteAICommand(),
        onInitialized: this._addEscapeHandler.bind(this),
      },
    };
  }

  protected _getGenerateButtonItem(): NamedToolbarItem {
    const width = getActionButtonWidth();
    const promptTextArea = this._promptTextArea;
    const disabled = !promptTextArea.option('value');

    return {
      name: 'generate',
      toolbar: 'bottom',
      location: 'after',
      widget: 'dxButton',
      options: {
        type: 'default',
        text: localizationMessage.format('dxHtmlEditor-aiGenerate'),
        stylingMode: 'contained',
        disabled,
        width,
        onClick: () => this._executeAICommand(),
        onInitialized: this._addEscapeHandler.bind(this),
      },
    };
  }

  protected _getCancelButtonItem(): NamedToolbarItem {
    const width = getActionButtonWidth();
    return {
      name: 'cancel',
      toolbar: 'bottom',
      location: 'after',
      widget: 'dxButton',
      options: {
        type: 'default',
        stylingMode: 'contained',
        text: localizationMessage.format('dxHtmlEditor-aiCancel'),
        width,
        onClick: () => this._cancelAICommandExecution(),
        onInitialized: this._addEscapeHandler.bind(this),
      },
    };
  }

  private _getInitialToolbarItems(): NamedToolbarItem[] {
    return [
      this._getRegenerateButtonItem(),
      this._getCopyButtonItem(),
      this._getReplaceButtonItem(),
    ];
  }

  protected _getToolbarItems(): NamedToolbarItem[] {
    const items: NamedToolbarItem[] = [this._getTitleItem()];

    switch (this._dialogState) {
      case DialogState.Initial:
      case DialogState.InitialCanceled:
      case DialogState.ResultReady:
        items.push(...this._getInitialToolbarItems());
        break;
      case DialogState.Asking:
      case DialogState.AskingCanceled:
        items.push(this._getGenerateButtonItem());
        break;
      case DialogState.Generating:
        items.push(this._getCancelButtonItem());
        break;
      case DialogState.Error: {
        if (this._isAskAICommandSelected) {
          items.push(this._getGenerateButtonItem());
        } else {
          items.push(...this._getInitialToolbarItems());
        }
        break;
      }
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
    this._refreshLoadIndicator();
    this._refreshInformer();
    this._refreshDialogAria();
  }

  private _refreshToolbarItems(): void {
    this._popup.option('toolbarItems', this._getToolbarItems());
  }

  private _retryExecuteAICommand(): void {
    this._updateResults();
    this._executeAICommand();
  }

  private _getAICommandParams(
    uiCommand: AICommandNameExtended,
  ): AICommandParamsMap[AICommandNameExtended] {
    const {
      _askAIPrompt: askAIPrompt,
      _currentOption: option,
      _getCustomCommandPrompt: getCustomPrompt,
      _selectedText: text,
    } = this;

    const uiCommandName = this._commandsMap[uiCommand].name;

    const params = buildAICommandParams<AICommandNameExtended>(
      uiCommandName,
      askAIPrompt,
      option,
      getCustomPrompt,
      text,
    );

    return params;
  }

  private _updateResults(value = ''): void {
    this._resultTextArea.option({ value });
  }

  private _processCommandCompletion(dialogState?: DialogState): void {
    this._abort?.();
    this._abort = undefined;
    this._isAICommandExecuting = false;

    if (dialogState) {
      this._setDialogState(dialogState);
    }
  }

  private _getAICommandCallbacks<T>(): RequestCallbacks<T> {
    const callbacks = {
      onComplete: (finalResponse: T): void => {
        this._updateResults(String(finalResponse));
        this._processCommandCompletion(DialogState.ResultReady);
      },
      onError: (): void => {
        this._processCommandCompletion(DialogState.Error);
      },
    };

    return callbacks;
  }

  private _executeAICommand(): void {
    const { _currentCommand: uiCommand } = this;
    const aiCommandName = uiCommand && getAICommandName(this._commandsMap[uiCommand]?.name);

    if (!(aiCommandName && this._aiIntegration[aiCommandName])) {
      return;
    }

    const callbacks = this._getAICommandCallbacks();
    const params = this._getAICommandParams(uiCommand);

    this._isAICommandExecuting = true;
    this._setDialogState(DialogState.Generating);

    const abort = (this._aiIntegration[aiCommandName] as unknown as AICommandExecutor<
      typeof uiCommand
    >)(params, callbacks);

    this._abort = abort;
  }

  private _cancelAICommandExecution(): void {
    this._processCommandCompletion(this._getInitialDialogState(true));
  }

  private _isCommandWithOptionsSelected(): boolean {
    if (
      this._currentCommand
      && this._commandsMap[this._currentCommand]?.name === AI_DIALOG_CUSTOM_COMMAND_NAME) {
      return Boolean(this._commandOptionsList?.length);
    }

    return AI_DIALOG_COMMANDS_WITH_OPTIONS.includes(this._currentCommand ?? '');
  }

  private _refreshCommandSelectBox(): void {
    const commandsList = Object.entries(this._commandsMap).map(
      ([name, config]: [string, CommandDefinition]) => ({ name, text: config.text }),
    );

    this._commandChangeSuppressed = true;
    this._commandSelectBox.option({
      disabled: this._isAICommandExecuting,
      dataSource: commandsList,
      value: this._currentCommand,
    });
    this._commandChangeSuppressed = false;
  }

  private _refreshOptionSelectBox(): void {
    const hasOptions = this._isCommandWithOptionsSelected();

    this._commandOptionSuppressed = true;
    this._optionSelectBox.option({
      disabled: this._isAICommandExecuting,
      visible: hasOptions,
      items: this._commandOptionsList ?? [],
      value: this._currentOption ?? this._commandOptionsList?.[0],
    });
    this._commandOptionSuppressed = false;
  }

  private _setTextAreasInitialState(): void {
    this._promptTextArea.option({
      disabled: true,
      readOnly: false,
      value: undefined,
      visible: false,
    });
    this._resultTextArea.option({
      disabled: false,
      readOnly: true,
      value: undefined,
      visible: true,
    });
  }

  private _setTextAreasAskingState(): void {
    this._promptTextArea.option({
      disabled: false,
      readOnly: false,
      value: this._askAIPrompt,
      visible: true,
    });
    this._resultTextArea.option({
      disabled: true,
      readOnly: false,
      value: undefined,
      visible: false,
    });
  }

  private _refreshTextAreas(): void {
    switch (this._dialogState) {
      case DialogState.Initial:
      case DialogState.InitialCanceled:
        this._setTextAreasInitialState();
        break;
      case DialogState.Asking:
      case DialogState.AskingCanceled:
        this._setTextAreasAskingState();
        break;
      case DialogState.Generating:
        this._promptTextArea.option({
          disabled: true,
          readOnly: false,
          value: this._askAIPrompt,
          visible: this._isAskAICommandSelected,
        });
        this._resultTextArea.option({
          disabled: true,
          readOnly: false,
          value: undefined,
          visible: true,
        });
        break;
      case DialogState.ResultReady:
        this._promptTextArea.option({
          disabled: !this._isAskAICommandSelected,
          readOnly: true,
          value: this._askAIPrompt,
          visible: this._isAskAICommandSelected,
        });
        this._resultTextArea.option({
          disabled: false,
          readOnly: true,
          visible: true,
        });
        break;
      case DialogState.Error: {
        if (this._isAskAICommandSelected) {
          this._setTextAreasAskingState();
        } else {
          this._setTextAreasInitialState();
        }
        break;
      }
      default:
        break;
    }
  }

  private _refreshLoadIndicator(): void {
    if (this._dialogState === DialogState.Generating) {
      this._renderLoadIndicator();
    } else {
      this._disposeLoadIndicator();
    }
  }

  private _refreshInformer(): void {
    const errorText = localizationMessage.format('dxHtmlEditor-aiDialogError');
    const cancelText = localizationMessage.format('dxHtmlEditor-aiDialogCanceled');

    switch (this._dialogState) {
      case DialogState.Error:
        this._informer.option({
          visible: true,
          text: errorText,
          icon: '',
          type: 'error',
        });
        break;
      case DialogState.InitialCanceled:
      case DialogState.AskingCanceled:
        this._informer.option({
          visible: true,
          text: cancelText,
          icon: 'errorcircle',
          type: 'info',
        });
        break;
      default:
        this._informer.option('visible', false);
        break;
    }
  }

  private _getInitialDialogState(canceled?: boolean): DialogState {
    const isAskingCommand = this._isAskAICommandSelected;

    if (canceled) {
      return isAskingCommand ? DialogState.AskingCanceled : DialogState.InitialCanceled;
    }

    return isAskingCommand ? DialogState.Asking : DialogState.Initial;
  }

  private _replaceButtonAction(event: AIDialogResult['event']): void {
    const { value } = this._resultTextArea.option();
    this.hide(value ?? '', event);
  }

  private _disposeLoadIndicator(): void {
    if (!this._loadIndicator) {
      return;
    }

    this._loadIndicator.dispose();
    this._loadIndicator.$element().remove();
    this._loadIndicator = undefined;
  }

  private _isOpen(): boolean {
    const { visible } = this._popup.option();

    return visible as boolean;
  }

  private _refreshDialogAria(): void {
    const id = String(new Guid());
    const $overlayContent = $(this._popup.content()).parent();
    const $title = $overlayContent.find(`.${AI_DIALOG_TITLE_CLASS}`);

    $title.attr('id', id);
    $overlayContent.attr('aria-labelledby', id);
  }

  updateAIIntegration(aiIntegration: AIIntegration): void {
    this._processCommandCompletion(this._getInitialDialogState());
    this._aiIntegration = aiIntegration;
    this._executeAICommand();
  }

  show(payload: AIDialogShowPayload): Promise<AIDialogResult> | undefined {
    const {
      currentCommand, currentCommandOption, commandsMap, text, prompt,
    } = payload;

    this._commandsMap = commandsMap;
    this._currentCommand = currentCommand;
    this._selectedText = text ?? '';
    this._commandOptionsList = commandsMap[currentCommand]?.options ?? [];
    this._currentOption = currentCommandOption;
    this._getCustomCommandPrompt = prompt;
    this._isAskAICommandSelected = currentCommand === AI_DIALOG_ASKAI_COMMAND_NAME;
    this._askAIPrompt = '';

    this._setDialogState(this._getInitialDialogState());

    if (!this._isAskAICommandSelected) {
      this._executeAICommand();
    }

    return super.show();
  }

  hide(resultText: AIDialogResult['resultText'], event: AIDialogResult['event']): void {
    this.deferred?.resolve({ resultText, event });
    super.hide();
  }
}
