import { bootstrapApplication } from '@angular/platform-browser';
import {
  Component, enableProdMode, inject, viewChild,
} from '@angular/core';
import config from 'devextreme/core/config';
import { loadMessages } from 'devextreme-angular/common/core/localization';
import type { DxChatTypes } from 'devextreme-angular/ui/chat';
import { AiAssistantComponent } from './components/ai-assistant/ai-assistant.component';
import { EmployeeFormComponent } from './components/employee-form/employee-form.component';
import { TaskGridComponent } from './components/task-grid/task-grid.component';
import { AiService } from './ai/ai.service';
import { routeMessage } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

config({
  floatingActionButtonConfig: {
    position: {
      my: 'right bottom',
      at: 'right bottom',
      of: '#grid-container',
      offset: '-16 -16',
    },
  },
  editorStylingMode: 'filled',
});

loadMessages({
  en: {
    'dxChat-textareaPlaceholder': 'Ask AI Assistant...',
  },
});

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [AiService],
  imports: [
    AiAssistantComponent,
    EmployeeFormComponent,
    TaskGridComponent,
  ],
})
export class AppComponent {
  private readonly employeeForm = viewChild.required(EmployeeFormComponent);

  private readonly taskGrid = viewChild.required(TaskGridComponent);

  private readonly aiAssistant = viewChild.required(AiAssistantComponent);

  readonly aiIntegration = inject(AiService).getAiIntegration();

  async onMessageSubmitted(message: DxChatTypes.TextMessage): Promise<void> {
    this.aiAssistant().setDisabled(true);

    try {
      await routeMessage(message.text ?? '', {
        form: this.employeeForm().formComponent(),
        gridInstance: this.taskGrid().gridComponent(),
        aiIntegration: this.aiIntegration,
        pushMessage: (message) => this.aiAssistant().pushMessage(message),
      });
    } finally {
      this.aiAssistant().setDisabled(false);
    }
  }
}

bootstrapApplication(AppComponent);
