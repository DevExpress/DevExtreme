import { Selector } from 'testcafe';
import { testInFramework } from '../test-helpers';

if(process.env.FRAMEWORK === 'react') {
  testInFramework('Gantt template state update', 'gantt-template-state-update', [
      'Gantt should be able to ummount its template when a parent component\'s state update happens',
      async (t) => {
        const hideButton = Selector('button').withText('Hide Data');
        const noDataPlaceholder = Selector('.dx-treelist-nodata');

        await t
          .click(hideButton)
          .expect(noDataPlaceholder.visible).ok()
          .expect(noDataPlaceholder.textContent).eql('No data');
      }
  ]);
}
