import '../js/__internal/integration/jquery';
// import '../js/ui/drop_down_editor/ui.drop_down_editor';
import '../js/ui/autocomplete';
import $ from 'jquery';
import { setupThemeSelector } from './themeSelector.ts';

window.addEventListener('load', () =>
  setupThemeSelector('theme-selector')
    .catch((err) => console.error('Theme loading failed:', err))
    .then(() => {
      const instance = $('#widget-container').dxAutocomplete({
        opened: true,
        // dropDownOptions: {
        //     width: 100,
        // },
      })
      // .dxDropDownEditor('instance');

      // instance.option('dropDownOptions.width', 200);
      // instance.option('width', 153);
    }));
