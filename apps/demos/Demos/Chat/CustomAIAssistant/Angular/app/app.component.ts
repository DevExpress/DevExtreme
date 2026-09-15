import { bootstrapApplication } from '@angular/platform-browser';
import {
  Component, ViewChild, enableProdMode, provideZoneChangeDetection,
} from '@angular/core';
import config from 'devextreme/core/config';
import { loadMessages } from 'devextreme-angular/common/core/localization';
import type { AIIntegration } from 'devextreme-angular/common/ai-integration';
import type { DxChatTypes } from 'devextreme-angular/ui/chat';
import { AiAssistantComponent } from './components/ai-assistant/ai-assistant.component';
import { EmployeeFormComponent } from './components/employee-form/employee-form.component';
import { TaskGridComponent } from './components/task-grid/task-grid.component';
import { createAiIntegration } from './services/ai-service';
import { routeMessage } from './routing/chat-router';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

let modulePrefix = '';
// @ts-ignore
if (window && window.config?.packageConfigPaths) {
  modulePrefix = '/app';
}

config({
  editorStylingMode: 'filled',
});

config({
  floatingActionButtonConfig: {
    position: {
      my: 'right bottom',
      at: 'right bottom',
      of: '#grid-container',
      offset: '-16 -16',
    },
  },
});

loadMessages({
  en: {
    'dxChat-textareaPlaceholder': 'Enter a prompt...',
  },
});

@Component({
  selector: 'demo-app',
  templateUrl: `.${modulePrefix}/app.component.html`,
  styleUrls: [`.${modulePrefix}/app.component.css`],
  imports: [
    AiAssistantComponent,
    EmployeeFormComponent,
    TaskGridComponent,
  ],
})
export class AppComponent {
  @ViewChild(EmployeeFormComponent) private employeeForm!: EmployeeFormComponent;

  @ViewChild(TaskGridComponent) private taskGrid!: TaskGridComponent;

  @ViewChild(AiAssistantComponent) private aiAssistant!: AiAssistantComponent;

  readonly aiIntegration: AIIntegration = createAiIntegration();

  async onMessageSubmitted(message: DxChatTypes.TextMessage): Promise<void> {
    this.aiAssistant.setDisabled(true);

    try {
      await routeMessage(message.text ?? '', {
        form: this.employeeForm.instance,
        gridInstance: this.taskGrid.instance,
        aiIntegration: this.aiIntegration,
        pushMessage: (message) => this.aiAssistant.pushMessage(message),
      });
    } finally {
      this.aiAssistant.setDisabled(false);
    }
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
  ],
});
