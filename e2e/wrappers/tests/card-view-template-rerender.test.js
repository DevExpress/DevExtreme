import { Selector } from 'testcafe';
import { testInFramework } from '../test-helpers';

if(process.env.FRAMEWORK === 'react') {
  testInFramework('CardView template re-rendering', 'card-view-template-rerender', [
      'CardView should not duplicate card templates after a dataSource update (T1336765)',
      async (t) => {
        const updateButton = Selector('button').withText('Update Data');
        const cards = Selector('.custom-card');

        await t
          .expect(cards.count).eql(2)
          .click(updateButton)
          .expect(cards.count).eql(2)
          .expect(cards.nth(0).textContent).eql('1: 1')
          .expect(cards.nth(1).textContent).eql('2: 1');
      }
  ]);
}
