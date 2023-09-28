/* eslint-disable no-restricted-syntax */
import url from '../../../helpers/getPageUrl';
import createWidget from '../../../helpers/createWidget';
import { a11yCheck } from '../../../helpers/accessibilityUtils';

fixture.disablePageReloads`Accordion`
  .page(url(__dirname, '../../container.html'));

const accordionItems = [{
  ID: 1,
  CompanyName: 'Super Mart of the West',
  Name: 'Name_1',
  Website: 'http://www.site1.com',
}, {
  ID: 2,
  CompanyName: 'Electronics Depot',
  Name: 'Name_2',
  Website: 'http://www.site2.com',
}];

const accordionOptions = {
  dataSource: accordionItems,
  animationDuration: 0,
  collapsible: false,
  multiple: false,
  selectedItems: [accordionItems[0]],
  itemTitleTemplate(data) {
    const span = $('<span>');

    span.text(data.CompanyName);

    return span;
  },
  itemTemplate(a) {
    const wrapper = $('<wrapper>');
    const name = $('<div>');

    name.text(`Name: ${a.Name}`);
    wrapper.append(name);

    const websiteWrapper = $('<div>');
    const websiteLabel = $('<span>');

    websiteLabel.text('Website: ');
    websiteWrapper.append(websiteLabel);

    const link = $(`<a href="${a.Website}">${a.Website}</a>`);

    websiteWrapper.append(link);
    wrapper.append(websiteWrapper);

    return wrapper;
  },
};

test('Accordion accessibility check', async (t) => {
  await a11yCheck(t);
}).before(async () => createWidget(
  'dxAccordion',
  accordionOptions,
));
