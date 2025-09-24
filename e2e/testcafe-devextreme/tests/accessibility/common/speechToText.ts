import { Properties } from 'devextreme/ui/speech_to_text.d';
import url from '../../../helpers/getPageUrl';
import { testAccessibility, Configuration } from '../../../helpers/accessibility/test';
import { Options } from '../../../helpers/generateOptionMatrix';

fixture.disablePageReloads`Accessibility`
  .page(url(__dirname, '../../container.html'));

const options: Options<Properties> = {
  startText: ['', 'custom text'],
  stopIcon: ['', 'user'],
};

const configuration: Configuration = {
  component: 'dxSpeechToText',
  options,
};

testAccessibility(configuration);
