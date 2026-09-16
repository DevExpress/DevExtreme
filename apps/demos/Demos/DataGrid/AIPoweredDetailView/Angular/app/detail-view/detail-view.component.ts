import { Component, Input, ChangeDetectorRef, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DxTextBoxModule, DxButtonGroupModule, DxButtonModule, DxTextAreaModule, DxLoadPanelModule } from 'devextreme-angular';
import { type DxTextBoxTypes } from 'devextreme-angular/ui/text-box';
import { type DxButtonGroupTypes } from 'devextreme-angular/ui/button-group';
import { type DxButtonTypes } from 'devextreme-angular/ui/button';
import { type DxEvent } from 'devextreme/events';
import themes from 'devextreme/ui/themes';
import { type Vehicle } from '../app.service';
import { AiService, type AIMessage } from '../ai/ai.service';

@Component({
  selector: 'detail-view',
  templateUrl: './detail-view/detail-view.component.html',
  styleUrls: ['./detail-view/detail-view.component.css'],
  imports: [
    CommonModule,
    DxTextBoxModule,
    DxButtonGroupModule,
    DxButtonModule,
    DxTextAreaModule,
    DxLoadPanelModule,
  ],
})
export class DetailViewComponent implements OnInit, OnDestroy {
  @Input() rowData!: Vehicle;

  @Input() registerAbortRequest?: (abortRequest: () => void) => void;

  @Input() unregisterAbortRequest?: (abortRequest: () => void) => void;

  promptValue: string = '';

  responseValue: string = '';

  submitButtonText: string = 'Submit';

  isLoading: boolean = false;

  isError: boolean = false;

  outputAreaMinHeight: number;

  outputAreaMaxHeight: number;

  abortController: AbortController | null = null;

  readonly abortRequest = () => this.abortController?.abort();

  suggestions = [
    { type: 'default', text: '✨ Summary', prompt: 'Display general information about this vehicle and its features.' },
    { type: 'default', text: '⚡ Ideal Buyer', prompt: 'Describe who this vehicle appeals to the most in a sentence.' },
    { type: 'default', text: '🏎️ Competitors', prompt: 'List 2-3 models that directly compete with this vehicle.' },
  ];

  constructor(private readonly aiService: AiService, private readonly changeDetectorRef: ChangeDetectorRef) {
    const isCompact = themes.current().endsWith('compact');
    const isMaterial = themes.current().startsWith('material');
    const isGeneric = themes.current().startsWith('generic');

    if (isMaterial) {
      this.outputAreaMinHeight = isCompact ? 60 : 68;
      this.outputAreaMaxHeight = isCompact ? 200 : 244;
    } else if (isGeneric) {
      this.outputAreaMinHeight = isCompact ? 42 : 56;
      this.outputAreaMaxHeight = isCompact ? 154 : 178;
    } else {
      this.outputAreaMinHeight = isCompact ? 42 : 56;
      this.outputAreaMaxHeight = isCompact ? 154 : 196;
    }
  }

  ngOnInit() {
    this.registerAbortRequest?.(this.abortRequest);
  }

  ngOnDestroy() {
    this.abortRequest();
    this.unregisterAbortRequest?.(this.abortRequest);
  }

  onSubmit({ event }: DxTextBoxTypes.EnterKeyEvent | DxButtonTypes.ClickEvent) {
    this.handleSubmit(event);
  }

  onSuggestionClick({ itemData: suggestion, event }: DxButtonGroupTypes.ItemClickEvent) {
    this.promptValue = suggestion.prompt;
    this.handleSubmit(event);
  }

  async handleSubmit(event?: DxEvent) {
    if (!this.promptValue) return;

    const controller = new AbortController();
    this.abortController = controller;
    this.isError = false;
    this.isLoading = true;
    (event?.target as HTMLElement)?.blur();

    try {
      const messages: AIMessage[] = [
        { role: 'system', content: this.aiService.getSystemPrompt() },
        { role: 'user', content: `User prompt: ${this.promptValue}\nRow data: ${JSON.stringify(this.rowData)}` },
      ];

      const aiResponse = await this.aiService.getAIResponse(messages, controller.signal);

      if (aiResponse === '') throw new Error('AI response is empty');
      this.responseValue = aiResponse;
    } catch {
      this.responseValue = '';
      this.isError = true;
    } finally {
      this.abortController = null;
      this.isLoading = false;
      this.submitButtonText = 'Resubmit';
      this.changeDetectorRef.detectChanges();
      (event?.target as HTMLElement)?.focus();
    }
  }

}
