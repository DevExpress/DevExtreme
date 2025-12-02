import { ButtonTypes } from 'devextreme-react/button';

export const displayModes = ['Icon Only', 'Text and Icon', 'Custom'];

export const stylingModes: { displayValue: string; value: ButtonTypes.ButtonStyle }[] = [
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

export const types: { displayValue: string; value: ButtonTypes.ButtonType }[] = [
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

export const languages = [
  'Auto-detect',
  'English',
  'Spanish',
  'French',
  'German',
];

export const langMap = {
  "Auto-detect": '',
  "English": 'en-US',
  "Spanish": 'es-ES',
  "French": 'fr-FR',
  "German": 'de-DE',
};
