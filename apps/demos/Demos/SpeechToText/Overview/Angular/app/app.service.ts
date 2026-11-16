import { Injectable } from '@angular/core';
import { type DxButtonTypes } from 'devextreme-angular/ui/button';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  private readonly displayModes: string[] = ['Icon Only', 'Text and Icon', 'Custom'];

  private readonly stylingModes: { displayValue: string; value: DxButtonTypes.ButtonStyle }[] = [
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

  private readonly types: { displayValue: string; value: DxButtonTypes.ButtonType }[] = [
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

  private readonly languages: string[] = [
    'Auto-detect',
    'English',
    'Spanish',
    'French',
    'German',
  ];

  private readonly langMap: { [key: string]: string } = {
    'Auto-detect': '',
    'English': 'en-US',
    'Spanish': 'es-ES',
    'French': 'fr-FR',
    'German': 'de-DE',
  };

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
