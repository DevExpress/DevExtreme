import messageLocalization from '@js/common/core/localization/message';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import type { Item, ItemClickEvent, Properties as DropDownProperties } from '@js/ui/drop_down_button';
import DropDownButton from '@js/ui/drop_down_button';

import type { ColumnHeadersView } from '../column_headers/m_column_headers';
import type { Column } from '../columns_controller/m_columns_controller';
import type { ColumnsResizerViewController } from '../columns_resizing_reordering/m_columns_resizing_reordering';
import type { ModuleType } from '../m_types';
import { AI_COLUMN_NAME, CLASSES, ICON_NAMES } from './const';
import { createAIHeaderContainer, createChatSparkleOutlineIcon } from './dom';
import type { AIColumnController } from './m_ai_column_controller';
import type { AIPromptEditorViewController } from './m_ai_prompt_editor_view_controller';
import {
  isAIColumnHeader,
  isHeaderDropDownButtonVisible,
  isPromptOption,
} from './utils';

export const columnHeadersViewExtender = (
  Base: ModuleType<ColumnHeadersView>,
) => class AIColumnHeadersViewExtender extends Base {
  private aiColumnController!: AIColumnController;

  private aiPromptEditorController!: AIPromptEditorViewController;

  private columnsResizer!: ColumnsResizerViewController;

  private activeDropDownButtonInstance!: DropDownButton | null;

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
    const alignment = column.alignment === 'right' ? 'left' : 'right';

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
            this.aiPromptEditorController.show($container[0], column);
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
          at: `${alignment} bottom`,
          my: `${alignment} top`,
        },
        onShown: (): void => {
          this.activeDropDownButtonInstance = this.getDropDownButtonInstance($container);
        },
        onHidden: (): void => {
          this.activeDropDownButtonInstance = null;
        },
        onDisposing: (): void => {
          this.activeDropDownButtonInstance = null;
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
    this.aiPromptEditorController = this.getController('aiPromptEditor');
    this.columnsResizer = this.getController('columnsResizer');

    this.columnsResizer.resizeStarted.add(() => {
      this.activeDropDownButtonInstance?.close();
    });
  }

  public optionChanged(args): void {
    super.optionChanged(args);

    if (args.name !== 'columns') {
      return;
    }

    const column = this._columnsController.getColumnByPath(args.fullName);

    if (column?.type !== AI_COLUMN_NAME) {
      return;
    }

    const columnOptionName = this._columnsController.getColumnOptionNameByFullName(args.fullName);
    const isPromptOptionName = isPromptOption(columnOptionName, args.value);

    if (isPromptOptionName) {
      const visibleIndex = this._columnsController.getVisibleIndex(column.index);
      const $headerElement = this.getHeaderElement(visibleIndex);
      const dropDownButtonInstance = this.getDropDownButtonInstance($headerElement);

      dropDownButtonInstance?.option('items', this.getDropDownButtonItems(column));
    }
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
    this.activeDropDownButtonInstance = null;
  }
};
