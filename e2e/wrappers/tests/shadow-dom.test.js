import { Selector, ClientFunction } from 'testcafe';
import { testInFramework } from '../test-helpers';

testInFramework('Shadow DOM styles test', 'shadow-dom', [
  'should apply styles to shadow DOM after click',
  async (t) => {
    const host = Selector('.shadow');
    const button = host.shadowRoot().find('.dx-button');

    const getComputedColor = ClientFunction(() => {
      const host = document.querySelector('.shadow');
      const span = host?.shadowRoot?.querySelector('.dx-button .dx-button-text');
      return span ? window.getComputedStyle(span).color : null;
    });

    // await t.debug();

    await t
      .expect(button.exists).ok('Button is present inside shadow root')
      .click(button)
      .wait(50);

    // await t.debug();

    const color = await getComputedColor();
    await t.expect(color).eql('rgb(0, 0, 255)', 'Text color should be blue');
  }
]);
