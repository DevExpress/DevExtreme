import {
  Component, OnDestroy, OnInit, inject, input, signal,
} from '@angular/core';
import { DxTextBoxModule, DxButtonGroupModule, DxButtonModule, DxTextAreaModule, DxLoadPanelModule } from 'devextreme-angular';
import { type DxTextBoxTypes } from 'devextreme-angular/ui/text-box';
import { type DxButtonGroupTypes } from 'devextreme-angular/ui/button-group';
import { type DxButtonTypes } from 'devextreme-angular/ui/button';
import { type EventObject } from 'devextreme-angular/common/core/events';
import themes from 'devextreme/ui/themes';
import { type Vehicle, type AbortRequest } from '../app.service';
import { AiService, type AIMessage } from '../ai/ai.service';

function getOutputAreaHeights() {
  const isCompact = themes.current().endsWith('compact');
  const isMaterial = themes.current().startsWith('material');
  const isGeneric = themes.current().startsWith('generic');

  if (isMaterial) {
    return { min: isCompact ? 60 : 68, max: isCompact ? 200 : 244 };
  }
  if (isGeneric) {
    return { min: isCompact ? 42 : 56, max: isCompact ? 154 : 178 };
  }
  return { min: isCompact ? 42 : 56, max: isCompact ? 154 : 196 };
}

@Component({
  selector: 'detail-view',
  templateUrl: './detail-view.component.html',
  styleUrls: ['./detail-view.component.css'],
  imports: [
    DxTextBoxModule,
    DxButtonGroupModule,
    DxButtonModule,
    DxTextAreaModule,
    DxLoadPanelModule,
  ],
})
export class DetailViewComponent implements OnInit, OnDestroy {
  private readonly aiService = inject(AiService);

  readonly rowData = input.required<Vehicle>();

  readonly registerAbortRequest = input<(abortRequest: AbortRequest) => void>();

  readonly unregisterAbortRequest = input<(abortRequest: AbortRequest) => void>();

  readonly promptValue = signal('');

  readonly responseValue = signal('');

  readonly submitButtonText = signal('Submit');

  readonly isLoading = signal(false);

  readonly isError = signal(false);

  readonly outputAreaHeights = getOutputAreaHeights();

  readonly suggestions = [
    { type: 'default', text: '✨ Summary', prompt: 'Display general information about this vehicle and its features.' },
    { type: 'default', text: '⚡ Ideal Buyer', prompt: 'Describe who this vehicle appeals to the most in a sentence.' },
    { type: 'default', text: '🏎️ Competitors', prompt: 'List 2-3 models that directly compete with this vehicle.' },
  ];

  private abortController: AbortController | null = null;

  readonly abortRequest = () => this.abortController?.abort();

  ngOnInit() {
    this.registerAbortRequest()?.(this.abortRequest);
  }

  ngOnDestroy() {
    this.abortRequest();
    this.unregisterAbortRequest()?.(this.abortRequest);
  }

  onSubmit({ event }: DxTextBoxTypes.EnterKeyEvent | DxButtonTypes.ClickEvent) {
    this.handleSubmit(event);
  }

  onSuggestionClick({ itemData: suggestion, event }: DxButtonGroupTypes.ItemClickEvent) {
    this.promptValue.set(suggestion.prompt);
    this.handleSubmit(event);
  }

  async handleSubmit(event?: EventObject) {
    const prompt = this.promptValue();

    if (!prompt) return;

    const controller = new AbortController();
    this.abortController = controller;
    this.isError.set(false);
    this.isLoading.set(true);
    (event?.target as HTMLElement)?.blur();

    try {
      const messages: AIMessage[] = [
        { role: 'system', content: this.aiService.getSystemPrompt() },
        { role: 'user', content: `User prompt: ${prompt}\nRow data: ${JSON.stringify(this.rowData())}` },
      ];

      const aiResponse = await this.aiService.getAIResponse(messages, controller.signal);

      if (aiResponse === '') throw new Error('AI response is empty');
      this.responseValue.set(aiResponse);
    } catch {
      this.responseValue.set('');
      this.isError.set(true);
    } finally {
      this.abortController = null;
      this.isLoading.set(false);
      this.submitButtonText.set('Resubmit');
      (event?.target as HTMLElement)?.focus();
    }
  }
}
