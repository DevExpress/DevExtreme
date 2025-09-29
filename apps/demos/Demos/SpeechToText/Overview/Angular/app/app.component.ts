import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxSpeechToTextModule } from 'devextreme-angular/ui/speech-to-text';
import { DxTextAreaModule } from 'devextreme-angular/ui/text-area';
import { DxButtonModule } from 'devextreme-angular/ui/button';
import { DxSelectBoxModule } from 'devextreme-angular/ui/select-box';
import { DxSwitchModule } from 'devextreme-angular/ui/switch';

import { AppService } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

let modulePrefix = '';
// @ts-ignore
if (window && window.config?.packageConfigPaths) {
  modulePrefix = '/app';
}

@Component({
  selector: 'demo-app',
  templateUrl: `.${modulePrefix}/app.component.html`,
  styleUrls: [`.${modulePrefix}/app.component.css`],
})
export class AppComponent {
  state: 'initial' | 'listening';

  startText: string;

  stopText: string;

  displayMode: string;

  displayModes: string[];

  stylingMode: string;

  stylingModes: { displayValue: string; value: string }[];

  stylingModeDisabled: boolean;

  type: string;

  types: { displayValue: string; value: string }[];

  typeDisabled: boolean;

  hint: string;

  disabled: boolean;

  textAreaValue: string;

  clearButtonDisabled: boolean;

  language: string;

  languages: string[];

  langMap: { [key: string]: string };

  interimResults: boolean;

  continuous: boolean;

  animation: boolean;

  speechRecognitionConfig: Record<string, unknown>;

  constructor(private readonly appService: AppService) {
    this.state = 'initial';
    this.startText = '';
    this.stopText = '';
    this.displayModes = this.appService.getDisplayModes();
    this.displayMode = this.displayModes[0];
    this.stylingModes = this.appService.getStylingModes();
    this.stylingMode = this.stylingModes[0].value;
    this.stylingModeDisabled = false;
    this.types = this.appService.getTypes();
    this.type = this.types[2].value;
    this.typeDisabled = false;
    this.hint = 'Start voice recognition';
    this.disabled = false;
    this.textAreaValue = '';
    this.clearButtonDisabled = true;
    this.languages = this.appService.getLanguages();
    this.language = this.languages[0];
    this.langMap = this.appService.getLangMap();
    this.interimResults = true;
    this.continuous = false;
    this.animation = true;
    this.updateSpeechRecognitionConfig();
  }

  onStartClick() {
    this.state = 'listening';
    this.hint = 'Stop voice recognition';
    if (this.displayMode !== 'Custom') {
      return;
    }

    this.type = 'danger';
  }

  stopHandler() {
    this.state = 'initial';
    this.hint = 'Start voice recognition';

    if (this.displayMode !== 'Custom') {
      return;
    }

    this.type = 'default';
  }

  onStopClick() {
    this.stopHandler();
  }

  onResult({ event }) {
    const { results } = event;
    const resultText = Object.values(results)
      .map((resultItem) => resultItem[0].transcript)
      .join(' ');
    this.textAreaValue = resultText;

    if (!this.continuous && results[0].isFinal === true) {
      this.stopHandler();
    }
  }

  onTextAreaValueChanged({ value }) {
    this.clearButtonDisabled = !value;
  }

  onClearButtonClick() {
    this.textAreaValue = '';
  }

  onDisplayModeChanged({ value }) {
    const isCustomMode = value === 'Custom';
    this.stylingModeDisabled = isCustomMode;
    this.typeDisabled = isCustomMode;

    if (value === 'Text and Icon') {
      this.startText = 'Dictate';
      this.stopText = 'Stop';

      return;
    }

    this.startText = '';
    this.stopText = '';

    if (isCustomMode) {
      this.stylingMode = 'contained';
      this.type = this.state === 'initial' ? 'default' : 'danger';
    }
  }

  updateSpeechRecognitionConfig() {
    this.speechRecognitionConfig = {
      lang: this.langMap[this.language],
      interimResults: this.interimResults,
      continuous: this.continuous,
    };
  }
}

@NgModule({
  imports: [
    BrowserModule,
    DxSpeechToTextModule,
    DxTextAreaModule,
    DxButtonModule,
    DxSelectBoxModule,
    DxSwitchModule,
  ],
  declarations: [AppComponent],
  providers: [AppService],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
