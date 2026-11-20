import type { Properties } from 'devextreme/ui/speech_to_text';
import { testAccessibility, type Configuration } from '../../helpers/accessibility/test';
import type { Options } from '../../helpers/generateOptionMatrix';

const options: Options<Properties> = {
  startText: ['', 'custom text'],
  stopIcon: ['', 'user'],
};

const configuration: Configuration<Properties> = {
  component: 'dxSpeechToText',
  options,
};

testAccessibility(configuration);
