/* eslint-disable max-classes-per-file */
import messageLocalization from '@js/common/core/localization/message';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import type { Item, ItemClickEvent, Properties as DropDownProperties } from '@js/ui/drop_down_button';
import DropDownButton from '@js/ui/drop_down_button';
import domAdapter from '@ts/core/m_dom_adapter';

import type { ColumnHeadersView } from '../column_headers/m_column_headers';
import type { Column, ColumnsController } from '../columns_controller/m_columns_controller';
import { getColumnHeaderCellSelector } from '../columns_controller/m_columns_controller_utils';
import type { ColumnsResizerViewController } from '../columns_resizing_reordering/m_columns_resizing_reordering';
import { View } from '../m_modules';
import type { ModuleType } from '../m_types';
import { AIPromptEditor } from './ai_prompt_editor/ai_prompt_editor';
import type { AIPromptEditorOptions } from './ai_prompt_editor/types';
import { AI_COLUMN_NAME, CLASSES, ICON_NAMES } from './const';
import { createAIHeaderContainer, createChatSparkleOutlineIcon } from './dom';
import type { AIColumnController } from './m_ai_column_controller';
import {
  getAICommandColumnDefaultOptions,
  isAIColumnAutoMode,
  isAIColumnHeader,
  isEditorOptions,
  isHeaderDropDownButtonVisible,
  isPopupOptions,
  isPromptOption,
  isRefreshOption,
} from './utils';

export class AIColumnView extends View {
  private columnsController!: ColumnsController;

  private aiColumnController!: AIColumnController;

  private promptEditorInstance!: AIPromptEditor;

  private addAICommandColumn(): void {
    this.columnsController.addCommandColumn(getAICommandColumnDefaultOptions());
  }

  private getAIPromptEditorConfig(
    column: Column,
  ): AIPromptEditorOptions {
    const alignment = column.alignment === 'right' ? 'left' : 'right';
    const visibleIndex = this.columnsController.getVisibleIndex(column.index);

    return {
      prompt: column.ai?.prompt ?? '',
      container: this.element(),
      createComponent: this._createComponent.bind(this),
      onSubmit: (): void => {
        this.promptEditorInstance.updateStateOnAction('apply');
        this.columnsController.columnOption(
          column.index,
          'ai.prompt',
          this.promptEditorInstance.getEditorValue(),
          true,
        );
      },
      onStop: (): void => {
        this.promptEditorInstance.updateStateOnAction('stop');
        this.aiColumnController.abortAIColumnRequest(column.name as string);
      },
      onRefresh: (): void => {
        this.promptEditorInstance.updateStateOnAction('regenerate');
        this.aiColumnController.refreshAIColumn(column.name as string);
      },
      popupOptions: {
        container: domAdapter.getBody(),
        onHiding: (): void => {
          this.promptEditorInstance.updateStateOnAction('stop');
          this.aiColumnController.abortAIColumnRequest(column.name as string);
        },
        position: {
          my: `${alignment} top`,
          at: `${alignment} bottom`,
          of: getColumnHeaderCellSelector(visibleIndex),
          collision: 'fit',
          boundary: this.component.element(),
        },
        ...column.ai?.popup,
      },
      editorOptions: {
        ...column.ai?.editorOptions,
      },
    };
  }

  private updatePromptEditorInstance(column: Column): void {
    const config = this.getAIPromptEditorConfig(column);

    if (!this.promptEditorInstance) {
      this.promptEditorInstance = new AIPromptEditor(config);
    } else {
      this.promptEditorInstance.updateOptions(config);
    }
  }

  // TODO: support changing all columns and the entire column
  public optionChanged(args): void {
    super.optionChanged(args);

    if (args.name !== 'columns') {
      return;
    }

    const column = this.columnsController.getColumnByPath(args.fullName);

    if (column?.type !== AI_COLUMN_NAME) {
      return;
    }

    const columnOptionName = this.columnsController.getColumnOptionNameByFullName(args.fullName);
    const isPromptOptionName = isPromptOption(columnOptionName, args.value);

    if (isPromptOptionName) {
      this.promptEditorInstance?.updatePrompt(args.value);
    }

    if (isPromptOptionName && isAIColumnAutoMode(column)) {
      this.aiColumnController.sendAIColumnRequest(column.name);
    }

    const needUpdatePopup = isPopupOptions(columnOptionName, args.value);
    const needUpdateEditor = isEditorOptions(columnOptionName, args.value);
    if (needUpdatePopup || needUpdateEditor) {
      this.updatePromptEditorInstance(column);
    }

    if (isRefreshOption(columnOptionName, args.value)) {
      // TODO: this.component.refresh();
    }
  }

  private ensureAIPromptEditorVisibility() {
    const aiColumns = this.aiColumnController.getAIColumns();
    const aiColumnsWithVisiblePopup = aiColumns.filter((column) => column.ai?.popup?.visible);
    if (aiColumnsWithVisiblePopup.length > 0) {
      this.updatePromptEditorInstance(aiColumnsWithVisiblePopup[0]);
    }
  }

  public init(): void {
    this.columnsController = this.getController('columns');
    this.aiColumnController = this.getController('aiColumn');

    this.addAICommandColumn();
    this.aiColumnController.aiRequestCompleted.add(() => {
      this.promptEditorInstance?.updatePrompt(this.promptEditorInstance.getEditorValue());
      this.promptEditorInstance?.updateStateOnAction('stop');
    });
    this.aiColumnController.aiRequestRejected.add(() => {
      this.promptEditorInstance?.updateStateOnAction('stop');
    });
    this.aiColumnController.promptEditorRequested.add(({ column, cellElement }) => {
      this.showPromptEditor(cellElement, column);
    });
    this.renderCompleted.add(() => {
      this.ensureAIPromptEditorVisibility();
    });
  }

  public showPromptEditor(cellElement: HTMLElement, column: Column): Promise<boolean> {
    const $cellElement = $(cellElement);

    if (!$cellElement?.length || column?.type !== AI_COLUMN_NAME) {
      return Promise.resolve(false);
    }

    this.updatePromptEditorInstance(column);
    return this.promptEditorInstance.show();
  }

  public hidePromptEditor(): Promise<boolean> {
    return this.promptEditorInstance?.hide();
  }

  public getPromptEditorInstance(): AIPromptEditor {
    return this.promptEditorInstance;
  }
}

export const columnHeadersViewExtender = (
  Base: ModuleType<ColumnHeadersView>,
) => class AIColumnHeadersViewExtender extends Base {
  private aiColumnController!: AIColumnController;

  private columnsResizer!: ColumnsResizerViewController;

  private dropDownButtonInstance!: DropDownButton | null;

  private getDropDownButtonItems(column: Column): Item[] {
    return [
      {
        key: 'autoFill',
        icon: ICON_NAMES.autoFill,
        text: messageLocalization.format('dxDataGrid-aiDropDownButtonAutofillItem'),
      },
      {
        key: 'regenerate',
        icon: ICON_NAMES.regenerate,
        text: messageLocalization.format('dxDataGrid-aiDropDownButtonRegenerateItem'),
        disabled: !column.ai?.prompt,
      },
      {
        key: 'clear',
        icon: ICON_NAMES.clear,
        text: messageLocalization.format('dxDataGrid-aiDropDownButtonClearItem'),
        disabled: !column.ai?.prompt,
      },
    ];
  }

  private getDropDownButtonInstance($container: dxElementWrapper): DropDownButton {
    return DropDownButton.getInstance($container.find(`.${CLASSES.aiColumnHeaderButton}`)[0]) as DropDownButton;
  }

  private getDropDownButtonConfig(
    column: Column,
    $container: dxElementWrapper,
  ): DropDownProperties {
    return {
      showArrowIcon: false,
      icon: 'overflow',
      stylingMode: 'text',
      items: this.getDropDownButtonItems(column),
      onItemClick: (e: ItemClickEvent): void => {
        const { key: actionName } = e.itemData;

        // eslint-disable-next-line default-case
        switch (actionName) {
          case 'autoFill':
            this.aiColumnController.requestPromptEditor(
              column,
              $container[0],
            );
            break;
          case 'regenerate':
            this.aiColumnController.refreshAIColumn(column.name as string);
            break;
          case 'clear':
            this.aiColumnController.clearAIColumn(column.name as string);
            break;
        }
      },
      dropDownOptions: {
        width: 160,
        position: {
          of: $container[0],
          at: 'right bottom',
          my: 'right top',
        },
        onShown: (): void => {
          const actualColumn = this._columnsController.columnOption(column.name);

          this.dropDownButtonInstance = this.getDropDownButtonInstance($container);
          this.dropDownButtonInstance.option('items', this.getDropDownButtonItems(actualColumn));
        },
        onHidden: (): void => {
          this.dropDownButtonInstance = null;
        },
        onDisposing: (): void => {
          this.dropDownButtonInstance = null;
        },
      },
    };
  }

  private renderHeaderDropDownButton(column: Column, $container: dxElementWrapper): void {
    const $dropDownButton = $('<div>')
      .addClass(CLASSES.aiColumnHeaderButton)
      .appendTo($container);

    this._createComponent(
      $dropDownButton,
      DropDownButton,
      this.getDropDownButtonConfig(column, $container),
    );
  }

  private renderAIHeader($container: dxElementWrapper, column: Column): void {
    const $iconElement = createChatSparkleOutlineIcon();
    const $aiHeaderContainer = createAIHeaderContainer();
    const $cellContent = this.createCellContent($container, column);

    $cellContent.text(column.caption ?? '');
    $aiHeaderContainer
      .append($iconElement)
      .append($cellContent)
      .appendTo($container);
  }

  protected getHeaderDefaultTemplate($container: dxElementWrapper, options): void {
    if (isAIColumnHeader(options.column)) {
      this.renderAIHeader($container, options.column);
      return;
    }

    super.getHeaderDefaultTemplate($container, options);
  }

  protected _processTemplate(template, options) {
    const renderingTemplate = super._processTemplate(template, options);
    const needToRenderHeaderDropDownButton = isAIColumnHeader(options.column, options.rowType)
      && isHeaderDropDownButtonVisible(options.column);

    if (renderingTemplate && needToRenderHeaderDropDownButton) {
      return {
        render: (args) => {
          renderingTemplate.render(args);
          this.renderHeaderDropDownButton(args.model.column, $(args.container));
        },
      };
    }

    return renderingTemplate;
  }

  public init(): void {
    super.init();
    this.aiColumnController = this.getController('aiColumn');
    this.columnsResizer = this.getController('columnsResizer');

    this.columnsResizer.resizeStarted.add(() => {
      this.dropDownButtonInstance?.close();
    });
  }

  public renderDragCellContent($dragContainer: dxElementWrapper, column: Column): void {
    if (column.type === AI_COLUMN_NAME) {
      this.renderAIHeader($dragContainer, column);
      return;
    }

    super.renderDragCellContent($dragContainer, column);
  }

  public dispose(): void {
    super.dispose();
    this.dropDownButtonInstance = null;
  }
};
