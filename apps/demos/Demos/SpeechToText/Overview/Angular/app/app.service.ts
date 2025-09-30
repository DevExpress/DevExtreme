import { Injectable } from '@angular/core';
import { type DxButtonTypes } from 'devextreme-angular/ui/button';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  displayModes: string[] = [];

  stylingModes: { displayValue: string; value: DxButtonTypes.ButtonStyle }[] = [];

  types: { displayValue: string; value: DxButtonTypes.ButtonType }[] = [];

  languages: string[] = [];

  langMap: { [key: string]: string } = {};

  constructor() {
    this.displayModes = ['Icon Only', 'Text and Icon', 'Custom'];
    this.stylingModes = [
      {
        displayValue: 'Contained',
        value: 'contained',
      },
      {
        displayValue: 'Outlined',
        value: 'outlined',
      },
      {
        displayValue: 'Text',
        value: 'text',
      },
    ];
    this.types = [
      {
        displayValue: 'Normal',
        value: 'normal',
      },
      {
        displayValue: 'Success',
        value: 'success',
      },
      {
        displayValue: 'Default',
        value: 'default',
      },
      {
        displayValue: 'Danger',
        value: 'danger',
      },
    ];
    this.languages = [
      'Auto-detect',
      'English',
      'Spanish',
      'French',
      'German',
    ];
    this.langMap = {
      'Auto-detect': '',
      'English': 'en-US',
      'Spanish': 'es-ES',
      'French': 'fr-FR',
      'German': 'de-DE',
    };
  }

  getDisplayModes() {
    return this.displayModes;
  }

  getStylingModes() {
    return this.stylingModes;
  }

  getTypes() {
    return this.types;
  }

  getLanguages() {
    return this.languages;
  }

  getLangMap() {
    return this.langMap;
  }
}
