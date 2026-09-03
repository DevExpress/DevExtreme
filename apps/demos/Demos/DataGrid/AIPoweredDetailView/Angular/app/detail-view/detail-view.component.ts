import { Component, Input, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DxTextBoxModule, DxButtonGroupModule, DxButtonModule, DxTextAreaModule, DxLoadPanelModule } from 'devextreme-angular';
import { DxTextBoxTypes } from 'devextreme-angular/ui/text-box';
import { DxButtonGroupTypes } from 'devextreme-angular/ui/button-group';
import { DxButtonTypes } from 'devextreme-angular/ui/button';
import { type Vehicle } from '../app.service';
import { AiService, type AIMessage } from '../ai/ai.service';

type SubmitEvent = DxButtonTypes.ClickEvent | DxTextBoxTypes.EnterKeyEvent;

let modulePrefix = '';
// @ts-ignore
if (window && window.config?.packageConfigPaths) {
  modulePrefix = '/app';
}

@Component({
  selector: 'detail-view',
  templateUrl: `.${modulePrefix}/detail-view/detail-view.component.html`,
  styleUrls: [`.${modulePrefix}/detail-view/detail-view.component.css`],
  providers: [AiService],
  imports: [
    CommonModule,
    DxTextBoxModule,
    DxButtonGroupModule,
    DxButtonModule,
    DxTextAreaModule,
    DxLoadPanelModule,
  ],
})
export class DetailViewComponent {
  @Input() rowData!: Vehicle;

  promptValue: string = '';

  responseValue: string = '';

  isSubmitButtonDisabled: boolean = true;

  isLoading: boolean = false;

  isError: boolean = false;

  outputAreaMinHeight: number = 56;
  
  outputAreaMaxHeight: number = 196;

  suggestions = [
    { type: 'default', text: '✨ Summary', prompt: 'Display general information about this vehicle and its features.' },
    { type: 'default', text: '⚡ Ideal Buyer', prompt: 'Describe who this vehicle appeals to the most in a sentence.' },
    { type: 'default', text: '🏎️ Competitors', prompt: 'List 2-3 models that directly compete with this vehicle.' },
  ];

  constructor(private readonly aiService: AiService, private readonly changeDetectorRef: ChangeDetectorRef) {
    const isMaterial = document.querySelector('.dx-theme-material');
    const isGeneric = document.querySelector('.dx-theme-generic');

    if (isMaterial) {
      this.outputAreaMinHeight = 68;
      this.outputAreaMaxHeight = 244;
    } else if (isGeneric) {
      this.outputAreaMaxHeight = 178;
    }
  }

  onSuggestionClick({ itemData: suggestion }: DxButtonGroupTypes.ItemClickEvent) {
    this.promptValue = suggestion.prompt;
  }

  async handleSubmit({ event }: SubmitEvent) {
    if (this.promptValue === '') return;

    this.isError = false;
    this.isLoading = true;
    (event?.target as HTMLElement).blur();

    try {
      const messages: AIMessage[] = [
        { role: 'system', content: this.aiService.getSystemPrompt() },
        { role: 'user', content: `User prompt: ${this.promptValue}\nRow data: ${JSON.stringify(this.rowData)}` },
      ];
      const aiResponse = await this.aiService.getAIResponse(messages);
      this.responseValue = aiResponse!;
    } catch {
      this.responseValue = '';
      this.isError = true;
    } finally {
      this.isLoading = false;
      this.changeDetectorRef.detectChanges();
      (event?.target as HTMLElement).focus();
    }

  }
}
