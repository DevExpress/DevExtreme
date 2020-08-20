import { Selector } from 'testcafe';
import url from '../../helpers/getPageUrl';

fixture`Map`
  .page(url(__dirname, './pages/T914315.html'));

test('Map should not raise errors when it is disposed immediately after creating (T914315)', async (t) => {
  const $editButton = Selector('.dx-command-edit').child();

  await t
    .click($editButton)
    .wait(500)
    .expect(true).ok();
});
