import url from '../../helpers/getPageUrl';
import Lookup from '../../model/lookup';

fixture`Lookup`
  .page(url(__dirname, './pages/T1018037.html'));

test('Popup should not be closed if lookup is placed at the page bottom in material theme (T1018037)', async (t) => {
  const lookup = new Lookup('#lookup');

  await t
    .expect(await lookup.isOpened())
    .ok();
});
