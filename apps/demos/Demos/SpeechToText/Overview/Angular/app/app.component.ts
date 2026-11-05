import { bootstrapApplication } from '@angular/platform-browser';
import {
  Component, computed, enableProdMode, inject, signal,
} from '@angular/core';
import { DxSpeechToTextModule } from 'devextreme-angular/ui/speech-to-text';
import { DxTextAreaModule } from 'devextreme-angular/ui/text-area';
import { DxButtonModule } from 'devextreme-angular/ui/button';
import { DxSelectBoxModule } from 'devextreme-angular/ui/select-box';
import { DxSwitchModule } from 'devextreme-angular/ui/switch';
import notify from 'devextreme/ui/notify';

import { AppService } from './app.service';

declare global {
  interface Window {
    SpeechRecognition?: any;
    webkitSpeechRecognition?: any;
  }
}

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [
    DxSpeechToTextModule,
    DxTextAreaModule,
    DxButtonModule,
    DxSelectBoxModule,
    DxSwitchModule,
  ],
})
export class AppComponent {
  private readonly appService = inject(AppService);

  private state: 'initial' | 'listening' = 'initial';

  readonly startText = signal('');

  readonly stopText = signal('');

  readonly displayModes = this.appService.getDisplayModes();

  readonly displayMode = signal(this.displayModes[0]);

  readonly stylingModes = this.appService.getStylingModes();

  readonly stylingMode = signal(this.stylingModes[0].value);

  readonly types = this.appService.getTypes();

  readonly type = signal(this.types[2].value);

  readonly hint = signal('Start voice recognition');

  readonly disabled = signal(false);

  readonly textAreaValue = signal('');

  readonly languages = this.appService.getLanguages();

  readonly language = signal(this.languages[0]);

  private readonly langMap = this.appService.getLangMap();

  readonly interimResults = signal(true);

  readonly continuous = signal(false);

  readonly animation = signal(true);

  readonly speechRecognitionConfig = computed<Record<string, unknown>>(() => ({
    lang: this.langMap[this.language()],
    interimResults: this.interimResults(),
    continuous: this.continuous(),
  }));

  onStartClick() {
    if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
      notify({
        message: 'The browser does not support Web Speech API (SpeechRecognition).',
        type: 'error',
        displayTime: 7000,
        position: 'bottom center',
        width: 'auto',
      });
      return;
    }

    this.state = 'listening';
    this.hint.set('Stop voice recognition');
    if (this.displayMode() !== 'Custom') {
      return;
    }

    this.type.set('danger');
  }

  onResult({ event }) {
    const { results } = event;
    const resultText = Object.values(results)
      .map((resultItem) => resultItem[0].transcript.trim())
      .join(' ');
    this.textAreaValue.set(resultText);
  }

  onEnd() {
    this.state = 'initial';
    this.hint.set('Start voice recognition');

    if (this.displayMode() !== 'Custom') {
      return;
    }

    this.type.set('default');
  }

  onClearButtonClick() {
    this.textAreaValue.set('');
  }

  onDisplayModeChanged({ value }) {
    if (value === 'Text and Icon') {
      this.startText.set('Dictate');
      this.stopText.set('Stop');

      return;
    }

    this.startText.set('');
    this.stopText.set('');

    if (value === 'Custom') {
      this.stylingMode.set('contained');
      this.type.set(this.state === 'initial' ? 'default' : 'danger');
    }
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    AppService,
  ],
});
