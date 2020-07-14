import url from '../../helpers/getPageUrl';
import Gallery from '../../model/gallery';

fixture`Click on indicator`
  .page(url(__dirname, './pages/indicatorClick.html'));

test('click on indicator item should change selected item', async (t) => {
    const gallery = new Gallery('#gallery');
    const secondIndicatorItem = gallery.getIndicatorItem(1);
  
    await t
      .click(secondIndicatorItem.element)
      .expect(secondIndicatorItem.isSelected).ok();
});
