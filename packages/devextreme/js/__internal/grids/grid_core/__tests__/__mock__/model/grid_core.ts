/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { GridBase } from '@js/common/grids';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { LoadPanelModel } from '@ts/ui/__tests__/__mock__/model/load_panel';
import { ToastModel } from '@ts/ui/__tests__/__mock__/model/toast';

import { AIPromptEditorModel } from './ai_prompt_editor';
import { AIHeaderCellModel } from './cell/ai_header_cell';
import { DataCellModel } from './cell/data_cell';
import { HeaderCellModel } from './cell/header_cell';

const SELECTORS = {
  headerRowClass: 'dx-header-row',
  dataRowClass: 'dx-data-row',
  groupRowClass: 'dx-group-row',
  aiDialog: 'dx-aidialog',
  aiPromptEditor: 'dx-ai-prompt-editor',
  toast: 'dx-toast',
  loadPanel: 'dx-loadpanel',
};

export abstract class GridCoreModel<TInstance extends GridBase = GridBase> {
  protected abstract NAME: string;

  constructor(protected readonly root: HTMLElement) {}

  private getPromptEditorContainer(): HTMLElement {
    return this.root.querySelector(`.${SELECTORS.aiPromptEditor}`) as HTMLElement;
  }

  public getHeaderCells(): NodeListOf<HTMLElement> {
    return this.root.querySelectorAll(`.${SELECTORS.headerRowClass} > td`);
  }

  public getHeaderCell(columnIndex: number): HeaderCellModel {
    return new HeaderCellModel(this.getHeaderCells()[columnIndex], this.addWidgetPrefix.bind(this));
  }

  public getAIHeaderCell(columnIndex: number): AIHeaderCellModel {
    return new AIHeaderCellModel(
      this.getHeaderCells()[columnIndex],
      this.addWidgetPrefix.bind(this),
    );
  }

  public getDataRows(): NodeListOf<HTMLElement> {
    return this.root.querySelectorAll(`.${SELECTORS.dataRowClass}`);
  }

  public getDataCells(rowIndex: number): NodeListOf<HTMLElement> {
    return this.root.querySelectorAll(`.${SELECTORS.dataRowClass}:nth-child(${rowIndex + 1}) > td`);
  }

  public getDataCell(rowIndex: number, columnIndex: number): DataCellModel {
    return new DataCellModel(this.getDataCells(rowIndex)[columnIndex]);
  }

  public getGroupRows(): NodeListOf<HTMLElement> {
    return this.root.querySelectorAll(`.${SELECTORS.groupRowClass}`);
  }

  public getHeaderByText(text: string): dxElementWrapper {
    return $(Array.from(this.getHeaderCells()).find((el) => $(el).text().includes(text)));
  }

  public getAIDialog(): HTMLElement {
    return document.body.querySelector(`.${SELECTORS.aiDialog}`) as HTMLElement;
  }

  public getAIPromptEditor(): AIPromptEditorModel {
    return new AIPromptEditorModel(this.getPromptEditorContainer());
  }

  private getToastContainer(): HTMLElement {
    return document.body.querySelector(`.${SELECTORS.toast}`) as HTMLElement;
  }

  public getToast(): ToastModel {
    return new ToastModel(this.getToastContainer());
  }

  public addWidgetPrefix(classNames: string): string {
    const componentName = this.NAME;

    return `dx-${componentName.slice(2).toLowerCase()}${classNames ? `-${classNames}` : ''}`;
  }

  public apiColumnOption(id: string, name?: string, value?: any): any {
    switch (arguments.length) {
      case 1:
        return this.getInstance().columnOption(id);
      case 2:
        return this.getInstance().columnOption(id, name);
      default:
        this.getInstance().columnOption(id, name as string, value);
        return undefined;
    }
  }

  public async apiRefresh(): Promise<void> {
    await this.getInstance().refresh();
  }

  public apiAbortAIColumnRequest(columnName: string): void {
    this.getInstance().abortAIColumnRequest(columnName);
  }

  public getLoadPanel(): LoadPanelModel {
    return new LoadPanelModel(document.body.querySelector(`.${SELECTORS.loadPanel}`));
  }

  public abstract getInstance(): TInstance;
}
